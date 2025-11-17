/**
 * Vercel Serverless Function for Sybrin Research Assistant Chat
 * Uses OpenAI GPT-5.1 with File Search (Responses API)
 */

const VECTOR_STORE_ID = 'vs_69175031dd44819181977702547d85e0';

export default async function handler(req, res) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
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
      return res.status(response.status).json({
        error: 'OpenAI API request failed',
        details: errorData
      });
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

    return res.status(200).json({
      answer: responseText,
      citations: citations,
      response_id: data.id,
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
