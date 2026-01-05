#!/bin/bash

# Faculty Rating System Deployment Script
echo "🚀 Starting Faculty Rating System Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_warning "Git not initialized. Initializing..."
    git init
    print_status "Git initialized"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Committing them..."
    git add .
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    print_status "Changes committed"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    print_error "No remote origin set. Please set up your GitHub repository first:"
    echo "1. Create a new repository on GitHub"
    echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/faculty-rating-system.git"
    echo "3. Run this script again"
    exit 1
fi

# Push to GitHub
print_status "Pushing to GitHub..."
git push -u origin main

print_status "Code pushed to GitHub successfully!"

echo ""
echo "🎯 Next Steps for Deployment:"
echo ""
echo "📋 OPTION 1: Deploy on Vercel (Recommended)"
echo "1. Go to https://vercel.com"
echo "2. Sign in with GitHub"
echo "3. Import your repository: faculty-rating-system"
echo "4. Configure environment variables:"
echo "   - MONGODB_URI: Your MongoDB Atlas connection string"
echo "   - JWT_SECRET: Your JWT secret key"
echo "   - ADMIN_EMAIL: admin@saveetha.ac.in"
echo "   - ADMIN_PASSWORD: Your admin password"
echo "5. Deploy!"
echo ""

echo "📋 OPTION 2: Deploy on Railway"
echo "1. Go to https://railway.app"
echo "2. Sign in with GitHub"
echo "3. Create new project from GitHub repo"
echo "4. Add environment variables (same as above)"
echo "5. Deploy!"
echo ""

echo "📋 OPTION 3: Deploy on Render"
echo "1. Go to https://render.com"
echo "2. Sign in with GitHub"
echo "3. Create new Web Service"
echo "4. Connect your repository"
echo "5. Set build command: cd server && npm install"
echo "6. Set start command: cd server && npm start"
echo "7. Add environment variables"
echo "8. Deploy!"
echo ""

echo "🔧 Environment Variables Needed:"
echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/saveetha_portal"
echo "JWT_SECRET=your_super_secret_jwt_key"
echo "ADMIN_EMAIL=admin@saveetha.ac.in"
echo "ADMIN_PASSWORD=your_secure_password"
echo "NODE_ENV=production"
echo ""

print_status "Deployment preparation complete!"
print_warning "Remember to update your MongoDB Atlas IP whitelist to allow connections from your deployment platform"