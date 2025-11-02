import { useEffect, useState } from "react";
import type { PaginatedResponse } from "@/api/adminApi";

interface FetchParams {
  search?: string;
  page?: number;
  limit?: number;
  role?: string;
}
//the params is used to define the type of params that can be passed to the fetchFunction
export function usePaginatedFetch<T>( fetchFunction: (params?: FetchParams) => Promise<PaginatedResponse<T>>,
  initialParams?: Partial<FetchParams>)  {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


// this pareams i s used to refetch the data when needed
  const fetchData = async (reFetchParams?: Partial<FetchParams>) => {
    setLoading(true);
    try {
      // the page is needed because the page state is updated when the user changes the page
      const response = await fetchFunction({ ...initialParams, page, ...reFetchParams });
      setData(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return { data, loading, error, totalPages, page, setPage, refetch: fetchData };
}
