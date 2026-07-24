import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ShieldCheck, LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const { user, isAdmin, login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  if (isAdmin) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await login(password);
    if (!result.ok) {
      setError(result.error || 'Administrator login failed');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 pt-32 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-zinc-200 border border-zinc-100 text-center"
      >
        <div 
          className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-8 text-white italic font-black text-2xl shadow-xl hover:scale-105 transition-transform"
        >
          IQ
        </div>
        
        <h1 className="text-3xl font-black text-zinc-900 italic tracking-tighter mb-2">Admin Login</h1>
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

        <form onSubmit={handleLogin} className="space-y-6">
          <label htmlFor="admin-password" className="sr-only">Administrator password</label>
          <input
            id="admin-password"
            type="password"
            placeholder="Administrator Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-50 border-none rounded-2xl p-4 text-center text-lg focus:ring-2 focus:ring-zinc-900 transition-all font-mono"
            required
          />
          <Button 
            type="submit"
            className="w-full h-16 rounded-2xl bg-zinc-900 text-white font-black italic text-lg shadow-xl shadow-zinc-200 gap-3"
          >
            <LogIn className="h-5 w-5" />
            Authenticate
          </Button>
        </form>

        <div className="mt-12 pt-8 border-t border-zinc-50">
          <div className="flex items-center justify-center gap-2 text-zinc-300">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">Protected admin access</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
