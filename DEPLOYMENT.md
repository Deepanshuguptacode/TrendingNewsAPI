# Vercel Deployment Guide

## Prerequisites
- Vercel account (https://vercel.com)
- Git repository pushed to GitHub/GitLab/Bitbucket

## Deployment Steps

### Option 1: Deploy via Vercel CLI
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from project directory:
```bash
vercel
```

4. Follow the prompts and confirm deployment

### Option 2: Deploy via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your Git repository
4. Vercel will auto-detect the configuration
5. Click "Deploy"

## Environment Variables (if needed)
Add these in Vercel dashboard under Project Settings > Environment Variables:
- `NODE_ENV=production`

## Custom Domain (Optional)
1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

## API Endpoints after deployment
- Main API: `https://your-project.vercel.app/api/news`
- Documentation: `https://your-project.vercel.app/`

## Notes
- Vercel automatically handles serverless functions
- The API will be available globally via CDN
- Cold starts may cause slight delay on first request
- CORS is configured for your specified domains
