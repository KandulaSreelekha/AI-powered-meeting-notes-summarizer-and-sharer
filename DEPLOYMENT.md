# 🚀 Deployment Guide

This guide will help you deploy the Notes Summarizer application to production.

## 📋 Prerequisites

Before deploying, make sure you have:

1. **Groq API Key**: Get one from [Groq Console](https://console.groq.com/)
2. **Gmail Account**: For email functionality (with App Password)
3. **GitHub Account**: To host your code
4. **Vercel Account**: For frontend deployment (free tier available)
5. **Railway/Render Account**: For backend deployment (free tier available)

## 🎯 Deployment Strategy

We'll deploy the application using a **monorepo approach**:
- **Frontend**: Deploy to Vercel (React app)
- **Backend**: Deploy to Railway or Render (Node.js API)

## 📦 Step 1: Prepare Your Code

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/notes-summarizer.git
   git push -u origin main
   ```

2. **Verify your repository structure**
   ```
   notes-summarizer/
   ├── client/          # React frontend
   ├── server/          # Node.js backend
   ├── package.json     # Root package.json
   └── README.md
   ```

## 🌐 Step 2: Deploy Backend (Railway)

### Option A: Railway (Recommended)

1. **Visit Railway**
   - Go to [railway.app](https://railway.app/)
   - Sign up with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `notes-summarizer` repository

3. **Configure Deployment**
   - Set **Root Directory** to `server`
   - Set **Build Command** to `npm install`
   - Set **Start Command** to `npm start`

4. **Add Environment Variables**
   - Go to the "Variables" tab
   - Add the following variables:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   NODE_ENV=production
   ```

5. **Deploy**
   - Railway will automatically deploy your backend
   - Note the generated URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. **Visit Render**
   - Go to [render.com](https://render.com/)
   - Sign up with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - **Name**: `notes-summarizer-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables**
   - Go to "Environment" tab
   - Add the same variables as above

5. **Deploy**
   - Click "Create Web Service"
   - Note the generated URL

## 🎨 Step 3: Deploy Frontend (Vercel)

1. **Visit Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Sign up with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Import your `notes-summarizer` repository

3. **Configure Build Settings**
   - **Framework Preset**: Other
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   - Go to "Environment Variables"
   - Add:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend

## 🔧 Step 4: Update Frontend API URL

After deploying the backend, you need to update the frontend to use the production API URL.

1. **Update API calls in the frontend**
   
   Edit `client/src/App.tsx` and replace the fetch calls:
   
   ```typescript
   // Replace this:
   const response = await fetch('/api/summarize', {
   
   // With this:
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   const response = await fetch(`${API_URL}/api/summarize`, {
   ```

2. **Redeploy frontend**
   - Commit and push your changes
   - Vercel will automatically redeploy

## 🔒 Step 5: Security Configuration

### CORS Configuration

Update your backend CORS settings in `server/index.js`:

```javascript
// Replace the current CORS configuration with:
app.use(cors({
  origin: [
    'https://your-frontend-domain.vercel.app',
    'http://localhost:3000' // for development
  ],
  credentials: true
}));
```

### Environment Variables Checklist

Make sure all these are set in your backend deployment:

- ✅ `GROQ_API_KEY`
- ✅ `EMAIL_USER`
- ✅ `EMAIL_PASS`
- ✅ `NODE_ENV=production`
- ✅ `PORT` (usually auto-set)

## 🧪 Step 6: Testing Your Deployment

1. **Test Backend Health**
   ```bash
   curl https://your-backend-url.railway.app/api/health
   ```

2. **Test Frontend**
   - Visit your Vercel URL
   - Try uploading some text and generating a summary
   - Test the email sharing functionality

3. **Common Issues**
   - **CORS errors**: Check your CORS configuration
   - **API not found**: Verify the API URL in your frontend
   - **Email not working**: Check your Gmail App Password

## 📊 Step 7: Monitoring and Maintenance

### Railway/Render Monitoring
- Check your service logs regularly
- Monitor API usage and costs
- Set up alerts for downtime

### Vercel Analytics
- Enable Vercel Analytics for frontend monitoring
- Track user interactions and performance

## 🔄 Continuous Deployment

Both Vercel and Railway/Render support automatic deployments:
- Every push to your `main` branch will trigger a new deployment
- You can set up preview deployments for pull requests

## 💰 Cost Optimization

### Free Tier Limits
- **Vercel**: Unlimited deployments, 100GB bandwidth/month
- **Railway**: $5 credit/month (usually sufficient for small apps)
- **Render**: Free tier with some limitations

### Scaling Considerations
- Monitor your Groq API usage and costs
- Consider implementing caching for repeated requests
- Use environment-specific configurations

## 🆘 Troubleshooting

### Backend Issues
1. **Service not starting**
   - Check your `package.json` start script
   - Verify all dependencies are installed
   - Check environment variables

2. **API errors**
   - Check Railway/Render logs
   - Verify your Groq API key is valid
   - Test locally first

### Frontend Issues
1. **Build failures**
   - Check Vercel build logs
   - Verify all dependencies are in `package.json`
   - Check for TypeScript errors

2. **API connection issues**
   - Verify the API URL is correct
   - Check CORS configuration
   - Test API endpoints directly

## 📞 Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify all environment variables are set correctly
3. Test locally to isolate the issue
4. Check the troubleshooting section in the main README

---

**Your Notes Summarizer is now live! 🎉**

Share your deployed URL and start summarizing meeting notes!
