// frontend/src/types/electron.d.ts
export {};
declare global {
  interface Window {
    authVault?: {
      getToken: () => Promise<string | null>;
      setToken: (t: string) => Promise<void>;
      clear: () => Promise<void>;
      getUserRoles: () => Promise<string[]>;
      setUserRoles: (roles: string[]) => Promise<void>;
      getUser: () => Promise<any | null>;
      setUser: (user: any) => Promise<void>;
    };
  }
}
