/**
 * Vercel Edge Function for Sybrin Research Assistant Chat
 * Streams responses from OpenAI GPT-5.1 with File Search
 */

export const config = {
  runtime: 'edge',
};

const VECTOR_STORE_ID = 'vs_69175031dd44819181977702547d85e0';

export default async function handler(req) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { question, previous_response_id } = await req.json();

    if (!question || question.trim() === '') {
      return new Response(JSON.stringify({ error: 'Question is required' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    // Call OpenAI Responses API with streaming
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5.1',
        input: question,
        tools: [{
          type: 'file_search',
          vector_store_ids: [VECTOR_STORE_ID]
        }],
        previous_response_id: previous_response_id || undefined,
        store: true,
        stream: true, // Enable streaming
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return new Response(JSON.stringify({
        error: 'OpenAI API request failed',
        details: errorData
      }), {
        status: response.status,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    // Stream the response back to the client
    return new Response(response.body, {
      headers: {
        ...headers,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
}
