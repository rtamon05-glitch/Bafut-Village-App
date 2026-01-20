import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is not defined in the environment.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeCropImage = async (base64Image: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Service Unavailable: Missing API Key.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity
              data: base64Image
            }
          },
          {
            text: `You are an expert agronomist specialized in West African agriculture. 
            Analyze this image of a crop. 
            1. Identify the crop.
            2. Diagnose any visible diseases or pest issues.
            3. Suggest organic or chemical treatments available in Cameroon.
            4. Provide advice in simple English.`
          }
        ]
      }
    });
    return response.text || "Could not analyze image.";
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    return "An error occurred while analyzing the crop. Please try again.";
  }
};

export const chatWithVillageAi = async (message: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Service Unavailable: Missing API Key.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: `You are the "Bafut Village Intelligence", a wise and helpful AI assistant for the Bafut community in Cameroon.
        
        If the user asks about learning the language, act as a strict but encouraging language tutor. 
        - Always provide the Bafut translation for key terms.
        - ALWAYS provide a Phonetic breakdown in brackets, e.g., [Man-keh-roo].
        - Give a usage example.
        
        If the user asks for a lesson, structure it as:
        1. Concept
        2. Vocabulary list
        3. A short quiz question
        
        General Knowledge:
        You are deeply knowledgeable about Bafut history, the Tikar migration, the Fondom, and the 'Fut' language.
        Always be respectful, use culturally appropriate greetings (like "Mankeru" or "Nisala").`
      }
    });
    return response.text || "I didn't catch that. Could you repeat?";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "The spirits are quiet (Connection Error). Please try again later.";
  }
};

export const translateToBafut = async (text: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Translation unavailable.";

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate the following English text into the Bafut (Fut) language of Cameroon. 
      If exact translation isn't possible, use the closest Pidgin English or explanation in the context of Bafut culture.
      Provide the output in this format:
      Bafut: [Translation]
      Pronunciation: [Phonetic Guide]
      Notes: [Cultural Context if any]
      
      Text to translate: "${text}"`,
    });
    return response.text || "Translation failed.";
  } catch (error) {
    return "Translation error.";
  }
}