import { useEffect, useState, useCallback } from "react";
import { fetchPeople } from "../services/api";
import PeopleList from "../components/PeopleList";
import Filters from "../components/Filters";
import SearchBar from "../components/SearchBar";
import StreamingTextPage from "./StreamingTextPage";

type View = "people" | "text";

export default function Home() {
  const [topHobbies, setTopHobbies] = useState<string[]>([]);
  const [topNationalities, setTopNationalities] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [nationalities, setNationalities] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [view, setView] = useState<View>("people");

  const initialFilterFetchLimit = 1;

  useEffect(() => {
    const loadInitialFilters = async () => {
      try {
        const data = await fetchPeople(1, initialFilterFetchLimit, "", [], []);
        setTopHobbies(data.filters.topHobbies);
        setTopNationalities(data.filters.topNationalities);
      } catch (error) {
        console.error("Failed to load initial filter data:", error);
        setTopHobbies([]);
        setTopNationalities([]);
      }
    };
    loadInitialFilters();
  }, []);

  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const data = await fetchPeople(1, 1, search, hobbies, nationalities);
        setTotalCount(data.total);
      } catch (err) {
        console.error("Failed to fetch total count", err);
        setTotalCount(0);
      }
    };
    fetchTotalCount();
  }, [search, hobbies, nationalities]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleHobbiesChange = useCallback((selected: string[]) => {
    setHobbies((prev) => {
      if (arraysEqual(prev, selected)) return prev;
      return selected;
    });
  }, []);

  const handleNationalitiesChange = useCallback((selected: string[]) => {
    setNationalities((prev) => {
      if (arraysEqual(prev, selected)) return prev;
      return selected;
    });
  }, []);

  function arraysEqual(a: string[], b: string[]) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden p-6 mx-auto max-w-7xl">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Presight Demo App</h1>

        {/* Navigation Links */}
        <nav className="space-x-4">
          <button
            aria-pressed={view === "people"}
            className={`px-4 py-2 rounded font-semibold transition-colors duration-200 ${
              view === "people"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setView("people")}
          >
            People List
          </button>
          <button
            aria-pressed={view === "text"}
            className={`px-4 py-2 rounded font-semibold transition-colors duration-200 ${
              view === "text"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setView("text")}
          >
            Streaming Text
          </button>
        </nav>
      </header>

      {view === "people" && (
        <>
          <SearchBar value={search} onChange={handleSearchChange} />

          <div className="flex mt-6 gap-6 flex-grow overflow-hidden">
            {/* Filters sidebar */}
            <div className="w-1/4 flex-shrink-0 pr-4 overflow-y-auto custom-scrollbar">
              <Filters
                selectedHobbies={hobbies}
                onHobbiesChange={handleHobbiesChange}
                selectedNationalities={nationalities}
                onNationalitiesChange={handleNationalitiesChange}
                topHobbies={topHobbies}
                topNationalities={topNationalities}
              />
            </div>

            {/* PeopleList */}
            <div className="flex-1 overflow-hidden">
              <PeopleList
                search={search}
                selectedHobbies={hobbies}
                selectedNationalities={nationalities}
                totalCount={totalCount}
              />
            </div>
          </div>
        </>
      )}

      {view === "text" && (
        <div className="mt-6 flex-grow overflow-auto">
          <StreamingTextPage />
        </div>
      )}
    </div>
  );
}
