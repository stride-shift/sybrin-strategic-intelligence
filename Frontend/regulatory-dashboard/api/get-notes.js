import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all notes, ordered by created_at descending
    const { data, error } = await supabase
      .from('sy2_research_notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch notes', details: error.message });
    }

    return res.status(200).json({
      success: true,
      notes: data || []
    });

  } catch (error) {
    console.error('Error fetching notes:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
