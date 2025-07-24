# Trending News API

A REST API built with Express.js that scrapes and serves trending news from NDTV India in JSON format.

## Features

- Fetches latest news headlines from NDTV India
- Returns structured JSON data with images and descriptions
- Built with Express.js and Cheerio for web scraping
- CORS enabled for cross-origin requests

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. For development with auto-restart:
```bash
npm run dev
```

## Deployment

### Deploy to Vercel
1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Deploy with one click!

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## API Endpoints

### GET `/api/news`

Fetches the latest news articles from NDTV India.

**Response Format:**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "title": "Article Title",
      "link": "https://www.ndtv.com/article-url",
      "image": "https://image-url.jpg",
      "description": "Article description",
      "source": "NDTV",
      "category": "India"
    }
  ],
  "timestamp": "2025-07-24T12:00:00.000Z"
}
```

### GET `/`

Returns API information and documentation.

## Usage Examples

### Fetch News
```bash
curl http://localhost:3000/api/news
```

### Using JavaScript Fetch
```javascript
fetch('http://localhost:3000/api/news')
  .then(response => response.json())
  .then(data => {
    console.log('Latest news:', data.data);
  });
```

## Environment Variables

- `PORT` - Server port (default: 3000)

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200` - Success
- `500` - Server error (scraping failed)

Error response format:
```json
{
  "success": false,
  "error": "Failed to fetch news",
  "message": "Detailed error message"
}
```

## Rate Limiting

The API fetches up to 20 articles per request to maintain performance. Each request scrapes fresh data from NDTV.

## Dependencies

- Express.js - Web framework
- Axios - HTTP client for web scraping
- Cheerio - Server-side HTML parsing
- CORS - Cross-origin resource sharing
