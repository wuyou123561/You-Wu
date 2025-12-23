import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SourceLink } from "../types";

export const analyzeNews = async (content: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a professional disinformation analyst. Apply the 'Tri-Lens Protocol' to evaluate this news: "${content}". 
    
    CRITICAL LOGIC: 
    - This is NOT a scoring system. It is a RED FLAG system.
    - If ANY lens has a 'Critical Failure' (e.g., fabricated source), the entire verdict is RED.
    
    1. Source Lens: Verified/Anonymous/Fabricated.
    2. Fact Lens: Solid Evidence/Vague/Contradictory.
    3. Logic Lens: Logical/Emotional/Fallacious.
    
    Verdict must be GREEN, YELLOW, or RED.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          claims: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING }
              },
              required: ["id", "text"]
            }
          },
          sourceLens: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              details: { type: Type.STRING },
              isRedFlag: { type: Type.BOOLEAN }
            }
          },
          factLens: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              details: { type: Type.STRING },
              isRedFlag: { type: Type.BOOLEAN }
            }
          },
          logicLens: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              details: { type: Type.STRING },
              isRedFlag: { type: Type.BOOLEAN }
            }
          },
          verdict: { type: Type.STRING },
          summary: { type: Type.STRING },
          redFlagExplanation: { type: Type.STRING, description: "The single biggest reason for the verdict." }
        },
        required: ["claims", "sourceLens", "factLens", "logicLens", "verdict", "summary", "redFlagExplanation"]
      }
    }
  });

  const text = response.text || '{}';
  const result = JSON.parse(text);
  
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    result.groundingSources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri)
      .map((web: any) => ({ uri: web.uri, title: web.title }));
  }

  return result;
};