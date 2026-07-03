import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: { email: string } | null;
  loading: boolean;
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  isAdmin: false,
  login: async () => false,
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if they have the token
    const hasToken = localStorage.getItem('SESSION_ADMIN_TOKEN') === 'authenticated';
    
    if (hasToken) {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const login = async (password: string) => {
    try {
      const res = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        localStorage.setItem('SESSION_ADMIN_TOKEN', 'authenticated');
        setIsAdmin(true);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('SESSION_ADMIN_TOKEN');
    localStorage.removeItem('EMERGENCY_ADMIN_OVERRIDE');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user: isAdmin ? { email: 'admin@bryansdetailing.com' } : null, 
      loading, 
      isAdmin,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
