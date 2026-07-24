import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Edit, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { FAQAPI } from '../services/api';

interface FaqItem {
  id: string;
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

  const fetchFaqs = async () => {
    try {
      setFaqs(await FAQAPI.getFaqs());
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Failed to load FAQs' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchFaqs();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ question: '', answer: '', order: 0 });
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editingId) await FAQAPI.updateFaq(editingId, formData);
      else await FAQAPI.createFaq(formData);
      setStatus({ type: 'success', message: `FAQ ${editingId ? 'updated' : 'added'} successfully.` });
      resetForm();
      await fetchFaqs();
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Failed to save FAQ' });
    }
  };

  const handleDelete = async (faq: FaqItem) => {
    if (!window.confirm(`Delete “${faq.question}”?`)) return;
    try {
      await FAQAPI.deleteFaq(faq.id);
      setStatus({ type: 'success', message: 'FAQ deleted successfully.' });
      await fetchFaqs();
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Failed to delete FAQ' });
    }
  };

  if (loading) return <div className="min-h-screen bg-zinc-50 pt-32 text-center text-zinc-500">Loading FAQs…</div>;

  return (
    <main className="min-h-screen bg-zinc-50 px-4 pb-24 pt-32 font-sans">
      <div className="mx-auto max-w-4xl">
        <Link to="/admin" className="mb-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-950"><ArrowLeft className="h-4 w-4" /> Admin</Link>
        <h1 className="text-3xl font-black italic tracking-tight text-zinc-950">FAQ Manager</h1>
        <p className="mt-2 text-sm text-zinc-600">Changes appear on the public FAQ page immediately.</p>

        {status && <div className={`mt-6 flex items-center gap-3 rounded-2xl p-4 text-sm font-bold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}><CheckCircle2 className="h-5 w-5" />{status.message}</div>}

        <section className="my-8 rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-black italic"><Plus className="h-5 w-5 text-emerald-600" /> {editingId ? 'Edit FAQ' : 'Add FAQ'}</h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-[1fr_8rem]">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Question<input required maxLength={500} value={formData.question} onChange={(event) => setFormData({ ...formData, question: event.target.value })} className="mt-2 w-full rounded-xl bg-zinc-50 p-4 text-sm normal-case tracking-normal text-zinc-950 ring-1 ring-zinc-200" /></label>
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Order<input type="number" value={formData.order} onChange={(event) => setFormData({ ...formData, order: Number(event.target.value) })} className="mt-2 w-full rounded-xl bg-zinc-50 p-4 text-sm text-zinc-950 ring-1 ring-zinc-200" /></label>
            </div>
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Answer<textarea required maxLength={5000} rows={5} value={formData.answer} onChange={(event) => setFormData({ ...formData, answer: event.target.value })} className="mt-2 w-full rounded-xl bg-zinc-50 p-4 text-sm normal-case tracking-normal text-zinc-950 ring-1 ring-zinc-200" /></label>
            <div className="flex gap-3"><Button type="submit" className="rounded-xl bg-zinc-950 px-7 font-black text-white">{editingId ? 'Update FAQ' : 'Publish FAQ'}</Button>{editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}</div>
          </form>
        </section>

        <section className="space-y-4">
          {faqs.map((faq) => (
            <article key={faq.id} className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Order {faq.order}</p><h2 className="mt-2 text-lg font-black text-zinc-950">{faq.question}</h2><p className="mt-3 text-sm leading-6 text-zinc-600">{faq.answer}</p></div><div className="flex shrink-0 gap-1"><Button variant="ghost" size="icon" aria-label={`Edit ${faq.question}`} onClick={() => { setEditingId(faq.id); setFormData({ question: faq.question, answer: faq.answer, order: faq.order }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label={`Delete ${faq.question}`} className="text-red-600" onClick={() => void handleDelete(faq)}><Trash2 className="h-4 w-4" /></Button></div></div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
