import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy, getDoc } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Edit, Trash2, Plus, GripVertical, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { randomUUID } from 'crypto';
import { auth } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  order: number;
}

export default function FAQManager() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ question: '', answer: '', order: 0 });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const q = query(collection(db, 'faqs'), orderBy('order'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FaqItem[];
      setFaqs(data);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setStatus({ type: 'error', message: 'Failed to load FAQs' });
      handleFirestoreError(err, OperationType.LIST, 'faqs');
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (type: 'success' | 'error', message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isNew = !editingId;
      const docId = editingId || crypto.randomUUID();
      const docRef = doc(db, 'faqs', docId);

      await setDoc(docRef, {
        question: formData.question,
        answer: formData.answer,
        order: Number(formData.order) || 0,
        updatedAt: serverTimestamp(),
        ...(isNew && { createdAt: serverTimestamp() })
      }, { merge: true });

      showStatus('success', `FAQ ${isNew ? 'added' : 'updated'} successfully`);
      setEditingId(null);
      setFormData({ question: '', answer: '', order: 0 });
      fetchFaqs();
    } catch (err: any) {
      console.error(err);
      showStatus('error', err.message || 'Failed to save FAQ');
      handleFirestoreError(err, OperationType.WRITE, 'faqs');
    }
  };

  const handleEdit = (faq: FaqItem) => {
    setEditingId(faq.id!);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      order: faq.order || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await deleteDoc(doc(db, 'faqs', id));
      showStatus('success', 'FAQ deleted successfully');
      fetchFaqs();
    } catch (err: any) {
      console.error(err);
      showStatus('error', err.message || 'Failed to delete FAQ');
      handleFirestoreError(err, OperationType.DELETE, 'faqs');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ question: '', answer: '', order: 0 });
  };

  if (loading) {
    return <div className="min-h-screen pt-32 pb-24 text-center text-zinc-500">Loading master FAQs...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-24 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-zinc-900">FAQ Manager</h1>
            <p className="text-zinc-500 text-sm font-medium">Control the frequently asked questions displayed on the site.</p>
          </div>
        </div>

        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-8 p-4 rounded-xl flex items-center gap-3 font-medium ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
              }`}
            >
              <CheckCircle2 className="h-5 w-5" />
              {status.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100 mb-8">
          <h2 className="text-xl font-black italic tracking-tight mb-6 flex items-center gap-2">
            {editingId ? <><Edit className="h-5 w-5 text-blue-500" /> Edit FAQ</> : <><Plus className="h-5 w-5 text-emerald-500" /> Add New FAQ</>}
          </h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Question</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={e => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g., How long does a detail take?"
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
              <div className="md:col-span-1">
                 <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Display Order</label>
                 <input
                  type="number"
                  value={formData.order}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Answer</label>
              <textarea
                required
                rows={4}
                value={formData.answer}
                onChange={e => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Provide a detailed answer..."
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-y"
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-zinc-100">
              <Button type="submit" className="px-8 h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-black italic shadow-lg shadow-zinc-200">
                {editingId ? 'Update FAQ' : 'Publish FAQ'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel} className="px-8 h-12 rounded-xl font-bold">
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-4">
           {faqs.length === 0 && (
             <div className="text-center p-12 border-2 border-dashed border-zinc-200 rounded-[2rem]">
               <p className="text-zinc-400 font-medium italic mb-4">No FAQs added yet.</p>
               <Button 
                onClick={async () => {
                  try {
                    const DEFAULT_FAQS = [
                      { question: 'How long does detailing take?', answer: 'The time required depends on the service package...', order: 1 },
                      { question: 'What is your rain or weather policy?', answer: 'For mobile detailing, your appointment is weather-dependent...', order: 2 },
                      { question: 'Do I need to provide water or electricity for mobile services?', answer: 'We are fully self-contained! We bring our own professional-grade spot-free water...', order: 3 }
                    ];
                    for (const faq of DEFAULT_FAQS) {
                      await setDoc(doc(db, 'faqs', crypto.randomUUID()), { ...faq, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
                    }
                    showStatus('success', 'Seeded default FAQs!');
                    fetchFaqs();
                  } catch (e: any) {
                    showStatus('error', e.message);
                    handleFirestoreError(e, OperationType.WRITE, 'faqs');
                  }
                }}
                className="bg-zinc-900 text-white px-6 rounded-xl"
               >
                 Seed Initial FAQs
               </Button>
             </div>
           )}

           {faqs.map((faq) => (
            <motion.div 
              key={faq.id}
              layout
              className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 group hover:border-zinc-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="text-zinc-300 group-hover:text-zinc-400 cursor-grab active:cursor-grabbing pt-1">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-black italic tracking-tight text-zinc-900 break-words pr-4">{faq.question}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                       <span className="text-xs font-bold text-zinc-400 hidden md:inline-block mr-2">Order: {faq.order}</span>
                       <Button variant="ghost" size="sm" onClick={() => handleEdit(faq)} className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                         <Edit className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="sm" onClick={() => handleDelete(faq.id!)} className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed break-words">{faq.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
