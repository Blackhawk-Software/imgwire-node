import { describe, expect, it, vi } from "vitest";

import {
  iteratePaginatedItems,
  iteratePaginatedResults
} from "../src/pagination/page-iterator.ts";

describe("iteratePaginatedResults", () => {
  it("follows nextPage until pagination ends", async () => {
    const loadPage = vi.fn(async ({ page = 1, limit = 2 }) => ({
      data: [`item-${page}`],
      pagination: {
        page,
        limit,
        nextPage: page < 3 ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        totalCount: 3
      }
    }));

    const results: string[] = [];
    for await (const page of iteratePaginatedResults(
      { page: 1, limit: 2 },
      loadPage
    )) {
      results.push(...page.data);
    }

    expect(results).toEqual(["item-1", "item-2", "item-3"]);
    expect(loadPage).toHaveBeenNthCalledWith(1, { page: 1, limit: 2 });
    expect(loadPage).toHaveBeenNthCalledWith(2, { page: 2, limit: 2 });
    expect(loadPage).toHaveBeenNthCalledWith(3, { page: 3, limit: 2 });
  });
});

describe("iteratePaginatedItems", () => {
  it("yields individual items across all pages", async () => {
    const loadPage = vi.fn(async ({ page = 1, limit = 2 }) => ({
      data: [`${page}-a`, `${page}-b`],
      pagination: {
        page,
        limit,
        nextPage: page < 2 ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        totalCount: 4
      }
    }));

    const items: string[] = [];
    for await (const item of iteratePaginatedItems(
      { page: 1, limit: 2 },
      loadPage
    )) {
      items.push(item);
    }

    expect(items).toEqual(["1-a", "1-b", "2-a", "2-b"]);
  });
});
