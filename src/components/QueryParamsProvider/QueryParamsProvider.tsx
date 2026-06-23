"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { persistParams } from "@/lib/queryParams";

const QueryStringContext = createContext("");

/** Current query string, kept in sync after hydration. */
export function useQueryString(): string {
  return useContext(QueryStringContext);
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function getSnapshot(): string {
  return window.location.search;
}

function getServerSnapshot(): string {
  return "";
}

/**
 * Captures the landing query string, persists tracking params to sessionStorage
 * (first-touch) and exposes the current query to descendants so links carry it
 * forward. useSyncExternalStore returns "" on the server/first client render and
 * the real value after, with no hydration mismatch.
 */
export function QueryParamsProvider({ children }: { children: ReactNode }) {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    try {
      persistParams(window.location.search, window.sessionStorage);
    } catch {
      // sessionStorage can be blocked (private mode); links still work via URL.
    }
  }, [search]);

  return <QueryStringContext.Provider value={search}>{children}</QueryStringContext.Provider>;
}
