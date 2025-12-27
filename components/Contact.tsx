import React, { useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { useSound } from '../hooks/useSound';
import { Mail, Building2, User } from 'lucide-react';

const BrutalistInput: React.FC<{ 
  label: string; 
  type?: string; 
  isTextArea?: boolean;
  delay?: number;
  className?: string;
}> = ({ label, type = "text", isTextArea = false, delay = 0, className = "" }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const { playHover, playClick } = useSound();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay, duration: 0.5, ease: "easeOut" }}
      className={`relative group transition-all duration-300 ${className}`}
    >
      {/* Background & Border Container */}
      <div className={`absolute inset-0 border transition-all duration-300 ${isFocused ? 'bg-slate-50 dark:bg-slate-900/50 border-indigo-500 dark:border-indigo-400 translate-x-1 translate-y-1' : 'bg-transparent border-slate-300 dark:border-slate-800'}`} />

      {/* Label Badge */}
      <div className={`absolute top-0 left-0 px-3 py-1 text-[10px] font-bold uppercase tracking-widest z-10 pointer-events-none transition-all duration-300 ${isFocused || hasValue ? 'bg-indigo-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
        {label}
      </div>

      {isTextArea ? (
        <textarea 
          onFocus={() => { setIsFocused(true); playClick(); }}
          onBlur={(e) => { setIsFocused(false); setHasValue(e.target.value.length > 0); }}
          onChange={(e) => setHasValue(e.target.value.length > 0)}
          className={`relative w-full bg-transparent p-6 pt-8 text-xl font-bold outline-none resize-none h-40 transition-colors duration-300 z-10 ${isFocused ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-slate-300 placeholder-slate-400'}`}
        />
      ) : (
        <input 
          type={type}
          onFocus={() => { setIsFocused(true); playClick(); }}
          onBlur={(e) => { setIsFocused(false); setHasValue(e.target.value.length > 0); }}
          onChange={(e) => setHasValue(e.target.value.length > 0)}
          className={`relative w-full bg-transparent p-6 pt-8 text-xl font-bold outline-none transition-colors duration-300 z-10 ${isFocused ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-slate-300 placeholder-slate-400'}`}
        />
      )}

      {/* Premium Active Corner Accents */}
      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-all duration-300 ${isFocused ? 'border-indigo-500 opacity-100 scale-100' : 'border-slate-300 dark:border-slate-700 opacity-0 scale-75'}`} />
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 transition-all duration-300 ${isFocused ? 'border-indigo-500 opacity-100 scale-100' : 'border-slate-300 dark:border-slate-700 opacity-0 scale-75'}`} />
      
      {/* Loading/Scanline Effect on Focus */}
      {isFocused && (
         <motion.div 
            layoutId="input-scanline"
            className="absolute bottom-0 left-0 h-[2px] bg-indigo-500 w-full z-20"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
         />
      )}
    </motion.div>
  );
};

export const Contact: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'individual' | 'org'>('individual');
  const { playClick, playHover, playSuccess } = useSound();
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonRect = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smoother spring for "heavy" magnetic feel
  const mouseX = useSpring(x, { stiffness: 120, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 120, damping: 20 });

  const handleMouseEnter = () => {
    if (buttonRef.current) {
        buttonRect.current = buttonRef.current.getBoundingClientRect();
    }
    playHover();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRect.current) return;
    const width = buttonRect.current.width;
    const height = buttonRect.current.height;
    const xPct = e.clientX - buttonRect.current.left - width / 2;
    const yPct = e.clientY - buttonRect.current.top - height / 2;
    x.set(xPct * 0.35); // Slightly stronger magnetic pull
    y.set(yPct * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    buttonRect.current = null;
  };

  const handleSegmentChange = (val: 'individual' | 'org') => {
    setActiveSegment(val);
    playClick();
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      playClick();
      setTimeout(() => playSuccess(), 100); 
  };

  return (
    // Transparent BG for global mandala
    <section className="bg-transparent py-24 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl relative z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <h2 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">START<br/>PROJECT</h2>
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
             <div className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
               <Mail size={16} />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold tracking-widest">Prototype Inquiry</span>
               <span className="text-sm font-bold text-slate-900 dark:text-white select-all">hello@agency.example.com</span>
             </div>
          </div>
        </div>
        
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Segmented Control */}
          <div className="relative inline-flex bg-slate-100 dark:bg-slate-900 rounded-sm p-1 border border-slate-200 dark:border-slate-800 mb-8">
            <div 
              className={`relative z-10 px-8 py-3 cursor-pointer text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors duration-300 ${activeSegment === 'individual' ? 'text-slate-900 dark:text-slate-950' : 'text-slate-500 dark:text-slate-400'}`}
              onClick={() => handleSegmentChange('individual')}
              onMouseEnter={playHover}
            >
              <User size={14} className={activeSegment === 'individual' ? 'stroke-[3px]' : ''} />
              Individual
            </div>
            <div 
              className={`relative z-10 px-8 py-3 cursor-pointer text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors duration-300 ${activeSegment === 'org' ? 'text-slate-900 dark:text-slate-950' : 'text-slate-500 dark:text-slate-400'}`}
              onClick={() => handleSegmentChange('org')}
              onMouseEnter={playHover}
            >
              <Building2 size={14} className={activeSegment === 'org' ? 'stroke-[3px]' : ''} />
              Organization
            </div>
            <motion.div 
              className="absolute top-1 bottom-1 bg-white dark:bg-white rounded-sm shadow-md z-0"
              layoutId="segmentBg"
              initial={false}
              animate={{ 
                left: activeSegment === 'individual' ? '4px' : '50%',
                width: activeSegment === 'individual' ? 'calc(50% - 6px)' : 'calc(50% - 6px)',
                x: activeSegment === 'org' ? 2 : 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <BrutalistInput label="Name" delay={0.1} />
             <BrutalistInput label="Email" type="email" delay={0.2} />
          </div>

          {/* Organization Fields Animation */}
          <AnimatePresence mode='popLayout'>
            {activeSegment === 'org' && (
              <motion.div 
                initial={{ opacity: 0, height: 0, filter: "blur(10px)", scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, height: 0, filter: "blur(10px)", scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-2">
                   <div className="md:col-span-12">
                     <BrutalistInput label="Organization Name" delay={0} />
                   </div>
                   <div className="md:col-span-6">
                     <BrutalistInput label="Your Position" delay={0.1} />
                   </div>
                   <div className="md:col-span-6">
                     <BrutalistInput label="Org Type (e.g. Startup)" delay={0.2} />
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <BrutalistInput label="Project Details" isTextArea={true} delay={0.3} />

          {/* Magnetic Submit Button */}
          <motion.button 
            ref={buttonRef}
            style={{ x: mouseX, y: mouseY }}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="group relative w-full md:w-auto px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-black text-xl uppercase tracking-widest overflow-hidden rounded-sm mt-8 shadow-xl will-change-transform"
          >
            <span className="relative z-10 group-hover:text-white dark:group-hover:text-white transition-colors duration-300">Submit Request</span>
            <motion.div 
              className="absolute inset-0 bg-indigo-500 dark:bg-slate-900"
              initial={{ y: "100%" }}
              whileHover={{ y: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </motion.button>
        </form>
      </div>
    </section>
  );
};