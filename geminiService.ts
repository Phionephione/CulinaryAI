
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { Recipe, Difficulty, Ingredient } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper to decode PCM for TTS
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const geminiService = {
  analyzeFridgeImage: async (base64Image: string): Promise<string[]> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
            { text: "Identify all the food items and ingredients visible in this fridge. Return only a comma-separated list of items." }
          ]
        },
      });
      const text = response.text || "";
      return text.split(',').map(item => item.trim()).filter(item => item.length > 0);
    } catch (error) {
      console.error("Error analyzing image:", error);
      return [];
    }
  },

  generateRecipes: async (ingredients: string[], restriction: string): Promise<Recipe[]> => {
    const prompt = `Based on these ingredients found in a fridge: ${ingredients.join(', ')}. 
    Suggest 3 unique recipes. Consider dietary restriction: ${restriction}.
    Return the response in JSON format.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                difficulty: { type: Type.STRING, enum: Object.values(Difficulty) },
                prepTime: { type: Type.INTEGER },
                calories: { type: Type.INTEGER },
                ingredients: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      quantity: { type: Type.STRING }
                    },
                    required: ["name", "quantity"]
                  }
                },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                dietaryTags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["id", "title", "description", "difficulty", "prepTime", "calories", "ingredients", "steps"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || "[]");
      return data;
    } catch (error) {
      console.error("Error generating recipes:", error);
      return [];
    }
  },

  speakText: async (text: string) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioBase64) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const decoded = decode(audioBase64);
        const buffer = await decodeAudioData(decoded, audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
      }
    } catch (error) {
      console.error("TTS Error:", error);
    }
  }
};
