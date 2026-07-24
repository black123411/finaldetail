import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, CircleHelp, ExternalLink, LogOut, ShieldCheck, Wrench } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { ServiceAPI } from '../services/api';

type AdminLog = {
  id: string;
  action: string;
  details: string;
  createdAt: string;
};

export default function Admin() {
  const { user, logout } = useAuth();
  const [serviceCount, setServiceCount] = useState<number | null>(null);
  const [logs, setLogs] = useState<AdminLog[]>([]);

  useEffect(() => {
    ServiceAPI.getAdminServices()
      .then((services) => setServiceCount(Array.isArray(services) ? services.length : 0))
      .catch(() => setServiceCount(0));
    ServiceAPI.getLogs(6)
      .then((items) => setLogs(Array.isArray(items) ? items : []))
      .catch(() => setLogs([]));
  }, []);

  const tools = [
    {
      title: 'Service Catalog',
      description: 'Compare website services with Square, preview every change, and run a protected sync.',
      to: '/admin/services',
      icon: Wrench,
      meta: serviceCount === null ? 'Loading…' : `${serviceCount} live services`,
    },
    {
      title: 'Blog Manager',
      description: 'Create drafts, publish detailing articles, and update existing posts.',
      to: '/admin/blog',
      icon: BookOpen,
      meta: 'Cloudflare storage',
    },
    {
      title: 'FAQ Manager',
      description: 'Add, edit, remove, and reorder the questions shown on the public FAQ page.',
      to: '/admin/faq',
      icon: CircleHelp,
      meta: 'Live website content',
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 px-4 pb-24 pt-32 font-sans">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 flex flex-col gap-5 rounded-[2rem] bg-zinc-950 p-7 text-white shadow-xl md:flex-row md:items-center md:justify-between md:p-9">
          <div>
            <div className="mb-3 flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.24em]">Secure admin session</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">Admin Control Center</h1>
            <p className="mt-2 text-sm text-zinc-400">Manage website content and review the live Square service catalog.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="text-xs text-zinc-400">Signed in as <span className="font-bold text-white">{user?.email}</span></p>
            <Button variant="outline" onClick={() => void logout()} className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </Button>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {tools.map(({ title, description, to, icon: Icon, meta }) => (
            <Link key={to} to={to} className="group rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg">
              <div className="mb-8 flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white"><Icon className="h-5 w-5" /></span>
                <ChevronRight className="h-5 w-5 text-zinc-300 transition group-hover:translate-x-1 group-hover:text-zinc-950" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">{meta}</p>
              <h2 className="mt-2 text-xl font-black italic tracking-tight text-zinc-950">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{description}</p>
            </Link>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.55fr]">
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-7">
            <h2 className="text-xl font-black italic tracking-tight text-zinc-950">Recent admin activity</h2>
            <div className="mt-5 space-y-3">
              {logs.length === 0 ? (
                <p className="rounded-2xl bg-zinc-50 p-5 text-sm text-zinc-500">No content changes have been recorded yet.</p>
              ) : logs.map((log) => (
                <div key={log.id} className="flex flex-col gap-1 rounded-2xl bg-zinc-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black text-zinc-900">{log.action}</p>
                    {log.details && <p className="mt-1 text-xs text-zinc-500">{log.details}</p>}
                  </div>
                  <time className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{new Date(log.createdAt).toLocaleString()}</time>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] bg-emerald-50 p-7 ring-1 ring-emerald-100">
            <h2 className="text-xl font-black italic tracking-tight text-zinc-950">Square stays protected</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-700">The service wizard previews changes before applying them and never deletes Square items. Availability, bookings, customers, and payments remain owned by Square.</p>
            <a href="https://app.squareup.com/dashboard/items/library" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-emerald-800 hover:text-emerald-950">
              Open Square Catalog <ExternalLink className="h-4 w-4" />
            </a>
          </aside>
        </section>
      </div>
    </main>
  );
}
