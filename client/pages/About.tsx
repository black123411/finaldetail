import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, MessageSquare, ShieldCheck } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

const textPhotosLink = 'sms:+17123056313?body=Hi%20Bryan%2C%20I%27d%20like%20help%20choosing%20a%20detailing%20service.%20Here%20are%20photos%20of%20my%20vehicle%3A';

export default function About() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Bryan',
    jobTitle: 'Owner and Professional Auto Detailer',
    url: 'https://bryansdetailingomaha.com/about',
    worksFor: {
      '@type': 'LocalBusiness',
      '@id': 'https://bryansdetailingomaha.com/#business',
      name: "Bryan's Showroom Quality Mobile Detailing",
    },
    knowsAbout: [
      'Interior car detailing',
      'Paint correction',
      'Ceramic coating',
      'Vehicle appearance care',
    ],
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Helmet><script type="application/ld+json">{JSON.stringify(personSchema)}</script></Helmet>

      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto grid gap-10 px-4 py-14 lg:grid-cols-[1fr_.82fr] lg:items-center lg:py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-black leading-[.98] tracking-tight sm:text-6xl">About Bryan's Detailing</h1>
            <p className="mt-6 text-xl font-semibold leading-8 text-slate-900">I'm Bryan, the owner and detailer behind Bryan's Showroom Quality Detailing in Bellevue, Nebraska.</p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">I opened the business in 2017 after years of collision-center detailing, vehicle preparation and paint-prep work. That experience still affects how I approach paint, trim, fabric and other vehicle surfaces today.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/services" className="inline-flex min-h-14 items-center justify-center bg-blue-600 px-7 font-black text-white hover:bg-blue-700">View Services &amp; Pricing</Link>
              <a href={textPhotosLink} onClick={() => trackEvent('click_text_quote', { location: 'about_hero' })} className="inline-flex min-h-14 items-center justify-center gap-2 border border-slate-300 px-7 font-black text-slate-900 hover:border-blue-600 hover:text-blue-700"><MessageSquare className="h-5 w-5" /> Text Vehicle Photos</a>
            </div>
          </div>
          <figure>
            <img src="/bryan-professional-headshot.webp" alt="Bryan, owner of Bryan's Showroom Quality Detailing in Bellevue Nebraska" className="aspect-[4/5] w-full object-cover object-top" />
            <figcaption className="border-x border-b border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-600">The person you contact is the person working on your vehicle.</figcaption>
          </figure>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[.75fr_1.25fr]">
          <div><h2 className="text-4xl font-black tracking-tight">Why I started the business</h2></div>
          <div className="max-w-3xl text-lg leading-8 text-slate-600">
            <p className="font-semibold text-slate-950">Starting the business was personal.</p>
            <p className="mt-5">After my mother passed away, I took guardianship of my two younger siblings. I needed a way to support my family, and detailing was work I already knew.</p>
            <p className="mt-5">In 2017, I turned that experience into my own business. What started as a way to provide for my family became the owner-operated detailing business I still run today.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 lg:py-24">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="text-4xl font-black tracking-tight">Owner-operated means direct accountability</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">I inspect the vehicle, recommend the service, perform the work and check the result myself. If the condition changes the job, I can explain it directly instead of passing information between a salesperson and technician.</p>
          </div>
          <div className="divide-y divide-slate-300 border-y border-slate-300">
            {[
              'I recommend the service that fits the actual condition of the vehicle.',
              'I explain additional condition-related work before it is added.',
              'I do not promise stain removal or paint correction that is not realistic or safe.',
              'I personally check the finished work before the vehicle is returned.',
            ].map((item) => <div key={item} className="flex gap-3 py-5"><Check className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /><p className="font-semibold leading-7 text-slate-700">{item}</p></div>)}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <h2 className="text-4xl font-black tracking-tight">How I approach detailing</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Different materials and paint conditions need different methods. I would rather explain what can realistically be improved than chase a result that requires unnecessary risk.</p>
            <p className="mt-5 text-lg leading-8 text-slate-600">That applies to interior restoration, stain treatment, paint polishing, paint correction and ceramic-coating preparation.</p>
          </div>
          <aside className="border-l-4 border-blue-600 bg-slate-950 p-8 text-white">
            <ShieldCheck className="h-8 w-8 text-blue-400" />
            <h3 className="mt-5 text-2xl font-black">Clear communication before more work</h3>
            <p className="mt-4 leading-7 text-slate-300">Vehicle size, pet hair, stains, odors, spills, oxidation and previous damage can all change the amount of work involved. If I find something unexpected, I discuss it before changing the service or price.</p>
          </aside>
        </div>
      </section>

      <section className="bg-slate-950 py-14 text-white">
        <div className="container mx-auto flex flex-col justify-between gap-7 px-4 md:flex-row md:items-center">
          <div className="max-w-2xl"><h2 className="text-3xl font-black tracking-tight">Not sure what your vehicle needs?</h2><p className="mt-3 leading-7 text-slate-300">Send a few clear photos and tell me what you want cleaned, corrected or protected. I will recommend the appropriate service before you book.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row"><a href={textPhotosLink} onClick={() => trackEvent('click_text_quote', { location: 'about_closing' })} className="inline-flex min-h-14 items-center justify-center gap-2 bg-blue-600 px-7 font-black text-white hover:bg-blue-700"><MessageSquare className="h-5 w-5" /> Text Vehicle Photos</a><Link to="/services" className="inline-flex min-h-14 items-center justify-center gap-2 border border-slate-600 px-7 font-black text-white hover:border-blue-400">View Services <ArrowRight className="h-5 w-5" /></Link></div>
        </div>
      </section>
    </div>
  );
}
