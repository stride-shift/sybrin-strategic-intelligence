/**
 * Vercel Serverless Function for Sybrin Research Assistant Chat
 * Proxies to Supabase Edge Function with GPT-5.1 Vector Store
 */

const SUPABASE_EDGE_FUNCTION_URL = 'https://dhknuansbbqojyzbkvui.supabase.co/functions/v1/query-research';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, previous_response_id } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Call Supabase Edge Function
    const response = await fetch(SUPABASE_EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question,
        previous_response_id: previous_response_id || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Supabase Edge Function error:', errorData);
      return res.status(response.status).json({
        error: 'Research query failed',
        details: errorData
      });
    }

    const data = await response.json();

    return res.status(200).json({
      answer: data.answer || '',
      citations: data.citations || [],
      response_id: data.response_id,
      status: data.status,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
