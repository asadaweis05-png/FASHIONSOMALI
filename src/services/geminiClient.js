import { GoogleGenerativeAI } from '@google/generative-ai';
import { products } from '../data/mockData';

const rawApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const apiKey = rawApiKey ? rawApiKey.trim() : "";

const genAI = new GoogleGenerativeAI(apiKey);

// Cache the discovered model name to speed up subsequent requests
let cachedModelName = null;

export const getAIStylistResponse = async (userInput) => {
  try {
    if (!apiKey) throw new Error("API Key missing");

    // 1. Determine model name (use cache if available)
    if (!cachedModelName) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          const supportedModel = (data.models || []).find(m => 
            m.supportedGenerationMethods.includes('generateContent') && 
            (m.name.includes('flash') || m.name.includes('pro'))
          );
          if (supportedModel) {
            cachedModelName = supportedModel.name.replace('models/', '');
          }
        }
      } catch (e) {
        console.warn("Model discovery failed:", e);
      }
      // Final fallback if discovery failed
      if (!cachedModelName) cachedModelName = 'gemini-1.5-flash';
    }

    const model = genAI.getGenerativeModel({ model: cachedModelName });
    
    // Streamlined prompt for faster processing
    const catalogSnippet = products.slice(0, 20).map(p => `- ${p.name} ($${p.price})`).join('\n');
    
    const prompt = `
      You are a luxury Somali Fashion AI Stylist. 
      INVENTORY:
      ${catalogSnippet}
      
      User: "${userInput}"
      
      Respond in stylish SOMALI. 
      If they want to buy, set intent="order".
      Return ONLY JSON:
      {"message": "...", "intent": "chat"|"order", "orderInfo": {"product": "...", "size": "..."}}
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    });
    
    const responseText = result.response.text();
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { message: responseText.trim(), intent: "chat" };
    } catch (e) {
      return { message: responseText.trim(), intent: "chat" };
    }
  } catch (error) {
    console.error("AI Error:", error);
    return {
      message: "Waan ka xumahay, cilad yar ayaa dhacday. Fadlan mar kale isku day.",
      intent: "chat"
    };
  }
};
export const listAvailableModels = async () => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) return { success: false };
    const data = await response.json();
    return { success: true, models: data.models.map(m => m.name) };
  } catch (e) {
    return { success: false };
  }
};
