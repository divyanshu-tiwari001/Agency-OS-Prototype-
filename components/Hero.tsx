import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { Moon, Sun } from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface HeroProps {
  toggleTheme: () => void;
  isDark: boolean;
  startAnimation: boolean;
}

// ----------------------------------------------------------------------
// PREMIUM REVEAL COMPONENT (Main Title)
// Smooth, masked character slide-up with luxurious easing.
// ----------------------------------------------------------------------
const RevealText: React.FC<{ 
    text: string; 
    delay?: number; 
    className?: string; 
    stagger?: number;
    start?: boolean;
}> = ({ text, delay = 0, className, stagger = 0.025, start = false }) => {
  return (
    <span className={`inline-flex overflow-hidden relative ${className}`}>
        <span className="sr-only">{text}</span>
        {text.split("").map((char, i) => (
            <motion.span
                key={i}
                initial={{ y: "110%" }}
                animate={start ? { y: "0%" } : { y: "110%" }}
                transition={{
                    duration: 1.1,
                    ease: [0.25, 1, 0.5, 1], // The "Luxurious" sigmoid ease
                    delay: delay + (i * stagger)
                }}
                className="inline-block whitespace-pre will-change-transform origin-bottom"
            >
                {char}
            </motion.span>
        ))}
    </span>
  );
};

