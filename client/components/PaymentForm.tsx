import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getSquareAppId, getSquareLocationId, getConfig } from '../lib/config';

interface PaymentFormProps {
  onSuccess: (token: string) => void;
  applicationId?: string;
  locationId?: string;
  amount: number;
}

export default function PaymentForm({ onSuccess, applicationId: propAppId, locationId: propLocId, amount }: PaymentFormProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      const appId = propAppId || getSquareAppId();
      const locId = propLocId || getSquareLocationId();
      
      if (!appId || !locId) {
        setError("Square Application ID or Location ID is missing. Please configure them in the Setup Wizard.");
        return;
      }

      const env = getConfig('SQUARE_ENVIRONMENT', 'sandbox');
      const scriptUrl = env === 'production' 
        ? 'https://web.squareup.com/v2/payments' 
        : 'https://sandbox.web.squareupsandbox.com/v2/payments';

      if (!window.Square) {
        const script = document.createElement('script');
        script.src = scriptUrl;
        const scriptPromise = new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () => reject(new Error("Failed to load Square SDK"));
        });
        document.head.appendChild(script);
        try {
          await scriptPromise;
        } catch (e) {
          setError("Failed to load Square SDK");
          return;
        }
      }

      try {
        const payments = (window as any).Square.payments(appId, locId);
        const card = await payments.card();
        await card.attach('#card-container');
        (window as any).card = card;
        setIsReady(true);
      } catch (e) {
        console.error("Square Init Error:", e);
        setError("Failed to initialize payment form. Check your Application ID.");
      }
    };

    initialize();

    return () => {
      if ((window as any).card) {
        (window as any).card.destroy();
        (window as any).card = null;
      }
    };
  }, [propAppId, propLocId]);

  const handlePayment = async () => {
    if (!(window as any).card) return;
    
    try {
      const result = await (window as any).card.tokenize();
      if (result.status === 'OK') {
        onSuccess(result.token);
      } else {
        setError(result.errors[0].message);
      }
    } catch (e) {
      console.error("Tokenization Error:", e);
      setError("Payment failed. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] text-white overflow-hidden relative">
        <div className="relative z-10">
          <h4 className="text-lg font-black mb-1">Secure Your Appointment</h4>
          <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
            A ${amount} security deposit is required to hold your service appointment. This is fully credited toward your service total.
          </p>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-full w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Appointment is NOT held until paid</span>
          </div>
        </div>
      </div>

      <div id="card-container" className="min-h-[100px] p-4 bg-white border border-zinc-200 rounded-xl"></div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg font-medium">
          {error}
        </div>
      )}

      {!isReady && !error && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      )}

      {isReady && (
        <button 
          id="card-button"
          type="button"
          onClick={handlePayment}
          className="w-full h-12 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors"
        >
          Pay ${amount.toFixed(2)} Deposit
        </button>
      )}
    </div>
  );
}
