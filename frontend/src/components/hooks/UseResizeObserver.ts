// hooks/useResizeObserver.ts
import { useCallback, useEffect, useRef, useState } from "react";

const useResizeObserver = () => {
  const [height, setHeight] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    for (let entry of entries) {
      if (entry.target === ref.current) {
        setHeight(entry.contentRect.height);
        setWidth(entry.contentRect.width);
      }
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, [ref, handleResize]);

  return { ref, height, width };
};

export default useResizeObserver;
