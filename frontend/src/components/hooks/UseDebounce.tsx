import { useEffect, useMemo, useRef } from "react";
import debounce from "lodash.debounce";

interface DebounceFunction {
  (): void;
}

export const useDebounce = (callback: DebounceFunction, timeOut: number) => {
  const ref = useRef<DebounceFunction | null>(null);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, timeOut);
  }, []);

  return debouncedCallback;
};
