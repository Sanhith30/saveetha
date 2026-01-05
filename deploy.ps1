# Faculty Rating System Deployment Script for Windows
# PowerShell script to prepare and deploy the application

Write-Host "🚀 Faculty Rating System - Deployment Preparation" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if git is installed
try {
    git --version | Out-Null
    Write-Host "✅ Git is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "⚠️  Git not initialized. Initializing..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
}

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  You have uncommitted changes. Committing them..." -ForegroundColor Yellow
    git add .
    $commitMessage = "Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git commit -m $commitMessage
    Write-Host "✅ Changes committed" -ForegroundColor Green
}

# Check if remote origin exists
try {
    git remote get-url origin | Out-Null
    Write-Host "✅ Remote origin is configured" -ForegroundColor Green
} catch {
    Write-Host "❌ No remote origin set. Please set up your GitHub repository first:" -ForegroundColor Red
    Write-Host "1. Create a new repository on GitHub" -ForegroundColor Yellow
    Write-Host "2. Run: git remote add origin https://github.com/YOUR_USERNAME/faculty-rating-system.git" -ForegroundColor Yellow
    Write-Host "3. Run this script again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
try {
    git push -u origin main
    Write-Host "✅ Code pushed to GitHub successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Push failed. Trying to set upstream..." -ForegroundColor Yellow
    git push --set-upstream origin main
}

Write-Host ""
Write-Host "🎯 DEPLOYMENT OPTIONS" -ForegroundColor Magenta
Write-Host "=====================" -ForegroundColor Magenta

Write-Host ""
Write-Host "📋 OPTION 1: Vercel (Recommended - Free)" -ForegroundColor Cyan
Write-Host "1. Go to https://vercel.com"
Write-Host "2. Sign in with GitHub"
Write-Host "3. Import your repository: faculty-rating-system"
Write-Host "4. Deploy frontend (client folder) and backend (server folder) separately"
Write-Host "5. Add environment variables (see DEPLOYMENT_GUIDE.md)"

Write-Host ""
Write-Host "📋 OPTION 2: Railway (Full-Stack)" -ForegroundColor Cyan
Write-Host "1. Go to https://railway.app"
Write-Host "2. Sign in with GitHub"
Write-Host "3. Create new project from GitHub repo"
Write-Host "4. Add environment variables"
Write-Host "5. Deploy both frontend and backend together"

Write-Host ""
Write-Host "📋 OPTION 3: Render (Free Tier)" -ForegroundColor Cyan
Write-Host "1. Go to https://render.com"
Write-Host "2. Sign in with GitHub"
Write-Host "3. Create Web Service for backend"
Write-Host "4. Create Static Site for frontend"
Write-Host "5. Configure build settings"

Write-Host ""
Write-Host "🔧 REQUIRED ENVIRONMENT VARIABLES:" -ForegroundColor Yellow
Write-Host "MONGODB_URI=mongodb+srv://saveetha_user:saveetha123@cluster1.ywacfnr.mongodb.net/saveetha_portal?retryWrites=true&w=majority&appName=Cluster1"
Write-Host "JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024"
Write-Host "ADMIN_EMAIL=admin@saveetha.ac.in"
Write-Host "ADMIN_PASSWORD=admin123"
Write-Host "NODE_ENV=production"

Write-Host ""
Write-Host "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Deployment preparation complete!" -ForegroundColor Green
Write-Host "⚠️  Remember to update MongoDB Atlas IP whitelist for production" -ForegroundColor Yellow

Read-Host "Press Enter to exit"