# 🚀 PitchBridge Deployment Guide

This guide will help you deploy your PitchBridge application to production using Render for the backend and Netlify/Vercel for the frontend.

## 📋 Prerequisites

- GitHub account
- Render account (free tier available)
- Netlify or Vercel account (free tier available)
- MongoDB Atlas account (free tier available)

## 🗃️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login to your account
3. Create a new project: "PitchBridge"
4. Build a database (choose FREE tier)
5. Select cloud provider and region
6. Create cluster

### 2. Configure Database Access

1. **Database Access**:
   - Go to "Database Access" in left sidebar
   - Add New Database User
   - Username: `pitchbridge_user`
   - Password: Generate secure password
   - Database User Privileges: Read and write to any database

2. **Network Access**:
   - Go to "Network Access" in left sidebar
   - Add IP Address
   - Choose "Allow access from anywhere" (0.0.0.0/0) for deployment
   - Or add your Render deployment IP

3. **Get Connection String**:
   - Go to "Databases" → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## 🔧 Backend Deployment (Render)

### 1. Prepare Your Repository

```bash
# Make sure your project is pushed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Render

1. **Create Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select repository: `startup_official`

2. **Configure Service**:
   ```
   Name: pitchbridge-backend
   Environment: Node
   Region: Oregon (or closest to you)
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

3. **Add Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

   **Important**: 
   - Replace `your_mongodb_connection_string_here` with your Atlas connection string
   - Generate a strong JWT secret (you can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")`)

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your backend URL will be: `https://pitchbridge-backend.onrender.com`

## 🌐 Frontend Deployment

### Option A: Netlify (Recommended)

1. **Connect Repository**:
   - Go to [Netlify](https://www.netlify.com/)
   - Sign up/Login
   - "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select `startup_official` repository

2. **Configure Build Settings**:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

3. **Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add variable:
     ```
     VITE_API_BASE_URL=https://pitchbridge-backend.onrender.com
     ```

4. **Deploy**:
   - Click "Deploy site"
   - Your frontend will be available at: `https://your-site-name.netlify.app`

### Option B: Vercel

1. **Import Project**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - "Add New..." → "Project"
   - Import from GitHub: `startup_official`

2. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Environment Variables**:
   ```env
   VITE_API_BASE_URL=https://pitchbridge-backend.onrender.com
   ```

4. **Deploy**:
   - Click "Deploy"
   - Your frontend will be available at: `https://your-project.vercel.app`

## 🔄 Post-Deployment Configuration

### 1. Update Backend CORS

Update your backend `server.mjs` to include your frontend domain:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend-domain.netlify.app", // Add your actual domain
      "https://your-project.vercel.app" // Or your Vercel domain
    ],
    credentials: true,
  })
);
```

### 2. Test Your Deployment

1. **Backend Health Check**:
   - Visit: `https://pitchbridge-backend.onrender.com`
   - Should see: "🌉 PitchBridge API is running..."

2. **Frontend Check**:
   - Visit your frontend URL
   - Test user registration/login
   - Check if API calls work

## 🔍 Monitoring & Debugging

### Backend Logs (Render)
- Go to your service dashboard on Render
- Click "Logs" tab to view real-time logs
- Monitor for errors and performance issues

### Frontend Logs (Netlify/Vercel)
- Check deploy logs in your hosting provider dashboard
- Use browser dev tools for client-side debugging

### Common Issues & Solutions

1. **CORS Errors**:
   - Ensure frontend domain is added to CORS whitelist
   - Check environment variables are set correctly

2. **Database Connection Issues**:
   - Verify MongoDB connection string
   - Check database user permissions
   - Ensure IP whitelist includes 0.0.0.0/0

3. **Build Failures**:
   - Check Node.js version compatibility
   - Verify package.json scripts
   - Clear and reinstall dependencies

## 🔄 Continuous Deployment

### Auto-Deploy Setup
Both Render and Netlify/Vercel support automatic deployment:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Automatic Deployment**:
   - Backend redeploys automatically on Render
   - Frontend redeploys automatically on Netlify/Vercel

### Environment-Specific Deployments

Consider creating different branches for different environments:
- `main` → Production
- `staging` → Staging environment
- `development` → Development environment

## 📱 Domain Configuration (Optional)

### Custom Domain Setup

1. **Purchase Domain** (GoDaddy, Namecheap, etc.)

2. **Configure DNS**:
   - **Frontend**: Follow Netlify/Vercel custom domain guides
   - **Backend**: Use Render's custom domain feature

3. **Update Environment Variables**:
   - Update `VITE_API_BASE_URL` to use your custom backend domain
   - Update CORS settings with new domains

## 🔒 Security Checklist

- [ ] Environment variables are set (not hardcoded)
- [ ] JWT secret is secure and unique
- [ ] Database user has minimal required permissions
- [ ] CORS is configured properly
- [ ] HTTPS is enabled (automatic with Render/Netlify/Vercel)
- [ ] Database IP whitelist is configured

## 📞 Support

If you encounter issues:

1. Check the logs in your deployment platform
2. Verify environment variables
3. Test locally to isolate the issue
4. Check the troubleshooting section in README.md

## 🎉 Success!

Once deployed, your PitchBridge application will be:
- **Backend**: Available 24/7 on Render
- **Frontend**: Globally distributed via CDN
- **Database**: Managed and backed up by MongoDB Atlas

Your startup pitch platform is now live and ready for users! 🚀