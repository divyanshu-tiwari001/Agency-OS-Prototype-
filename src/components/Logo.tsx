import React from 'react';
import { motion } from 'framer-motion';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.15, type: "spring", duration: 1.5, bounce: 0 },
        opacity: { delay: i * 0.15, duration: 0.01 }
      }
    })
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.svg 
        viewBox="0 0 100 120" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="8" 
        className="w-full h-full overflow-visible"
        initial="hidden"
        animate="visible"
      >
        {/* Abstract A shape */}
        <motion.path d="M20 100 L50 20 L80 100" strokeLinecap="round" strokeLinejoin="round" variants={draw} custom={0} />
        <motion.line x1="35" y1="60" x2="65" y2="60" strokeLinecap="round" variants={draw} custom={1} />
        
        {/* Circle/O suggestion around */}
        <motion.circle cx="50" cy="60" r="45" strokeOpacity="0.3" variants={draw} custom={2} />
      </motion.svg>
      <motion.span 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-2 font-black tracking-[0.5em] text-[0.6rem] md:text-[0.7rem] uppercase whitespace-nowrap"
      >
        A • O
      </motion.span>
    </div>
  );
};