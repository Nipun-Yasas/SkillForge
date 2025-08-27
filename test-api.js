// Simple test script for the recommend API
const fetch = require('node-fetch');

async function testRecommendAPI() {
  console.log('🧪 Testing Gemini AI Recommend API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'I want to learn React and UI design for building modern web applications'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ API Response:');
    console.log('Query:', data.query);
    console.log('AI Generated:', data.aiGenerated);
    console.log('Message:', data.message);
    console.log('Recommendations:');
    data.recommendations.forEach((mentor, index) => {
      console.log(`  ${index + 1}. ${mentor.name} - Skills: ${mentor.skills.join(', ')}`);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRecommendAPI();
