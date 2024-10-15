import axios from 'axios';

// // Ensure that the environment variables are loaded
// if (!process.env.PPLX_API_KEY) {
//   throw new Error('PPLX_API_KEY is not defined in the environment variables.');
// }

interface GeneratedDescription {
  description: string;
}

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function generateDescription(topicName: string): Promise<GeneratedDescription> {
  try {
    const response = await axios.post<PerplexityResponse>(
      'https://api.perplexity.ai/chat/completions',
      {
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          { role: "system", content: "Be precise and concise." },
          { role: "user", content: `Generate a very concise description for the topic: ${topicName}` }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 100,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PPLX_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
      const generatedDescription = response.data.choices[0].message.content.trim();
      return { description: generatedDescription };
    } else {
      throw new Error('Unexpected response format from Perplexity API');
    }
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate content');
  }
}

// Add ResourceData interface
export interface ResourceData {
  type: string;
  url: string;
  classification: 'free' | 'paid';
  comprehensiveness: number;
  skillLevel: 'beginner' | 'intermediary' | 'advanced';
}

// Add this new function to generate resources
export async function generateResources(topicName: string): Promise<ResourceData[]> {
  try {
    const response = await axios.post<PerplexityResponse>(
      'https://api.perplexity.ai/chat/completions',
      {
        model: "llama-3.1-sonar-huge-128k-online",
        messages: [
          { role: "system", content: `
You are an assistant that generates structured resource data for educational topics. 
When provided with a topic name, create a list of 5 resources in JSON format adhering to the following schema:

{
  "type": "string",          // Type of the resource (e.g., "video", "book", "article", "pdf")
  "url": "string",           // Direct URL to the resource
  "classification": "string",// "free" or "paid"
  "comprehensiveness": number,// Integer between 1 and 100 indicating coverage depth
  "skillLevel": "string"     // "beginner", "intermediary", or "advanced"
}

**Guidelines:**
- Your output should be a valid JSON array and nothing else.
- Ensure all fields are present and correctly formatted.
- The \`comprehensiveness\` value should reflect the depth of the resource:
  - Comprehensive resources like books should have values in the 80-100 range.
  - Shorter resources like videos should have values below 50.
- The \`skillLevel\` should correspond to the complexity of the resource.
- Provide a diverse mix of resource types.
- Do not include \`topic\`, \`creator\`, or \`createdAt\` fields; these will be handled separately.
- Ensure URLs are valid and lead directly to the resource.
` },
          { role: "user", content: `Provide resource details for the topic: ${topicName}. Return the data as a JSON array following the schema outlined in the system message.` }
        ],
        temperature: 0.3,
        top_p: 0.8,
        max_tokens: 500,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PPLX_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
      const resourcesContent = response.data.choices[0].message.content;

      // **Edit:** Remove code fences if present
      const jsonMatch = resourcesContent.match(/```json\s*([\s\S]+?)\s*```/);
      const cleanJson = jsonMatch ? jsonMatch[1] : resourcesContent;

      return JSON.parse(cleanJson.trim());
    } else {
      throw new Error('Unexpected response format from Perplexity API');
    }
  } catch (error) {
    console.error('Error generating resources:', error);
    throw new Error('Failed to generate resources');
  }
}



