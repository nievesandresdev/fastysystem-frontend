// frontend/src/types/electron.d.ts
export {};
declare global {
  interface Window {
    authVault?: {
      getToken: () => Promise<string | null>;
      setToken: (t: string) => Promise<void>;
      clear: () => Promise<void>;
    };
  }
}
