/**
 * Vercel Edge Function for Sybrin Research Assistant Chat
 * Uses OpenAI GPT-5.1 with File Search (Responses API)
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VECTOR_STORE_ID = 'vs_69175031dd44819181977702547d85e0';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    const { question, previous_response_id } = await req.json();

    if (!question || question.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Question is required' }),
        { status: 400, headers }
      );
    }

    // Call OpenAI Responses API
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
        store: true, // Keep conversation state
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'OpenAI API request failed', details: errorData }),
        { status: response.status, headers }
      );
    }

    const data = await response.json();

    // Parse response
    let responseText = '';
    const citations = [];

    if (data.output_text) {
      responseText = data.output_text;
    } else if (data.output && Array.isArray(data.output)) {
      for (const item of data.output) {
        if (item.type === 'text') {
          responseText += item.text || '';
        } else if (item.type === 'file_search_call' && item.results) {
          for (const result of item.results) {
            citations.push({
              file_id: result.file_id || 'unknown',
              content: result.content ? result.content.substring(0, 200) : '',
              file_name: result.file_name || 'Unknown Document'
            });
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        answer: responseText,
        citations: citations,
        response_id: data.id,
        status: data.status,
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers }
    );
  }
}
