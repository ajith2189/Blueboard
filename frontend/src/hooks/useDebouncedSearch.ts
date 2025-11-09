import { useMemo } from "react";
import { debounce } from "lodash";

export function useDebouncedSearch(callback: (term: string) => void, delay = 400) {
  const debouncedFn = useMemo(() => debounce(callback, delay), [callback, delay]);
  return debouncedFn;
}
