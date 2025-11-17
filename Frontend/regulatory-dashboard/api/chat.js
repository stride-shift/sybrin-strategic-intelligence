/**
 * Vercel Edge Function for Sybrin Research Assistant Chat
 * Proxies to Supabase Edge Function with streaming support
 */

export const config = {
  runtime: 'edge',
};

const SUPABASE_EDGE_FUNCTION_URL = 'https://dhknuansbbqojyzbkvui.supabase.co/functions/v1/query-research';

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

    // Call Supabase Edge Function with streaming enabled
    const response = await fetch(SUPABASE_EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question,
        stream: true, // Enable streaming
        previous_response_id: previous_response_id || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Supabase Edge Function error:', errorData);
      return new Response(JSON.stringify({
        error: 'Research query failed',
        details: errorData
      }), {
        status: response.status,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    // Proxy the streaming response from Supabase
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
