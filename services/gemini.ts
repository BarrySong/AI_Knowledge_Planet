
import { GoogleGenAI } from "@google/genai";

/**
 * 核心模型配置
 */
export const CURRENT_MODEL = 'gemini-3-pro-preview';

/**
 * 安全获取 API Key
 */
const getApiKey = () => {
  return (typeof process !== 'undefined' && process.env?.API_KEY) || "";
};

export async function askGemini(concept: string, question: string) {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return {
      text: "检测到 API_KEY 未配置。请在 Vercel 项目的 Environment Variables 中添加该变量并重新部署。",
      model: CURRENT_MODEL
    };
  }

  // 重要：每次调用前创建新实例，确保使用最新的环境配置
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: CURRENT_MODEL,
      contents: `你是一位世界级的 AI 知识科普专家，深谙全球 AI 技术生态。
      
      请为一位完全不懂编程和 AI 的普通人解释关于 "${concept}" 的问题。
      
      用户的问题是: "${question}"
      
      要求：
      1. 【通俗易懂】使用极简的、贴近生活的类比（例如：像厨房里的调味品、像去菜市场买菜等）。
      2. 【专业深度】逻辑要准确，重点突出。如果是关于国产模型（如 Qwen），展现对其优势的理解。
      3. 【避开术语】禁止使用代码或未解释的缩写。
      4. 【结构清晰】分段阅读，总字数控制在 300 字左右。
      5. 【亲切感】语气要像是在和朋友聊天。`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });

    return {
      text: response.text || "我正在整理思绪，请再问我一次吧。",
      model: CURRENT_MODEL
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.message?.includes("entity was not found") || error.message?.includes("401")) {
      return {
        text: "API Key 似乎无效或权限不足。请检查 Vercel 环境变量设置。",
        model: CURRENT_MODEL
      };
    }
    
    return {
      text: "抱歉，思绪被星际干扰中断了，请稍后再试。",
      model: CURRENT_MODEL
    };
  }
}
