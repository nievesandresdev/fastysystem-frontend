// src/hooks/useHotkey.ts
import { useEffect } from "react";

export default function useHotkey(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === key) {
        e.preventDefault(); // evita comportamiento por defecto
        callback();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback]);
}
