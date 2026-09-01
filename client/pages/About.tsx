import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { trackBookingHandoff, trackEvent } from '../lib/analytics';
import { BOOKING_LINK } from '../lib/constants';

const TEXT_PHOTOS_LINK =
  'sms:+17123056313?body=Hi%20Bryan%2C%20I%27d%20like%20help%20choosing%20a%20detailing%20service.%20Here%20are%20photos%20of%20my%20vehicle%3A';

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
    <div className="min-h-screen overflow-x-hidden bg-white text-zinc-950">
      <Helmet>
        <title>Meet Bryan | Bryan's Showroom Quality Detailing</title>
        <meta
          name="description"
          content="Meet Bryan, the owner and detailer behind Bryan's Showroom Quality Detailing, serving Bellevue and the Omaha area since 2017."
        />
        <link rel="canonical" href="https://bryansdetailingomaha.com/about" />
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>

      <section className="relative bg-zinc-950 pb-16 pt-28 text-white sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
        <div className="absolute inset-x-0 top-0 h-px bg-blue-600/70" />
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-400">
                Owner-operated since 2017
              </p>
              <h1 className="mt-5 text-5xl font-black leading-[0.94] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Meet Bryan
              </h1>
              <p className="mt-7 text-xl font-semibold leading-relaxed text-zinc-100">
                I’m Bryan, the owner of Bryan’s Showroom Quality Detailing. I started my business in 2017, but my experience with detailing and paint work started years before that.
              </p>
              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
                Before going out on my own, I spent years working in a collision center doing detailing, vehicle preparation, and paint prep. That experience taught me how much the small things matter and how different surfaces, materials, and paint conditions need to be handled.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-14 bg-blue-600 px-7 font-black text-white hover:bg-blue-500"
                  asChild
                >
                  <a href={BOOKING_LINK} onClick={(event) => trackBookingHandoff(event, { location: 'about_hero' })}>
                    <Calendar className="mr-2 h-5 w-5" aria-hidden="true" />
                    View Availability
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 border-zinc-700 bg-transparent px-7 font-black text-white hover:border-white hover:bg-white hover:text-zinc-950"
                  asChild
                >
                  <a
                    href={TEXT_PHOTOS_LINK}
                    onClick={() => trackEvent('click_text_quote', { location: 'about_hero' })}
                  >
                    <MessageSquare className="mr-2 h-5 w-5" aria-hidden="true" />
                    Text Me Photos
                  </a>
                </Button>
              </div>
            </div>

            <figure className="mx-auto w-full max-w-md lg:col-span-5 lg:justify-self-end">
              <div className="border border-white/15 bg-zinc-900 p-2 shadow-2xl shadow-black/30 sm:p-3">
                <img
                  src="/bryan-professional-headshot.webp"
                  alt="Bryan, owner of Bryan's Showroom Quality Detailing"
                  width="1136"
                  height="1808"
                  fetchPriority="high"
                  className="aspect-[4/5] w-full object-cover object-top"
                />
              </div>
              <figcaption className="mt-3 border-l-2 border-blue-600 pl-3 text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                The person you talk to is the person doing the work.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">Where it started</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Why I Started My Own Detailing Business
            </h2>
          </div>
          <div className="max-w-3xl border-l border-zinc-300 pl-6 text-lg leading-8 text-zinc-700 sm:pl-10 sm:text-xl sm:leading-9 lg:col-span-8">
            <p className="font-semibold text-zinc-950">Starting Bryan’s Detailing was personal for me.</p>
            <p className="mt-5">
              After my mother passed away, I took guardianship of my two younger siblings. I suddenly had a much bigger responsibility and needed a way to provide for my family.
            </p>
            <p className="mt-5">
              I also knew I wanted to build something of my own around work I already had experience doing and actually cared about.
            </p>
            <p className="mt-5">
              In 2017, I decided to turn that experience into my own detailing business. What started as a way to support my family became something I’ve continued building year after year.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">How I work</p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                I Treat Every Vehicle Like My Own
              </h2>
              <p className="mt-7 border-l-4 border-blue-500 pl-5 text-2xl font-black leading-snug text-zinc-950 sm:text-3xl">
                The biggest thing that matters to me is how the vehicle looks when I hand the keys back.
              </p>
            </div>
            <div className="max-w-3xl space-y-5 text-lg leading-8 text-zinc-700 lg:col-span-7">
              <p className="text-xl font-bold text-zinc-950">I treat every vehicle as if it were my own.</p>
              <p>
                That means I don’t want to rush through a job just to get another vehicle in. I pay attention to the areas that are easy to overlook because those small details are usually what separate a quick cleaning from a properly finished detail.
              </p>
              <p>If something needs more attention, I give it more attention.</p>
              <p>If something cannot safely be corrected, I’ll tell you.</p>
              <p>
                I’d rather be honest about what I can accomplish than promise something just to make a sale.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">No surprises</p>
                <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Honest Communication</h2>
              </div>
              <div className="space-y-5 text-lg leading-8 text-zinc-700">
                <p className="text-xl font-bold text-zinc-950">
                  One of the things customers regularly tell me they appreciate is my communication.
                </p>
                <p>I try to make the process simple.</p>
                <p>
                  I explain what I see, what I think the vehicle needs, what I expect the result to be, and what the price will be before I start.
                </p>
                <p>
                  Every vehicle is different. Size, pet hair, stains, odors, spills, paint condition, scratches, oxidation, and previous damage can all change how much work is involved.
                </p>
                <p>
                  If I find something unexpected while working, I talk to the customer about it instead of adding work or charges without an explanation.
                </p>
                <p className="border-t border-zinc-300 pt-5 text-xl font-black text-zinc-950">
                  There shouldn’t be surprises when it comes time to pick up your vehicle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-950 py-20 text-white sm:py-24 lg:py-28">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-400">Owner-operated</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">I Still Do the Work Myself</h2>
            <p className="mt-7 max-w-md text-2xl font-bold leading-snug text-zinc-200">
              When you contact my business, you’re talking to me.
            </p>
          </div>
          <div className="max-w-3xl space-y-5 text-lg leading-8 text-zinc-300 lg:col-span-7">
            <p>
              Bryan’s Detailing is owner-operated. I inspect the vehicle, recommend the service, perform the detail, and make sure I’m happy with the finished result before I consider the job done.
            </p>
            <p className="font-bold text-white">That personal responsibility is important to me.</p>
            <p>
              I’ve been doing this long enough to know that expensive equipment and products only get you so far. Good detailing also takes patience, experience, and knowing when to keep working on something and when doing more could cause damage.
            </p>
            <p>
              I’m always trying to give customers the best result I reasonably can without cutting corners or promising something that isn’t realistic.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">What my name stands for</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Still the Same Approach Since 2017
            </h2>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-700">
              My business has grown and the services I offer have changed over the years, but the basic way I approach the work hasn’t.
            </p>

            <div className="my-12 border-y border-zinc-300 py-8 sm:py-10">
              <p className="text-3xl font-black leading-tight tracking-tight text-zinc-950 sm:text-4xl">
                Treat the vehicle with respect.
              </p>
              <p className="mt-3 text-3xl font-black leading-tight tracking-tight text-zinc-950 sm:ml-10 sm:text-4xl">
                Be honest with the customer.
              </p>
              <p className="mt-3 text-3xl font-black leading-tight tracking-tight text-zinc-950 sm:ml-20 sm:text-4xl">
                Pay attention to the small things.
              </p>
              <p className="mt-3 text-3xl font-black leading-tight tracking-tight text-blue-600 sm:ml-28 sm:text-4xl">
                And don’t call it finished until I’m comfortable putting my name on the result.
              </p>
            </div>

            <p className="text-2xl font-black text-zinc-950">
              That’s what Bryan’s Showroom Quality Detailing means to me.
            </p>

            <div className="mt-12 border-t border-zinc-200 pt-10">
              <h2 className="text-3xl font-black tracking-tight text-zinc-950">Not sure what your vehicle needs?</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-700">
                Text me a few photos of your vehicle. I’ll take a look and give you an honest recommendation before you book.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button size="lg" className="h-14 bg-blue-700 px-7 font-black text-white hover:bg-blue-800" asChild>
                  <a
                    href={TEXT_PHOTOS_LINK}
                    onClick={() => trackEvent('click_text_quote', { location: 'about_closing' })}
                  >
                    <MessageSquare className="mr-2 h-5 w-5" aria-hidden="true" />
                    Text Me Photos
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="h-14 border-zinc-300 px-7 font-black" asChild>
                  <a href={BOOKING_LINK} onClick={(event) => trackBookingHandoff(event, { location: 'about_closing' })}>
                    View Availability
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </a>
                </Button>
              </div>
              <nav aria-label="Learn more about Bryan's detailing work" className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
                <Link to="/services" className="text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                  Compare services
                </Link>
                <Link to="/gallery" className="text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                  See finished work
                </Link>
                <Link to="/areas/bellevue-ne" className="text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                  Bellevue detailing
                </Link>
                <Link to="/areas/omaha-ne" className="text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                  Omaha detailing
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
