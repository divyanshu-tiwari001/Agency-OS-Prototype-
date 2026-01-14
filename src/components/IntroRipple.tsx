import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../hooks/useSound';

interface IntroRippleProps {
  onComplete: () => void;
}

const LOADER_WORDS = ["INITIALIZING", "LOADING ASSETS", "CONNECTING", "DECRYPTING", "RENDERING", "SYSTEM READY"];

export const IntroRipple: React.FC<IntroRippleProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentWord, setCurrentWord] = useState(LOADER_WORDS[0]);
  const { playData, playSuccess, playStartup } = useSound();

  useEffect(() => {
    // Play startup sound
    playStartup();

    const duration = 2200; // Total load time
    const intervalTime = 20;
    const totalSteps = duration / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const newProgress = Math.min(100, Math.floor((step / totalSteps) * 100));
      setProgress(newProgress);

      // Randomly change words based on progress
      const wordIndex = Math.floor((newProgress / 100) * (LOADER_WORDS.length - 1));
      setCurrentWord(LOADER_WORDS[wordIndex]);

      if (Math.random() > 0.8) playData();

      if (step >= totalSteps) {
        clearInterval(timer);
        playSuccess();
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 800); // Trigger parent callback slightly before animation ends
        }, 500);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-mono"
          exit={{ 
            y: "-100%", 
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-[0.1]" 
               style={{ backgroundImage: `linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
          />

          <div className="relative z-10 flex flex-col items-center w-full max-w-md px-8">
            {/* Big Counter */}
            <div className="text-9xl font-black text-white tracking-tighter mb-8 flex items-baseline">
                <span>{progress}</span>
                <span className="text-2xl text-indigo-500 ml-2">%</span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-1 bg-slate-800 relative overflow-hidden mb-4">
                <motion.div 
                    className="absolute top-0 left-0 h-full bg-indigo-500"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                />
            </div>

            {/* Status Text */}
            <div className="flex justify-between w-full text-[10px] uppercase tracking-[0.2em] text-slate-500">
                <span className="w-24">{currentWord}</span>
                <span className="animate-pulse">AGENCY_OS KERNEL v1.0</span>
            </div>
          </div>
          
          {/* Footer Decoration */}
          <div className="absolute bottom-8 left-0 w-full flex justify-center text-[10px] text-slate-700 uppercase tracking-widest">
            <span>Secure Connection Established</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};