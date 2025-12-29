import axios from 'axios';
import * as cheerio from 'cheerio';

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export async function searchGoogle(query: string): Promise<SearchResult[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const { data } = await axios.get(
      `https://www.google.com/search?q=${encodedQuery}&num=5`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        }
      }
    );

    const $ = cheerio.load(data);
    const results: SearchResult[] = [];

    $('div.g').each((i, el) => {
      const titleEl = $(el).find('h3').first();
      const linkEl = $(el).find('a').first();
      const snippetEl = $(el).find('div[data-sncf], div.VwiC3b').first();

      const title = titleEl.text();
      const url = linkEl.attr('href') || '';
      const snippet = snippetEl.text();

      if (title && url && url.startsWith('http') && !url.includes('google.com')) {
        results.push({ title, url, snippet });
      }
    });

    return results.slice(0, 5);
  } catch (error) {
    console.error('Google search error:', error);
    return [];
  }
}

export async function scrapeExternalArticle(url: string): Promise<string> {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    // Remove script, style, nav, footer elements
    $('script, style, nav, footer, header, aside, .sidebar, .comments, .advertisement').remove();

    // Try to find the main content
    const selectors = [
      'article',
      'main',
      '.post-content',
      '.entry-content',
      '.article-content',
      '.content',
      '[role="main"]'
    ];

    let content = '';
    for (const selector of selectors) {
      const text = $(selector).text().trim();
      if (text.length > content.length) {
        content = text;
      }
    }

    // Fallback to body if nothing found
    if (!content) {
      content = $('body').text().trim();
    }

    // Clean up whitespace
    content = content.replace(/\s+/g, ' ').trim();

    return content.slice(0, 5000); // Limit to 5000 chars
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return '';
  }
}
