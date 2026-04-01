import { GoogleGenerativeAI } from '@google/generative-ai';
import { products } from '../data/mockData';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Remove global initialization to ensure the function always uses the latest environment variables

export const getAIStylistResponse = async (userInput) => {
  // Diagnostic log (partially masked for security)
  const maskedKey = apiKey ? `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}` : "MISSING";
  console.log("AI Initialization Diagnostic - API Key:", maskedKey);

  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];
  let lastError = null;

  for (const modelName of models) {
    try {
      if (!apiKey) {
        throw new Error("Missing VITE_GEMINI_API_KEY in environment variables.");
      }
      
      // Try v1 first (stable)
      const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
      
      const catalogString = products.map(p => `- ${p.name} (${p.category}, $${p.price})`).join('\n');
      const prompt = `
        You are a luxury Somali Fashion AI Stylist for an eCommerce app.
        OUR INVENTORY CATALOG:
        ${catalogString}
        User request: "${userInput}"
        Respond in SOMALI. Detect intent (chat/order). Output ONLY valid JSON:
        { "message": "...", "categories": [], "intent": "chat"|"order", "orderInfo": { "product": "...", "size": "...", "color": "..." } }
      `;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      if (response.status === 404) {
        console.warn(`Model ${modelName} not found on v1, trying next...`);
        continue; 
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API_ERROR: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;
      
      try {
        return JSON.parse(responseText);
      } catch (e) {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        return { message: responseText.trim(), intent: "chat", categories: [] };
      }
    } catch (error) {
      lastError = error;
      console.error(`Attempt with ${modelName} failed:`, error.message);
      if (!error.message.includes('404')) break; // If it's not a 404, don't keep trying models
    }
  }

  // If we reach here, everything failed
  console.error("--- AI Stylist Final Error ---");
  console.error(lastError);
  
  return {
    message: "Waan ka xumahay, isku xirka khadka cilad ayaa gashay. Fadlan hadhow isku day.",
    categories: [],
    rawError: lastError?.message || "All models failed"
  };
};

export const listAvailableModels = async () => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: `${response.status}: ${JSON.stringify(errorData)}` };
    }
    const data = await response.json();
    return { success: true, models: data.models.map(m => m.name) };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
