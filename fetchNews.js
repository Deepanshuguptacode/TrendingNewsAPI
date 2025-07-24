// File: fetchNews.js
// Express API for fetching trending news from NDTV India

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
  origin: [
    'https://voxveritas-backend.vercel.app',
    'https://voxveritas.vercel.app',
    'https://voxveritas.me',
    'https://www.voxveritas.me',
    'http://localhost:3000',
    'http://localhost:4000'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Fetch main image and full description from individual article page via Open Graph tags
async function fetchArticleDetails(url) {
  try {
    const { data: html } = await axios.get(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 8000, // 8 second timeout
      maxRedirects: 3
    });
    const $ = cheerio.load(html);
    const image = $('meta[property="og:image"]').attr('content') || '';
    const description = $('meta[property="og:description"]').attr('content') || '';
    return { image, description };
  } catch (error) {
    console.warn(`Failed to fetch details for ${url}:`, error.message);
    return { image: '', description: '' };
  }
}

async function scrapeNews() {
  try {
    const { data: html } = await axios.get('https://www.ndtv.com/india?pfrom=home-ndtv_mainnavigation', {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000, // 10 second timeout
      maxRedirects: 3
    });
    const $ = cheerio.load(html);
    const articles = [];

    // Collect headlines and list-page summary
    $('h2').each((i, elem) => {
      const titleElem = $(elem).find('a').first();
      const title = titleElem.text().trim();
      const link = titleElem.attr('href');
      if (!title || !link || !link.startsWith('http')) return;
      // Summary from list page
      let summary = $(elem).next('p').text().trim();
      if (!summary) {
        summary = $(elem).next().find('p').first().text().trim();
      }
      articles.push({ title, link, summary });
    });

    if (articles.length === 0) {
      throw new Error('No articles found - selectors may need updating.');
    }

    // Limit article count for Vercel performance (reduced for faster execution)
    const maxCount = 10; // Reduced from 20 to 10 for faster execution
    const toFetch = articles.slice(0, maxCount);

    // Fetch full page details with limited concurrency to avoid overwhelming the server
    const concurrencyLimit = 3; // Process only 3 articles at a time
    const chunks = [];
    for (let i = 0; i < toFetch.length; i += concurrencyLimit) {
      chunks.push(toFetch.slice(i, i + concurrencyLimit));
    }

    for (const chunk of chunks) {
      await Promise.all(chunk.map(async art => {
        try {
          const details = await fetchArticleDetails(art.link);
          art.image = details.image;
          art.description = details.description || art.summary;
        } catch (error) {
          console.warn(`Failed to process article: ${art.title}`, error.message);
          art.image = '';
          art.description = art.summary;
        }
      }));
    }

    // Format articles according to the required structure
    const formattedArticles = toFetch.map(art => ({
      title: art.title,
      link: art.link,
      image: art.image,
      description: art.description,
      source: 'NDTV',
      category: 'India'
    }));

    return formattedArticles;
  } catch (error) {
    throw new Error(`Error during scraping: ${error.message}`);
  }
}

// API Routes

// GET /api/news - Fetch latest news in JSON format
app.get('/api/news', async (req, res) => {
  // Set cache headers for better performance
  res.set({
    'Cache-Control': 'public, max-age=300', // 5 minutes cache
    'X-API-Version': '1.0.0',
    'X-Powered-By': 'Vercel'
  });

  try {
    const startTime = Date.now();
    const articles = await scrapeNews();
    const endTime = Date.now();
    
    res.json({
      success: true,
      count: articles.length,
      data: articles,
      timestamp: new Date().toISOString(),
      executionTime: `${endTime - startTime}ms`
    });
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET / - API info
app.get('/', (req, res) => {
  res.json({
    message: 'Trending News API',
    version: '1.0.0',
    endpoints: {
      '/api/news': 'GET - Fetch latest NDTV India news in JSON format'
    },
    example: {
      title: 'Article Title',
      link: 'https://example.com/article',
      image: 'https://example.com/image.jpg',
      description: 'Article description',
      source: 'NDTV',
      category: 'India'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Trending News API is running on port ${PORT}`);
  console.log(`📱 Access API at: http://localhost:${PORT}/api/news`);
  console.log(`📚 API docs at: http://localhost:${PORT}/`);
});

module.exports = app;
