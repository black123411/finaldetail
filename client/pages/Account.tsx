import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, type User } from 'firebase/auth';
import { doc, getDocFromServer, runTransaction, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

function explain(error: unknown) {
  const code = error instanceof FirebaseError ? error.code : '';
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'Check your email and password and try again.',
    'auth/email-already-in-use': 'This email already has an account. Sign in or reset your password.',
    'auth/weak-password': 'Choose a stronger password with at least 8 characters.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/popup-blocked': 'Allow pop-ups for this website, then tap Google sign-in again.',
    'auth/popup-closed-by-user': 'Google sign-in was closed. Tap the button to try again.',
    'auth/too-many-requests': 'Please wait a moment before trying again.',
    'auth/network-request-failed': 'Check your connection and try again.',
    'permission-denied': 'Verify your email, then refresh your account before saving.',
  };
  return messages[code] || 'This could not be completed. Please try again.';
}

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [create, setCreate] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, (next) => {
      setUser(next);
      setVerified(next?.emailVerified ?? false);
      setName(next?.displayName ?? '');
      setLoading(false);
      if (next?.emailVerified) {
        void getDocFromServer(doc(db, 'users', next.uid)).then(snapshot => {
          if (active && auth.currentUser?.uid === next.uid && snapshot.exists()) {
            setName(snapshot.data().displayName || next.displayName || '');
          }
        }).catch(() => {
          if (active && auth.currentUser?.uid === next.uid) setError('Your saved profile could not be loaded. Please refresh before editing it.');
        });
      }
    });
    return () => { active = false; unsubscribe(); };
  }, []);

  async function perform(action: () => Promise<unknown>) {
    setBusy(true); setError(''); setMessage('');
    try { await action(); } catch (e) { setError(explain(e)); }
    finally { setBusy(false); }
  }

  const inputClass = 'w-full rounded-xl border border-zinc-300 p-3 text-zinc-900';
  const buttonClass = 'w-full rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50';

  return <main className="min-h-screen bg-zinc-50 px-4 pb-20 pt-32">
    <Helmet><title>My account | Bryan's Showroom Quality Detailing</title><meta name="robots" content="noindex, follow" /></Helmet>
    <section className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="mb-3 text-3xl font-bold text-zinc-900">My account</h1>
      <p className="mb-6 text-zinc-600">Save your profile, or <Link className="text-blue-700 underline" to="/book">book without an account</Link>.</p>
      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-800">{error}</p>}
      {message && <p role="status" className="mb-4 rounded-lg bg-blue-50 p-3 text-blue-900">{message}</p>}
      {loading ? <p role="status">Loading your account…</p> : user ? <div className="space-y-4">
        <p className="break-words text-zinc-700">Signed in as {user.email}</p>
        {!verified ? <>
          <p className="text-zinc-600">Verify your email to save your profile.</p>
          <button disabled={busy} className={buttonClass} onClick={() => perform(async () => {
            await sendEmailVerification(user); setMessage('Check your email for the verification link.');
          })}>Send verification email</button>
          <button disabled={busy} className={buttonClass} onClick={() => perform(async () => {
            await user.reload(); await user.getIdToken(true); setVerified(user.emailVerified);
            setMessage(user.emailVerified ? 'Email verified. You can now save your profile.' : 'Your email is not verified yet. Open the link in your email first.');
          })}>I verified my email</button>
        </> : <form className="space-y-3" onSubmit={e => { e.preventDefault(); void perform(async () => {
          const profile = doc(db, 'users', user.uid);
          await runTransaction(db, async transaction => {
            const current = await transaction.get(profile);
            if (current.exists()) transaction.update(profile, { displayName: name.trim(), updatedAt: serverTimestamp() });
            else transaction.set(profile, { uid: user.uid, email: user.email || '', role: 'customer', displayName: name.trim(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
          });
          setMessage('Your profile is saved.');
        }); }}>
          <label className="block font-medium text-zinc-800" htmlFor="profile-name">Name</label>
          <input id="profile-name" autoComplete="name" className={inputClass} value={name} onChange={e => setName(e.target.value)} required maxLength={100} />
          <button disabled={busy} className={buttonClass}>Save profile</button>
        </form>}
        <button disabled={busy} className="text-blue-700 underline" onClick={() => perform(() => signOut(auth))}>Sign out</button>
      </div> : <div className="space-y-4">
        <button disabled={busy} className={buttonClass} onClick={() => perform(() => signInWithPopup(auth, new GoogleAuthProvider()))}>Continue with Google</button>
        <p className="text-center text-sm text-zinc-500">or use email</p>
        <form className="space-y-3" onSubmit={e => { e.preventDefault(); void perform(async () => {
          if (create) {
            const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
            setPassword('');
            await sendEmailVerification(result.user);
            setMessage('Account created. Check your email to verify your address.');
          } else { await signInWithEmailAndPassword(auth, email.trim(), password); setPassword(''); }
        }); }}>
          <label className="block font-medium text-zinc-800" htmlFor="account-email">Email</label>
          <input id="account-email" type="email" autoComplete="email" className={inputClass} value={email} onChange={e => setEmail(e.target.value)} required />
          <label className="block font-medium text-zinc-800" htmlFor="account-password">Password</label>
          <input id="account-password" type="password" autoComplete={create ? 'new-password' : 'current-password'} className={inputClass} value={password} onChange={e => setPassword(e.target.value)} minLength={create ? 8 : undefined} required />
          <button disabled={busy} className={buttonClass}>{busy ? 'Please wait…' : create ? 'Create account' : 'Sign in'}</button>
        </form>
        <button disabled={busy} className="block text-blue-700 underline" onClick={() => { setCreate(!create); setError(''); setMessage(''); }}>{create ? 'Already registered? Sign in' : 'Create an account'}</button>
        <button disabled={busy} className="block text-blue-700 underline" onClick={() => {
          if (!email.trim()) { setError('Enter your email above first.'); return; }
          void perform(async () => { await sendPasswordResetEmail(auth, email.trim()); setMessage('If an account uses that email, you will receive a password reset link.'); });
        }}>Forgot password?</button>
      </div>}
    </section>
  </main>;
}
