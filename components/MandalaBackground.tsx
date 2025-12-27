import React from 'react';
import { motion } from 'framer-motion';

export const MandalaBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
      <div className="relative w-[120vw] h-[120vw] md:w-[150vh] md:h-[150vh] opacity-[0.08] dark:opacity-[0.12] transition-opacity duration-1000">
        
        {/* Layer 1: Outer Dashed Ring - Slow Rotation */}
        <motion.div 
          className="absolute inset-0 border border-slate-900 dark:border-white rounded-full will-change-transform"
          style={{ borderStyle: 'dashed', borderWidth: '1px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        />

        {/* Layer 2: Middle Dotted Ring - Counter Rotation */}
        <motion.div 
          className="absolute inset-[20%] border border-indigo-500/50 dark:border-indigo-400/50 rounded-full will-change-transform"
          style={{ borderStyle: 'dotted', borderWidth: '2px' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        />

        {/* Layer 3: Inner Geometric Pattern - Squares */}
        <motion.div 
            className="absolute inset-[35%] flex items-center justify-center will-change-transform"
            animate={{ rotate: 180 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
            <div className="w-full h-full border border-slate-600 dark:border-slate-400 rounded-full absolute opacity-40" />
            <div className="w-[85%] h-[85%] border border-slate-600 dark:border-slate-400 rotate-45 absolute opacity-40" />
            <div className="w-[85%] h-[85%] border border-slate-600 dark:border-slate-400 rotate-0 absolute opacity-40" />
        </motion.div>

        {/* Layer 4: Core Pulse */}
        <div className="absolute inset-[48%] flex items-center justify-center">
            <motion.div 
                className="w-full h-full border-2 border-indigo-500 rounded-full will-change-transform"
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>

      </div>
    </div>
  );
};