import { useState } from 'react';
import { ArrowLeft, Check, Copy, ExternalLink, MessageSquareText, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const GOOGLE_REVIEW_URL =
  'https://search.google.com/local/writereview?placeid=ChIJVVU5ibSJk4cRCK2ex-dRYIg';

type CopiedItem = 'link' | 'message' | null;

export default function AdminReviewRequests() {
  const [firstName, setFirstName] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [copiedItem, setCopiedItem] = useState<CopiedItem>(null);
  const [copyError, setCopyError] = useState('');

  const customerName = firstName.trim() || 'there';
  const completedService = serviceName.trim() || 'recent detail';
  const message = `Hi ${customerName}, I hope you're enjoying the results of your ${completedService}! If you have a minute, I'd really appreciate an honest Google review. It helps other Bellevue and Omaha drivers find my business: ${GOOGLE_REVIEW_URL} — Bryan`;

  const copyText = async (value: string, item: Exclude<CopiedItem, null>) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedItem(item);
      setCopyError('');
    } catch {
      setCopiedItem(null);
      setCopyError('Copying was blocked by the browser. Select the text and copy it manually.');
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 pb-24 pt-28 font-sans md:pt-32">
      <div className="mx-auto max-w-5xl">
        <Link to="/admin" className="mb-6 inline-flex items-center gap-2 text-sm font-black text-zinc-600 hover:text-zinc-950">
          <ArrowLeft className="h-4 w-4" /> Back to admin
        </Link>

        <section className="rounded-[2rem] bg-zinc-950 p-7 text-white shadow-xl md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-emerald-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-[0.24em]">Verified Google review form</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">Review Request Helper</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                Personalize a simple request after a completed job. Nothing is sent automatically and no customer information is saved.
              </p>
            </div>
            <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-black text-emerald-400 hover:text-emerald-300">
              Test review form <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>

        <section className="mt-7 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
            <h2 className="text-xl font-black italic tracking-tight text-zinc-950">Personalize the message</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">Use only after the service is complete. Ask every customer for honest feedback—never offer an incentive or request only positive reviews.</p>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-700">Customer first name</span>
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="Example: Jamie"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-700">Completed service</span>
                <input
                  value={serviceName}
                  onChange={(event) => setServiceName(event.target.value)}
                  placeholder="Example: interior detail"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>
            </div>

            <Button type="button" variant="outline" onClick={() => void copyText(GOOGLE_REVIEW_URL, 'link')} className="mt-6 w-full rounded-xl py-6 font-black">
              {copiedItem === 'link' ? <Check className="mr-2 h-4 w-4 text-emerald-600" /> : <Copy className="mr-2 h-4 w-4" />}
              {copiedItem === 'link' ? 'Review link copied' : 'Copy review link'}
            </Button>
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><MessageSquareText className="h-5 w-5" /></span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">Ready to send manually</p>
                <h2 className="text-xl font-black italic tracking-tight text-zinc-950">Customer message</h2>
              </div>
            </div>

            <textarea
              aria-label="Review request message"
              readOnly
              value={message}
              className="mt-6 min-h-64 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm leading-7 text-zinc-800 outline-none"
            />

            {copyError ? <p className="mt-3 text-sm font-bold text-red-700">{copyError}</p> : null}

            <Button type="button" onClick={() => void copyText(message, 'message')} className="mt-5 w-full rounded-xl bg-emerald-500 py-6 font-black text-zinc-950 hover:bg-emerald-400">
              {copiedItem === 'message' ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copiedItem === 'message' ? 'Message copied' : 'Copy customer message'}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
