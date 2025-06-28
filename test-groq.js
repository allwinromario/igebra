import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function testGroqAPI() {
  try {
    console.log('Testing Groq API connection...');
    
    // First, list available models
    console.log('Fetching available models...');
    const models = await groq.models.list();
    console.log('Available models:', models);

    // Try a simple chat completion
    console.log('\nTesting chat completion...');
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: 'Say hello!' }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 100,
      stream: false,
    });

    console.log('Response:', completion.choices[0]?.message?.content);
    console.log('\nAPI test successful!');
  } catch (error) {
    console.error('Error testing Groq API:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testGroqAPI(); 