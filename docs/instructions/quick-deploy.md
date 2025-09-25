# 🚀 Quick Deploy: Optimizer to optimizer.kervinapps.com

## Step 1: Create GitHub Repository (2 minutes)

1. **Go to GitHub**: https://github.com/new
2. **Repository name**: `Optimizer`
3. **Description**: `Advanced personal time management and schedule optimization application`
4. **Visibility**: Public (or Private - your choice)
5. **Don't initialize** with README, .gitignore, or license (we already have these)
6. **Click "Create repository"**

## Step 2: Connect & Push (1 minute)

Copy and paste these commands in your terminal:

```bash
# Make sure you're in the Optimizer directory
cd /Users/kervinleacock/Documents/Development/Optimizer

# Add your GitHub repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/Optimizer.git

# Push to GitHub
git push -u origin main
```

## Step 3: Deploy to Netlify (3 minutes)

1. **Go to Netlify**: https://app.netlify.com/
2. **Click**: "New site from Git"
3. **Choose**: GitHub
4. **Select**: Your "Optimizer" repository
5. **Build settings** (should auto-detect):
   - Build command: `npm run build`
   - Publish directory: `build`
6. **Click**: "Deploy site"

## Step 4: Set Custom Domain (2 minutes)

1. **In Netlify**: Go to Site settings → Domain management
2. **Click**: "Add custom domain"
3. **Enter**: `optimizer.kervinapps.com`
4. **Add DNS Record** in your domain provider:
   ```
   Type: CNAME
   Name: optimizer
   Value: [your-netlify-site-name].netlify.app
   ```

## 🎯 Result

- **Toronto Guide**: `kervinapps.com` (unchanged)
- **Optimizer**: `optimizer.kervinapps.com` (new!)

## ⚡ Total Time: ~8 minutes

Your Optimizer app will be live at `optimizer.kervinapps.com` with zero impact on your existing Toronto Guide!
