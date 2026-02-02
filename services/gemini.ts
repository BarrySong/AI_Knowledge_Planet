
/**
 * 知识百科 AI 助手服务
 * 适配方案：通义千问 (Qwen) OpenAI 兼容接口
 */

export const CURRENT_MODEL = 'qwen-max'; // 通义千问旗舰模型

export async function askGemini(concept: string, question: string) {
  const apiKey = process.env.API_KEY || "";
  
  if (!apiKey) {
    return {
      text: "检测到 API Key 未配置。请在 Vercel 环境变量中添加 API_KEY。",
      model: CURRENT_MODEL
    };
  }

  // 识别 Key 类型并给出友好提示
  if (apiKey.startsWith('AIzaSy')) {
    return {
      text: "检测到您填入的是 Google Gemini 的 Key，但代码已切换为通义千问模式。请在代码或环境变量中保持一致。",
      model: CURRENT_MODEL
    };
  }

  try {
    // 通义千问支持 OpenAI 兼容格式的 API 调用
    const response = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: CURRENT_MODEL,
        messages: [
          {
            role: "system",
            content: `你是一位世界级的 AI 知识科普专家。请为一位完全不懂编程的普通人解释关于 "${concept}" 的问题。
            要求：1. 使用生活化类比；2. 语气亲切；3. 避开技术术语；4. 总字数 300 字左右。`
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
    }

    return {
      text: data.choices[0].message.content,
      model: CURRENT_MODEL
    };
  } catch (error: any) {
    console.error("Qwen API Error:", error);
    return {
      text: `抱歉，AI 助手暂时罢工了。原因：${error.message || '网络连接失败'}。请检查您的 API_KEY 是否正确，或是否在 Vercel 中进行了 Redeploy。`,
      model: CURRENT_MODEL
    };
  }
}
