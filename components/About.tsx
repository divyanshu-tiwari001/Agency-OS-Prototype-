import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion';
import { useSound } from '../hooks/useSound';

const Paragraph: React.FC<{ text: string }> = ({ text }) => {
  const { playHum } = useSound();
  
  return (
    <motion.p 
      className="text-2xl md:text-4xl font-semibold mb-32 tracking-tight relative z-10"
      initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", color: "#f8fafc" }}
      viewport={{ amount: 0.6, margin: "-10% 0px -10% 0px" }}
      onViewportEnter={() => playHum()}
      transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
      style={{ color: "#64748b" }}
    >
      {text}
    </motion.p>
  );
};

export const About: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  
  // Track scroll progress relative to this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const skewX = useTransform(smoothVelocity, [-2000, 2000], [-15, 15]);

  const y1Raw = useTransform(scrollYProgress, [0, 1], [-150, 150]); 
  const y2Raw = useTransform(scrollYProgress, [0, 1], [150, -150]);
  
  const y1 = useSpring(y1Raw, { stiffness: 50, damping: 20 });
  const y2 = useSpring(y2Raw, { stiffness: 50, damping: 20 });

  return (
    <section ref={containerRef} className="bg-slate-950 text-white py-32 relative overflow-hidden">
      {/* Parallax Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden flex flex-col justify-center items-center">
        <motion.div 
          style={{ y: y1, skewX, opacity: 0.03 }} 
          className="absolute top-[10%] -left-[10%] text-[20vw] font-black text-white leading-none whitespace-nowrap will-change-transform"
        >
          AGENCY
        </motion.div>
        <motion.div 
          style={{ y: y2, skewX, opacity: 0.03 }} 
          className="absolute bottom-[10%] -right-[10%] text-[20vw] font-black text-white leading-none whitespace-nowrap will-change-transform"
        >
          PROTOTYPE
        </motion.div>
      </div>

       {/* Subtle Grid Pattern for texture */}
       <div className="absolute inset-0 z-0 opacity-[0.05]"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
       />

      <div className="container mx-auto px-6 flex flex-col md:flex-row relative z-10">
        <div className="md:w-1/3 mb-12 md:mb-0">
          <div className="sticky top-12">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-indigo-400 leading-none">
              WHO<br/>WE<br/>ARE
            </h2>
            <div className="mt-8 w-full h-[2px] bg-slate-800" />
            <p className="mt-4 text-slate-500 font-bold tracking-widest uppercase">The "Impact First" Rule</p>
          </div>
        </div>
        
        <div className="md:w-2/3 md:pl-20">
          <Paragraph text="We are not just a service provider; we are a strategic partner. This prototype demonstrates our capability to build scalable digital ecosystems." />
          <Paragraph text="Efficiency is our currency. We prioritize automated workflows and data-driven decisions over traditional agency bloat." />
          <Paragraph text="Built for the future. Our systems are designed to adapt, scale, and monetize in a rapidly changing digital landscape." />
        </div>
      </div>
    </section>
  );
};