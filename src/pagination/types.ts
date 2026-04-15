export type PaginationInfo = {
  limit: number | null;
  nextPage: number | null;
  page: number | null;
  prevPage: number | null;
  totalCount: number | null;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: PaginationInfo;
};
