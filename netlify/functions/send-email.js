const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Set SendGrid API key
    sgMail.setApiKey(process.env.REACT_APP_SENDGRID_API_KEY);

    // Parse request body
    const { to, from, subject, html, templateId, dynamicTemplateData } = JSON.parse(event.body);

    // Prepare email data
    const msg = {
      to,
      from: from || process.env.REACT_APP_FROM_EMAIL,
      subject,
      html,
      templateId,
      dynamicTemplateData,
    };

    console.log('Sending email with data:', {
      to,
      from: msg.from,
      subject,
      templateId,
      hasHtml: !!html,
      hasTemplateData: !!dynamicTemplateData
    });

    // Send email via SendGrid
    await sgMail.send(msg);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ success: true, message: 'Email sent successfully' })
    };

  } catch (error) {
    console.error('SendGrid Error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response ? error.response.body : null
    });
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to send email',
        details: error.message,
        code: error.code
      })
    };
  }
};
