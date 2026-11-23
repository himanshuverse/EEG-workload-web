"use client";

import { useSyncExternalStore } from "react";

// The theme lives on <html class="dark"> (set before first paint by a script in layout.tsx), so every page shares it.
export function useDark() {
  const dark = useSyncExternalStore(
    (cb) => {
      const mo = new MutationObserver(cb);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => mo.disconnect();
    },
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("eeg-theme", next ? "dark" : "light");
    } catch {}
  };
  return { dark, toggle };
}
