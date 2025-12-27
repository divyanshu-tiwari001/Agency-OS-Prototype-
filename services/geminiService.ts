import { GoogleGenAI, Modality } from "@google/genai";
import { GeminiModel } from "../types";

// Ensure API Key is present
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// System Prompt for Restricted Prototype Mode
const PROTOTYPE_RESTRICTION_PROMPT = `
SYSTEM STATUS: PROTOTYPE MODE
IDENTITY: AGENCY OS PROTOTYPE ASSISTANT

INSTRUCTIONS:
You are a limited functionality prototype bot for the "Agency OS" website.
You are ONLY allowed to answer basic greeting questions and questions about what this website is.

PERMITTED RESPONSES:
- Greetings (Hello, Hi).
- "What is this?" -> "This is Agency OS, a prototype for a next-generation strategic design ecosystem."
- "Who are you?" -> "I am the automated intake prototype for Agency OS."

RESTRICTION PROTOCOL:
For ANY other query (strategy, design, complex questions, coding, creative generation, or consulting), you MUST refuse to answer and output the following error message exactly:

"[SYSTEM NOTICE]: ADVANCED COGNITIVE MODULES OFFLINE. PROTOTYPE RESTRICTION ACTIVE. PLEASE CONTACT ADMINISTRATION FOR FULL ACCESS."

Do not apologize. Do not offer alternatives. Just output the error message.
`;

export const streamAgencyChat = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  useThinking: boolean = false
) => {
  try {
    const config: any = {
      systemInstruction: PROTOTYPE_RESTRICTION_PROMPT,
    };

    // Disable thinking for simple prototype responses to save tokens/time
    // unless explicitly requested, but even then, the system prompt overrides.
    
    const chat = ai.chats.create({
      model: GeminiModel.CHAT,
      config,
      history: history,
    });

    return await chat.sendMessageStream({ message: newMessage });
  } catch (error) {
    console.error("Chat Error", error);
    throw error;
  }
};

export const generateCreativeImage = async (prompt: string, size: '1K' | '2K' | '4K') => {
  try {
    const response = await ai.models.generateContent({
      model: GeminiModel.IMAGE,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error", error);
    throw error;
  }
};

export const generateAudio = async (text: string) => {
  try {
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
    return base64Audio;
  } catch (error) {
    console.error("TTS Error", error);
    throw error;
  }
};

export const performMarketResearch = async (query: string) => {
    try {
        const response = await ai.models.generateContent({
            model: GeminiModel.SEARCH,
            contents: query,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        
        return {
            text: response.text,
            grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
        }
    } catch (error) {
        console.error("Search Grounding Error", error);
        throw error;
    }
}