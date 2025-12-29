import Groq from 'groq-sdk';
import OpenAI from 'openai';

const getLLMClient = () => {
  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (groqKey && groqKey.trim() !== '') {
    return {
      type: 'groq',
      client: new Groq({ apiKey: groqKey })
    };
  }
  if (openRouterKey && openRouterKey.trim() !== '') {
    return {
      type: 'openrouter',
      client: new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: openRouterKey,
        defaultHeaders: {
          'X-Title': 'BeyondChats Intelligence',
        }
      })
    };
  }
  return null;
};

export async function enhanceArticle(
  originalContent: string,
  referenceTexts: string[]
): Promise<string> {
  const config = getLLMClient();
  if (!config) {
    throw new Error('No LLM API key provided. Please configure GROQ_API_KEY or OPENROUTER_API_KEY.');
  }

  const { type, client } = config;
  const model = type === 'groq' ? 'llama-3.3-70b-versatile' : 'google/gemini-2.0-flash-001:free';

  const referenceSummary = referenceTexts.length > 0
    ? `\n\nReference material from top-ranking articles (Citations [1], [2], etc.):\n${referenceTexts.map((t, i) => `[Source ${i + 1}] ${t.slice(0, 1500)}`).join('\n\n')}`
    : '';

  const messages = [
    {
      role: 'system' as const,
      content: `You are an expert SEO content strategist and academic writer. Your task is to rewrite and enhance blog articles to improve their search engine ranking and authoritative value.

Guidelines:
- Improve readability and structure with clear headings (H2, H3)
- Add relevant keywords naturally for high SEO performance
- Expand on key points with more detail and insights
- Maintain the original message and intent while elevating the tone
- IMPORTANT: Incorporate specific information from the provided [Source X] references
- IMPORTANT: Use inline citations like [Source 1], [Source 2] whenever you use information from the references
- Make the content more engaging, authoritative, and research-backed
- Output ONLY the enhanced article content in Markdown format, no preamble or explanation`
    },
    {
      role: 'user' as const,
      content: `Please enhance the following article by cross-referencing it with the provided source materials:\n\nORIGINAL ARTICLE:\n${originalContent}\n\n${referenceSummary}`
    }
  ];

  const completion = await (client as any).chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 4096,
  });

  return completion.choices[0]?.message?.content || originalContent;
}

export async function generateSearchQueries(title: string): Promise<string[]> {
  const config = getLLMClient();
  if (!config) return [];

  const { type, client } = config;
  const model = type === 'groq' ? 'llama-3.3-70b-versatile' : 'google/gemini-2.0-flash-001:free';

  const completion = await (client as any).chat.completions.create({
    model,
    messages: [
      {
        role: 'system' as const,
        content: 'You are a search query generator. Given an article title, generate 3 Google search queries that would find competing articles on the same topic. Output ONLY the queries, one per line, no numbering or explanation.'
      },
      {
        role: 'user' as const,
        content: title
      }
    ],
    temperature: 0.5,
    max_tokens: 200,
  });

  const queries = completion.choices[0]?.message?.content?.split('\n').filter((q: string) => q.trim()) || [];
  return queries.slice(0, 3);
}

export async function chatWithContext(
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  context: string
): Promise<string> {
  const config = getLLMClient();
  if (!config) return "LLM not configured.";

  const { type, client } = config;
  const model = type === 'groq' ? 'llama-3.3-70b-versatile' : 'google/gemini-2.0-flash-001:free';

  const completion = await (client as any).chat.completions.create({
    model,
    messages: [
      {
        role: 'system' as const,
        content: `You are an expert analyst and AI assistant. Use the following article/document context to answer the user's questions. 
        If the answer isn't in the context, say so, but try to provide helpful insights based on the available information.
        Maintain an authoritative, sophisticated BeyondChats "Intelligence" tone.
        
        CONTEXT:
        ${context}`
      },
      ...history,
      {
        role: 'user' as const,
        content: message
      }
    ],
    temperature: 0.6,
    max_tokens: 1024,
  });

  return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
}

