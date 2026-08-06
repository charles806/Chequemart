import { useEffect } from "react";

export function useHotkey(key, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (e.key === key && !e.target.closest("input, textarea, select")) {
        handler(e);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [key, handler]);
}
