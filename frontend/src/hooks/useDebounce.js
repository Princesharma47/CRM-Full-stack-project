import { useEffect, useRef, useState } from 'react';

/**
 * Debounce hook — returns a stable debounced version of `callback`.
 * The callback only fires after `delay` ms of no new calls.
 *
 * Usage:
 *   const debouncedSearch = useDebounce((val) => loadData(val), 400);
 *   <input onChange={e => debouncedSearch(e.target.value)} />
 */
export function useDebounce(callback, delay = 400) {
  const timerRef    = useRef(null);
  const callbackRef = useRef(callback);

  // Keep callback ref fresh so old closures don't cause stale data
  useEffect(() => { callbackRef.current = callback; }, [callback]);

  return (...args) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  };
}

/**
 * Debounced value hook — returns a value that only updates after delay ms of silence.
 *
 * Usage:
 *   const debouncedSearch = useDebouncedValue(search, 400);
 *   useEffect(() => { loadData(); }, [debouncedSearch]);
 */
export function useDebouncedValue(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
