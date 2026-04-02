import { GoogleGenerativeAI } from '@google/generative-ai';
import { products } from '../data/mockData';

// Using hardcoded key for ONE FINAL TEST to rule out all environment issues
const apiKey = "AIzaSyC4zh4wBOBBlC-ed47lND95i0lldEdGe9s";
const genAI = new GoogleGenerativeAI(apiKey.trim());

export const getAIStylistResponse = async (userInput) => {
  try {
    // 1. Try to find an available model dynamically
    let modelName = 'gemini-1.5-flash';
    
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const availableModels = data.models || [];
        // Look for any model that supports generateContent
        const supportedModel = availableModels.find(m => 
          m.supportedGenerationMethods.includes('generateContent') && 
          (m.name.includes('flash') || m.name.includes('pro'))
        );
        if (supportedModel) {
          modelName = supportedModel.name.replace('models/', '');
          console.log("Automatically selected model:", modelName);
        }
      }
    } catch (e) {
      console.warn("Dynamic model discovery failed, using default:", e);
    }

    const model = genAI.getGenerativeModel({ model: modelName });
    
    const catalogString = products.map(p => `- ${p.name} (${p.category}, $${p.price})`).join('\n');
    const prompt = `
      You are a luxury Somali Fashion AI Stylist for an eCommerce app.
      OUR INVENTORY CATALOG:
      ${catalogString}
      User request: "${userInput}"
      Respond in SOMALI. Detect intent (chat/order). Output ONLY valid JSON:
      { "message": "...", "categories": [], "intent": "chat"|"order", "orderInfo": { "product": "...", "size": "...", "color": "..." } }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    try {
      return JSON.parse(responseText);
    } catch (e) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return { message: responseText.trim(), intent: "chat", categories: [] };
    }
  } catch (error) {
    console.error("AI Stylist Error:", error);
    return {
      message: `Cilad ayaa dhacday: ${error.message}. Fadlan hubi inuu API key-gu sax yahay.`,
      categories: [],
      rawError: error.message
    };
  }
};

export const listAvailableModels = async () => {
  const maskedKey = apiKey ? `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}` : "MISSING";
  const keyLength = apiKey ? apiKey.length : 0;
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: `${response.status}: ${JSON.stringify(errorData)}`,
        maskedKey,
        keyLength
      };
    }
    const data = await response.json();
    return { 
      success: true, 
      models: data.models.map(m => m.name),
      maskedKey,
      keyLength
    };
  } catch (error) {
    return { success: false, error: error.message, maskedKey, keyLength };
  }
};
