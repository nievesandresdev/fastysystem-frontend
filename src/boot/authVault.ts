// Fallback web: usa localStorage si no existe authVault (Electron)
(() => {
  const w = window as Window & {
    authVault?: {
      getToken: () => Promise<string | null>;
      setToken: (t: string) => Promise<void>;
      clear: () => Promise<void>;
    };
  };
  if (!w.authVault) {
    w.authVault = {
      async getToken() { return localStorage.getItem('token'); },
      async setToken(t: string) { localStorage.setItem('token', t); },
      async clear() { localStorage.removeItem('token'); },
    };
    // console.log('[authVault] web fallback activo');
  }
})();
