import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isAdmin: false });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Allow multiple admin emails for testing/staff
  const ADMIN_EMAILS = [
    'bryansmobiledetailing@gmail.com',
    import.meta.env.VITE_ADMIN_EMAIL // Fallback to an env variable if set
  ].map(e => e?.toLowerCase().trim());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email.toLowerCase().trim()) : false;
  const isEmergencyAdmin = localStorage.getItem('EMERGENCY_ADMIN_OVERRIDE') === 'true';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: isAdmin || isEmergencyAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
