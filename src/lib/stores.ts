"use client";

import { useSyncExternalStore } from "react";
import type { SessionUser } from "./types";

type Listener = () => void;

interface Store<T> {
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (value: T) => void;
}

/**
 * Store genérica sincronizada com o localStorage.
 *
 * O snapshot do servidor é sempre o valor padrão para evitar divergência de
 * hidratação; no cliente, `getSnapshot` lê e memoiza o valor real. Isso permite
 * usar `useSyncExternalStore` sem `setState` dentro de `useEffect`.
 */
function createStore<T>(
  key: string,
  parse: (raw: string | null) => T,
  fallback: T,
  serialize: (value: T) => string | null,
): Store<T> {
  let cached: T = fallback;
  let loaded = false;
  const listeners = new Set<Listener>();

  function load(): T {
    if (loaded) return cached;
    loaded = true;
    try {
      cached = parse(window.localStorage.getItem(key));
    } catch {
      cached = fallback;
    }
    return cached;
  }

  function emit(): void {
    listeners.forEach((listener) => listener());
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      const onStorage = (event: StorageEvent) => {
        if (event.key === key || event.key === null) {
          loaded = false;
          emit();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot: load,
    getServerSnapshot() {
      return fallback;
    },
    set(value) {
      cached = value;
      loaded = true;
      const serialized = serialize(value);
      if (serialized === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, serialized);
      emit();
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Tema                                                                        */
/* -------------------------------------------------------------------------- */

export type Theme = "dark" | "light";

export const themeStore = createStore<Theme>(
  "sac.theme",
  (raw) => (raw === "light" ? "light" : "dark"),
  "dark",
  (value) => value,
);

/* -------------------------------------------------------------------------- */
/* Sessão                                                                      */
/* -------------------------------------------------------------------------- */

export const sessionStore = createStore<SessionUser | null>(
  "sac.auth",
  (raw) => {
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionUser;
    return parsed?.perfil && parsed?.email ? parsed : null;
  },
  null,
  (value) => (value ? JSON.stringify(value) : null),
);

/* -------------------------------------------------------------------------- */
/* Montagem (evita divergência de hidratação em guardas de rota)               */
/* -------------------------------------------------------------------------- */

const mountedListeners = new Set<Listener>();

const mountedStore: Store<boolean> = {
  subscribe(listener) {
    mountedListeners.add(listener);
    return () => {
      mountedListeners.delete(listener);
    };
  },
  getSnapshot: () => true,
  getServerSnapshot: () => false,
  set() {
    /* no-op */
  },
};

export function useMounted(): boolean {
  return useSyncExternalStore(
    mountedStore.subscribe,
    mountedStore.getSnapshot,
    mountedStore.getServerSnapshot,
  );
}
