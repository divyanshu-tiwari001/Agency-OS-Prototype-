import { useCallback } from 'react';

// Global context to avoid "The AudioContext was not allowed to start" and limit errors.
// We lazily initialize it.
let globalCtx: AudioContext | null = null;

const getCtx = () => {
  if (!globalCtx) {
    globalCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Always try to resume if suspended (e.g. after user interaction)
  if (globalCtx.state === 'suspended') {
    globalCtx.resume().catch(() => {});
  }
  return globalCtx;
};

export const useSound = () => {
  // Helper for random pitch variation (0.95 to 1.05) to prevent ear fatigue
  const getDetune = () => Math.random() * 0.1 + 0.95;

  // 1. Hover Tick (High tech chirp)
  const playHover = useCallback(() => {
    try {
      const ctx = getCtx();
      if (!ctx) return;
      
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 * getDetune(), t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.05);
      
      gain.gain.setValueAtTime(0.015, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      
      osc.start(t);
      osc.stop(t + 0.05);
    } catch (e) { /* Ignore */ }
  }, []);

  // 2. Click / Activate (Solid mechanical click)
  const playClick = useCallback(() => {
    try {
      const ctx = getCtx();
      if (!ctx) return;

      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Rapid pitch drop simulates a physical switch
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 * getDetune(), t);
      osc.frequency.exponentialRampToValueAtTime(100, t + 0.08);
      
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      
      osc.start(t);
      osc.stop(t + 0.08);
    } catch (e) { /* Ignore */ }
  }, []);

  // 3. Success / Complete (Harmonic Chime - Major Triad)
  const playSuccess = useCallback(() => {
    try {
      const ctx = getCtx();
      if (!ctx) return;

      const t = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0.05, t);
      masterGain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

      const notes = [440, 554.37, 659.25]; // A4, C#5, E5 (A Major)

      notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          osc.connect(masterGain);
          osc.start(t);
          osc.stop(t + 1.5);
      });
    } catch (e) { /* Ignore */ }
  }, []);

  // 4. Scroll Ratchet (Mechanical Gear Sound)
  const playScroll = useCallback(() => {
    try {
        const ctx = getCtx();
        if (!ctx) return;

        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        // Sawtooth wave filtered heavily creates a metallic "tick"
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150 * getDetune(), t); 
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3000, t); // Crisp high-end tick
        filter.Q.value = 8;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        // Very subtle volume
        gain.gain.setValueAtTime(0.015, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

        osc.start(t);
        osc.stop(t + 0.03);
    } catch (e) { /* Ignore */ }
  }, []);

  // 5. Data Tick (For typing/streaming)
  const playData = useCallback(() => {
    try {
      const ctx = getCtx();
      if (!ctx) return;

      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'square';
      osc.frequency.setValueAtTime(1200 * getDetune(), t);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

      osc.start(t);
      osc.stop(t + 0.03);
    } catch (e) { /* Ignore */ }
  }, []);

  // 6. Switch / Toggle (Lower thump)
  const playSwitch = useCallback(() => {
    try {
      const ctx = getCtx();
      if (!ctx) return;

      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

      osc.start(t);
      osc.stop(t + 0.1);
    } catch (e) { /* Ignore */ }
  }, []);

  // 7. Ambient Hum Reveal (Low swell)
  const playHum = useCallback(() => {
    try {
        const ctx = getCtx();
        if (!ctx) return;

        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, t); // Low hum
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.03, t + 0.2);
        gain.gain.linearRampToValueAtTime(0, t + 0.8);

        osc.start(t);
        osc.stop(t + 0.8);
    } catch (e) { /* Ignore */ }
  }, []);

  // 8. Startup Power On
  const playStartup = useCallback(() => {
    try {
        const ctx = getCtx();
        if (!ctx) return;

        const t = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(50, t);
        osc1.frequency.exponentialRampToValueAtTime(800, t + 1.0);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(50, t);
        osc2.frequency.exponentialRampToValueAtTime(200, t + 0.5);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.05, t + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 1.5);
        osc2.stop(t + 1.5);
    } catch (e) { /* Ignore */ }
  }, []);

  return { 
    playHover, 
    playClick, 
    playSuccess, 
    playScroll, 
    playData, 
    playSwitch, 
    playHum, 
    playStartup 
  };
};