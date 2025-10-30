// Fallback web: usa localStorage si no existe authVault (Electron)
(() => {
  const w = window as Window & {
    authVault?: {
      getToken: () => Promise<string | null>;
      setToken: (t: string) => Promise<void>;
      clear: () => Promise<void>;
      getUserRoles: () => Promise<string[]>;
      setUserRoles: (roles: string[]) => Promise<void>;
      getUser: () => Promise<any | null>;
      setUser: (user: any) => Promise<void>;
    };
  };
  if (!w.authVault) {
    w.authVault = {
      async getToken() { return localStorage.getItem('token'); },
      async setToken(t: string) { localStorage.setItem('token', t); },
      async clear() { 
        localStorage.removeItem('token'); 
        localStorage.removeItem('userRoles');
        localStorage.removeItem('user');
      },
      async getUserRoles() { 
        const roles = localStorage.getItem('userRoles');
        return roles ? JSON.parse(roles) : [];
      },
      async setUserRoles(roles: string[]) { 
        localStorage.setItem('userRoles', JSON.stringify(roles)); 
      },
      async getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
      },
      async setUser(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
      },
    };
    // console.log('[authVault] web fallback activo');
  }
})();
