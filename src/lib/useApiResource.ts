"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api/client";

export interface ApiResource<T> {
  /** Dados da API quando disponíveis, senão o fallback (mock). */
  data: T;
  loading: boolean;
  /** true quando a API falhou e o fallback local está em uso. */
  offline: boolean;
  error: string | null;
  reload: () => void;
  /** Atualização local (mutações otimistas quando a API está offline). */
  setData: (updater: T | ((prev: T) => T)) => void;
}

/**
 * Carrega um recurso da API com fallback automático para dados locais.
 *
 * `key` identifica o recurso (mudanças disparam novo fetch). `load` é mantido
 * numa ref para não entrar nas dependências do efeito. O `setState` acontece
 * apenas em callbacks assíncronos, respeitando a regra set-state-in-effect.
 */
export function useApiResource<T>(key: string, load: () => Promise<T>, fallback: T): ApiResource<T> {
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  });

  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let ativo = true;
    loadRef
      .current()
      .then((resultado) => {
        if (!ativo) return;
        setData(resultado);
        setOffline(false);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!ativo) return;
        setOffline(true);
        setError(err instanceof ApiError ? err.message : "API indisponível — exibindo dados locais.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });
    return () => {
      ativo = false;
    };
  }, [key, nonce]);

  const reload = useCallback(() => {
    setLoading(true);
    setNonce((n) => n + 1);
  }, []);

  return { data, loading, offline, error, reload, setData };
}
