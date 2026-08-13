import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Loader2, MessageSquare, Phone } from 'lucide-react';
import { QuoteAPI } from '../services/api';
import { trackEvent } from '../lib/analytics';

const textHref = 'sms:+17123056313?body=Hi%20Bryan%2C%20I%27d%20like%20a%20detailing%20recommendation.%20My%20vehicle%20is%3A%20%0AWhat%20I%20want%20done%3A%20%0AHere%20are%20photos%3A';

export default function Quote() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', vehicle: '', work: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData();
    data.append('name', form.name);
    data.append('phone', form.phone);
    data.append('email', form.email);
    data.append('vehicleYear', form.vehicle);
    data.append('vehicleSize', form.vehicle);
    data.append('services', form.work);
    data.append('condition', form.notes);
    data.append('expectation', form.work);
    data.append('addons', '[]');
    data.append('redFlags', '{}');
    data.append('estimatedRange', 'Needs review');
    try {
      const response = await QuoteAPI.submitQuote(data);
      if (!response.success) throw new Error(response.error || 'I could not send your request.');
      trackEvent('generate_lead', { form_name: 'quote', location: 'contact_page' });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'I could not send your request. Please text or call me instead.');
    } finally { setSubmitting(false); }
  };

  if (submitted) return (
    <div className="min-h-[70vh] bg-slate-50 px-4 py-24">
      <div className="mx-auto max-w-2xl border-t-4 border-blue-600 bg-white p-8 shadow-sm md:p-12">
        <CheckCircle2 className="h-12 w-12 text-blue-600" />
        <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950">I received your request.</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">I will review the vehicle information and follow up with you. If photos would help, send them to me by text.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href={textHref} className="inline-flex min-h-14 items-center justify-center gap-2 bg-blue-600 px-6 font-black text-white hover:bg-blue-700"><MessageSquare className="h-5 w-5" /> Text Photos</a><Link to="/services" className="inline-flex min-h-14 items-center justify-center border border-slate-300 px-6 font-black text-slate-800">View Services</Link></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <section className="bg-slate-950 py-20 text-white"><div className="container mx-auto px-4"><div className="max-w-3xl"><p className="text-sm font-black uppercase tracking-[.18em] text-blue-300">Contact Bryan</p><h1 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">Tell me about your vehicle.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">The quickest way to get my recommendation is to text me a few clear photos. You can also send the short form below and I will follow up.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href={textHref} onClick={() => trackEvent('click_text_quote', { location: 'quote_hero' })} className="inline-flex min-h-14 items-center justify-center gap-2 bg-blue-600 px-7 font-black text-white hover:bg-blue-700"><MessageSquare className="h-5 w-5" /> Text Photos to Bryan</a><a href="tel:7123056313" onClick={() => trackEvent('click_call', { location: 'quote_hero' })} className="inline-flex min-h-14 items-center justify-center gap-2 border border-slate-600 px-7 font-black text-white hover:border-blue-400"><Phone className="h-5 w-5" /> Call (712) 305-6313</a></div></div></div></section>

      <section className="py-16 md:py-24"><div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[.7fr_1.3fr]"><aside><h2 className="text-3xl font-black tracking-tight">Send a contact request</h2><p className="mt-4 leading-7 text-slate-600">Tell me what you drive and what you want done. I will review it myself.</p><div className="mt-8 border-l-4 border-blue-600 bg-white p-6"><h3 className="font-black">Sending photos?</h3><p className="mt-2 text-sm leading-6 text-slate-600">Photos are not uploaded through this form. Use the text button so I can see them clearly on my phone.</p></div></aside>
        <form onSubmit={handleSubmit} className="border border-slate-200 bg-white p-6 shadow-sm md:p-9"><div className="grid gap-6 sm:grid-cols-2">
          <label className="block"><span className="mb-2 block text-sm font-black">Name *</span><input required autoComplete="name" value={form.name} onChange={(e) => update('name', e.target.value)} className="min-h-12 w-full border border-slate-300 px-4 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200" /></label>
          <label className="block"><span className="mb-2 block text-sm font-black">Phone *</span><input required type="tel" autoComplete="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="min-h-12 w-full border border-slate-300 px-4 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200" /></label>
          <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-black">Email <span className="font-normal text-slate-500">(optional)</span></span><input type="email" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="min-h-12 w-full border border-slate-300 px-4 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200" /></label>
          <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-black">Vehicle *</span><input required placeholder="Year, make, model, and size" value={form.vehicle} onChange={(e) => update('vehicle', e.target.value)} className="min-h-12 w-full border border-slate-300 px-4 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200" /></label>
          <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-black">What do you want done? *</span><textarea required rows={4} placeholder="Tell me what needs attention or which service you are considering." value={form.work} onChange={(e) => update('work', e.target.value)} className="w-full resize-y border border-slate-300 px-4 py-3 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200" /></label>
          <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-black">Notes <span className="font-normal text-slate-500">(optional)</span></span><textarea rows={3} placeholder="Pet hair, stains, odors, paint concerns, timing, or anything else I should know." value={form.notes} onChange={(e) => update('notes', e.target.value)} className="w-full resize-y border border-slate-300 px-4 py-3 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200" /></label>
        </div>{error && <div role="alert" className="mt-6 border-l-4 border-red-600 bg-red-50 p-4 text-sm font-semibold text-red-800">{error}</div>}<button type="submit" disabled={submitting} className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 bg-blue-600 px-7 font-black text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Sending...</> : <>Send Request <ArrowRight className="h-5 w-5" /></>}</button><p className="mt-4 text-sm text-slate-500">I will review your request before recommending a service or confirming a price.</p></form>
      </div></section>
    </div>
  );
}
