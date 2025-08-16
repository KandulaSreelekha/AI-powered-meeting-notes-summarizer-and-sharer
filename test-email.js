// Test email configuration
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 Testing Email Configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Set' : '❌ Missing');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log('\n❌ Email configuration is incomplete!');
  console.log('Please check your .env file and ensure EMAIL_USER and EMAIL_PASS are set.');
  process.exit(1);
}

// Test email transporter
console.log('\n📧 Testing Email Transporter...');
try {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  console.log('✅ Email transporter created successfully');
  
  // Test connection
  console.log('\n🔗 Testing connection...');
  transporter.verify(function(error, success) {
    if (error) {
      console.log('❌ Email connection failed:', error.message);
      console.log('\n💡 Common solutions:');
      console.log('1. Make sure 2-factor authentication is enabled on your Gmail');
      console.log('2. Generate a new App Password (not your regular password)');
      console.log('3. Check that EMAIL_USER is your full Gmail address');
      console.log('4. Make sure EMAIL_PASS is the 16-character App Password');
    } else {
      console.log('✅ Email connection successful!');
      console.log('Server is ready to send emails');
    }
  });

} catch (error) {
  console.log('❌ Error creating email transporter:', error.message);
}
