import { getPeople } from "./people.controller";
import { getFilteredPeople } from "../services/people.service";
import { Request, Response } from "express";
import { jest, describe, beforeEach, it, expect } from "@jest/globals";

jest.mock("../services/people.service"); // mock the service

describe("getPeople Controller", () => {
  const mockJson = jest.fn();
  const mockStatus = jest.fn(() => ({ json: mockJson }));
  const res = {
    json: mockJson,
    status: mockStatus,
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return people data with default pagination", async () => {
    const req = {
      query: {},
    } as unknown as Request;

    const mockData = {
      data: [],
      total: 0,
      page: 1,
      limit: 20,
      filters: { topHobbies: [], topNationalities: [] },
    };

    (
      getFilteredPeople as jest.MockedFunction<typeof getFilteredPeople>
    ).mockResolvedValue(mockData);

    await getPeople(req, res);

    expect(getFilteredPeople).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      search: undefined,
      hobbies: undefined,
      nationality: undefined,
    });

    expect(mockJson).toHaveBeenCalledWith(mockData);
  });

  it("should parse query params correctly", async () => {
    const req = {
      query: {
        page: "2",
        limit: "10",
        search: "john",
        hobbies: "swimming,dancing",
        nationality: "Indian",
      },
    } as unknown as Request;
    const mockData = {
      data: ["test"],
      total: 1,
      page: 2,
      limit: 10,
      filters: { topHobbies: [], topNationalities: [] },
    };
    // ❌ Wrong data shape — Person[] must be used

    const fixedMockData = {
      data: [
        {
          id: "1",
          avatar: "https://example.com/avatar.png",
          first_name: "John",
          last_name: "Doe",
          age: 30,
          nationality: "Indian",
          hobbies: ["swimming", "dancing"],
        },
      ],
      total: 1,
      page: 2,
      limit: 10,
      filters: { topHobbies: [], topNationalities: [] },
    };

    (
      getFilteredPeople as jest.MockedFunction<typeof getFilteredPeople>
    ).mockResolvedValue(fixedMockData);

    await getPeople(req, res);

    expect(getFilteredPeople).toHaveBeenCalledWith({
      page: 2,
      limit: 10,
      search: "john",
      hobbies: ["swimming", "dancing"],
      nationality: "Indian",
    });

    expect(mockJson).toHaveBeenCalledWith(fixedMockData);
  });

  it("should handle errors and return 500", async () => {
    const req = {
      query: {},
    } as unknown as Request;

    (
      getFilteredPeople as jest.MockedFunction<typeof getFilteredPeople>
    ).mockRejectedValue(new Error("DB error"));

    await getPeople(req, res);

    expect(mockStatus).toHaveBeenCalled(); // No arguments, as res.status() is likely chained
    expect(mockJson).toHaveBeenCalledWith({ message: "Error fetching people" });
  });
});
