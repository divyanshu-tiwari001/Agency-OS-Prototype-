import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Twitter, Instagram, ChevronRight, ChevronLeft, Github } from 'lucide-react';
import { useSound } from '../hooks/useSound';

// Updated Squad Data with Short Indian Names
const SQUAD = [
  { 
    id: 0, 
    name: "DIVYANSHU", 
    role: "FOUNDER & CEO", 
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop", 
    status: "ONLINE",
    socials: [
      { icon: Twitter, url: "https://x.com" },
      { icon: Linkedin, url: "https://linkedin.com" }
    ]
  },
  { 
    id: 1, 
    name: "AARAV", 
    role: "TECH LEAD", 
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop", 
    status: "CODING",
    socials: [
      { icon: Github, url: "https://github.com" },
      { icon: Linkedin, url: "https://linkedin.com" }
    ]
  },
  { 
    id: 2, 
    name: "RIYA", 
    role: "HEAD OF DESIGN", 
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop", 
    status: "CREATING",
    socials: [
      { icon: Instagram, url: "https://instagram.com" },
      { icon: Linkedin, url: "https://linkedin.com" }
    ]
  },
  { 
    id: 3, 
    name: "KABIR", 
    role: "PRODUCT STRATEGY", 
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop", 
    status: "MEETING",
    socials: [
        { icon: Twitter, url: "https://x.com" }
    ]
  },
  { 
    id: 4, 
    name: "ANANYA", 
    role: "GROWTH LEAD", 
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop", 
    status: "OFFLINE",
    socials: [
        { icon: Linkedin, url: "https://linkedin.com" }
    ]
  },
  { 
    id: 5, 
    name: "DEV", 
    role: "SYSTEMS ARCHITECT", 
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop", 
    status: "DEPLOYING",
    socials: [
        { icon: Github, url: "https://github.com" }
    ]
  }
];

