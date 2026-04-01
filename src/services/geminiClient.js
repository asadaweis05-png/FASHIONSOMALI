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
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash' 
    });
    
    // Convert products to string
    const catalogString = products.map(p => `- ${p.name} (${p.category}, $${p.price})`).join('\n');

    const prompt = `
      You are a luxury Somali Fashion AI Stylist for an eCommerce app.
      
      OUR INVENTORY CATALOG:
      ${catalogString}
      
      User request: "${userInput}"
      
      Respond thoughtfully as a stylish fashion assistant. IMPORTANT: You MUST respond entirely in the SOMALI LANGUAGE. Use natural, conversational, and culturally relevant Somali phrasing. Make it feel premium but simple.
      When a user asks for recommendations, you MUST ONLY recommend items from OUR INVENTORY CATALOG above. Provide the exact product name.
      
      You must detect if the user wants to place an order (buy a product). If they mention they want to buy, order, or purchase a specific item and/or size, set "intent" to "order". Otherwise, set "intent" to "chat".
      
      You must respond ONLY with a valid JSON string with the following exact structure:
      {
        "message": "Your stylish advice or order confirmation IN SOMALI here.",
        "categories": ["CategoryName1"], // use from core categories or empty array
        "intent": "chat" | "order",
        "orderInfo": {
          "product": "Product name or category they want to buy (e.g. Dirac)",
          "size": "Requested size if mentioned (e.g. M, L, XL), otherwise null",
          "color": "Requested color if mentioned, otherwise null"
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Robust extraction of JSON from response
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if no JSON found but there is text
      return {
        message: responseText.trim(),
        intent: "chat",
        categories: []
      };
    } catch (parseError) {
      console.warn("JSON Parse Error, falling back to raw text:", parseError);
      return {
        message: responseText.trim(),
        intent: "chat",
        categories: []
      };
    }
  } catch (error) {
    // Detailed error logging for easier diagnosis
    console.error("--- AI Stylist Error Details ---");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    if (error.status) console.error("Status Code:", error.status);
    console.error("API Key configured:", !!apiKey);
    console.error("-------------------------------");
    
    let errorMessage = "Waan ka xumahay, isku xirka khadka cilad ayaa gashay. Fadlan isku day hadhow ama hubi internet-kaaga.";
    
    if (error.message && error.message.includes('API_KEY_INVALID')) {
       errorMessage = "Cilad ayaa ku timid API Key-ga. Fadlan hubi inuu sax yahay.";
    } else if (error.message && error.message.includes('quota')) {
       errorMessage = "Waan ka xumahay, xadka isticmaalka AI ayaa dhamaaday hadda. Fadlan dib u tijaabi berri.";
    }
    
    return {
      message: errorMessage,
      categories: []
    };
  }
};
