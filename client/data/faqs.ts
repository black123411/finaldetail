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
    answer: 'A full interior and exterior detail typically takes 4 to 6 hours, depending on vehicle size and condition. I will confirm what is included and how long it should take before the appointment.',
    order: 1
  },
  {
    id: '2',
    question: 'Do you need access to water and power?',
    answer: 'For most mobile appointments, I bring the equipment and water needed for the service. The vehicle must be parked in a safe, accessible location. Bellevue drop-off and pickup are available when controlled conditions are needed.',
    order: 2
  },
  {
    id: '3',
    question: 'What is a ceramic coating?',
    answer: 'A ceramic coating is a liquid protection product applied to prepared paint. It adds gloss, water behavior, and resistance to routine contamination and UV exposure. It does not make paint scratch-proof, and the result depends on preparation and maintenance.',
    order: 3
  },
  {
    id: '4',
    question: 'Do I need to be present while you detail my car?',
    answer: 'You do not need to stay for the appointment. Please provide access to the vehicle when needed and leave it in an accessible location. I will text you when the service is complete.',
    order: 4
  }
];
