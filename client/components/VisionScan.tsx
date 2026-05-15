import { useState, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Image as ImageIcon, Loader2, X, AlertCircle } from "lucide-react";
import { analyzeVehicleImage } from "../services/geminiService";
import { RecommendationResult } from '@/shared/types';

export default function VisionScan({ 
  onResult, 
  onCancel 
}: { 
  onResult: (res: RecommendationResult) => void, 
  onCancel: () => void 
}) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeVehicleImage(image);
      onResult(result);
    } catch (err) {
      setError("I had trouble analyzing the image. Please try a clearer shot of the vehicle surface.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 italic tracking-tight">AI-ASSISTED ESTIMATE</h2>
        <p className="text-white/40 text-sm max-w-sm mx-auto">
          Upload a high-quality photo of your paint or interior. I'll use Gemini Vision to identify the actual condition and visible issues.
        </p>
      </div>

      <div className="glass rounded-2xl aspect-video relative overflow-hidden flex flex-col items-center justify-center border-dashed border-white/20">
        <AnimatePresence mode="wait">
          {!image ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center border border-brand-gold/20 hover:scale-110 transition-transform"
                >
                  <ImageIcon size={24} />
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-full bg-brand-gold text-brand-charcoal flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Camera size={24} />
                </button>
              </div>
              <p className="text-xs font-semibold tracking-widest text-white/30 uppercase">Select Image or Open Camera</p>
            </motion.div>
          ) : (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 group"
            >
              <img src={image} className="w-full h-full object-cover" alt="Preview" />
              
              {/* Premium Scanning Animation */}
              {loading && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <div className="absolute inset-0 bg-brand-gold/10" />
                  <motion.div 
                    initial={{ top: "0%" }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                    className="absolute left-0 right-0 h-1 bg-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/80 text-brand-gold px-6 py-3 rounded-full font-bold tracking-widest text-sm border border-brand-gold/30 backdrop-blur-md flex items-center gap-3">
                      <Loader2 className="animate-spin" size={16} />
                      ANALYZING SURFACE...
                    </div>
                  </div>
                </div>
              )}

              {!loading && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => setImage(null)}
                    className="bg-red-500 text-white p-2 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <input 
          type="file" 
          hidden 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleFile}
        />
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-start gap-3">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="mt-12 flex gap-4">
        <button onClick={onCancel} className="btn-secondary flex-1">
          CANCEL
        </button>
        <button 
          onClick={handleScan}
          disabled={!image || loading}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              ANALYZING...
            </>
          ) : (
            "GET AI ESTIMATE"
          )}
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-white/20 uppercase tracking-widest leading-loose">
          Privacy Policy: Images are analyzed only for condition identification<br />and are not stored after analysis.
        </p>
      </div>
    </div>
  );
}
