
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SourceLink } from "../types";

export const analyzeNews = async (content: string): Promise<AnalysisResult> => {
  // Create a new instance right before call to pick up the latest key from dialog
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Detective API Key missing. Please authenticate.");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Act as a professional disinformation analyst. Use Google Search to investigate.
      Apply Tri-Lens Protocol. Return ONLY JSON.
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
    if (error.message?.includes('429')) {
      throw new Error("侦探总部线路繁忙（免费接口频率限制）。请稍等 60 秒后再重新尝试扫描。");
    }
    if (error.message?.includes('403') || error.message?.includes('entity was not found')) {
      throw new Error("API Key 权限受限或无效。请重新点击“连接真理服务器”并选择一个可用的 Key。");
    }
    throw new Error("调查中断：无法连接到真理服务器。请检查网络。");
  }
};
