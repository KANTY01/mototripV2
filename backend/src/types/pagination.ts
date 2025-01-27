export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export function getPaginationOptions(params: PaginationParams) {
  const { page = 1, pageSize = 10 } = params;
  return {
    limit: pageSize,
    offset: (page - 1) * pageSize
  };
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
