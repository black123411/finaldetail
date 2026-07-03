export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export const FAQS: FAQ[] = [
  {
    id: '1',
    question: 'How long does a full detail take?',
    answer: 'A full interior and exterior detail typically takes between 4 to 6 hours depending on the condition and size of the vehicle. We take our time to ensure every crack and crevice is pristine.',
    order: 1
  },
  {
    id: '2',
    question: 'Do you need access to water and power?',
    answer: 'No! We are a fully self-contained mobile detailing unit. We bring our own spot-free water supply and super-quiet generators, so we can detail your car at your home, apartment, or office without needing anything from you.',
    order: 2
  },
  {
    id: '3',
    question: 'What is a ceramic coating?',
    answer: 'A ceramic coating is a liquid polymer that chemically bonds to your vehicles factory paint. It creates a semi-permanent layer of protection that is much harder and longer-lasting than traditional wax, offering incredible gloss and protection against UV rays, chemicals, and minor scratches.',
    order: 3
  },
  {
    id: '4',
    question: 'Do I need to be present while you detail my car?',
    answer: 'Not at all. As long as we have the keys to access the interior (if you booked an interior service) and the vehicle is parked in an accessible location, you can go about your day. We will text you when the job is complete.',
    order: 4
  }
];
