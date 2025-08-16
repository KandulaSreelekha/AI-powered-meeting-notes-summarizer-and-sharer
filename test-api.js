// Simple test script for the Notes Summarizer API
// Run with: node test-api.js

const API_URL = process.env.API_URL || 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing Notes Summarizer API...\n');

  // Test 1: Health Check
  console.log('1. Testing Health Check...');
  try {
    const healthResponse = await fetch(`${API_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
  }

  // Test 2: Summarization
  console.log('\n2. Testing Summarization...');
  const testText = `
    Meeting Notes - Product Development Team
    Date: 2024-01-15
    Attendees: John, Sarah, Mike, Lisa
    
    Discussion Points:
    - New feature development for mobile app
    - User feedback analysis from beta testing
    - Timeline for Q1 release
    - Budget allocation for marketing
    
    Action Items:
    - John to complete UI mockups by Friday
    - Sarah to analyze user feedback data
    - Mike to prepare budget proposal
    - Lisa to schedule next meeting
    
    Next Meeting: January 22nd, 2024
  `;

  try {
    const summaryResponse = await fetch(`${API_URL}/api/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: testText,
        customPrompt: 'Summarize in bullet points highlighting key decisions and action items'
      }),
    });

    if (summaryResponse.ok) {
      const summaryData = await summaryResponse.json();
      console.log('✅ Summarization Successful!');
      console.log('Summary:', summaryData.summary.substring(0, 200) + '...');
    } else {
      const errorData = await summaryResponse.json();
      console.log('❌ Summarization Failed:', errorData);
    }
  } catch (error) {
    console.log('❌ Summarization Error:', error.message);
  }

  console.log('\n🎉 API Testing Complete!');
}

// Run the tests
testAPI().catch(console.error);
