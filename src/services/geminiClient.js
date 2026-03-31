import { GoogleGenerativeAI } from '@google/generative-ai';
import { products } from '../data/mockData';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const getAIStylistResponse = async (userInput) => {
  try {
    if (!apiKey) {
      throw new Error("Missing VITE_GEMINI_API_KEY in environment variables.");
    }
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash-latest' // Changed to latest for better reliability
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
    let text = result.response.text().trim();
    
    // Clean up potential markdown blocks if the model accidentally includes them
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("AI Stylist Error Detailed:", error.message || error);
    console.error("API Key configured:", !!apiKey);
    
    // Provide a more specific error fallback for debugging if needed
    let errorMessage = "Waan ka xumahay, isku xirka khadka cilad ayaa gashay. Ma isku daynaa mar kale?";
    if (error.message && error.message.includes('API_KEY_INVALID')) {
       errorMessage = "Cilad ayaa ku timid API Key-ga. Fadlan hubi inuu sax yahay.";
    }
    
    return {
      message: errorMessage,
      categories: []
    };
  }
};