const CyberGrid = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Base Grid */}
            <div 
                className="absolute inset-0 opacity-[0.05]"
                style={{ 
                    backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`, 
                    backgroundSize: '40px 40px' 
                }}
            />
            
            {/* Scanning Vertical Beam */}
            <motion.div 
                className="absolute top-0 bottom-0 w-[200px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent"
                animate={{ left: ["-20%", "120%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />

            {/* Rotating Radar Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-indigo-500/5 opacity-50">
                <motion.div 
                    className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(99,102,241,0.1)_360deg)]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </div>
    );
};

export const Founder: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { playHover, playClick, playSwitch } = useSound();

  const handleNext = useCallback(() => {
    playSwitch();
    setActiveIndex((prev) => (prev + 1) % SQUAD.length);
  }, [playSwitch]);

  const handlePrev = useCallback(() => {
    playSwitch();
    setActiveIndex((prev) => (prev - 1 + SQUAD.length) % SQUAD.length);
  }, [playSwitch]);

  // Auto-play interval
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4000); // Switch every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, handleNext]);

  const getCardStyle = (index: number) => {
    // Calculate distance with circular wrapping logic
    const total = SQUAD.length;
    let distance = (index - activeIndex + total) % total;
    
    // Normalize distance for cleaner logic: -1 (left), 0 (center), 1 (right)
    // We treat total-1 as -1 (immediate left)
    if (distance === total - 1) distance = -1;
    if (distance > 1 && distance < total - 1) distance = 2; // Everything else is "far away"

    const isCenter = distance === 0;
    const isLeft = distance === -1;
    const isRight = distance === 1;

    // Mobile width check helper
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    // Default styles for hidden/far cards
    // Using 'any' to avoid TS casting issues inside object literal
    let styles: any = {
        x: 0,
        scale: 0.6,
        opacity: 0,
        zIndex: 0,
        rotateY: 0,
        filter: 'grayscale(100%) blur(5px)',
        pointerEvents: 'none'
    };

    if (isCenter) {
        styles = {
            x: 0,
            scale: 1,
            opacity: 1,
            zIndex: 50,
            rotateY: 0,
            filter: 'grayscale(0%) blur(0px)',
            pointerEvents: 'auto'
        };
    } else if (isLeft) {
        styles = {
            x: isMobile ? '-10%' : -320, // Move left
            scale: 0.85,
            opacity: 0.4,
            zIndex: 40,
            rotateY: 35,
            filter: 'grayscale(100%) blur(2px)',
            pointerEvents: 'auto'
        };
    } else if (isRight) {
        styles = {
            x: isMobile ? '10%' : 320, // Move right
            scale: 0.85,
            opacity: 0.4,
            zIndex: 40,
            rotateY: -35,
            filter: 'grayscale(100%) blur(2px)',
            pointerEvents: 'auto'
        };
    }

    return styles;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            handleNext();
            setIsAutoPlaying(false); // Pause on manual interaction
        }
        if (e.key === 'ArrowLeft') {
            handlePrev();
            setIsAutoPlaying(false); // Pause on manual interaction
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <section className="min-h-[100vh] bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden py-32 perspective-1000">
      
      <CyberGrid />
      
      {/* Title */}
      <div className="relative z-10 mb-20 flex flex-col items-center">
         <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            className="h-1 bg-indigo-500 mb-6"
         />
         <h2 className="text-white font-black text-6xl md:text-7xl tracking-tighter mix-blend-overlay">THE SQUAD</h2>
         <p className="text-indigo-400 font-mono text-xs tracking-[0.3em] uppercase mt-4"> elite unit // global operations</p>
      </div>

      {/* 3D Carousel Stage - Pause AutoPlay on Hover */}
      <div 
        className="w-full max-w-[1200px] h-[550px] relative flex items-center justify-center z-20 perspective-1000 overflow-visible"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <AnimatePresence mode='popLayout'>
            {SQUAD.map((member, index) => {
                const style = getCardStyle(index);
                const isActive = index === activeIndex;

                return (
                    <motion.div
                        key={member.id}
                        initial={false}
                        animate={style}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // smooth cinematic ease
                        className="absolute top-0 h-[500px]"
                        style={{ 
                            transformStyle: 'preserve-3d',
                            width: typeof window !== 'undefined' && window.innerWidth < 768 ? '85vw' : '320px' // Responsive card width
                        }}
                        onClick={() => {
                            // Allow clicking side cards to navigate
                            const total = SQUAD.length;
                            const distance = (index - activeIndex + total) % total;
                            if (distance === 1) handleNext();
                            if (distance === total - 1) handlePrev();
                        }}
                    >
                        {/* Card Container */}
                        <div className={`w-full h-full relative bg-slate-900 border ${isActive ? 'border-indigo-500' : 'border-slate-800'} shadow-2xl overflow-hidden group`}>
                            
                            {/* Image */}
                            <div className="absolute inset-0">
                                <img src={member.img} alt={member.name} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                                <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent ${isActive ? 'opacity-80' : 'opacity-90'}`} />
                            </div>

                            {/* Active Tech Overlays */}
                            {isActive && (
                                <>
                                    <motion.div 
                                        className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                                        animate={{ opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-scanline" />
                                    
                                    {/* Corner Reticles */}
                                    <svg className="absolute top-4 left-4 w-6 h-6 text-indigo-500 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                        <path d="M1 9V1H9" />
                                    </svg>
                                    <svg className="absolute bottom-4 right-4 w-6 h-6 text-indigo-500 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                        <path d="M23 15V23H15" />
                                    </svg>
                                </>
                            )}

                            {/* Content Info */}
                            <div className="absolute bottom-0 left-0 w-full p-8 z-30">
                                <div className={`border-l-2 ${isActive ? 'border-indigo-500' : 'border-slate-700'} pl-4 transition-colors duration-500`}>
                                    <h3 className="text-4xl font-black text-white italic uppercase leading-none mb-2">{member.name}</h3>
                                    <p className={`font-mono text-[10px] tracking-[0.2em] font-bold uppercase mb-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                                        {member.role}
                                    </p>

                                    {/* Status Indicator */}
                                    <div className="flex items-center gap-2 mb-6 opacity-70">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? (member.status === 'OFFLINE' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]') : 'bg-slate-600'}`} />
                                        <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">STATUS: {member.status}</span>
                                    </div>

                                    {/* Socials - Only visible when active */}
                                    {isActive && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="flex gap-3"
                                        >
                                            {member.socials.map((social, i) => (
                                                <a 
                                                    key={i}
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-8 h-8 flex items-center justify-center border border-white/20 hover:bg-white hover:text-black hover:border-white text-white rounded-full transition-all duration-300"
                                                    onMouseEnter={playHover}
                                                    onClick={(e) => { e.stopPropagation(); playClick(); }}
                                                >
                                                    <social.icon size={14} />
                                                </a>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="relative z-30 flex items-center gap-12 mt-12">
            <button 
                onClick={() => { handlePrev(); setIsAutoPlaying(false); }}
                onMouseEnter={playHover}
                className="w-14 h-14 rounded-full border border-slate-700 bg-slate-900/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300 group"
            >
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <div className="flex gap-2">
                {SQUAD.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1 transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-800'}`}
                    />
                ))}
            </div>

            <button 
                onClick={() => { handleNext(); setIsAutoPlaying(false); }}
                onMouseEnter={playHover}
                className="w-14 h-14 rounded-full border border-slate-700 bg-slate-900/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300 group"
            >
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
      </div>

      {/* Fictional Disclaimer */}
      <div className="relative z-30 mt-8 text-center pointer-events-none select-none flex flex-col items-center gap-2">
            <p className="text-[9px] text-slate-600 font-mono uppercase tracking-widest opacity-60">
                * Note: Personnel profiles are simulated for prototype demonstration purposes.
            </p>
            <p className="text-[9px] text-indigo-400 font-mono uppercase tracking-widest opacity-50">
                * Solely Developed by Divyanshu Tiwari
            </p>
      </div>

    </section>
  );
};