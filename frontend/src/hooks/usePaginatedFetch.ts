import { useEffect, useState, useCallback } from "react";
import type { PaginatedResponse } from "@/api/adminApi";

interface FetchParams {
  search?: string;
  page?: number;
  limit?: number;
  role?: string;
}

export function usePaginatedFetch<T>(
  fetchFunction: (params?: FetchParams) => Promise<PaginatedResponse<T>>,
  initialParams: Partial<FetchParams> = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialParams.page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [params, setParams] = useState<Partial<FetchParams>>(initialParams);

  // ✅ Main fetch function - single source of truth
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFunction({ ...params, page });
      setData(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, params, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ Update search/filter params AND reset to page 1
  const updateParams = useCallback((newParams: Partial<FetchParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
    setPage(1); // Always reset to first page on filter change
  }, []);

  // ✅ Refetch with current params (useful for manual refresh)
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    setPage,
    updateParams, 
    refetch,       
  };
}