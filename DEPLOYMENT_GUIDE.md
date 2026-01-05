# Faculty Rating System - Complete Deployment Guide

## 🚀 Step-by-Step Deployment Process

### Prerequisites
- GitHub account
- MongoDB Atlas account (already set up)
- Deployment platform account (Vercel/Railway/Render)

---

## Step 1: Prepare Your Code for Git

### 1.1 Check Git Status
```bash
# Navigate to your project root
cd /path/to/your/faculty-rating-system

# Check if git is initialized
git status
```

### 1.2 Initialize Git (if needed)
```bash
git init
git add .
git commit -m "Initial commit: Faculty Rating System with 163 faculty members"
```

---

## Step 2: Create GitHub Repository

### 2.1 Create Repository on GitHub
1. Go to [GitHub.com](https://github.com)
2. Click "New Repository"
3. Repository name: `faculty-rating-system`
4. Description: `Faculty Rating Portal for Saveetha School of Engineering`
5. Set to Public or Private
6. **Don't** initialize with README (you have existing code)
7. Click "Create Repository"

### 2.2 Connect Local Repository to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/faculty-rating-system.git
git branch -M main
git push -u origin main
```

---

## Step 3: Choose Deployment Platform

## 🌟 OPTION A: Vercel (Recommended - Free Tier Available)

### Why Vercel?
- ✅ Free tier with good limits
- ✅ Automatic deployments from Git
- ✅ Built-in CI/CD
- ✅ Global CDN
- ✅ Easy environment variable management

### Vercel Deployment Steps:

#### 3.1 Deploy Frontend (React)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `faculty-rating-system` repository
5. Configure project:
   - **Framework Preset:** Create React App
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
6. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app/api
   ```
7. Click "Deploy"

#### 3.2 Deploy Backend (Node.js)
1. Create another Vercel project for backend
2. Import same repository
3. Configure project:
   - **Framework Preset:** Other
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Output Directory:** Leave empty
4. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://saveetha_user:saveetha123@cluster1.ywacfnr.mongodb.net/saveetha_portal?retryWrites=true&w=majority&appName=Cluster1
   JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
   NODE_ENV=production
   ADMIN_EMAIL=admin@saveetha.ac.in
   ADMIN_PASSWORD=admin123
   ```
5. Click "Deploy"

#### 3.3 Update Frontend API URL
1. Go to your frontend Vercel project
2. Update environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-project.vercel.app/api
   ```
3. Redeploy

---

## 🚂 OPTION B: Railway (Full-Stack in One Project)

### Why Railway?
- ✅ Deploy both frontend and backend together
- ✅ Built-in database hosting
- ✅ Simple configuration
- ✅ $5/month starter plan

### Railway Deployment Steps:

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `faculty-rating-system` repository
6. Railway will auto-detect and deploy both services
7. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://saveetha_user:saveetha123@cluster1.ywacfnr.mongodb.net/saveetha_portal?retryWrites=true&w=majority&appName=Cluster1
   JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
   NODE_ENV=production
   ADMIN_EMAIL=admin@saveetha.ac.in
   ADMIN_PASSWORD=admin123
   PORT=5000
   ```
8. Deploy!

---

## 🎨 OPTION C: Render (Free Tier Available)

### Render Deployment Steps:

#### 3.1 Deploy Backend
1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name:** faculty-rating-backend
   - **Root Directory:** `server`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add Environment Variables (same as above)
7. Deploy

#### 3.2 Deploy Frontend
1. Create new "Static Site"
2. Connect same repository
3. Configure:
   - **Name:** faculty-rating-frontend
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `build`
4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://faculty-rating-backend.onrender.com/api
   ```
5. Deploy

---

## Step 4: Configure MongoDB Atlas for Production

### 4.1 Update Network Access
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to "Network Access"
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (0.0.0.0/0)
5. Click "Confirm"

### 4.2 Verify Connection String
Your current connection string should work:
```
mongodb+srv://saveetha_user:saveetha123@cluster1.ywacfnr.mongodb.net/saveetha_portal?retryWrites=true&w=majority&appName=Cluster1
```

---

## Step 5: Test Your Deployment

### 5.1 Test Backend API
```bash
# Replace with your actual backend URL
curl https://your-backend-url.com/api/health
```

### 5.2 Test Frontend
1. Open your frontend URL in browser
2. Try logging in as admin
3. Test faculty search functionality
4. Verify faculty data is loading

### 5.3 Test Full Flow
1. Register as a student
2. Search for faculty
3. Rate a faculty member
4. Check admin panel for ratings

---

## Step 6: Custom Domain (Optional)

### 6.1 Purchase Domain
- Namecheap, GoDaddy, or Google Domains
- Suggested: `saveetha-faculty-portal.com`

### 6.2 Configure DNS
1. In your deployment platform, add custom domain
2. Update DNS records as instructed
3. SSL certificate will be auto-generated

---

## Step 7: Monitoring & Maintenance

### 7.1 Set Up Monitoring
- Enable error tracking
- Set up uptime monitoring
- Configure email alerts

### 7.2 Regular Updates
```bash
# To update your deployment
git add .
git commit -m "Update: description of changes"
git push origin main
# Auto-deployment will trigger
```

---

## 🎯 Quick Start Commands

### For Git Setup:
```bash
git init
git add .
git commit -m "Initial commit: Faculty Rating System"
git remote add origin https://github.com/YOUR_USERNAME/faculty-rating-system.git
git push -u origin main
```

### For Local Testing:
```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend  
cd client
npm install
npm start
```

---

## 🔧 Environment Variables Reference

### Backend (.env):
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://saveetha_user:saveetha123@cluster1.ywacfnr.mongodb.net/saveetha_portal?retryWrites=true&w=majority&appName=Cluster1
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
ADMIN_EMAIL=admin@saveetha.ac.in
ADMIN_PASSWORD=admin123
```

### Frontend:
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## 🚨 Security Checklist

- ✅ Environment variables are not committed to Git
- ✅ MongoDB Atlas has proper network restrictions
- ✅ JWT secret is strong and unique
- ✅ Admin password is secure
- ✅ HTTPS is enabled on deployment
- ✅ CORS is properly configured

---

## 📞 Support & Troubleshooting

### Common Issues:

1. **CORS Errors:** Update CORS configuration in server/index.js
2. **Database Connection:** Check MongoDB Atlas network access
3. **Environment Variables:** Verify all required variables are set
4. **Build Failures:** Check Node.js version compatibility

### Getting Help:
- Check deployment platform documentation
- Review application logs
- Test API endpoints individually
- Verify database connectivity

---

## 🎉 Success!

Once deployed, your Faculty Rating System will be live with:
- ✅ 163 faculty members from all departments
- ✅ Student registration and login
- ✅ Faculty search and rating system
- ✅ Admin panel for management
- ✅ Real-time updates
- ✅ Mobile-responsive design

**Your live application URLs:**
- Frontend: `https://your-frontend-url.com`
- Backend API: `https://your-backend-url.com/api`
- Admin Panel: `https://your-frontend-url.com/admin`

**Default Admin Login:**
- Email: admin@saveetha.ac.in
- Password: admin123

Remember to change the admin password after first login!