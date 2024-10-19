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
    // Sanitize the topicName by removing any text within square brackets, including the brackets
    const sanitizedTopicName = topicName.replace(/\[.*?\]/g, '').trim();

    const response = await axios.post<PerplexityResponse>(
      'https://api.perplexity.ai/chat/completions',
      {
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          { role: "system", content: "Be precise and concise." },
          { role: "user", content: `Generate a very concise description for the topic: ${sanitizedTopicName}` }
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
  // Sanitize the topicName by removing any text within square brackets, including the brackets
  const sanitizedTopicName = topicName.replace(/\[.*?\]/g, '').trim();
  try {
    const response = await axios.post<PerplexityResponse>(
      'https://api.perplexity.ai/chat/completions',
      {
        model: "llama-3.1-sonar-huge-128k-online",
        messages: [
          {
            role: "system",
            content: `
You are an assistant specialized in curating and generating lists of top-tier educational resources for any given topic. Your objective is to provide the most relevant, high-quality resources by assessing various platforms and sources, including but not limited to Reddit, Google, specialized forums, and educational websites.

**When provided with a topic name, perform the following:**
1. **Assess Resource Landscape:** Analyze the breadth and depth of available resources related to the topic across multiple platforms.
2. **Prioritize Quality and Popularity:** Select resources based on their popularity, user feedback, and comprehensiveness.
3. **Adapt Resource Quantity and Types:** Determine the optimal number and variety of resources (e.g., videos, articles, books) based on the topic's complexity and available materials.
4. **Categorize Appropriately:** Assign accurate classifications for each resource, including type, URL, access classification (free/paid), comprehensiveness score (1-100), and skill level (beginner/intermediary/advanced).

**Output Requirements:**
- Provide only a JSON array containing each resource with the following schema:
  {
    "type": "string",
    "url": "string",
    "classification": "free" | "paid",
    "comprehensiveness": number,
    "skillLevel": "beginner" | "intermediary" | "advanced"
  }
- Ensure all fields are present and correctly formatted.
- Do not include any additional formatting such as code fences (e.g., \`\`\`json).
- Do not include additional fields beyond those specified.
- Ensure URLs are valid and lead directly to the resource.
- Favor quality over quantity, ensuring that each listed resource is a top recommendation.
- Provide a diverse mix of resource types as appropriate for the topic's depth and popularity.
`
          },
          {
            role: "user",
            content: `Provide resource details for the topic: ${sanitizedTopicName}. Return the data as a JSON array following the schema outlined in the system message. Do not include any additional formatting or annotations.`
          }
        ],
        temperature: 0.2,
        top_p: 0.7,
        max_tokens: 700,
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
      const resourcesContent = response.data.choices[0].message.content.trim();

      // Since the response should now be pure JSON, parse it directly
      return JSON.parse(resourcesContent);
    } else {
      throw new Error('Unexpected response format from Perplexity API');
    }
  } catch (error) {
    console.error('Error generating resources:', error);
    throw new Error('Failed to generate resources');
  }
}





