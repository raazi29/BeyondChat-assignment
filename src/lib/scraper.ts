import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedArticle {
  title: string;
  content: string;
  source_url: string;
}

export async function scrapeOldestArticles(limit: number = 5): Promise<ScrapedArticle[]> {
  try {
    const baseUrl = 'https://beyondchats.com/blogs/';
    const { data: mainData } = await axios.get(baseUrl);
    const $main = cheerio.load(mainData);

    // Find the last page number
    let lastPage = 1;
    $main('.page-numbers').each((i, el) => {
      const text = $main(el).text();
      const num = parseInt(text);
      if (!isNaN(num) && num > lastPage) {
        lastPage = num;
      }
    });

    // console.log(`Last page detected: ${lastPage}`);

    const articles: ScrapedArticle[] = [];
    let currentPage = lastPage;

    while (articles.length < limit && currentPage >= 1) {
      // console.log(`Scraping page: ${currentPage}`);
      const pageUrl = currentPage === 1 ? baseUrl : `${baseUrl}page/${currentPage}/`;

      try {
        const { data: pageData } = await axios.get(pageUrl);
        const $page = cheerio.load(pageData);

        const pageArticleLinks: string[] = [];
        $page('h2.entry-title a, article h2 a').each((i, el) => {
          const href = $page(el).attr('href');
          if (href) pageArticleLinks.push(href);
        });

        // Oldest articles are at the end of the last pages
        const linksToScrape = pageArticleLinks.reverse();

        for (const url of linksToScrape) {
          if (articles.length >= limit) break;

          // console.log(`Scraping article: ${url}`);
          try {
            const { data: articleData } = await axios.get(url);
            const $article = cheerio.load(articleData);

            const title = $article('h1.entry-title, .post-title, h1').first().text().trim();
            const $content = $article('.entry-content, article .content, .post-content').first();

            // Remove unwanted elements
            $content.find('script, style, iframe, .share-buttons, .related-posts, .comments, .metadata, .post-tags, .navigation').remove();

            // Replace block elements with newlines for better formatting
            $content.find('br').replaceWith('\n');
            $content.find('p, div, h1, h2, h3, h4, h5, h6, li').each((_, el) => {
              $article(el).append('\n');
            });

            // Extract text and clean up
            let content = $content.text();

            // Remove "0 0" artifacts and excess whitespace
            content = content
              .replace(/0\s+0\s*$/g, '')         // Remove trailing "0 0" artifact
              .replace(/[ \t]+/g, ' ')           // Collapse multiple spaces/tabs
              .replace(/[ \t]*\n[ \t]*/g, '\n')  // Trim around newlines
              .replace(/\n{3,}/g, '\n\n')        // Limit max newlines
              .trim();

            if (title && content) {
              articles.push({ title, content, source_url: url });
            }
          } catch (err) {
            console.error(`Error scraping article at ${url}:`, err);
          }
        }
      } catch (err) {
        console.error(`Error scraping page ${currentPage}:`, err);
      }

      currentPage--;
    }

    return articles;

  } catch (error) {
    console.error('Error in scrapeOldestArticles:', error);
    throw error;
  }
}
