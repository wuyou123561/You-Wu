
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SourceLink } from "../types";

export const analyzeNews = async (content: string): Promise<AnalysisResult> => {
  // Always fetch fresh API Key from environment
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === '' || apiKey === 'undefined') {
    throw new Error("Detective API Key missing. Use the 'Connect API' button to authenticate.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Switched from Pro to Flash for better availability
      contents: `Act as a professional disinformation analyst. Use Google Search to investigate.
      Apply Tri-Lens Protocol (Source, Fact, Logic). Return ONLY valid JSON.
      Content: "${content}"`,
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
                properties: { id: { type: Type.STRING }, text: { type: Type.STRING } },
                required: ["id", "text"]
              }
            },
            sourceLens: {
              type: Type.OBJECT,
              properties: { status: { type: Type.STRING }, details: { type: Type.STRING }, isRedFlag: { type: Type.BOOLEAN } },
              required: ["status", "details", "isRedFlag"]
            },
            factLens: {
              type: Type.OBJECT,
              properties: { status: { type: Type.STRING }, details: { type: Type.STRING }, isRedFlag: { type: Type.BOOLEAN } },
              required: ["status", "details", "isRedFlag"]
            },
            logicLens: {
              type: Type.OBJECT,
              properties: { status: { type: Type.STRING }, details: { type: Type.STRING }, isRedFlag: { type: Type.BOOLEAN } },
              required: ["status", "details", "isRedFlag"]
            },
            verdict: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["claims", "sourceLens", "factLens", "logicLens", "verdict", "summary"]
        }
      }
    });

    const text = response.text || '{}';
    const result = JSON.parse(text.trim()) as AnalysisResult;
    
    // Extract Grounding Chunks for transparency
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: SourceLink[] = [];
    
    if (groundingChunks && Array.isArray(groundingChunks)) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
          sources.push({ uri: chunk.web.uri, title: chunk.web.title || 'Verified Evidence' });
        }
      });
    }

    result.groundingSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());
    return result;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    const status = error.status || (error.message?.includes('429') ? 429 : 0);
    
    if (status === 429) {
      throw new Error("QUOTA_EXCEEDED: The Truth Server is under heavy load. This often happens on free API keys. Please try again in 60 seconds or switch projects.");
    }
    if (status === 403 || error.message?.includes('entity was not found') || error.message?.includes('API_KEY_INVALID')) {
      throw new Error("AUTH_ERROR: Your API Key is invalid or not authorized for this model. Please reconnect.");
    }
    
    throw new Error(error.message || "UPLINK_FAILURE: Unable to reach the Truth Server.");
  }
};
