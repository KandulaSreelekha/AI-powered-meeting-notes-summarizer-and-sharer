# 📝 Notes Summarizer

An AI-powered meeting notes summarizer and sharer built with React, Node.js, and Groq AI.

## 🚀 Features

- **Text Summarization**: Upload or paste meeting notes, call transcripts, or any text
- **Custom Instructions**: Provide specific prompts like "Summarize in bullet points for executives" or "Highlight only action items"
- **Editable Summaries**: Review and edit generated summaries before sharing
- **Email Sharing**: Share summaries via email with multiple recipients
- **Modern UI**: Clean, responsive interface with real-time feedback
- **Security**: Rate limiting, input validation, and secure API endpoints

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **CSS3** with modern styling and responsive design
- **Fetch API** for HTTP requests

### Backend
- **Node.js** with Express.js
- **Groq AI API** for text summarization
- **Nodemailer** for email functionality
- **Security middleware** (Helmet, CORS, Rate limiting)

### Deployment
- **Frontend**: Vercel (recommended)
- **Backend**: Railway, Render, or Heroku

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Groq API key
- Gmail account with App Password (for email functionality)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KandulaSreelekha/AI-powered-meeting-notes-summarizer-and-sharer
   cd notes-summarizer
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```bash
   cd server
   cp env.example .env
   ```
   
   Edit the `.env` file with your credentials:
   ```env
   # Groq API Configuration
   GROQ_API_KEY=your_groq_api_key_here
   
   # Email Configuration (Gmail)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password_here
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Get your Groq API key**
   - Visit [Groq Console](https://console.groq.com/)
   - Sign up and create an API key
   - Add it to your `.env` file

5. **Set up Gmail App Password** (for email sharing)
   - Go to your Google Account settings
   - Enable 2-factor authentication
   - Generate an App Password for this application
   - Use this password in your `.env` file

## 🚀 Running the Application

### Development Mode
```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run server  # Backend on http://localhost:5000
npm run client  # Frontend on http://localhost:3000
```

### Production Build
```bash
# Build the frontend
npm run build

# Start the backend
cd server && npm start
```

## 📱 Usage

1. **Input Text**: Paste your meeting notes, call transcript, or any text you want to summarize
2. **Custom Instructions** (Optional): Add specific instructions like "Summarize in bullet points for executives"
3. **Generate Summary**: Click the button to create an AI-powered summary
4. **Edit Summary**: Review and modify the generated summary if needed
5. **Share**: Add recipient email addresses and share the summary via email

## 🌐 API Endpoints

### Health Check
```
GET /api/health
```

### Summarize Text
```
POST /api/summarize
Content-Type: application/json

{
  "text": "Your text to summarize",
  "customPrompt": "Optional custom instructions"
}
```

### Share Summary
```
POST /api/share
Content-Type: application/json

{
  "summary": "The summary text",
  "recipients": ["email1@example.com", "email2@example.com"],
  "subject": "Email subject"
}
```

## 🚀 Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set build command: `cd client && npm install && npm run build`
4. Set output directory: `client/build`
5. Deploy!

### Backend (Railway/Render)
1. Push your code to GitHub
2. Connect your repository to Railway or Render
3. Set the root directory to `server`
4. Add environment variables
5. Deploy!

### Environment Variables for Production
Make sure to set these environment variables in your deployment platform:
- `GROQ_API_KEY`
- `EMAIL_USER`
- `EMAIL_PASS`
- `PORT` (usually auto-set by the platform)

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for production domains
- **Helmet.js**: Security headers
- **Input Sanitization**: Protection against malicious inputs

## 🐛 Troubleshooting

### Common Issues

1. **"Groq API key not configured"**
   - Make sure your `.env` file exists in the server directory
   - Verify your Groq API key is correct

2. **"Failed to share summary via email"**
   - Check your Gmail App Password is correct
   - Ensure 2-factor authentication is enabled
   - Verify the email addresses are valid

3. **CORS errors**
   - Make sure the frontend is making requests to the correct backend URL
   - Check that the backend CORS configuration includes your frontend domain

### Development Tips

- Use browser developer tools to check network requests
- Check server logs for detailed error messages
- Verify all environment variables are set correctly

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Verify your environment setup

---

**Built with ❤️ using React, Node.js, and Groq AI**
