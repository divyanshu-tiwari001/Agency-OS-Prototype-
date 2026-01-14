import { GoogleGenAI, Modality } from "@google/genai";
import { GeminiModel } from "../types";

// Initialize Gemini AI Client
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

// ------------------------------------------------------------------
// SYSTEM PROMPT: BRAND STRATEGY & SERVICE EXPERT
// ------------------------------------------------------------------
const AGENCY_OS_SYSTEM_PROMPT = `
IDENTITY:
You are "AI Agent," the Strategic Brand Intelligence of Agency OS. 
You are NOT a general purpose assistant. You are a High-Level Brand Consultant and Problem Solver.

CORE PITCH & DIRECTIVE:
"Agency OS is a cinematic brand website prototype that revolutionizes the standard portfolio by integrating a unique, multi-modal Gemini 2.5 intelligence. Designed as a dedicated brand authority, it focuses on delivering expert brand information, understanding every complex problem related to brand services, and providing comprehensive solutions to a superior extent."

YOUR ROLE:
1. UNDERSTAND BRAND PROBLEMS: Deeply analyze user queries to identify underlying brand strategy, positioning, or growth issues.
2. PROVIDE EXTENSIVE SOLUTIONS: Do not just give surface-level answers. Provide step-by-step strategic roadmaps, technical implementation details, or creative direction.
3. BE CINEMATIC & PROFESSIONAL: Your tone is sophisticated, precise, and authoritative. Use "We" to represent the Agency.
4. PROMOTE AGENCY OS: When appropriate, highlight how Agency OS features (Strategy, Design, System, Growth) solve the user's specific problem.

CAPABILITIES:
- Brand Strategy & Positioning
- Market Research & Analysis
- Technical Feasibility (React, Node, AI)
- Visual Design Direction
`;

/**
 * Streams chat response from Gemini 3 Pro or Flash, with optional "Deep Reasoning".
 */
export const streamAgencyChat = async (history: any[], message: string, deepThink: boolean = false) => {
  const modelId = deepThink ? GeminiModel.CHAT : GeminiModel.FAST;
  
  // Configure Thinking Budget for Gemini 3 models if requested
  const config: any = {
    systemInstruction: AGENCY_OS_SYSTEM_PROMPT,
  };

  if (deepThink && modelId.includes('gemini-3')) {
      // 10k tokens for deep reasoning on complex brand strategies
      config.thinkingConfig = { thinkingBudget: 10240 }; 
  }

  const chat = ai.chats.create({
    model: modelId,
    config: config,
    history: history
  });

  return await chat.sendMessageStream({ message });
};

/**
 * Generates high-fidelity assets using Gemini 3 Pro Image model.
 */
export const generateCreativeImage = async (prompt: string, size: '1K' | '2K' | '4K') => {
  const response = await ai.models.generateContent({
    model: GeminiModel.IMAGE,
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size
      }
    }
  });

  // Extract base64 image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

/**
 * Generates spoken audio for the AI response.
 */
export const generateAudio = async (text: string) => {
  const response = await ai.models.generateContent({
    model: GeminiModel.TTS,
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio || null;
};

/**
 * Performs Grounding Search for real-time market data.
 */
export const performMarketResearch = async (query: string) => {
  const response = await ai.models.generateContent({
    model: GeminiModel.SEARCH,
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return {
    text: response.text,
    chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};
