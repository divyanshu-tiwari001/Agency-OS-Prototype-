import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useSound } from '../hooks/useSound';

const MARQUEE_TEXT = "STRATEGY • DESIGN • SYSTEM • GROWTH • EXECUTION • ";
const MARQUEE_TEXT_REVERSE = "PROTOTYPE • BUILD • SHIP • SCALE • ITERATE • ";

const ServiceCard: React.FC<{ title: string; subtitle: string; desc: string; index: number }> = ({ title, subtitle, desc, index }) => {
  const { playHover, playClick } = useSound();
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  // 3D Tilt Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseEnter = () => {
    if (ref.current) {
        // Cache the bounding rectangle on enter to avoid reflows during move
        rectRef.current = ref.current.getBoundingClientRect();
    }
    playHover();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current) return;
    
    const width = rectRef.current.width;
    const height = rectRef.current.height;
    
    // Calculate relative to the cached rect
    const mouseXPct = (e.clientX - rectRef.current.left) / width - 0.5;
    const mouseYPct = (e.clientY - rectRef.current.top) / height - 0.5;
    
    x.set(mouseXPct);
    y.set(mouseYPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rectRef.current = null; // Clear cache
  };
  
  return (
    <motion.div 
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={playClick}
      className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 p-8 h-[340px] flex flex-col justify-between transition-colors duration-200 relative overflow-hidden group cursor-pointer perspective-1000 z-0 hover:z-10 hover:shadow-2xl gpu-accelerated will-change-transform"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover="hover"
      whileTap="tap"
      variants={{
        hover: { 
          scale: 1.02,
          x: [0, -2, 2, -2, 2, 0],
          transition: { 
            scale: { duration: 0.2 },
            x: { duration: 0.2 } 
          }
        },
        tap: { 
          scale: 0.98,
          rotate: [0, -1, 1, 0],
          transition: { duration: 0.1 }
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
    >
      {/* Hard Shadow for Neo-Brutalist Feel - Dynamic on Hover */}
      <div className="absolute inset-0 bg-transparent transition-all duration-300 group-hover:translate-x-3 group-hover:translate-y-3 pointer-events-none z-[-1] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] group-hover:shadow-[12px_12px_0px_0px_rgba(99,102,241,0.2)] dark:group-hover:shadow-[12px_12px_0px_0px_rgba(99,102,241,0.2)]" />

      {/* Gentle Gradient Shift on Hover */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
            background: "linear-gradient(120deg, rgba(99,102,241,0) 0%, rgba(99,102,241,0.1) 50%, rgba(168,85,247,0.1) 100%)",
            backgroundSize: "200% 200%"
        }}
        animate={{
            backgroundPosition: ["0% 0%", "100% 100%"]
        }}
        transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "linear"
        }}
      />

      {/* Subtle Moving Grid Background */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          color: 'inherit'
        }}
        animate={{
          backgroundPosition: ["0px 0px", "24px 24px"]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Interactive Scanline Glitch Effect */}
      <motion.div 
        className="absolute inset-0 bg-indigo-400/10 z-20 pointer-events-none"
        initial={{ y: "-100%" }}
        variants={{
            hover: { y: ["-100%", "100%"] },
            tap: { opacity: 0.5 }
        }}
        transition={{ duration: 0.5, ease: "linear" }}
      />

      <div className="relative z-10 transform translate-z-20">
        <h3 className="text-4xl font-black tracking-tighter uppercase mb-2 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">{title}</h3>
        <span className="text-xs font-bold bg-slate-100 dark:bg-indigo-500/20 text-slate-600 dark:text-indigo-300 px-2 py-1 uppercase tracking-widest group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">{subtitle}</span>
      </div>
      
      <p className="text-lg font-medium text-slate-500 dark:text-slate-400 leading-tight relative z-10 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300 transform translate-z-10">{desc}</p>
      
      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-200 dark:border-slate-700 font-bold text-xl self-end text-slate-900 dark:text-indigo-400 relative z-10 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500 transition-all duration-300 transform translate-z-30 shadow-sm">
        <motion.span variants={{ hover: { x: 5 }, tap: { x: 0 } }}>→</motion.span>
      </div>
    </motion.div>
  );
};

export const Services: React.FC = () => {
  return (
    // Transparent background
    <section className="bg-transparent py-32 overflow-hidden flex flex-col gap-24 relative">
      
      {/* Ambient Background Animation */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none z-0 will-change-transform"
        animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
        }}
      />

      {/* Double Marquee */}
      <div className="relative z-10 py-10">
        <div className="w-full bg-slate-950 dark:bg-white py-6 rotate-[-2deg] scale-105 border-y-4 border-indigo-400 dark:border-indigo-600 shadow-xl absolute top-0 left-0 z-20 hover:rotate-[-1deg] transition-transform duration-700 gpu-accelerated">
            <div className="flex whitespace-nowrap overflow-hidden">
            <motion.div 
                className="flex text-slate-100 dark:text-black text-6xl font-black tracking-tighter"
                animate={{ x: "-50%" }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <span className="mr-8">{MARQUEE_TEXT}</span>
                <span className="mr-8">{MARQUEE_TEXT}</span>
                <span className="mr-8">{MARQUEE_TEXT}</span>
                <span className="mr-8">{MARQUEE_TEXT}</span>
            </motion.div>
            </div>
        </div>

        <div className="w-full bg-indigo-500 dark:bg-slate-800 py-6 rotate-[1deg] scale-105 border-y-4 border-black dark:border-white shadow-xl absolute top-12 left-0 z-10 opacity-90 hover:rotate-[2deg] transition-transform duration-700 gpu-accelerated">
            <div className="flex whitespace-nowrap overflow-hidden">
            <motion.div 
                className="flex text-black dark:text-white text-6xl font-black tracking-tighter"
                animate={{ x: ["-50%", "0%"] }} // Reverse direction
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
                <span className="mr-8">{MARQUEE_TEXT_REVERSE}</span>
                <span className="mr-8">{MARQUEE_TEXT_REVERSE}</span>
                <span className="mr-8">{MARQUEE_TEXT_REVERSE}</span>
                <span className="mr-8">{MARQUEE_TEXT_REVERSE}</span>
            </motion.div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 z-20 mt-20">
        <ServiceCard 
          index={0}
          title="Strategy" 
          subtitle="Core"
          desc="Market analysis, positioning, and brand architecture." 
        />
        <ServiceCard 
          index={1}
          title="Product" 
          subtitle="Build"
          desc="Rapid prototyping, UI/UX design, and development frameworks." 
        />
        <ServiceCard 
          index={2}
          title="Growth" 
          subtitle="Scale"
          desc="Go-to-market execution, user acquisition, and retention systems." 
        />
      </div>
    </section>
  );
};