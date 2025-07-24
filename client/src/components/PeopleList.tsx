import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { createWebSocket, type WSMessage } from "../services/websocket";
import type { Person } from "../types/person";
import PersonCard from "./PersonCard";

const ITEMS_PER_PAGE = 20;

export interface PeopleListHandle {
  loadMore: () => void;
}

const PeopleList = forwardRef<PeopleListHandle, {
  search: string;
  selectedHobbies: string[];
  selectedNationalities: string[];
  totalCount: number;
}>(({ search, selectedHobbies, selectedNationalities, totalCount }, ref) => {
  const [people, setPeople] = useState<(Person | "pending")[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const parentRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const usedIds = useRef(new Set<string>());
  const hasMoreRef = useRef(true);
  const filtersRef = useRef({ search, selectedHobbies, selectedNationalities });

  const rowVirtualizer = useVirtualizer({
    count: people.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  const resetStateAndStream = useCallback(() => {
    const initialPlaceholders = Math.min(ITEMS_PER_PAGE, totalCount);
    setPeople(Array(initialPlaceholders).fill("pending"));
    setPage(1);
    usedIds.current.clear();
    hasMoreRef.current = true;
    setLoading(true);

    if (parentRef.current) {
      parentRef.current.scrollTop = 0;
    }

    setTimeout(() => {
      rowVirtualizer.measure();
    }, 0);

    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      const nationality =
        selectedNationalities.length > 0 ? selectedNationalities[0] : undefined;
      socket.send(
        JSON.stringify({
          type: "start_stream",
          count: ITEMS_PER_PAGE,
          page: 1,
          search,
          hobbies: selectedHobbies,
          nationality,
        })
      );
    }
  }, [search, selectedHobbies, selectedNationalities, rowVirtualizer, totalCount]);

  const sendStreamRequest = useCallback(
    (pageToRequest: number) => {
      const socket = socketRef.current;
      if (
        socket?.readyState !== WebSocket.OPEN ||
        loading ||
        !hasMoreRef.current
      )
        return;

      const nationality =
        selectedNationalities.length > 0 ? selectedNationalities[0] : undefined;
      socket.send(
        JSON.stringify({
          type: "start_stream",
          count: ITEMS_PER_PAGE,
          page: pageToRequest,
          search,
          hobbies: selectedHobbies,
          nationality,
        })
      );

      setPeople((prev) => {
        const placeholdersToAdd = Math.min(
          ITEMS_PER_PAGE,
          totalCount - prev.length
        );
        if (placeholdersToAdd <= 0) return prev;
        return [...prev, ...Array(placeholdersToAdd).fill("pending")];
      });

      setLoading(true);
      setPage(pageToRequest);
    },
    [loading, search, selectedHobbies, selectedNationalities, totalCount]
  );

  const handleWSMessage = useCallback(
    (data: WSMessage) => {
      if ("type" in data) {
        if (data.type === "no_more_data") {
          hasMoreRef.current = false;
          setLoading(false);
          return;
        }

        if ("error" in data) {
          console.error("WebSocket error message:", data.error);
          setLoading(false);
          return;
        }
      }

      if ("id" in data && typeof data.id === "string") {
        if (!usedIds.current.has(data.id)) {
          usedIds.current.add(data.id);
          setPeople((prev) => {
            const next = [...prev];
            const idx = next.findIndex((p) => p === "pending");
            if (idx !== -1) next[idx] = data;
            else next.push(data);

            if (next.length > totalCount) {
              next.splice(totalCount);
            }
            return next;
          });

          setLoading(false);
        }
      }
    },
    [totalCount]
  );

  useEffect(() => {
    const socket = createWebSocket(handleWSMessage);
    socketRef.current = socket;

    const waitUntilReady = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        clearInterval(waitUntilReady);
        resetStateAndStream();
      }
    }, 100);

    return () => {
      clearInterval(waitUntilReady);
      socket.close();
    };
  }, [handleWSMessage, resetStateAndStream]);

  useEffect(() => {
    if (
      filtersRef.current.search !== search ||
      filtersRef.current.selectedHobbies !== selectedHobbies ||
      filtersRef.current.selectedNationalities !== selectedNationalities
    ) {
      filtersRef.current = { search, selectedHobbies, selectedNationalities };
      resetStateAndStream();
    }
  }, [search, selectedHobbies, selectedNationalities, resetStateAndStream]);

  const loadMore = useCallback(() => {
    if (loading || !hasMoreRef.current) return;
    if (people.length >= totalCount) return;
    sendStreamRequest(page + 1);
  }, [loading, page, sendStreamRequest, people.length, totalCount]);

  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    if (!virtualItems.length || loading || !hasMoreRef.current) return;
    const lastItem = virtualItems[virtualItems.length - 1];
    if (lastItem.index >= people.length - 2) {
      loadMore();
    }
  }, [rowVirtualizer.getVirtualItems(), people.length, loading, loadMore]);

  useEffect(() => {
    rowVirtualizer.measure();
  }, [people.length, rowVirtualizer]);

  useImperativeHandle(ref, () => ({
    loadMore,
  }), [loadMore]);

  const actualPeople = people.filter((p) => p !== "pending") as Person[];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 text-sm text-white-700">
        Showing {actualPeople.length} of {totalCount} people
      </div>

      <div
        ref={parentRef}
        className="ListContainer overflow-auto h-full flex-grow"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = people[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                ref={rowVirtualizer.measureElement}
                className="ListItem px-4 py-2"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {item === "pending" ? (
                  <div className="p-4 text-center text-gray-400">
                    Loading item...
                  </div>
                ) : (
                  <PersonCard person={item} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!loading && actualPeople.length === 0 && (
        <div className="text-center p-2 text-gray-500 mt-2">
          No matching results.
        </div>
      )}
      {loading && (
        <div className="text-center p-2 text-gray-500">Loading...</div>
      )}
      {!hasMoreRef.current && actualPeople.length > 0 && !loading && (
        <div className="text-center p-2 text-gray-500">End of results.</div>
      )}
    </div>
  );
});

export default PeopleList;
