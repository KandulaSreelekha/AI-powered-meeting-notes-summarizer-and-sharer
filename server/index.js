const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Groq } = require('groq-sdk');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Security middleware
app.use(helmet());

// CORS configuration for both development and production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000', // Development
      'http://192.168.162.67:3000', // Local network IP
      'https://your-frontend-domain.vercel.app', // Replace with your actual Vercel domain
      process.env.FRONTEND_URL // Environment variable for production
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Notes Summarizer API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Summarize text endpoint
app.post('/api/summarize', async (req, res) => {
  try {
    const { text, customPrompt } = req.body;
    
    console.log('📝 Summarization request received');
    console.log('Text length:', text?.length || 0);
    console.log('Custom prompt:', customPrompt || 'None provided');

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    // Create the prompt for summarization
    const prompt = customPrompt 
      ? `${customPrompt}\n\nText to summarize:\n${text}`
      : `Please provide a clear and structured summary of the following text. Focus on key points, main ideas, and important details:\n\n${text}`;
    
    console.log('🤖 Final prompt being sent to AI:', prompt.substring(0, 200) + '...');

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional meeting notes summarizer. Provide clear, well-structured summaries that are easy to read and understand."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.3,
      max_tokens: 2048,
    });

    const summary = completion.choices[0]?.message?.content || 'No summary generated';

    res.json({ 
      summary,
      originalText: text,
      customPrompt: customPrompt || 'Default summarization'
    });

  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error.message 
    });
  }
});

// Share summary via email endpoint
app.post('/api/share', async (req, res) => {
  try {
    console.log('📧 Email sharing request received');
    const { summary, recipients, subject, message } = req.body;
    console.log('Request body:', { summary: summary?.substring(0, 50) + '...', recipients, subject });

    if (!summary || !recipients || recipients.length === 0) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'Summary and recipients are required' });
    }

    // Check email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('❌ Email configuration missing');
      return res.status(500).json({ error: 'Email configuration not set up properly' });
    }

    console.log('✅ Email configuration found');

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('✅ Email transporter created');

    // Email content
    const emailContent = `
      <h2>Meeting Summary</h2>
      <p><strong>Subject:</strong> ${subject || 'Meeting Summary'}</p>
      <hr>
      <div style="white-space: pre-wrap;">${summary}</div>
      <hr>
      <p><em>This summary was generated using AI-powered meeting notes summarizer.</em></p>
    `;

    console.log('📤 Sending emails to recipients:', recipients);

    // Send email to each recipient
    const emailPromises = recipients.map(recipient => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: subject || 'Meeting Summary',
        html: emailContent,
        text: summary // Plain text fallback
      };

      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);
    console.log('✅ All emails sent successfully');

    res.json({ 
      success: true, 
      message: `Summary shared successfully with ${recipients.length} recipient(s)`,
      recipients 
    });

  } catch (error) {
    console.error('❌ Email sharing error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to share summary via email',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
