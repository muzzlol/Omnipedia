import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

interface SafetyRating {
  category: string;
  probability: string;
}

interface ResponseData {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
    safetyRatings: SafetyRating[];
    finishReason: string;
  }[];
}

export const moderate = async (name: string): Promise<boolean> => {
  try {
    const prompt = `You are working as a moderation service for new topic creation in a school forum. Your task is to determine if the topic name is appropriate. Respond with exactly "true" for appropriate names or "false" for inappropriate names. Topic name to check: "${name}"`;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not defined in environment variables');
      return false;
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    const response = await axios.post<ResponseData>(
      url,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ],
        generationConfig: {
          maxOutputTokens: 1,
          temperature: 0,
          topP: 0,
          topK: 1
        }
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Check if we have a valid response
    if (!response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Unexpected response format:', response.data);
      return false;
    }

    // Get the model's response
    const result = response.data.candidates[0].content.parts[0].text.trim().toLowerCase();
    
    // Check if all safety ratings are NEGLIGIBLE
    const safetyRatings = response.data.candidates[0].safetyRatings;
    const passedSafetyCheck = safetyRatings?.every(
      rating => rating.probability === "NEGLIGIBLE"
    ) ?? false;

    // Return true only if both the model says "true" AND it passes safety checks
    return result === "true" && passedSafetyCheck;

  } catch (error) {
    console.error('Error in moderation:', error);
    return false; // Fail closed - treat errors as inappropriate
  }
};
