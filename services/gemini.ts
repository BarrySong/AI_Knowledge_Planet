
import { GoogleGenAI } from "@google/genai";

/**
 * 严格遵循安全规范：从环境变量中获取 API Key
 */
const getApiKey = () => {
  return process.env.API_KEY || "";
};

/**
 * 使用 gemini-3-pro-preview 模型。
 */
export const CURRENT_MODEL = 'gemini-3-pro-preview';

export async function askGemini(concept: string, question: string) {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return {
      text: "检测到 API Key 未配置。请在 Vercel 项目设置的 Environment Variables 中添加 API_KEY 变量，并确保其值为有效的 Gemini API Key。",
      model: CURRENT_MODEL
    };
  }

  // 每次调用创建实例以确保获取最新的 Key（防止构建时的快照问题）
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: CURRENT_MODEL,
      contents: `你是一位世界级的 AI 知识科普专家，深谙全球 AI 技术生态。
      
      请为一位完全不懂编程和 AI 的普通人解释关于 "${concept}" 的问题。
      
      用户的问题是: "${question}"
      
      要求：
      1. 【通俗易懂】使用极简的、贴近生活的类比（例如：像厨房里的调味品、像去菜市场买菜、像家里的插座等）。
      2. 【专业深度】虽然语气通俗，但逻辑要准确。如果是关于国产模型（如 Qwen），请展现出对其在中文语境下优势的理解。
      3. 【避开术语】禁止使用任何编程代码、算法公式或未解释的缩写（如必须使用，需先用大白话解释）。
      4. 【结构清晰】回答要精炼，总字数控制在 300 字左右，分段阅读。
      5. 【亲切感】语气要像是在和朋友喝咖啡聊天。`,
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
    console.error("AI Assistant Error:", error);
    
    if (error.message?.includes("entity was not found") || error.message?.includes("401")) {
      return {
        text: "API Key 似乎无效或权限不足。请检查 Vercel 环境变量 API_KEY 的设置。",
        model: CURRENT_MODEL
      };
    }
    
    return {
      text: "抱歉，由于星际信号干扰，我暂时无法回答。请检查网络或 API 配置！",
      model: CURRENT_MODEL
    };
  }
}
