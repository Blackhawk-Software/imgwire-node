import type { IncomingHttpHeaders } from "node:http";

import type { PaginatedResult, PaginationInfo } from "./types.ts";

export type { PaginatedResult, PaginationInfo } from "./types.ts";

export function toPaginatedResult<T>(
  data: T[],
  headers: IncomingHttpHeaders
): PaginatedResult<T> {
  return {
    data,
    pagination: readPaginationHeaders(headers)
  };
}

export function readPaginationHeaders(
  headers: IncomingHttpHeaders
): PaginationInfo {
  return {
    limit: readHeaderNumber(headers, "x-limit"),
    nextPage: readHeaderNumber(headers, "x-next-page"),
    page: readHeaderNumber(headers, "x-page"),
    prevPage: readHeaderNumber(headers, "x-prev-page"),
    totalCount: readHeaderNumber(headers, "x-total-count")
  };
}

function readHeaderNumber(
  headers: IncomingHttpHeaders,
  name: string
): number | null {
  const value = headers[name];
  const normalized = Array.isArray(value) ? value[0] : value;
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}
