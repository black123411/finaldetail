import React, { createContext, useContext, useEffect, useState } from 'react';
import { ADMIN_SESSION_KEY, workerApiUrl } from '../lib/apiBase';

interface AuthContextType {
  user: { email: string } | null;
  loading: boolean;
  isAdmin: boolean;
  login: (password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  login: async () => ({ ok: false }),
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const token = sessionStorage.getItem(ADMIN_SESSION_KEY);

    if (!token) {
      setLoading(false);
      return () => {
        active = false;
      };
    }

    fetch(workerApiUrl('/api/admin/session'), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json().catch(() => null);
        if (!active) return;
        const authenticated = response.ok && data?.authenticated === true;
        setIsAdmin(authenticated);
        if (!authenticated) sessionStorage.removeItem(ADMIN_SESSION_KEY);
      })
      .catch(() => {
        if (active) setIsAdmin(false);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = async (password: string) => {
    try {
      const response = await fetch(workerApiUrl('/api/admin/verify-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || data?.ok !== true || typeof data?.token !== 'string') {
        return { ok: false, error: data?.error || 'Administrator login failed' };
      }

      sessionStorage.setItem(ADMIN_SESSION_KEY, data.token);
      const sessionResponse = await fetch(workerApiUrl('/api/admin/session'), {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const sessionData = await sessionResponse.json().catch(() => null);

      if (sessionResponse.ok && sessionData?.authenticated === true) {
        setIsAdmin(true);
        return { ok: true };
      }

      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      setIsAdmin(false);
      return { ok: false, error: 'Login succeeded, but the secure session could not be established' };
    } catch {
      return { ok: false, error: 'Unable to reach the admin server' };
    }
  };

  const logout = async () => {
    const token = sessionStorage.getItem(ADMIN_SESSION_KEY);
    try {
      await fetch(workerApiUrl('/api/admin/logout'), {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    } finally {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: isAdmin ? { email: 'admin@bryansdetailingomaha.com' } : null,
        loading,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
