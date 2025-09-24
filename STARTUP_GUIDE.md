# Optimizer App Startup Guide

## Prerequisites
- Node.js v18.20.8 or higher
- npm v10.8.2 or higher

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Open Application
- Go to: `http://localhost:3000`
- Email Test: `http://localhost:3000/email-test`
- Authentication Demo: `http://localhost:3000/auth-demo`

## Environment Setup

### SendGrid Configuration
1. Create a `.env` file in the root directory
2. Add your SendGrid API key:
```bash
# SendGrid Configuration
REACT_APP_SENDGRID_API_KEY=your_actual_api_key_here
REACT_APP_FROM_EMAIL=noreply@optimizer.kervinapps.com
NODE_ENV=development
```

### SendGrid Dynamic Templates
The app uses SendGrid Dynamic Templates:
- **Email Verification Template ID**: `d-3ee64b454500491c8e5a2cbae5040ced`
- **Password Reset Template ID**: `d-dbf9789afd6b44de8b0c16708852142c`

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Features

### Authentication Module
- User registration and login
- Email verification
- Password reset
- Secure token management
- Password hashing
- Input validation

### Email System
- SendGrid integration
- Dynamic email templates
- Verification emails
- Password reset emails
- Welcome emails

### User Management
- Admin interface
- User tracking
- Security monitoring

## Troubleshooting

### Node.js Not Found
If you get "command not found: npm", install Node.js:
```bash
# Using NVM (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### Port Already in Use
If port 3000 is busy:
```bash
# Kill processes on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm start
```

### SendGrid Not Configured
1. Check your `.env` file has the correct API key
2. Restart the development server after adding the API key
3. Verify the SendGrid templates are created

## Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
The app is configured for Netlify deployment with `netlify.toml`.

## Support

For issues or questions, check the documentation in:
- `src/modules/authentication-module/README.md`
- `EMAIL_SETUP_GUIDE.md`
- `DYNAMIC_TEMPLATES_SETUP.md`