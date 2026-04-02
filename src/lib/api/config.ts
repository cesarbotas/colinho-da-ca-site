export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface PaginatedResponse<T> {
  page: number;
  pageSize: number;
  total: number;
  data: T[];
}
