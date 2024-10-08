import axios from 'axios';

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
          { role: "user", content: `Generate a concise description for the topic: ${topicName}` }
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
      const generatedDescription = response.data.choices[0].message.content;

      return {
        description: generatedDescription,
      };
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
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          { role: "system", content: "Generate a list of 5 resources related to the topic." },
          { role: "user", content: `Provide resource details for the topic: ${topicName}. Return the data as a JSON array.` }
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
      const resources: ResourceData[] = JSON.parse(resourcesContent);
      return resources;
    } else {
      throw new Error('Unexpected response format from Perplexity API');
    }
  } catch (error) {
    console.error('Error generating resources:', error);
    throw new Error('Failed to generate resources');
  }
}


