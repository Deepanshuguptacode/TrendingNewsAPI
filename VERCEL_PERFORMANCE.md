# Vercel Scraping Performance Guide

## ✅ **Optimizations Made for Vercel**

### **Timeout Management**
- Main request: 10 second timeout
- Individual articles: 8 second timeout
- Function timeout: 25 seconds (max for Hobby plan)

### **Concurrency Control**
- Reduced article count: 10 instead of 20
- Limited concurrent requests: 3 at a time
- Chunked processing to avoid overwhelming target server

### **Error Handling**
- Individual article failures don't break entire request
- Graceful fallbacks for missing images/descriptions
- Detailed error logging

### **Performance Features**
- Cache headers (5-minute cache)
- Execution time tracking
- Better User-Agent headers
- Response compression

## 🚨 **Vercel Limitations to Consider**

### **Hobby Plan Limits**
- 10 second execution timeout
- 1024MB memory limit
- 100GB bandwidth/month
- Cold start delays

### **Pro Plan Limits**
- 30 second execution timeout
- 3008MB memory limit
- 1TB bandwidth/month

## 📊 **Expected Performance**

### **Typical Response Times**
- Cold start: 3-8 seconds
- Warm function: 1-3 seconds
- With 10 articles: ~2-5 seconds

### **Success Scenarios**
- ✅ NDTV site is responsive
- ✅ Network conditions are good
- ✅ Function is warm (recent request)

### **Failure Scenarios**
- ❌ NDTV blocks requests (429 errors)
- ❌ Network timeouts
- ❌ Vercel function timeout (25s exceeded)
- ❌ Memory limits exceeded

## 🔧 **Monitoring & Debugging**

### **Check Function Logs**
```bash
vercel logs your-project-name
```

### **Monitor Performance**
- Vercel dashboard shows execution time
- Check cold start frequency
- Monitor error rates

### **Response Headers**
- `executionTime`: Time taken to scrape
- `count`: Number of articles returned
- `timestamp`: When request was processed

## 🚀 **Deployment Tips**

1. **Test Locally First**
```bash
npm start
curl http://localhost:4000/api/news
```

2. **Deploy to Vercel**
```bash
vercel --prod
```

3. **Monitor Initial Deployment**
- Check logs for errors
- Test API endpoints
- Verify CORS settings

## 🔄 **Fallback Strategies**

If scraping fails frequently:
1. Implement caching layer (Redis/database)
2. Reduce article count further
3. Add retry logic with exponential backoff
4. Consider using a dedicated scraping service
