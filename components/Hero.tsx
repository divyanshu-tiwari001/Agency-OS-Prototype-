import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Logo } from './Logo';
import { Moon, Sun, ArrowDown } from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface HeroProps {
  toggleTheme: () => void;
  isDark: boolean;
}

const ScrambleText: React.FC<{ text: string; delay: number; className?: string }> = ({ text, delay, className }) => {
  const [displayedText, setDisplayedText] = useState("");
  const { playData } = useSound();
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const scramble = useCallback(() => {
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
        
        if (Math.random() > 0.9) playData();

        if (iteration >= text.length) { 
          clearInterval(interval);
        }
        
        iteration += 1 / 3;
      }, 30);
      return interval;
  }, [text, playData]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      scramble();
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [delay, scramble]);

  return (
    <motion.span 
      className={`inline-block cursor-default ${className}`}
      onMouseEnter={() => scramble()}
      whileHover={{ scale: 1.05 }}
    >
      {displayedText || text.replace(/./g, ' ')}
    </motion.span>
  );
}

const CinematicReveal: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  return (
    <div className="overflow-hidden h-[13vw] sm:h-[14vw] flex items-center justify-center relative">
        <motion.span
            initial={{ y: "120%", scale: 1.4, opacity: 0, filter: "blur(15px)" }}
            animate={{ y: "0%", scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ 
                type: "spring",
                damping: 18,
                stiffness: 90,
                mass: 0.8,
                delay: delay 
            }}
            className="block text-slate-900 dark:text-slate-50 relative z-10 origin-bottom"
        >
            {text}
        </motion.span>
        
        {/* Subtle Ambient Reflection behind text */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: delay + 0.5, duration: 1 }}
            className="absolute top-0 left-0 w-full h-full text-indigo-500 blur-sm select-none pointer-events-none transform scale-y-[-1] origin-bottom translate-y-[20%] z-0"
        >
            {text}
        </motion.div>
    </div>
  );
};

export const Hero: React.FC<HeroProps> = ({ toggleTheme, isDark }) => {
  const { scrollY } = useScroll();
  const { playHover, playClick, playSwitch } = useSound();
  
  // Adjusted transforms to keep logo visible longer and clearer
  const logoScale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const logoOpacity = useTransform(scrollY, [0, 500], [1, 0.8]); 

  const [isGlitching, setIsGlitching] = useState(false);
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
      const threshold = 300;
      if ((lastY.current < threshold && latest >= threshold) || (lastY.current > threshold && latest <= threshold)) {
          if (!isGlitching) {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 500);
          }
      }
      lastY.current = latest;
  });

  return (
    // Changed bg to bg-transparent to show Mandala from App.tsx
    <section className="h-screen w-full flex flex-col justify-center items-center bg-transparent relative overflow-hidden">
      
      {/* Branding - Fixed Position with Glass Background for High Visibility */}
      <motion.div 
        style={{ scale: logoScale, opacity: logoOpacity }}
        className="fixed top-6 left-6 md:top-8 md:left-8 z-[60] origin-top-left cursor-pointer pointer-events-auto"
        onMouseEnter={playHover}
        onClick={playClick}
      >
        <motion.div
          className="bg-white/10 dark:bg-slate-950/30 backdrop-blur-md border border-white/20 dark:border-white/10 p-3 rounded-2xl shadow-xl transition-colors duration-500 group hover:border-indigo-500/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
             className="text-slate-900 dark:text-white"
             animate={isGlitching ? {
                x: [0, -2, 2, -2, 2, 0],
                skewX: [0, 10, -10, 5, -5, 0],
             } : { x: 0, skewX: 0 }}
             transition={{ duration: 0.3, ease: "linear" }}
          >
            <Logo className="w-10 h-10 md:w-12 md:h-12" />
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Theme Toggle - Fixed Position with Glass Background */}
      <div className="fixed top-6 right-6 md:top-8 md:right-8 z-[60]">
        <motion.button 
          onClick={() => { toggleTheme(); playSwitch(); }}
          onMouseEnter={playHover}
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="p-3 rounded-full bg-white/10 dark:bg-slate-950/30 backdrop-blur-md border border-white/20 dark:border-white/10 text-slate-900 dark:text-white shadow-xl hover:border-indigo-500/50 hover:text-indigo-500 transition-colors"
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun size={20} className="fill-current" /> : <Moon size={20} className="fill-current" />}
        </motion.button>
      </div>

      {/* Main Typography */}
      <motion.div 
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center z-10 text-[14vw] sm:text-[15vw] leading-[0.8] font-black tracking-tighter uppercase transition-colors duration-500 select-none"
      >
        <CinematicReveal text="AGENCY" delay={0.2} />
        <CinematicReveal text="SYSTEM" delay={0.4} />
        <CinematicReveal text="DESIGN" delay={0.6} />
      </motion.div>

      {/* Animated Tagline */}
      <motion.div 
        className="mt-8 z-20 overflow-hidden min-h-[20px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
      >
        <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-bold tracking-[0.3em] text-slate-500 dark:text-slate-400 uppercase text-center">
            <ScrambleText text="STRATEGY" delay={3.0} className="hover:text-indigo-500 transition-colors" />
            <span className="text-indigo-500 animate-pulse">•</span>
            <ScrambleText text="PRODUCT" delay={3.5} className="hover:text-indigo-500 transition-colors" />
            <span className="text-indigo-500 animate-pulse">•</span>
            <ScrambleText text="GROWTH" delay={4.0} className="hover:text-indigo-500 transition-colors" />
        </div>
      </motion.div>

      {/* Scroll Indicator - Continuous Bounce Animation */}
      <motion.div 
        className="absolute bottom-10 flex flex-col items-center gap-2 z-20"
        initial={{ opacity: 0, y: 0 }}
        animate={{ 
            opacity: 1,
            y: [0, 10, 0] 
        }}
        transition={{ 
            opacity: { delay: 2.8, duration: 0.8 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <button 
          onMouseEnter={playHover}
          onClick={() => { playClick(); window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }); }}
          className="bg-slate-900/10 dark:bg-white/10 backdrop-blur-sm border border-slate-900/10 dark:border-white/10 text-slate-900 dark:text-white px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase cursor-pointer transition-all hover:bg-indigo-500 hover:text-white hover:border-indigo-500"
        >
          Scroll Down
        </button>
        <div className="text-slate-900 dark:text-white">
          <ArrowDown size={24} />
        </div>
      </motion.div>
    </section>
  );
};