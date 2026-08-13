import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MessageSquare, Phone, X } from 'lucide-react';
import { Button } from './ui/button';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:block">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="mb-4 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl"
          >
            <h2 className="mb-2 text-lg font-black text-zinc-900">Ask Bryan directly</h2>
            <p className="mb-5 text-sm leading-relaxed text-zinc-600">
              Send a few vehicle photos and a short description for a service recommendation, or call with a quick question.
            </p>
            <div className="grid gap-3">
              <Button asChild>
                <a href="sms:+17123056313?body=Hi%20Bryan%2C%20I%20need%20help%20choosing%20a%20detailing%20service.%20Here%20are%20my%20vehicle%20details%20and%20photos%3A%20">
                  <MessageSquare className="mr-2 h-4 w-4" /> Text Bryan
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="tel:+17123056313"><Phone className="mr-2 h-4 w-4" /> Call (712) 305-6313</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={isOpen ? 'Close contact options' : 'Open contact options'}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white shadow-2xl transition-colors hover:bg-zinc-800"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
