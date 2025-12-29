import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { enhanceArticle, generateSearchQueries } from '@/lib/llm';
import { searchGoogle, scrapeExternalArticle } from '@/lib/search';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Fetch the original article
    const { data: article, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Generate search queries based on title
    const queries = await generateSearchQueries(article.title);
    // console.log('Generated queries:', queries);

    // Search Google for each query and collect URLs
    const allResults: { url: string; title: string }[] = [];
    for (const query of queries) {
      const results = await searchGoogle(query);
      allResults.push(...results.map(r => ({ url: r.url, title: r.title })));
    }

    // Remove duplicates and limit
    const uniqueUrls = [...new Set(allResults.map(r => r.url))].slice(0, 5);
    // console.log('URLs to scrape:', uniqueUrls);

    // Scrape external articles
    const referenceTexts: string[] = [];
    for (const url of uniqueUrls) {
      const content = await scrapeExternalArticle(url);
      if (content) {
        referenceTexts.push(content);
      }
    }

    // Enhance the article using LLM
    const enhancedContent = await enhanceArticle(article.content, referenceTexts);

    // Create the enhanced version as a new article
    const { data: newArticle, error: insertError } = await supabase
      .from('articles')
      .insert({
        title: article.title,
        content: enhancedContent,
        source_url: article.source_url,
        is_updated: true,
        original_id: article.id,
        reference_links: uniqueUrls.map((url, i) => ({
          url,
          title: allResults.find(r => r.url === url)?.title || `Reference ${i + 1}`
        }))
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      original: article,
      enhanced: newArticle,
      references: uniqueUrls
    });

  } catch (error: any) {
    console.error('Enhancement error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
