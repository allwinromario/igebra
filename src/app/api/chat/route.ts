import { NextResponse } from 'next/server'

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

// Configure CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

const systemPrompt = `You are a friendly tutor who explains things in a simple, easy-to-understand way.

Structure your responses with clear spacing:
- Use line breaks between different parts of the explanation
- Present steps or points on separate lines
- Add a blank line between different sections
- Keep each line focused on one idea

For math problems, structure like this:
Question: [Write the question]

Let's solve this:
1. [First step or explanation]
2. [Next step if needed]

Example:
[Give a simple real-world example]

Answer:
[State the final answer clearly]

Remember to:
- Keep explanations simple
- Use everyday examples
- Be friendly and encouraging
- Keep formulas in plain text`

export async function POST(req: Request) {
  console.log('Received POST request to /api/chat');
  
  try {
    // Validate request
    if (!req.body) {
      console.error('No request body provided');
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { messages } = await req.json()
    console.log('Received messages:', JSON.stringify(messages, null, 2));

    // Check if we have messages and if they're in the correct format
    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages format:', messages);
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Extract the subject from the latest message if it exists
    const latestMessage = messages[messages.length - 1]
    const subjectMatch = latestMessage.content.match(/\[(.*?)\]/)
    const subject = subjectMatch ? subjectMatch[1] : null

    // Add subject-specific instructions to the system prompt if a subject is detected
    let finalSystemPrompt = systemPrompt
    if (subject) {
      finalSystemPrompt += `\n\nYou are currently tutoring in ${subject}. Focus your responses on this subject area while maintaining connections to related concepts when relevant.`
    }

    try {
      console.log('Making API request with model:', 'llama-3.3-70b-versatile')
      console.log('Request messages:', JSON.stringify(messages, null, 2))
      
      // Make the API call with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: finalSystemPrompt },
            ...messages.map((msg: any) => ({
              role: msg.role,
              content: msg.content,
            })),
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const completion = await response.json();
      console.log('API Response:', completion);

      return NextResponse.json(completion, { headers: corsHeaders });
    } catch (apiError: any) {
      // Enhanced error logging
      console.error('Groq API Error Details:', {
        message: apiError.message,
        name: apiError.name,
        stack: apiError.stack,
      });

      const isTimeout = apiError.name === 'AbortError';
      return NextResponse.json(
        {
          error: isTimeout
            ? 'The request took too long to complete. Please try again.'
            : 'Failed to get response from Groq API. Please try again.',
          details: apiError.message,
        },
        { status: isTimeout ? 408 : 500, headers: corsHeaders }
      );
    }
  } catch (error: any) {
    // Handle general errors
    console.error('Chat API Error:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again.',
        details: error.message,
        stack: error.stack,
      },
      { status: error.status || 500, headers: corsHeaders }
    );
  }
} 