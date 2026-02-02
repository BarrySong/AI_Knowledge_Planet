
import { GoogleGenAI } from "@google/genai";

// 严格遵循安全规范：从环境变量中获取 API Key
// 注意：该变量在部署环境下会自动注入，无需在代码中硬编码
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * 使用 gemini-3-pro-preview 模型。
 * 该模型在处理复杂概念关联（如 MCP、RAG、Qwen 架构等）时具有更强的推理能力。
 */
export const CURRENT_MODEL = 'gemini-3-pro-preview';

export async function askGemini(concept: string, question: string) {
  try {
    const response = await ai.models.generateContent({
      model: CURRENT_MODEL,
      contents: `你是一位世界级的 AI 知识科普专家，深谙全球 AI 技术生态（包括 Gemini, Claude, GPT 以及国产大模型如通义千问 Qwen 等）。
      
      请为一位完全不懂编程和 AI 的普通人解释关于 "${concept}" 的问题。
      
      用户的问题是: "${question}"
      
      要求：
      1. 【通俗易懂】使用极简的、贴近生活的类比（例如：像厨房里的调味品、像去菜市场买菜、像家里的插座等）。
      2. 【专业深度】虽然语气通俗，但逻辑要准确。如果是关于国产模型（如 Qwen），请展现出对其在中文语境下优势的理解。
      3. 【避开术语】禁止使用任何编程代码、算法公式或未解释的缩写（如必须使用，需先用大白话解释）。
      4. 【结构清晰】回答要精炼，总字数控制在 300 字左右，分段阅读。
      5. 【亲切感】语气要像是在和朋友喝咖啡聊天。`,
      config: {
        temperature: 0.8, // 提高一点创造性，使比喻更生动
        topP: 0.9,
      }
    });

    return {
      text: response.text || "我正在整理思绪，请再问我一次吧。",
      model: CURRENT_MODEL
    };
  } catch (error: any) {
    console.error("AI Assistant Error:", error);
    
    // 错误处理：如果是因为 API Key 问题导致的 404 或 401，给出友好提示
    if (error.message?.includes("entity was not found") || error.message?.includes("401")) {
      return {
        text: "哎呀，我的‘通行证’（API Key）似乎遇到了一些问题。请确保系统已经配置了正确的 API 访问权限。",
        model: CURRENT_MODEL
      };
    }
    
    return {
      text: "抱歉，由于星际信号干扰，我暂时无法回答。请稍后再试！",
      model: CURRENT_MODEL
    };
  }
}
