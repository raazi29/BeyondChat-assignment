import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { scrapeOldestArticles } from '@/lib/scraper';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const is_updated = searchParams.get('is_updated');
  
  let query = supabase.from('articles').select('*').order('created_at', { ascending: false });
  
  if (is_updated !== null) {
    query = query.eq('is_updated', is_updated === 'true');
  }
  
  const { data, error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Check if it's a request to scrape
    if (body.action === 'scrape') {
      const scraped = await scrapeOldestArticles(5);
      
      const { data, error } = await supabase.from('articles').insert(
        scraped.map(a => ({
          title: a.title,
          content: a.content,
          source_url: a.source_url,
          is_updated: false
        }))
      ).select();
      
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data, { status: 201 });
    }
    
    // Manual creation
    const { data, error } = await supabase.from('articles').insert([{
      title: body.title,
      content: body.content,
      source_url: body.source_url,
      is_updated: body.is_updated || false,
      original_id: body.original_id || null,
      reference_links: body.reference_links || []
    }]).select();
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data[0], { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
