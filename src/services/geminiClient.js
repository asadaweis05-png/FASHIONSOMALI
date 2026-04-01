import { GoogleGenerativeAI } from '@google/generative-ai';
import { products } from '../data/mockData';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Remove global initialization to ensure the function always uses the latest environment variables

export const getAIStylistResponse = async (userInput) => {
  // Diagnostic log (partially masked for security)
  const maskedKey = apiKey ? `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}` : "MISSING";
  console.log("AI Initialization Diagnostic - API Key:", maskedKey);

  try {
    if (!apiKey) {
      throw new Error("Missing VITE_GEMINI_API_KEY in environment variables.");
    }
    
    // Direct Fetch approach for better browser compatibility and easier debugging
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API_ERROR: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    try {
      return JSON.parse(responseText);
    } catch (e) {
      // Fallback if JSON is weirdly formatted
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return { message: responseText.trim(), intent: "chat", categories: [] };
    }
  } catch (error) {
    console.error("--- AI Stylist Error Details ---");
    console.error(error);
    
    let errorMessage = "Waan ka xumahay, isku xirka khadka cilad ayaa gashay. Fadlan isku day hadhow ama hubi internet-kaaga.";
    if (error.message.includes('API_ERROR')) {
       // Extract specific error if possible
       errorMessage = `Cilad ka timid Google API: ${error.message.split(' - ')[0]}`;
    }
    
    return {
      message: errorMessage,
      categories: [],
      rawError: error.message // Include for diagnostic button
    };
  }
};

export const testAIConnection = async () => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Respond with 'OK' if you can read this." }] }]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: `${response.status}: ${JSON.stringify(errorData)}` };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
