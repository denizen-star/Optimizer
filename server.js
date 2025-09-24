const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// SendGrid proxy endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { type, data } = req.body;
    const apiKey = process.env.REACT_APP_SENDGRID_API_KEY;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'SendGrid API key not configured' });
    }

    let emailData;
    
    if (type === 'verification') {
      emailData = {
        personalizations: [{
          to: [{ email: data.email, name: data.name }],
          dynamic_template_data: {
            name: data.name,
            verification_url: data.verificationUrl,
            email: data.email
          }
        }],
        from: { email: process.env.REACT_APP_FROM_EMAIL, name: 'Optimizer' },
        template_id: 'd-3ee64b454500491c8e5a2cbae5040ced',
        reply_to: { email: process.env.REACT_APP_FROM_EMAIL, name: 'Optimizer' }
      };
    } else if (type === 'welcome') {
      emailData = {
        personalizations: [{
          to: [{ email: data.email, name: data.name }],
          subject: 'Welcome to Optimizer!'
        }],
        from: { email: process.env.REACT_APP_FROM_EMAIL, name: 'Optimizer' },
        content: [{
          type: 'text/html',
          value: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Welcome to Optimizer!</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #4CAF50;">Welcome to Optimizer, ${data.name}!</h1>
                <p>Thank you for joining Optimizer. We're excited to have you on board!</p>
                <p>Get started by exploring our features and optimizing your workflow.</p>
                <div style="margin: 30px 0;">
                  <a href="https://optimizer.kervinapps.com" 
                     style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                    Get Started
                  </a>
                </div>
                <p>Best regards,<br>The Optimizer Team</p>
              </div>
            </body>
            </html>
          `
        }],
        reply_to: { email: process.env.REACT_APP_FROM_EMAIL, name: 'Optimizer' }
      };
    } else if (type === 'password-reset') {
      emailData = {
        personalizations: [{
          to: [{ email: data.email, name: data.name }],
          dynamic_template_data: {
            name: data.name,
            reset_url: data.resetUrl,
            email: data.email
          }
        }],
        from: { email: process.env.REACT_APP_FROM_EMAIL, name: 'Optimizer' },
        template_id: 'd-dbf9789afd6b44de8b0c16708852142c',
        reply_to: { email: process.env.REACT_APP_FROM_EMAIL, name: 'Optimizer' }
      };
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (response.ok) {
      console.log(`✅ ${type} email sent successfully`);
      res.json({ success: true, message: `${type} email sent successfully` });
    } else {
      const errorData = await response.text();
      console.error(`❌ SendGrid API error:`, response.status, errorData);
      res.status(response.status).json({ error: 'Failed to send email', details: errorData });
    }

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Email proxy server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Email proxy server running on port ${PORT}`);
  console.log(`📧 SendGrid API key configured: ${process.env.REACT_APP_SENDGRID_API_KEY ? 'Yes' : 'No'}`);
});
