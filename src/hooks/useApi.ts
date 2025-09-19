// src/hooks/useApi.ts
import { useEffect, useState, useRef } from 'react';

type ApiErr = { status?: number; message: string; data?: any } | null;
type ApiState<T> = { data: T | null; loading: boolean; error: ApiErr };
const normErr = (e: any): NonNullable<ApiErr> => ({
  status: e?.status,
  message: e?.data?.message ?? e?.message ?? 'Error en la petición',
  data: e?.data,
});

/**
 * useApiQuery
 * Para peticiones de tipo "consulta" (GET principalmente).
 * - Llama automáticamente al request en el montaje del componente.
 * - Devuelve { data, loading, error, refetch }.
 * - Puedes pasar dependencias (deps) para volver a ejecutar cuando cambien.
 */
export function useApiQuery<T>(request: (signal?: AbortSignal) => Promise<T>, deps: any[] = [], options?: { debounce?: number }) {
  // estado inicial: cargando
  const [state, set] = useState<ApiState<T>>({ data: null, loading: true, error: null });

  // ref para manejar debounce sin afectar otras vistas
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // función que ejecuta la petición
  const fetchOnce = (signal?: AbortSignal) => {
    // antes de lanzar la request → pongo loading=true
    set(s => ({ ...s, loading: true, error: null }));

    request()
      .then(d => { if (!signal?.aborted) set({ data: d, loading: false, error: null }); })
      .catch(e => { if (!signal?.aborted) set({ data: null, loading: false, error: normErr(e) }); });
  };

  // useEffect → ejecuta la request cuando se monta el componente o cambian las deps
  useEffect(() => {
    const controller = new AbortController();

    // 🚫 No hacemos request si alguna dep es "" o null
    if (deps.some(d => d === null || d === "")) {
      set({ data: null, loading: false, error: null });
      return;
    }

    if (options?.debounce) {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        fetchOnce(controller.signal);
      }, options.debounce);
    } else {
      fetchOnce(controller.signal);
    }

    return () => {
      controller.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, deps);
  // refetch → expuesto al consumidor para relanzar la request manualmente
  const refetch = () => fetchOnce();

  return { ...state, refetch };
}

/**
 * useApiMutation
 * Para peticiones que cambian datos (POST, PUT, DELETE).
 * - No se ejecuta sola: tienes que llamar "run" manualmente.
 * - Devuelve { data, loading, error, run, reset }.
 */
export function useApiMutation<T, A extends any[]>(
  fn: (...args: A) => Promise<T>
) {
  // estado inicial: no cargando
  const [state, set] = useState<ApiState<T>>({ data: null, loading: false, error: null });

  // run → ejecuta la mutación
  const run = async (...args: A) => {
    set({ data: null, loading: true, error: null });
    try {
      const d = await fn(...args);
      set({ data: d, loading: false, error: null });
      return d; // devolvemos el resultado para usar en el componente
    } catch (e: any) {
      const err = normErr(e);
      console.log('useApiMutation err',err)
      set({ data: null, loading: false, error: err });
      throw err; // relanzamos para que el componente pueda capturar si quiere
    }
  };

  // reset → limpia el estado manualmente
  const reset = () => set({ data: null, loading: false, error: null });

  return { ...state, run, reset };
}
