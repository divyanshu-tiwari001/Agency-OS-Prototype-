import React, { useState, useEffect, useRef } from 'react';
import { Hero } from './components/Hero';
import { Founder } from './components/Founder';
import { Services } from './components/Services';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { GeminiLab } from './components/GeminiLab';
import { Footer } from './components/Footer';
import { IntroRipple } from './components/IntroRipple';
import { MandalaBackground } from './components/MandalaBackground';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useSound } from './hooks/useSound';
import Lenis from 'lenis';

// Premium Ambient Particles - Optimized Count
const Particles = () => {
  const [items, setItems] = useState<{id: number, x: number, y: number, size: number, duration: number, delay: number}[]>([]);

  useEffect(() => {
    // Reduced count for better performance (25 -> 12)
    setItems(Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 30 + 40,
      delay: Math.random() * 10
    })));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute rounded-full bg-indigo-500 dark:bg-indigo-300 opacity-10 dark:opacity-15 blur-[1px] will-change-transform pointer-events-none"
          style={{ 
            left: `${item.x}%`, 
            top: `${item.y}%`,
            width: item.size,
            height: item.size
          }}
          animate={{
            y: [0, -150],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "linear",
            delay: item.delay
          }}
        />
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const { playScroll } = useSound();
  const lastScrollY = useRef(0);

  // Scroll Transforms for Banner
  const { scrollY } = useScroll();
  const bannerScale = useTransform(scrollY, [0, 200], [1, 0.8]);
  const bannerOpacity = useTransform(scrollY, [0, 200], [1, 0.6]);
  const bannerY = useTransform(scrollY, [0, 200], [0, 10]);

  // Initialize Lenis Smooth Scroll - Enhanced Physics Configuration
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // Slightly longer duration for "heavier" premium feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1, 
      smoothTouch: false, // Default native scroll on touch is often smoother/faster
      touchMultiplier: 2,
    });

    // Sync with browser refresh rate (High Hz support)
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Scroll Sound Logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (Math.abs(currentScroll - lastScrollY.current) > 50) { // Increased threshold for less sound spam
        playScroll();
        lastScrollY.current = currentScroll;
      }
    };
    // Passive listener improves scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [playScroll]);

  // Theme Toggle Logic
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="overflow-hidden bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-1000 ease-in-out selection:bg-indigo-500 selection:text-white">
      <IntroRipple onComplete={() => setIsIntroComplete(true)} />
      
      {/* Prototype Banner - Shrinks on scroll, now with subtle glow animation */}
      <AnimatePresence>
        {isIntroComplete && (
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ 
              x: 0, 
              opacity: 1,
              boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 10px rgba(99,102,241,0.3)", "0 0 0px rgba(99,102,241,0)"]
            }}
            style={{ 
              scale: bannerScale, 
              opacity: bannerOpacity, 
              y: bannerY,
              transformOrigin: "bottom left" 
            }}
            transition={{ 
              delay: 1, 
              duration: 0.8,
              boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="fixed bottom-6 left-6 md:bottom-8 md:left-8 bg-slate-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-black z-[90] px-4 py-1.5 rounded-sm text-center font-mono text-[9px] font-bold uppercase tracking-[0.2em] shadow-2xl border border-indigo-400/20 flex items-center gap-2 pointer-events-none will-change-transform"
          >
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            <span>PROTOTYPE v1.0</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complex Ambient Light System - Performance Optimized */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden transform-gpu">
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-1000" />
        
        {/* Subtle Mandala Background Animation - Now visible through transparent sections */}
        <MandalaBackground />

        {/* Primary Glow (Indigo) - Scaled Up method for better performance */}
        {/* We use a smaller element and scale it up to reduce blur computation cost per pixel */}
        <motion.div 
          className="absolute top-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-20 dark:opacity-10 blur-[40px] will-change-transform"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,1) 0%, rgba(0,0,0,0) 70%)' }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [2, 2.2, 2] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Secondary Glow (Cyan/Teal hint) - Scaled Up method */}
        <motion.div 
          className="absolute bottom-[-10%] right-[-10%] w-[25vw] h-[25vw] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-10 dark:opacity-5 blur-[40px] will-change-transform"
          style={{ background: 'radial-gradient(circle, rgba(45,212,191,1) 0%, rgba(0,0,0,0) 70%)' }}
          animate={{ x: [0, -30, 0], y: [0, -50, 0], scale: [2, 2.3, 2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <motion.main 
        className="w-full relative z-10"
        initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
        animate={isIntroComplete ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Particles />
        
        {/* Cinematic Grain Overlay - Static to avoid repaint, using translate3d for GPU layering */}
        {/* Lowered z-index to 40 to ensure it's below Footer content (z-50) but above standard content */}
        <div className="fixed inset-0 z-[40] pointer-events-none opacity-[0.035] mix-blend-overlay gpu-accelerated" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        <Hero toggleTheme={toggleTheme} isDark={isDark} />
        <Founder />
        <Services />
        <About />
        <Contact />
        <Footer />
        
      </motion.main>
      
      {/* GeminiLab moved outside motion.main to ensure fixed positioning works correctly */}
      <GeminiLab />
    </div>
  );
};

export default App;