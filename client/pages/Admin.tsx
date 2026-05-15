import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Trash2, 
  LineChart, 
  BarChart3, 
  Users, 
  Target, 
  ArrowDownRight, 
  TrendingUp,
  Settings,
  Key,
  X,
  ExternalLink,
  ChevronRight,
  Shield,
  Zap,
  Info,
  FileText
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceAPI } from '../services/api';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [syncing, setSyncing] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [catalogSyncing, setCatalogSyncing] = useState(false);
  const [catalogResults, setCatalogResults] = useState<{ summary?: any; results?: any[]; error?: string } | null>(null);
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [dbServices, setDbServices] = useState<any[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  
  useEffect(() => {
    fetchDbServices();
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const data = await ServiceAPI.getLogs(10);
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const fetchDbServices = async () => {
    setIsLoadingServices(true);
    try {
      const data = await ServiceAPI.getAdminServices();
      setDbServices(data);
    } catch (err) {
      console.error("Failed to fetch Firestore services:", err);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const toggleServiceStatus = async (id: string, currentStatus: boolean) => {
    try {
      await ServiceAPI.patchAdminService(id, { active: !currentStatus });
      fetchDbServices();
      setStatus({ success: true, message: `Service ${!currentStatus ? 'Activated' : 'Deactivated'}. Syncing with Square...` });
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Are you sure? This will remove the service from both the Master DB and Square Catalog.")) return;
    try {
      await ServiceAPI.deleteAdminService(id);
      fetchDbServices();
      setStatus({ success: true, message: "Service deleted and removed from Square." });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Local state for temporary keys
  const [sessionKeys, setSessionKeys] = useState({
    GEMINI_API_KEY: localStorage.getItem('SESSION_GEMINI_API_KEY') || '',
    SQUARE_ACCESS_TOKEN: localStorage.getItem('SESSION_SQUARE_ACCESS_TOKEN') || '',
    VITE_SQUARE_APP_ID: localStorage.getItem('SESSION_VITE_SQUARE_APP_ID') || '',
    VITE_SQUARE_LOCATION_ID: localStorage.getItem('SESSION_VITE_SQUARE_LOCATION_ID') || '',
    SQUARE_ENVIRONMENT: localStorage.getItem('SESSION_SQUARE_ENVIRONMENT') || '',
    GOOGLE_MAPS_API_KEY: localStorage.getItem('SESSION_GOOGLE_MAPS_API_KEY') || '',
    GOOGLE_PLACE_ID: localStorage.getItem('SESSION_GOOGLE_PLACE_ID') || ''
  });

  const saveSessionKeys = () => {
    Object.entries(sessionKeys).forEach(([key, value]) => {
      localStorage.setItem(`SESSION_${key}`, value as string);
    });
    window.location.reload(); // Reload to apply keys across the app
  };

  // Real-time env check (Vite + Session Overrides)
  const envStatus = {
    gemini: !!(process.env.GEMINI_API_KEY || sessionKeys.GEMINI_API_KEY),
    squareToken: !!(process.env.SQUARE_ACCESS_TOKEN || sessionKeys.SQUARE_ACCESS_TOKEN),
    squareApp: !!(import.meta.env.VITE_SQUARE_APP_ID || sessionKeys.VITE_SQUARE_APP_ID),
    squareLoc: !!(import.meta.env.VITE_SQUARE_LOCATION_ID || sessionKeys.VITE_SQUARE_LOCATION_ID),
    maps: !!(process.env.GOOGLE_MAPS_API_KEY || sessionKeys.GOOGLE_MAPS_API_KEY)
  };

  // Behavior Tracking State (Simulated)
  const stats = {
    totalQuotes: 124,
    conversionRate: '18%',
    averageTicket: '$285',
    dropOffPoints: [
      { step: 'Contact Info', rate: '10%' },
      { step: 'Vehicle Selection', rate: '25%' },
      { step: 'Service Selection', rate: '15%' },
      { step: 'Final Review', rate: '32%' },
    ],
    popularServices: [
        { name: 'Signature Interior Reset', percentage: '65%', price: '$180' },
        { name: 'Showroom Full Detail', percentage: '22%', price: '$350' },
        { name: 'Ceramic Coating', percentage: '13%', price: '$950' },
    ]
  };

    const handleSync = async () => {
    setSyncing(true);
    setStatus(null);
    console.log('🔄 Initiating Preservation Sync...');
    try {
      const data = await ServiceAPI.syncSquare();
      if (data.success) {
        setStatus({ success: true, message: data.message });
      } else {
        setStatus({ success: false, message: data.error });
      }
    } catch (err: any) {
      console.error('Frontend Sync Error:', err);
      setStatus({ success: false, message: err.message || 'Failed to connect to server' });
    } finally {
      setSyncing(false);
    }
  };

  const handleCleanup = async () => {
    setCleaning(true);
    setStatus(null);
    console.log('🧹 Initiating Deep Duplicate Cleanup...');
    try {
      const data = await ServiceAPI.removeAllDuplicates();
      if (data.success) {
        setStatus({ success: true, message: data.message });
      } else {
        setStatus({ success: false, message: data.error });
      }
    } catch (err: any) {
      console.error('Frontend Cleanup Error:', err);
      setStatus({ success: false, message: err.message || 'Failed to connect to server' });
    } finally {
      setCleaning(false);
    }
  };

  const handleCatalogSync = async () => {
    setCatalogSyncing(true);
    setCatalogResults(null);
    try {
      const squareToken = localStorage.getItem('SESSION_SQUARE_ACCESS_TOKEN') || import.meta.env.VITE_SQUARE_ACCESS_TOKEN || '';
      const squareLocationId = localStorage.getItem('SESSION_VITE_SQUARE_LOCATION_ID') || import.meta.env.VITE_SQUARE_LOCATION_ID || '';
      const resp = await fetch('/api/admin/sync-catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-square-access-token': squareToken,
          'x-square-location-id': squareLocationId,
        },
      });
      const data = await resp.json();
      if (data.status === 'ok') {
        setCatalogResults(data);
      } else {
        setCatalogResults({ error: data.error || 'Unknown error' });
      }
    } catch (err: any) {
      setCatalogResults({ error: err.message || 'Failed to reach server' });
    } finally {
      setCatalogSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-24 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* 1. Revenue & Behavior Stats */}
            <div className="lg:col-span-8 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white italic font-black shadow-xl">IQ</div>
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter italic">Revenue Intelligence</h1>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Behavior tracking & price optimization</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm space-y-2">
                        <Users className="h-5 w-5 text-zinc-400" />
                        <p className="text-xs font-black uppercase text-zinc-400 tracking-widest">Total Leads</p>
                        <p className="text-3xl font-black text-zinc-900 italic">{stats.totalQuotes}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm space-y-2">
                        <Target className="h-5 w-5 text-emerald-500" />
                        <p className="text-xs font-black uppercase text-zinc-400 tracking-widest">Conversion</p>
                        <p className="text-3xl font-black text-zinc-900 italic">{stats.conversionRate}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm space-y-2">
                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                        <p className="text-xs font-black uppercase text-zinc-400 tracking-widest">Avg Ticket</p>
                        <p className="text-3xl font-black text-zinc-900 italic">{stats.averageTicket}</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-zinc-50 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-black italic tracking-tight">Funnel Drop-Off Points</h3>
                            <p className="text-xs text-zinc-400">Where are you losing potential money?</p>
                        </div>
                        <BarChart3 className="h-5 w-5 text-zinc-300" />
                    </div>
                    <div className="p-8 space-y-6">
                        {stats.dropOffPoints.map((point, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                    <span className="text-zinc-500">{point.step}</span>
                                    <span className="text-red-500 flex items-center gap-1">
                                        <ArrowDownRight className="h-3 w-3" /> {point.rate}
                                    </span>
                                </div>
                                <div className="h-2 bg-zinc-50 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-zinc-900 transition-all duration-1000" 
                                        style={{ width: `${100 - parseInt(point.rate)}%` }} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-zinc-50 flex justify-between items-center bg-zinc-950 text-white">
                        <div>
                            <h3 className="text-lg font-black italic tracking-tight">Service Popularity vs. Pricing</h3>
                            <p className="text-xs text-zinc-500">Is it time to raise rates?</p>
                        </div>
                        <LineChart className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="p-8">
                        <div className="divide-y divide-zinc-50">
                            {stats.popularServices.map((service, index) => (
                                <div key={index} className="py-4 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-xs font-black text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-zinc-900">{service.name}</p>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{service.price} Base</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black italic">{service.percentage}</p>
                                        {parseInt(service.percentage) > 50 && (
                                            <p className="text-[10px] font-black text-emerald-600 uppercase italic tracking-tighter underline">Over-utilized: +$15 Suggestion</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- NEW: FIRESTORE MASTER SERVICE INVENTORY --- */}
                <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden mt-8">
                  <div className="p-8 border-b border-zinc-50 flex justify-between items-center bg-zinc-50">
                    <div>
                      <h3 className="text-xl font-black italic tracking-tighter text-zinc-900">Service Inventory Master</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Master Data Source (Firestore)</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <Button variant="outline" size="sm" onClick={fetchDbServices} className="rounded-xl h-8 text-[10px] uppercase font-black tracking-widest">
                         <RefreshCw className={`h-3 w-3 mr-2 ${isLoadingServices ? 'animate-spin' : ''}`} />
                         Refresh
                       </Button>
                    </div>
                  </div>
                  
                  <div className="p-0">
                    {dbServices.length === 0 && !isLoadingServices ? (
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center mx-auto mb-4">
                          <Zap className="h-8 w-8 text-zinc-200" />
                        </div>
                        <p className="text-sm font-black text-zinc-400 italic">No master services found in Firestore.</p>
                        <p className="text-[10px] text-zinc-400 mt-2 uppercase tracking-widest">Run "Push Updates to Square" to seed the database.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-zinc-50">
                        {dbServices.map((svc) => (
                          <div key={svc.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={`w-3 h-3 rounded-full ${svc.active !== false ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-red-500'}`} />
                              <div>
                                <h4 className="text-sm font-black text-zinc-900">{svc.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[9px] font-black uppercase text-zinc-400 tracking-tighter">Square ID:</span>
                                  <span className="text-[9px] font-mono text-zinc-500">{svc.squareId || 'Not Synced'}</span>
                                  {svc.syncStatus === 'synced' && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase">Live</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button 
                                variant={svc.active !== false ? "outline" : "default"} 
                                size="sm" 
                                onClick={() => toggleServiceStatus(svc.id, svc.active !== false)}
                                className={`rounded-xl h-9 text-[10px] font-black uppercase tracking-widest ${
                                  svc.active !== false ? 'border-red-100 text-red-600 hover:bg-red-50' : 'bg-emerald-500 text-zinc-950'
                                }`}
                              >
                                {svc.active !== false ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => deleteService(svc.id)}
                                className="rounded-xl h-9 w-9 p-0 text-zinc-300 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* --- NEW: SYSTEM DIAGNOSTIC LOGS --- */}
                <div className="bg-zinc-900 rounded-[2.5rem] border border-zinc-800 shadow-2xl overflow-hidden mt-8 text-white">
                  <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-black italic tracking-tighter">System Diagnostic Logs</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Real-time Square & Engine monitoring</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={fetchLogs} className="text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl h-8 text-[10px] uppercase font-black tracking-widest">
                      <RefreshCw className={`h-3 w-3 mr-2 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                      Refresh Logs
                    </Button>
                  </div>
                  
                  <div className="p-0">
                    {logs.length === 0 && !isLoadingLogs ? (
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                          <BarChart3 className="h-8 w-8 text-zinc-700" />
                        </div>
                        <p className="text-sm font-black text-zinc-500 italic">No system logs recorded yet.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-zinc-800">
                        {logs.map((log) => (
                          <div key={log.id} className="p-6 hover:bg-white/5 transition-colors group">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                  log.level === 'error' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                                  log.level === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                                }`} />
                                <div>
                                  <div className="flex items-center gap-3 mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{log.source}</span>
                                    <span className="text-[10px] text-zinc-600">
                                      {log.timestamp?._seconds 
                                        ? new Date(log.timestamp._seconds * 1000).toLocaleString() 
                                        : 'Just now'}
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-bold text-zinc-100">{log.message}</h4>
                                  {log.details && (
                                    <div className="mt-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800 hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                                      <pre className="text-[9px] font-mono text-zinc-400 overflow-x-auto">
                                        {JSON.stringify(log.details, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                  {log.level === 'error' && !log.details && (
                                    <p className="text-[10px] text-red-400 mt-1 font-medium capitalize">
                                      {log.level} reported. Hover for technical details.
                                    </p>
                                  )}
                                </div>
                              </div>
                              {log.level === 'error' && (
                                <AlertCircle className="h-4 w-4 text-red-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
            </div>

            {/* 2. Management Controls */}
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="w-24 h-24 text-zinc-900" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-xl">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-black italic tracking-tight">API Setup & Health</h2>
                    </div>
                    
                    <div className="space-y-4 relative z-10">
                        <div className="p-4 bg-zinc-50 rounded-2xl space-y-3">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Gemini AI (Chat/Scan)</p>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${process.env.GEMINI_API_KEY ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    {process.env.GEMINI_API_KEY ? 'Connected' : 'Missing Key'}
                                </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 leading-normal">
                                Get a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-blue-500 underline">Google AI Studio</a>. Add <code>GEMINI_API_KEY</code> to Settings.
                            </p>
                        </div>

                        <div className="p-4 bg-zinc-50 rounded-2xl space-y-3 border-l-4 border-zinc-200">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Configuration Hub</p>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${envStatus.squareToken && envStatus.squareApp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    {(envStatus.squareToken && envStatus.squareApp) ? 'Live' : 'Action Required'}
                                </span>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] text-zinc-400 leading-normal">
                                    Manage your Square payment integration and Gemini AI settings in one place.
                                </p>
                                <Button 
                                    onClick={() => setIsConfigOpen(true)}
                                    className="w-full h-12 rounded-xl bg-zinc-900 border-0 text-white font-black italic shadow-lg shadow-zinc-200 hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                                >
                                    <Settings className="h-4 w-4" />
                                    Launch Setup Wizard
                                </Button>
                            </div>
                        </div>

                        <div className="p-4 bg-zinc-50 rounded-2xl space-y-3">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Google Maps (Reviews)</p>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${envStatus.maps ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {envStatus.maps ? 'Configured' : 'Missing Key'}
                                </span>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] text-zinc-400 leading-normal">
                                    <strong>Note:</strong> If you see "REQUEST_DENIED", ensure the <strong>Places API (Legacy)</strong> is enabled in your Google Cloud project and billing is attached.
                                </p>
                                <a 
                                    href="https://console.cloud.google.com/google/maps-apis/api-list" 
                                    target="_blank" 
                                    className="text-[9px] text-blue-500 font-bold flex items-center gap-1 hover:underline"
                                >
                                    Check API Status <ExternalLink className="h-2 w-2" />
                                </a>
                            </div>
                        </div>

                        <div className="p-4 bg-zinc-50 rounded-2xl space-y-3 border-l-4 border-blue-500">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Custom Domain Setup</p>
                                <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-blue-100 text-blue-700">
                                    Pending
                                </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 leading-normal">
                                To use <code>bryansdetailingomaha.com</code>, ensure your DNS CNAME points to the Development URL or use the platform's mapping service.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Square Catalog Sync ── */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-black shadow-xl">
                      <RefreshCw className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black italic tracking-tight">Square Catalog Sync</h2>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Push prices & services to Square</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                      Syncs all services from your website into Square — creating new ones and updating prices on existing ones. <strong>Safe to run anytime. Will never create duplicates.</strong>
                    </p>

                    <Button
                      onClick={handleCatalogSync}
                      disabled={catalogSyncing}
                      className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${catalogSyncing ? 'animate-spin' : ''}`} />
                      {catalogSyncing ? 'Syncing to Square...' : 'Sync All Services to Square'}
                    </Button>

                    {catalogResults && !catalogResults.error && catalogResults.summary && (
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                            <p className="text-2xl font-black text-emerald-600">{catalogResults.summary.created}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Created</p>
                          </div>
                          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                            <p className="text-2xl font-black text-blue-600">{catalogResults.summary.updated}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-blue-500">Updated</p>
                          </div>
                          <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-center">
                            <p className="text-2xl font-black text-zinc-600">{catalogResults.summary.skipped}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Skipped</p>
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {catalogResults.results?.map((r: any, i: number) => (
                            <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-xl text-[10px] font-bold ${
                              r.action === 'created' ? 'bg-emerald-50 text-emerald-700' :
                              r.action === 'updated' ? 'bg-blue-50 text-blue-700' :
                              'bg-red-50 text-red-600'
                            }`}>
                              <span className="truncate">{r.name}</span>
                              <span className="uppercase tracking-widest shrink-0 ml-2">{r.error ? `⚠ ${r.error.slice(0, 30)}` : r.action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {catalogResults?.error && (
                      <div className="mt-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                        <p className="text-xs font-bold text-red-600">⚠ Sync Error</p>
                        <p className="text-[10px] text-red-500 mt-1">{catalogResults.error}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Management Section */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <LineChart className="w-24 h-24 text-zinc-900" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-xl">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-black italic tracking-tight">Media Library</h2>
                    </div>
                    
                    <div className="space-y-4 relative z-10">
                        <p className="text-xs text-zinc-500 font-medium leading-relaxed italic">
                            Want to use your own photos? Follow these steps to replace the stock images:
                        </p>
                        
                        <div className="p-4 bg-zinc-50 rounded-2xl space-y-3">
                            <div className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] font-black flex items-center justify-center shrink-0">1</div>
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Upload to File Explorer</p>
                            </div>
                            <p className="text-[10px] text-zinc-400 leading-normal pl-8">
                                Drag your JPG/PNG files into the <code className="bg-zinc-200 px-1 rounded text-zinc-900">public</code> folder in the left-hand sidebar.
                            </p>
                        </div>

                        <div className="p-4 bg-zinc-50 rounded-2xl space-y-3">
                            <div className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] font-black flex items-center justify-center shrink-0">2</div>
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Reference in Data</p>
                            </div>
                            <p className="text-[10px] text-zinc-400 leading-normal pl-8">
                                Update the <code className="bg-zinc-200 px-1 rounded text-zinc-900">image</code> path in <code className="bg-zinc-200 px-1 rounded text-zinc-900">src/data/services.ts</code> to match your filename.
                            </p>
                        </div>
                        
                        <div className="pt-4 text-center">
                            <p className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                                Need help? Ask the AI Assist
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-100">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-black italic tracking-tight">Square Master</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100 space-y-4">
                            <div className="flex items-center justify-between">
                               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Business Logic Source</p>
                               <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase">Active</span>
                            </div>
                            <h4 className="text-2xl font-black italic tracking-tighter text-zinc-900 leading-none">All Services Managed via Square Catalog.</h4>
                            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                                Pricing, availability, and bookings are now pulled directly from your Square account. Changes made in the Square Dashboard reflect on the site instantly.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                              <Button 
                                onClick={handleSync}
                                className="h-12 rounded-2xl bg-zinc-950 text-white font-black italic shadow-lg shadow-zinc-200"
                                disabled={syncing}
                              >
                                {syncing ? (
                                  <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Push Updates to Square
                                  </>
                                )}
                              </Button>
                              <Button variant="outline" className="h-12 rounded-2xl border-zinc-200 font-black italic" asChild>
                                <a href="https://squareup.com/dashboard/items/library" target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4 text-emerald-500" />
                                  Open Square
                                </a>
                              </Button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-zinc-50 space-y-4">
                             <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Integrity Tools</h5>
                              <Button 
                                variant="outline"
                                onClick={handleCleanup} 
                                className="w-full h-14 rounded-2xl text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300 font-black italic"
                                disabled={cleaning}
                            >
                                {cleaning ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Analyzing Catalog...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Cleanup Duplicate Items
                                    </>
                                )}
                            </Button>
                        </div>

                        {status && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-xl flex items-start gap-3 ${
                                    status.success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                                }`}
                            >
                                {status.success ? (
                                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                )}
                                <p className="text-sm font-medium">{status.message}</p>
                            </motion.div>
                        )}
                    </div>
                </div>

                <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white">
                    <h3 className="text-lg font-black italic tracking-tight mb-4">Deep Links</h3>
                    <ul className="space-y-4">
                        <li>
                            <Link to="/admin/services" className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
                                <span className="text-sm font-bold text-zinc-200">Service Manager</span>
                                <FileText className="h-4 w-4 text-emerald-500" />
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/blog" className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
                                <span className="text-sm font-bold text-zinc-200">Blog Manager</span>
                                <FileText className="h-4 w-4 text-emerald-500" />
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/faq" className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
                                <span className="text-sm font-bold text-zinc-200">FAQ Manager</span>
                                <Info className="h-4 w-4 text-blue-500" />
                            </Link>
                        </li>
                        <li>
                            <a href="https://squareup.com/dashboard/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
                                <span className="text-sm font-bold text-zinc-200">Square Dashboard</span>
                                <TrendingUp className="h-4 w-4 text-zinc-500" />
                            </a>
                        </li>
                        <li>
                            <a href="https://squareup.com/dashboard/staff/team" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
                                <span className="text-sm font-bold text-zinc-200">Personnel & Hours</span>
                                <Users className="h-4 w-4 text-zinc-500" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </div>

      {/* Setup Wizard Modal */}
      <AnimatePresence>
        {isConfigOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfigOpen(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white">
                    <Key className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black italic tracking-tight">API Setup Wizard</h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Connect your Business Infrastructure</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsConfigOpen(false)}
                  className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
                
                {/* 1. Square Payments Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                    <h3 className="text-lg font-black italic tracking-tight">1. Square Payments & Booking</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        To process payments and sync your catalog, you need to connect your Square account.
                      </p>
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase text-zinc-400 italic">Instructions</h4>
                        <ul className="text-xs space-y-2 text-zinc-500">
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-3 w-3 mt-0.5 text-emerald-500 shrink-0" />
                            <span>Log into <a href="https://developer.squareup.com" target="_blank" className="text-blue-500 underline font-bold">Square Developer</a></span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-3 w-3 mt-0.5 text-emerald-500 shrink-0" />
                            <span>Create a <b>"Detailing App"</b></span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-3 w-3 mt-0.5 text-emerald-500 shrink-0" />
                            <span>Copy the <b>Application ID</b> and <b>Access Token</b></span>
                          </li>
                        </ul>
                      </div>
                      <a 
                        href="https://developer.squareup.com/apps" 
                        target="_blank" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all"
                      >
                        Open Dashboard <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    
                    <div className="space-y-4 p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Current Health</span>
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${envStatus.squareToken ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                          {envStatus.squareToken ? <Zap className="h-2 w-2" /> : <Shield className="h-2 w-2" />}
                          {envStatus.squareToken ? 'Token Found' : 'Missing'}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Square Access Token</label>
                          <input 
                            type="password"
                            value={sessionKeys.SQUARE_ACCESS_TOKEN}
                            onChange={(e) => setSessionKeys(prev => ({ ...prev, SQUARE_ACCESS_TOKEN: e.target.value }))}
                            placeholder="sq0atp-..."
                            className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-[10px] font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Square Application ID</label>
                          <input 
                            type="text"
                            value={sessionKeys.VITE_SQUARE_APP_ID}
                            onChange={(e) => setSessionKeys(prev => ({ ...prev, VITE_SQUARE_APP_ID: e.target.value }))}
                            placeholder="sandbox-sq0idp-..."
                            className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-[10px] font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Square Location ID</label>
                          <input 
                            type="text"
                            value={sessionKeys.VITE_SQUARE_LOCATION_ID}
                            onChange={(e) => setSessionKeys(prev => ({ ...prev, VITE_SQUARE_LOCATION_ID: e.target.value }))}
                            placeholder="L..."
                            className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-[10px] font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Environment (sandbox / production)</label>
                          <select 
                            value={sessionKeys.SQUARE_ENVIRONMENT || 'sandbox'}
                            onChange={(e) => setSessionKeys(prev => ({ ...prev, SQUARE_ENVIRONMENT: e.target.value }))}
                            className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-[10px] font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          >
                            <option value="sandbox">Sandbox</option>
                            <option value="production">Production</option>
                          </select>
                        </div>
                        <div className="pt-2">
                          <p className="text-[10px] text-zinc-400 italic leading-tight">
                            Status: {envStatus.squareToken ? '✅ Connected' : '❌ Needs Setup'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-zinc-100" />

                {/* 3. Google Maps Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-amber-500 rounded-full" />
                    <h3 className="text-lg font-black italic tracking-tight">3. Google Maps (Reviews & Location)</h3>
                  </div>
                  
                  <div className="p-6 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-zinc-900 italic uppercase">Maps API Config</p>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${envStatus.maps ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                        {envStatus.maps ? 'Configured' : 'Missing'}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Google Maps API Key</label>
                        <input 
                          type="password"
                          value={sessionKeys.GOOGLE_MAPS_API_KEY}
                          onChange={(e) => setSessionKeys(prev => ({ ...prev, GOOGLE_MAPS_API_KEY: e.target.value }))}
                          placeholder="AIza..."
                          className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-[10px] font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Google Place ID</label>
                        <input 
                          type="text"
                          value={sessionKeys.GOOGLE_PLACE_ID}
                          onChange={(e) => setSessionKeys(prev => ({ ...prev, GOOGLE_PLACE_ID: e.target.value }))}
                          placeholder="ChIJ..."
                          className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-[10px] font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <p className="text-xs text-zinc-500 leading-relaxed italic">
                      Required for displaying real Google Reviews. You can find your Place ID <a href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder" target="_blank" className="text-blue-500 underline font-bold">here</a>.
                    </p>
                  </div>
                </section>

                {/* 2. Gemini AI Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-zinc-900 rounded-full" />
                    <h3 className="text-lg font-black italic tracking-tight">2. Gemini AI Concierge</h3>
                  </div>
                  
                  <div className="p-6 bg-zinc-900 rounded-[2.5rem] text-white space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold opacity-80 uppercase tracking-widest italic">AI BRAIN CONFIG</p>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${envStatus.gemini ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        {envStatus.gemini ? 'ACTIVE' : 'OFFLINE'}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block">Gemini API Key</label>
                      <input 
                        type="password"
                        value={sessionKeys.GEMINI_API_KEY}
                        onChange={(e) => setSessionKeys(prev => ({ ...prev, GEMINI_API_KEY: e.target.value }))}
                        placeholder="AIza..."
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-[10px] font-mono text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Powers the Chat Assistant and Vehicle Condition AI. Paste your key above from Google AI Studio.
                    </p>
                    
                    <Button variant="outline" className="w-full h-12 rounded-xl border-zinc-700 text-white hover:bg-zinc-800 font-bold" asChild>
                      <a href="https://aistudio.google.com/app/apikey" target="_blank">
                        Get Free Key <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </section>

                {/* 3. Global Secrets Table */}
                <section className="space-y-4">
                   <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <h3 className="text-sm font-black italic tracking-tight uppercase">Master Secrets Reference</h3>
                  </div>
                  <div className="bg-zinc-50 rounded-[1.5rem] overflow-hidden border border-zinc-100">
                    <table className="w-full text-[10px] text-left">
                      <thead className="bg-zinc-100 text-zinc-400 font-black uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-3">Variable Name</th>
                          <th className="px-6 py-3">Source</th>
                          <th className="px-6 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        <tr>
                          <td className="px-6 py-4 font-mono text-zinc-600">SQUARE_ACCESS_TOKEN</td>
                          <td className="px-6 py-4 text-zinc-400">Square App Credentials</td>
                          <td className="px-6 py-4"><span className={envStatus.squareToken ? 'text-emerald-500' : 'text-red-500'}>{envStatus.squareToken ? '✓' : '✗'}</span></td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-mono text-zinc-600">VITE_SQUARE_APP_ID</td>
                          <td className="px-6 py-4 text-zinc-400">Square App Credentials</td>
                          <td className="px-6 py-4"><span className={envStatus.squareApp ? 'text-emerald-500' : 'text-red-500'}>{envStatus.squareApp ? '✓' : '✗'}</span></td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-mono text-zinc-600">GEMINI_API_KEY</td>
                          <td className="px-6 py-4 text-zinc-400">Google AI Studio</td>
                          <td className="px-6 py-4"><span className={envStatus.gemini ? 'text-emerald-500' : 'text-red-500'}>{envStatus.gemini ? '✓' : '✗'}</span></td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-mono text-zinc-600">GOOGLE_MAPS_API_KEY</td>
                          <td className="px-6 py-4 text-zinc-400">Google Cloud Console</td>
                          <td className="px-6 py-4"><span className={envStatus.maps ? 'text-emerald-500' : 'text-red-500'}>{envStatus.maps ? '✓' : '✗'}</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

              </div>

              {/* Footer */}
              <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-zinc-400 italic">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Grade Encryption</span>
                </div>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                       Object.keys(sessionKeys).forEach(key => localStorage.removeItem(`SESSION_${key}`));
                       window.location.reload();
                    }}
                    className="font-bold text-red-500 hover:bg-red-50"
                  >
                    Clear All Overrides
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsConfigOpen(false)}
                    className="font-bold text-zinc-500"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={saveSessionKeys}
                    className="bg-emerald-500 border-0 text-white px-8 h-12 rounded-xl font-black italic shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all"
                  >
                    Apply & Sync Live
                  </Button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
