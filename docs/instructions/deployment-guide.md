# Optimizer Deployment Guide

## 🌐 Subdomain Deployment: optimizer.kervinapps.com

This guide walks you through deploying Optimizer to `optimizer.kervinapps.com` without impacting your existing Toronto Guide at `kervinapps.com`.

## ✅ Pre-Configuration Complete

The following has been configured for you:

- ✅ **Homepage URL**: Set to `https://optimizer.kervinapps.com`
- ✅ **Netlify Config**: Created with SPA routing and security headers
- ✅ **Build Process**: Tested and working
- ✅ **Manifest**: Updated with proper branding
- ✅ **SEO**: Meta descriptions and robots.txt configured

## 🚀 Deployment Steps

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. **Repository Name**: `Optimizer`
3. **Visibility**: Public or Private (your choice)
4. **Initialize**: Don't initialize (we already have files)

### Step 2: Connect Local Repository to GitHub

```bash
# In your Optimizer directory
cd /Users/kervinleacock/Documents/Development/Optimizer

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/Optimizer.git

# Push to GitHub
git push -u origin main
```

### Step 3: Deploy to Netlify

1. **Login to Netlify**: Go to [netlify.com](https://netlify.com)
2. **New Site**: Click "New site from Git"
3. **Connect Repository**: Select your new Optimizer repository
4. **Build Settings**:
   - **Build command**: `npm run build` (auto-detected)
   - **Publish directory**: `build` (auto-detected)
   - **Node version**: 18 (configured in netlify.toml)

### Step 4: Configure Custom Domain

1. **In Netlify Dashboard**: Go to Site settings → Domain management
2. **Add custom domain**: `optimizer.kervinapps.com`
3. **DNS Configuration**: Add CNAME record in your domain provider:
   ```
   CNAME: optimizer → your-netlify-site.netlify.app
   ```

### Step 5: Enable HTTPS

1. **SSL Certificate**: Netlify will automatically provision Let's Encrypt SSL
2. **Force HTTPS**: Enable in Site settings → Domain management

## 🔧 Build Commands

```bash
# Development
npm start                    # Start dev server at localhost:3000

# Production
npm run build               # Create production build
npm run test                # Run tests
```

## 🌍 Final URLs

After deployment:

- **Toronto Guide**: `kervinapps.com` (unchanged)
- **Optimizer**: `optimizer.kervinapps.com` (new)

## 🛠️ Troubleshooting

### Build Issues
- Ensure Node.js version 16+ is installed
- Run `npm install` if dependencies are missing
- Check console for any TypeScript errors

### Routing Issues
- The netlify.toml handles SPA routing automatically
- All routes redirect to index.html for client-side routing

### Domain Issues
- DNS propagation can take up to 24 hours
- Verify CNAME record points to correct Netlify domain
- Check SSL certificate status in Netlify dashboard

## 📊 Performance

- **Gzipped Bundle**: ~350KB main bundle
- **Load Time**: Optimized for fast loading
- **Caching**: Static assets cached for 1 year
- **Security**: Headers configured for security best practices

## 🔄 Future Updates

To deploy updates:

```bash
# Make changes to your code
git add .
git commit -m "Your update message"
git push

# Netlify will automatically rebuild and deploy
```

## 🎯 Success Criteria

✅ Optimizer accessible at `optimizer.kervinapps.com`  
✅ Toronto Guide unaffected at `kervinapps.com`  
✅ HTTPS enabled and working  
✅ All routes working correctly  
✅ Fast load times and good performance  

---

**Need help?** Check the troubleshooting section above or review the Netlify deployment logs for specific error messages.
