import React, { useState, useEffect } from 'react';
import { signInWithRedirect, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ShieldCheck, LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const { user, isAdmin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  // Handle any pending redirect results from previous login attempts
  useEffect(() => {
    getRedirectResult(auth).catch((err) => {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Authentication failed');
      }
    });
  }, []);

  if (user && isAdmin) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 pt-32 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-zinc-200 border border-zinc-100 text-center"
      >
        <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-8 text-white italic font-black text-2xl shadow-xl">
          IQ
        </div>
        
        <h1 className="text-3xl font-black text-zinc-900 italic tracking-tighter mb-2">Revenue Intelligence</h1>
        <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-8">Secure Administrator Portal</p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-50 rounded-2xl flex items-start gap-3 text-left border border-red-100"
          >
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-red-800 leading-relaxed">{error}</p>
          </motion.div>
        )}

        {user && !isAdmin ? (
          <div className="space-y-6">
            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 italic">
              <p className="text-sm text-zinc-500 font-medium">Logged in as: <span className="text-zinc-900 font-bold">{user.email}</span></p>
              <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-2">Access Denied</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => auth.signOut()}
              className="w-full h-14 rounded-2xl font-black italic text-zinc-600"
            >
              Sign Out & Retry
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-zinc-900 text-white font-black italic text-lg shadow-xl shadow-zinc-200 gap-3"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Authenticate with Google
              </>
            )}
          </Button>
        )}

        <div className="mt-12 pt-8 border-t border-zinc-50">
          <div className="flex items-center justify-center gap-2 text-zinc-300">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">Standard Military Encryption Active</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
