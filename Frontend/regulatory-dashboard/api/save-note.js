import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { noteName, question, answer, sources } = req.body;

    if (!noteName || !question || !answer) {
      return res.status(400).json({
        error: 'Missing required fields: noteName, question, and answer are required'
      });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert the note
    const { data, error } = await supabase
      .from('sy2_research_notes')
      .insert([
        {
          note_name: noteName,
          question: question,
          answer: answer,
          sources: sources || []
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to save note', details: error.message });
    }

    return res.status(200).json({
      success: true,
      note: data
    });

  } catch (error) {
    console.error('Error saving note:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
