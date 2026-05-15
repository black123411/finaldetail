import React, { useState, useEffect } from 'react';
import { ServiceAPI } from '../services/api';
import { Plus, Edit2, Save, Trash2, X } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function AdminServiceManager() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await ServiceAPI.getAdminServices();
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (svc: any) => {
    setEditingId(svc.id);
    setFormData(svc);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const saveService = async () => {
    try {
      if (editingId === 'new') {
        await ServiceAPI.createAdminService(formData);
      } else {
        await ServiceAPI.patchAdminService(editingId!, formData);
      }
      setEditingId(null);
      fetchServices();
    } catch (err: any) {
      console.error(err);
      alert('Error saving service: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-24 px-4 font-sans max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black italic text-zinc-900 tracking-tighter">Service Manager</h1>
          <p className="text-sm text-zinc-500 font-medium">Add, edit, and describe your services. These sync to Square automatically.</p>
        </div>
        <Button onClick={() => { setEditingId('new'); setFormData({}); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      <div className="space-y-4">
        {services.map(svc => (
          <div key={svc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex items-start justify-between">
            {editingId === svc.id ? (
              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Name</label>
                  <input className="w-full mt-1 p-2 border border-zinc-200 rounded" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                  <textarea className="w-full mt-1 p-2 border border-zinc-200 rounded" rows={3} value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Price (Base / Car)</label>
                  <input type="number" className="w-full mt-1 p-2 border border-zinc-200 rounded" 
                    value={typeof formData.price === 'object' ? (formData.price?.car || formData.price?.rv || formData.price?.tractor || Object.values(formData.price)[0] || '') : (formData.price || '')} 
                    onChange={e => {
                      const val = Number(e.target.value);
                      if (formData.isSpecialty) {
                        setFormData({ ...formData, price: { [formData.price?.rv !== undefined ? 'rv' : 'tractor']: val } });
                      } else {
                        setFormData({ 
                          ...formData, 
                          price: { 
                            car: val, 
                            suv: val + 20, 
                            truck: val + 40, 
                            largeSuv: val + 70 
                          } 
                        });
                      }
                    }} 
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">For standard services, SUV/Truck/XL prices are auto-calculated (+20/40/70).</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Duration (mins)</label>
                  <input type="number" className="w-full mt-1 p-2 border border-zinc-200 rounded" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveService} className="bg-zinc-900"><Save className="mr-2 h-4 w-4"/> Save</Button>
                  <Button variant="ghost" onClick={cancelEdit}><X className="mr-2 h-4 w-4"/> Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-900">{svc.name}</h3>
                  <p className="text-sm text-zinc-500 mt-2">{svc.description || 'No description provided.'}</p>
                  <div className="text-xs text-zinc-400 mt-3 flex gap-4">
                    <span className="font-mono bg-zinc-100 px-2 py-1 rounded">${typeof svc.price === 'object' ? (svc.price?.car || svc.price?.rv || svc.price?.tractor || Object.values(svc.price)[0] || 0) : (svc.price || 0)}</span>
                    <span className="font-mono bg-zinc-100 px-2 py-1 rounded">{svc.duration || 0} mins</span>
                    {svc.squareId && <span className="bg-emerald-100 px-2 py-1 rounded text-emerald-700 font-bold uppercase tracking-widest text-[10px] flex items-center">Linked to Square</span>}
                  </div>
                </div>
                <Button variant="ghost" onClick={() => startEdit(svc)}><Edit2 className="h-4 w-4"/></Button>
              </>
            )}
          </div>
        ))}

        {editingId === 'new' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex items-start justify-between">
            <div className="flex-1 space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Name</label>
                <input className="w-full mt-1 p-2 border border-zinc-200 rounded" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                <textarea className="w-full mt-1 p-2 border border-zinc-200 rounded" rows={3} value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Price (Base / Car)</label>
                <input type="number" className="w-full mt-1 p-2 border border-zinc-200 rounded" 
                  value={typeof formData.price === 'object' ? (formData.price?.car || formData.price?.rv || formData.price?.tractor || Object.values(formData.price)[0] || '') : (formData.price || '')} 
                  onChange={e => {
                    const val = Number(e.target.value);
                    if (formData.isSpecialty) {
                      setFormData({ ...formData, price: { rv: val } });
                    } else {
                      setFormData({ 
                        ...formData, 
                        price: { 
                          car: val, 
                          suv: val + 20, 
                          truck: val + 40, 
                          largeSuv: val + 70 
                        } 
                      });
                    }
                  }} 
                />
                <p className="text-[10px] text-zinc-500 mt-1">For standard services, SUV/Truck/XL prices are auto-calculated (+20/40/70).</p>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Duration (mins)</label>
                <input type="number" className="w-full mt-1 p-2 border border-zinc-200 rounded" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })} />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveService} className="bg-zinc-900"><Save className="mr-2 h-4 w-4"/> Create Service</Button>
                <Button variant="ghost" onClick={cancelEdit}><X className="mr-2 h-4 w-4"/> Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
