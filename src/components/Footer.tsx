import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Twitter, Instagram, Mail, ArrowUpRight, X, Terminal, Code2, Heart, Cpu } from 'lucide-react';
import { useSound } from '../hooks/useSound';

// Type for storing popover position
interface PopupState {
    key: string;
    x: number;
    y: number;
    width: number;
    alignment: 'left' | 'right' | 'center';
}

export const Footer: React.FC = () => {
  const { playHover, playClick } = useSound();
  const [activePopup, setActivePopup] = useState<PopupState | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const socialLinks = [
    { icon: Mail, href: "mailto:hello@agency.example.com", label: "Email" },
    { icon: Linkedin, href: "https://www.linkedin.com", label: "LinkedIn" },
    { icon: Twitter, href: "https://x.com", label: "Twitter" },
    { icon: Instagram, href: "https://www.instagram.com", label: "Instagram" },
  ];

  const handleModalOpen = (key: string, e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    playClick();
    
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Determine alignment based on screen position
    let alignment: 'left' | 'right' | 'center' = 'left';
    
    // For mobile or small screens, we use a bottom sheet center alignment
    if (window.innerWidth < 768) {
        alignment = 'center';
    } else if (rect.left > window.innerWidth * 0.6) {
        alignment = 'right';
    }

    setActivePopup({
        key,
        x: rect.left,
        y: rect.top,
        width: rect.width,
        alignment
    });
  };

  const handleModalClose = () => {
    playClick();
    setActivePopup(null);
  };

  const getModalContent = (key: string) => {
    switch (key) {
      case 'Services':
        return {
          title: 'OUR CAPABILITIES',
          body: (
            <div className="space-y-4">
              <p className="text-slate-300">We provide a full-spectrum digital service ecosystem aimed at high-growth startups and established brands looking to reinvent themselves.</p>
              <ul className="space-y-3 mt-4">
                {[
                    "Strategic Consulting & Market Analysis",
                    "High-Fidelity UI/UX Design Systems",
                    "Full-Stack Engineering (React, Node, AI)",
                    "Brand Identity & Motion Graphics",
                    "AI Integration & Automation"
                ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-400">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        {item}
                    </li>
                ))}
              </ul>
            </div>
          )
        };
      case 'About':
        return {
          title: 'THE COLLECTIVE',
          body: (
            <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                Agency OS is not just a template; it's a design philosophy. We believe in <span className="text-white font-bold">"Heavy Design"</span>—interfaces that feel physical, substantial, and precise. 
                </p>
                <p className="text-slate-400 text-sm">
                Founded by Divyanshu Tiwari, this project represents the intersection of code, art, and strategy, built to demonstrate the future of the web.
                </p>
            </div>
          )
        };
      case 'Contact':
        return {
          title: 'GET IN TOUCH',
          body: (
            <div className="space-y-4">
                <p className="text-slate-300">
                We are currently accepting new projects for Q4 2025. While this is a prototype, I am always open to discussing real-world collaborations, freelance opportunities, or full-time roles. 
                </p>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-sm mt-4">
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        OPEN FOR WORK
                    </div>
                </div>
            </div>
          )
        };
      case 'Privacy Policy':
        return {
          title: 'DATA PROTOCOL',
          body: <p className="text-slate-300">This application is a client-side prototype. No personal data is stored, sold, or processed on external servers. All interactions are local or simulated for demonstration purposes. Your privacy is absolute because your data never leaves your device.</p>
        };
      case 'Terms of Service':
        return {
          title: 'TERMS OF USE',
          body: <p className="text-slate-300">By accessing Agency OS, you agree that this is a portfolio piece. You are encouraged to explore, interact, and break things. The code serves as an intellectual property demonstration for Divyanshu Tiwari.</p>
        };
      case 'Prototype Disclaimer':
        return {
          title: 'SYSTEM DISCLAIMER',
          body: (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-sm">
                 <p className="text-indigo-200 font-medium text-sm leading-relaxed">
                   This application is a sophisticated prototype designed to demonstrate advanced frontend engineering capabilities, motion design, and UI patterns. 
                   It is not an operational commercial agency. All client data and case studies are simulated.
                 </p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Developer Contact</h4>
                <div className="space-y-4 font-mono text-sm">
                    <div className="flex flex-col group">
                        <span className="text-slate-500 text-[10px] uppercase mb-1">Primary Email</span>
                        <a href="mailto:divyanshutiwari@duck.com" className="text-white hover:text-indigo-400 transition-colors flex items-center gap-2">
                            <Mail size={14} /> divyanshutiwari@duck.com
                        </a>
                    </div>
                    <div className="flex flex-col group">
                        <span className="text-slate-500 text-[10px] uppercase mb-1">Secondary Email</span>
                        <a href="mailto:programmingwithdt@gmail.com" className="text-white hover:text-indigo-400 transition-colors flex items-center gap-2">
                             <Mail size={14} /> programmingwithdt@gmail.com
                        </a>
                    </div>
                    <div className="flex flex-col group">
                        <span className="text-slate-500 text-[10px] uppercase mb-1">LinkedIn</span>
                        <a href="https://www.linkedin.com/in/its-tiwari" target="_blank" rel="noreferrer" className="text-white hover:text-indigo-400 transition-colors flex items-center gap-2">
                             <Linkedin size={14} /> /in/its-tiwari
                        </a>
                    </div>
                </div>
              </div>
            </div>
          )
        };
      case 'TechStack':
        return {
          title: 'SYSTEM ARCHITECTURE',
          body: (
             <div className="space-y-6">
                <p className="text-slate-400 text-sm">The following technologies were engaged to construct this environment:</p>
                <div className="grid grid-cols-1 gap-3">
                   {[
                     "React 19 (Experimental)",
                     "TypeScript",
                     "Tailwind CSS",
                     "Framer Motion",
                     "Google AI Studio",
                     "Google Gemini 2.0 Flash (AI)",
                     "Lenis Smooth Scroll",
                     "Web Audio API (Sound Synthesis)",
                     "Lucide React"
                   ].map((tech, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i} 
                        className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-sm hover:border-indigo-500/50 transition-colors group"
                        onMouseEnter={playHover}
                      >
                         <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full group-hover:shadow-[0_0_8px_rgba(99,102,241,0.8)] transition-all" />
                         <span className="text-sm font-bold text-slate-200 group-hover:text-white font-mono">{tech}</span>
                      </motion.div>
                   ))}
                </div>
             </div>
          )
        };
      case 'DevNote':
        return {
            title: "DEVELOPER'S LOG",
            body: (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px]">
                             <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-lg overflow-hidden">
                                 {/* Updated Avatar to Male (Ryker) */}
                                 <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Ryker" alt="DT" className="w-full h-full object-cover" />
                             </div>
                         </div>
                         <div>
                             <h4 className="text-white font-bold text-lg">Divyanshu Tiwari</h4>
                             <p className="text-indigo-400 text-[10px] font-mono tracking-[0.2em] uppercase">Creative Developer</p>
                         </div>
                    </div>
                    <div className="space-y-4">
                        <p className="text-slate-200 text-md font-light leading-relaxed">
                           Hey there! 👋 Thanks a ton for stopping by Agency OS. 
                        </p>
                        <p className="text-slate-300 text-sm leading-relaxed">
                           I built this prototype because I believe the web is losing its soul to boring templates. I wanted to create something that feels <span className="text-indigo-400 font-bold">heavy</span>, precise, and genuinely fun to use. I poured a lot of late nights (and way too much coffee) into getting these animations just right.
                        </p>
                        <p className="text-slate-300 text-sm leading-relaxed">
                           If this little project made you smile or think "woah", then my job here is done. I'm always looking for cool people to build legendary things with.
                        </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                         <button 
                            onClick={(e) => handleModalOpen('TechStack', e)}
                            className="px-4 py-2 bg-slate-800 hover:bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-widest rounded-sm transition-colors flex items-center gap-2"
                            onMouseEnter={playHover}
                         >
                            <Cpu size={14} />
                            View Tech Stack
                         </button>
                         <div className="flex items-center gap-2 text-indigo-400">
                            <Heart size={14} className="fill-current animate-pulse" />
                            <span className="text-[10px] font-mono tracking-widest uppercase">Made with love</span>
                         </div>
                    </div>
                </div>
            )
        }
      default:
        return { title: 'INFO', body: <p>Information unavailable.</p> };
    }
  };

  return (
    <footer className="bg-slate-950 text-white pt-32 pb-12 border-t border-slate-900 relative overflow-hidden font-sans">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
        />
        
        {/* Increased Z-Index to 60 to be safe above grains/overlays */}
        <div className="container mx-auto px-6 relative z-[60]"> 
            
            {/* Top Section: CTA */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-12">
                <div className="text-center md:text-left">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
                        READY TO <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">BUILD?</span>
                    </h2>
                    <p className="text-slate-500 max-w-md text-sm md:text-lg font-medium">
                        Prototype your future. Join the ecosystem.
                    </p>
                </div>
                
                <motion.a
                    href="mailto:divyanshutiwari@duck.com"
                    onMouseEnter={playHover}
                    onClick={playClick}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 30px -10px rgba(99, 102, 241, 0.3)" }}
                    whileTap={{ scale: 0.95, y: 0 }}
                    className="group relative px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-sm overflow-hidden flex items-center gap-3 rounded-sm shadow-xl cursor-pointer"
                >
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">Start Prototype</span>
                    <ArrowUpRight size={18} className="relative z-10 group-hover:text-white group-hover:rotate-45 transition-all duration-300" />
                    
                    {/* Hover Fill */}
                    <div className="absolute inset-0 bg-indigo-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[0.22, 1, 0.36, 1]" />
                    
                    {/* Shine Effect - Periodic */}
                    <motion.div
                        className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                        animate={{ left: ["-100%", "200%"] }}
                        transition={{ repeat: Infinity, repeatDelay: 5, duration: 2, ease: "easeInOut" }}
                    />
                </motion.a>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-slate-900 mb-20" />

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
                {/* Brand Info */}
                <div className="md:col-span-5 space-y-8">
                    <Logo className="w-16 h-auto text-white items-start opacity-80" />
                    <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium">
                        Agency OS is a prototype demonstration. All content is for illustrative purposes. 
                        Designed for scalability and strategy.
                    </p>
                    <div className="flex gap-4">
                        {socialLinks.map((link, i) => (
                            <motion.a 
                                key={i}
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                                className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-400 hover:bg-slate-800 transition-colors duration-300 group relative overflow-hidden"
                                onMouseEnter={playHover}
                                onClick={playClick}
                                aria-label={link.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                                whileHover={{ scale: 1.1, rotate: 5, borderColor: "rgba(99, 102, 241, 0.5)" }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <link.icon size={18} className="relative z-10 group-hover:stroke-[2.5px] transition-all" />
                                {/* Subtle fill effect on hover */}
                                <motion.div 
                                    className="absolute inset-0 bg-indigo-500/10 rounded-full"
                                    initial={{ scale: 0 }}
                                    whileHover={{ scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Links - Buttons optimized for click */}
                <div className="md:col-span-2 md:col-start-8">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-8 border-b border-slate-800 pb-2 inline-block">Explore</h4>
                    <ul className="space-y-2 text-sm text-slate-500 font-medium">
                        {['Services', 'About', 'Contact'].map((item) => (
                            <li key={item} className="group">
                                <button 
                                    type="button"
                                    onClick={(e) => handleModalOpen(item, e)}
                                    className="w-full text-left hover:text-indigo-400 cursor-pointer transition-colors duration-200 flex items-center gap-2 py-2 appearance-none bg-transparent border-none p-0 m-0"
                                    onMouseEnter={playHover}
                                >
                                    <span className="w-0 group-hover:w-2 h-[1px] bg-indigo-400 transition-all duration-300"></span>
                                    {item}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Legal - Buttons optimized for click */}
                <div className="md:col-span-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-8 border-b border-slate-800 pb-2 inline-block">Legal</h4>
                     <ul className="space-y-2 text-sm text-slate-500 font-medium">
                        {['Privacy Policy', 'Terms of Service', 'Prototype Disclaimer'].map((item) => (
                            <li key={item} className="group">
                                <button
                                    type="button"
                                    onClick={(e) => handleModalOpen(item, e)}
                                    className="w-full text-left hover:text-indigo-400 cursor-pointer transition-colors duration-200 flex items-center gap-2 py-2 appearance-none bg-transparent border-none p-0 m-0"
                                    onMouseEnter={playHover}
                                >
                                    <span className="w-0 group-hover:w-2 h-[1px] bg-indigo-400 transition-all duration-300"></span>
                                    {item}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Developer Note Button */}
                    <motion.button 
                        onClick={(e) => handleModalOpen('DevNote', e)}
                        onMouseEnter={playHover}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative z-30 mt-8 flex items-center gap-3 px-4 py-3 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 rounded-sm group transition-all duration-300 w-full md:w-auto cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:text-white group-hover:bg-indigo-500 transition-colors">
                            <Code2 size={14} />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold group-hover:text-slate-400">Read</span>
                            <span className="text-xs text-white font-bold group-hover:text-indigo-200">Developer's Note</span>
                        </div>
                    </motion.button>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-900 gap-4">
                <div className="flex items-center gap-2">
                     <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                        This prototype is made by
                     </span>
                     <a 
                        href="https://divyanshu-portfolio-01.vercel.app" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest hover:text-white transition-colors relative group"
                        onMouseEnter={playHover}
                     >
                        DIVYANSHU TIWARI
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                     </a>
                </div>
                
                <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                     <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">System Nominal</span>
                </div>
            </div>
        </div>

        {/* Parallax Watermark - Subtle */}
        <motion.div 
            className="absolute -bottom-12 -right-4 text-[25vw] md:text-[18vw] font-black text-slate-900 pointer-events-none select-none leading-none opacity-40 z-0"
            style={{ y: -50 }} // Static offset
        >
            PROTO
        </motion.div>

        {/* Dynamic Contextual Popover */}
        {mounted && createPortal(
            <AnimatePresence>
            {activePopup && (
                <div className="fixed inset-0 z-[9999] isolate font-sans pointer-events-none">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleModalClose}
                        className={`absolute inset-0 pointer-events-auto ${activePopup.alignment === 'center' ? 'bg-slate-950/80 backdrop-blur-sm' : 'bg-transparent'}`}
                    />

                    {/* Popover Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        style={{
                            position: 'fixed',
                            bottom: activePopup.alignment === 'center' ? 0 : window.innerHeight - activePopup.y,
                            left: activePopup.alignment === 'center' ? 0 : (activePopup.alignment === 'right' ? 'auto' : activePopup.x),
                            right: activePopup.alignment === 'right' ? (window.innerWidth - (activePopup.x + activePopup.width)) : (activePopup.alignment === 'center' ? 0 : 'auto'),
                            width: activePopup.alignment === 'center' ? '100vw' : 400,
                            maxWidth: activePopup.alignment === 'center' ? '100vw' : '90vw'
                        }}
                        className={`bg-slate-950 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-20 pointer-events-auto ${activePopup.alignment !== 'center' ? 'rounded-sm mb-4' : 'rounded-t-2xl max-h-[70vh]'}`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/50">
                            <div className="flex items-center gap-2">
                                <Terminal size={14} className="text-indigo-500" />
                                <span className="text-xs font-black tracking-[0.2em] text-white uppercase">
                                    {getModalContent(activePopup.key).title}
                                </span>
                            </div>
                            <button 
                                onClick={handleModalClose}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8 overflow-y-auto max-h-[50vh]">
                            {getModalContent(activePopup.key).body}
                        </div>

                        {/* Decorative footer line */}
                        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
                    </motion.div>
                </div>
            )}
            </AnimatePresence>,
            document.body
        )}
    </footer>
  );
};