// ----------------------------------------------------------------------
// SCRAMBLE TEXT COMPONENT (Sub-Tagline)
// Cyber-style decryption effect for technical feel.
// ----------------------------------------------------------------------
const ScrambleText: React.FC<{ text: string; delay?: number; className?: string; start?: boolean }> = ({ text, delay = 0, className, start = false }) => {
  const [displayedText, setDisplayedText] = useState("");
  const { playData } = useSound();
  const [hasStarted, setHasStarted] = useState(false);
  
  const scramble = useCallback(() => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@$";
      let iteration = 0;
      const interval = setInterval(() => {
        setDisplayedText(prev => 
          text.split("").map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("")
        );

        if (iteration >= text.length) {
            clearInterval(interval);
        }
        
        iteration += 1 / 3; // Speed of decryption
      }, 30);
      return interval;
  }, [text]);

  useEffect(() => {
    if (!start) return;

    const timeout = setTimeout(() => {
        setHasStarted(true);
        scramble();
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [delay, scramble, start]);

  return (
    <motion.span 
      className={`inline-block cursor-pointer font-mono ${className}`}
      onMouseEnter={() => { playData(); scramble(); }}
      whileHover={{ scale: 1.05, color: "#6366f1" }} // Indigio highlight on hover
    >
      {hasStarted ? displayedText : <span className="opacity-0">{text}</span>}
    </motion.span>
  );
}

export const Hero: React.FC<HeroProps> = ({ toggleTheme, isDark, startAnimation }) => {
  const { scrollY } = useScroll();
  const { playHover, playClick, playSwitch } = useSound();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // --- LOGO SCROLL PHYSICS ---
  // Rotates 180deg over 500px scroll. 
  const logoRotate = useTransform(scrollY, [0, 500], [0, 180]);
  const logoScale = useTransform(scrollY, [0, 500], [1, 0.7]);
  const logoOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="h-screen w-full flex flex-col justify-center items-center bg-transparent relative overflow-hidden perspective-1000">
      
      {/* 
        FIXED UI PORTAL 
        Renders outside the main DOM tree to stay fixed regardless of parent transforms.
      */}
      {mounted && createPortal(
        <>
            {/* --- BRANDING --- */}
            <motion.div 
              style={{ rotate: logoRotate, scale: logoScale }}
              className="fixed top-8 left-6 md:top-10 md:left-10 z-[60] mix-blend-difference cursor-pointer origin-center"
              onMouseEnter={playHover}
              onClick={() => { playClick(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              initial={{ opacity: 0, y: -40 }}
              animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: -40 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 1 }}
            >
                {/* Continuous Subtle Breath Animation independent of scroll */}
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="text-white relative" 
                    style={{ opacity: logoOpacity }}
                >
                    <Logo className="w-12 h-12 md:w-16 md:h-16" />
                </motion.div>
            </motion.div>

            {/* --- THEME TOGGLE (Eclipse Animation) --- */}
            <motion.div 
              className="fixed top-8 right-6 md:top-10 md:right-10 z-[60] mix-blend-difference cursor-pointer"
              initial={{ opacity: 0, y: -40 }}
              animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: -40 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 1.2 }}
            >
              <button 
                onClick={() => { toggleTheme(); playSwitch(); }}
                onMouseEnter={playHover}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                aria-label="Toggle Theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ y: 20, opacity: 0, rotate: -90 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      exit={{ y: -20, opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.4, ease: "backOut" }}
                      className="text-white"
                    >
                      <Sun size={24} className="fill-current" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ y: 20, opacity: 0, rotate: -90 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      exit={{ y: -20, opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.4, ease: "backOut" }}
                      className="text-white"
                    >
                      <Moon size={24} className="fill-current" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
        </>,
        document.body
      )}

      {/* --- MAIN TYPOGRAPHY --- */}
      <div className="flex flex-col items-center justify-center z-10 relative select-none">
        {/* We stack them tightly with negative margins for that "magazine" look */}
        <div className="text-[13vw] sm:text-[14vw] leading-[0.8] font-black tracking-tighter uppercase flex flex-col items-center text-slate-900 dark:text-slate-50 mix-blend-overlay dark:mix-blend-normal">
             {/* Staggered Entrance - Premium Reveal */}
             <RevealText text="AGENCY" delay={0.2} stagger={0.03} start={startAnimation} />
             <RevealText text="SYSTEM" delay={0.4} stagger={0.03} start={startAnimation} />
             <RevealText text="DESIGN" delay={0.6} stagger={0.03} start={startAnimation} />
        </div>
      </div>

      {/* --- ANIMATED SUB-TAGLINE --- */}
      <motion.div 
        className="mt-12 z-20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="flex items-center gap-4 md:gap-8 text-xs md:text-sm font-bold tracking-[0.3em] text-slate-500 dark:text-slate-400 uppercase text-center">
            {/* Scramble / Decryption Effects for Sub-Tagline */}
            <div className="hover:text-indigo-500 transition-colors cursor-pointer">
                <ScrambleText text="STRATEGY" delay={1.8} start={startAnimation} />
            </div>

            <motion.span 
                initial={{ scale: 0 }} 
                animate={startAnimation ? { scale: 1 } : { scale: 0 }} 
                transition={{ delay: 2.0 }}
                className="text-indigo-500 text-[10px] animate-pulse"
            >
                ●
            </motion.span>

            <div className="hover:text-indigo-500 transition-colors cursor-pointer">
                <ScrambleText text="PRODUCT" delay={2.1} start={startAnimation} />
            </div>

            <motion.span 
                initial={{ scale: 0 }} 
                animate={startAnimation ? { scale: 1 } : { scale: 0 }} 
                transition={{ delay: 2.3 }}
                className="text-indigo-500 text-[10px] animate-pulse"
            >
                ●
            </motion.span>

            <div className="hover:text-indigo-500 transition-colors cursor-pointer">
                <ScrambleText text="GROWTH" delay={2.4} start={startAnimation} />
            </div>
        </div>
      </motion.div>

      {/* --- SCROLL INDICATOR --- */}
      <motion.div 
        className="absolute bottom-10 flex flex-col items-center gap-4 z-20 cursor-pointer group"
        initial={{ opacity: 0 }}
        animate={startAnimation ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 2.8, duration: 1 }}
        onClick={() => { playClick(); window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }); }}
      >
        <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-slate-400 to-transparent relative overflow-hidden">
             <motion.div 
                className="absolute top-0 left-0 w-full h-1/2 bg-indigo-500"
                animate={{ top: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
             />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 group-hover:text-indigo-400 transition-colors">
            Scroll to Explore
        </span>
      </motion.div>
    </section>
  );
};