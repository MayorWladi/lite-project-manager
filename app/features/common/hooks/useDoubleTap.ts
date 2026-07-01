import { useRef, useCallback } from "react";

/**
 * Returns an onTouchEnd handler that fires `callback` on double-tap (mobile).
 * Pair with onDoubleClick for full cross-device coverage.
 */
export function useDoubleTap(callback: (e: React.TouchEvent) => void, delay = 300) {
  const lastTap = useRef(0);

  return useCallback(
    (e: React.TouchEvent) => {
      const now = Date.now();
      const delta = now - lastTap.current;
      if (delta > 0 && delta < delay) {
        e.preventDefault();
        callback(e);
        lastTap.current = 0;
      } else {
        lastTap.current = now;
      }
    },
    [callback, delay]
  );
}

/**
 * Returns a handler that tracks the last-tapped arbitrary id and fires `callback`
 * when the same id is tapped twice within `delay` ms.
 * Useful for lists where you can't call hooks per-item.
 */
export function useDoubleTapById(callback: (id: string) => void, delay = 300) {
  const lastTap = useRef(0);
  const lastId = useRef<string | null>(null);

  return useCallback(
    (e: React.TouchEvent, id: string) => {
      const now = Date.now();
      const delta = now - lastTap.current;
      if (delta > 0 && delta < delay && lastId.current === id) {
        e.preventDefault();
        callback(id);
        lastTap.current = 0;
        lastId.current = null;
      } else {
        lastTap.current = now;
        lastId.current = id;
      }
    },
    [callback, delay]
  );
}
