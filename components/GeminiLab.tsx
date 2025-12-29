import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { streamAgencyChat, generateCreativeImage, generateAudio, performMarketResearch } from '../services/geminiService';
import { Loader2, Send, Image as ImageIcon, Sparkles, X, Bot, Zap, Terminal, BrainCircuit } from 'lucide-react';
import { useSound } from '../hooks/useSound';

// PCM Decoding Helpers
const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodePCM = (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000
): AudioBuffer => {
  const dataInt16 = new Int16Array(data.buffer);
  const numChannels = 1; // Gemini TTS is mono
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);
  
  for (let i = 0; i < frameCount; i++) {
    // Convert int16 to float32 range [-1.0, 1.0]
    channelData[i] = dataInt16[i] / 32768.0;
  }
  
  return buffer;
};

const playAudio = async (base64String: string) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const pcmBytes = decodeBase64(base64String);
    const audioBuffer = decodePCM(pcmBytes, audioContext);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    
    source.onended = () => {
        audioContext.close().catch(console.error);
    };
    
    source.start(0);
  } catch (e) {
    console.error("Audio playback error", e);
  }
};

export const GeminiLab: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'consult' | 'create'>('consult');
  const { playHover, playClick, playSuccess, playData, playSwitch } = useSound();
  
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  // New: Deep Think Mode Toggle
  const [deepThink, setDeepThink] = useState(false);
  
  // New: Hint Visibility State
  const [showHint, setShowHint] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [imgPrompt, setImgPrompt] = useState('');
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgSize, setImgSize] = useState<'1K' | '2K' | '4K'>('1K');

  useEffect(() => {
    if (messages.length === 0) {
        setMessages([{
            role: 'model',
            text: "AI AGENT SYSTEM ONLINE.\n\nAgency OS is a cinematic brand website prototype powered by Gemini 2.5. I am here to provide expert brand information, understand every service-related problem you face, and deliver superior strategic solutions.\n\nAwaiting your command."
        }]);
    }

    // Auto-hide the hint label after 8 seconds
    const hintTimer = setTimeout(() => {
        setShowHint(false);
    }, 8000);

    return () => clearTimeout(hintTimer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const toggleWidget = () => {
    if (!isOpen) {
        playSwitch(); 
        setShowHint(false); // Immediately hide hint on interaction
    } else {
        playClick(); 
    }
    setIsOpen(!isOpen);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    playClick();
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsStreaming(true);

    try {
      let context = "";
      // Smart Auto-Grounding: If it looks like a research question, search first.
      if (userMsg.toLowerCase().includes("current") || userMsg.toLowerCase().includes("news") || userMsg.toLowerCase().includes("price") || userMsg.toLowerCase().includes("trend")) {
          try {
            const searchRes = await performMarketResearch(userMsg);
            if (searchRes?.text) {
                 context = `\n[SYSTEM: LIVE DATA RETRIEVED]\n${searchRes.text}\n[END DATA]\n`;
            }
          } catch (e) { /* Ignore search errors silently */ }
      }

      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const finalMsg = context + userMsg;
      
      // Pass the deepThink state to the service
      const stream = await streamAgencyChat(history, finalMsg, deepThink);
      
      let fullResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      let charCount = 0;
      for await (const chunk of stream) {
        const chunkText = chunk.text; 
        if (chunkText) {
            fullResponse += chunkText;
            charCount++;
            if (charCount % 3 === 0) playData(); // Reduced sound frequency slightly

            setMessages(prev => {
              const newArr = [...prev];
              newArr[newArr.length - 1].text = fullResponse;
              return newArr;
            });
        }
      }
      playSuccess();

      // Only speak reasonably short responses to keep the flow fast
      if (fullResponse.length < 350) {
        const audioData = await generateAudio(fullResponse);
        if (audioData) playAudio(audioData);
      }

    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Connection interrupted. Re-establishing link..." }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleImageGen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imgPrompt || imgLoading) return;
    playClick();
    setImgLoading(true);
    try {
      const b64 = await generateCreativeImage(imgPrompt, imgSize);
      setGeneratedImg(b64);
      playSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setImgLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger - Draggable */}
      <motion.div
        className="fixed bottom-8 right-8 z-[100]"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        drag
        dragMomentum={false} 
        dragElastic={0.1}
        whileDrag={{ scale: 1.1, cursor: "grabbing" }}
        whileHover={{ scale: 1.05, cursor: "grab" }}
      >
        <button
          onClick={toggleWidget}
          onMouseEnter={playHover}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.3)] backdrop-blur-xl border transition-all duration-300 relative overflow-hidden group ${isOpen ? 'bg-slate-900 border-slate-700 scale-95' : 'bg-slate-950 border-indigo-500/50 hover:border-indigo-400 hover:shadow-[0_0_60px_rgba(99,102,241,0.6)]'}`}
        >
           {!isOpen && (
            <>
                <motion.div 
                    className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,#6366f1_360deg)] opacity-40"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />
                 <motion.div 
                    className="absolute inset-[2px] bg-slate-950 rounded-full z-0"
                />
            </>
           )}
           
           <div className={`relative z-10 transition-colors duration-300 ${isOpen ? 'text-slate-400' : 'text-indigo-400 group-hover:text-white'}`}>
             {isOpen ? (
                <X size={24} strokeWidth={3} />
             ) : (
                <div className="relative">
                    <Sparkles size={28} strokeWidth={2} className="drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    <motion.div 
                        className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    />
                </div>
             )}
           </div>
        </button>
        
        {/* Tooltip hint - Only shows momentarily on load */}
        <AnimatePresence>
          {!isOpen && showHint && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 10, scale: 0.9 }}
               transition={{ delay: 1, duration: 0.5 }}
               className="absolute right-full top-1/2 -translate-y-1/2 mr-6 pointer-events-none"
             >
               <div className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-xl border border-neutral-200 whitespace-nowrap flex items-center gap-2">
                 <span>AI AGENT</span>
                 <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
               </div>
               {/* Arrow */}
               <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white border-t border-r border-neutral-200 rotate-45 transform translate-x-[1px]" />
             </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Widget Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 50, scale: 0.95, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed bottom-24 right-4 md:right-8 w-[calc(100vw-2rem)] md:w-[400px] h-[600px] z-[90] bg-slate-950 dark:bg-black border border-white/10 shadow-2xl rounded-sm overflow-hidden flex flex-col ring-1 ring-white/5 font-sans"
          >
            {/* Header */}
            <div className="h-14 bg-slate-900 border-b border-white/10 flex items-center justify-between px-5 select-none relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                    <span className="font-black text-white text-xs tracking-[0.2em] uppercase">AGENCY OS</span>
                    <span className="text-[8px] font-mono text-indigo-400 tracking-widest flex items-center gap-1">
                        AI AGENT SYSTEM <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"/>
                    </span>
                </div>
              </div>
              <div className="flex gap-2">
                 <Terminal size={14} className="text-slate-500" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-slate-900/50">
              <button
                onClick={() => { setActiveTab('consult'); playClick(); }}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-b-2 ${activeTab === 'consult' ? 'border-indigo-500 text-white bg-white/5' : 'border-transparent text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <Bot size={12} /> Consult
              </button>
              <button
                onClick={() => { setActiveTab('create'); playClick(); }}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-b-2 ${activeTab === 'create' ? 'border-indigo-500 text-white bg-white/5' : 'border-transparent text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <Zap size={12} /> Create
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative bg-slate-950">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                   style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '20px 20px' }} 
              />
              
              {activeTab === 'consult' ? (
                <div className="h-full flex flex-col relative z-10">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
                    {messages.map((m, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i} 
                        className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                      >
                         <div className={`text-[8px] font-mono tracking-widest mb-1 opacity-50 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                             {m.role === 'user' ? 'YOU' : 'AI AGENT'}
                         </div>
                        <div className={`max-w-[90%] p-4 text-xs font-medium leading-relaxed shadow-lg backdrop-blur-sm border ${m.role === 'user' ? 'bg-white text-black border-white rounded-tr-none rounded-bl-xl rounded-tl-xl rounded-br-xl' : 'bg-slate-900/80 text-indigo-50 border-indigo-500/30 rounded-tl-none rounded-tr-xl rounded-bl-xl rounded-br-xl'}`}>
                          {/* Basic Markdown-like formatting for lines */}
                          {m.text.split('\n').map((line, i) => (
                              <React.Fragment key={i}>
                                  {line}
                                  {i !== m.text.split('\n').length - 1 && <br />}
                              </React.Fragment>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                    {isStreaming && (
                         <div className="flex flex-col items-start">
                             <div className="text-[8px] font-mono tracking-widest mb-1 opacity-50">AI AGENT THINKING</div>
                             <div className="bg-slate-900/80 p-4 border border-indigo-500/30 rounded-tr-xl rounded-bl-xl rounded-br-xl flex gap-1 items-center h-12">
                                 <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 bg-indigo-400" />
                                 <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 bg-indigo-400" />
                                 <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 bg-indigo-400" />
                             </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Controls */}
                  <div className="p-4 border-t border-white/10 bg-slate-900">
                    <div className="flex items-center gap-2 mb-2">
                        <button 
                            onClick={() => { setDeepThink(!deepThink); playClick(); }}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] uppercase tracking-wider border transition-all ${deepThink ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500'}`}
                        >
                            <BrainCircuit size={10} />
                            Deep Reasoning
                        </button>
                    </div>

                    <form onSubmit={handleChatSubmit} className="relative flex gap-2">
                      <div className="relative flex-1">
                          <input 
                            className="w-full bg-black border border-white/20 px-4 py-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700 font-mono"
                            placeholder={deepThink ? "Ask complex strategy query..." : "Input command..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                          />
                      </div>
                      <button 
                        type="submit" 
                        className="px-4 bg-white text-black hover:bg-indigo-400 transition-colors border border-transparent font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isStreaming}
                      >
                        {isStreaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col p-6 overflow-y-auto relative z-10">
                   <div className="space-y-6 mb-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Asset Resolution</label>
                            <span className="text-[10px] text-indigo-500 font-mono">{imgSize}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {['1K', '2K', '4K'].map(s => (
                             <button
                               key={s}
                               onClick={() => { setImgSize(s as any); playClick(); }}
                               className={`py-2 border rounded-none text-[10px] font-bold transition-all ${imgSize === s ? 'bg-indigo-500 text-black border-indigo-500' : 'border-white/20 text-slate-500 hover:border-white hover:text-white'}`}
                             >
                               {s}
                             </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-wider">Asset Description</label>
                        <textarea 
                          className="w-full h-24 bg-black border border-white/20 p-3 text-xs text-white resize-none focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700 font-mono"
                          placeholder="Describe the visual asset..."
                          value={imgPrompt}
                          onChange={(e) => setImgPrompt(e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={handleImageGen}
                        disabled={imgLoading}
                        className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                      >
                        {imgLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} className="group-hover:animate-pulse" />}
                        {imgLoading ? 'PROCESSING...' : 'INITIALIZE GENERATION'}
                      </button>
                   </div>
                   
                   <div className="flex-1 min-h-[200px] border border-dashed border-white/20 flex items-center justify-center bg-black/40 overflow-hidden relative group">
                      {generatedImg ? (
                        <motion.img 
                          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                          src={generatedImg} 
                          alt="Generated" 
                          className="w-full h-full object-contain" 
                        />
                      ) : (
                        <div className="text-slate-700 flex flex-col items-center gap-2">
                           <ImageIcon size={24} className="opacity-30" />
                           <span className="text-[10px] font-mono tracking-widest uppercase opacity-50">Awaiting Output</span>
                        </div>
                      )}
                   </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};