// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// export async function POST(req: Request) {
//   console.log('API route /api/ask hit at', new Date().toISOString()); // Debug log
//   try {
//     const { query } = await req.json();
//     console.log('Received query:', query); // Debug log

//     if (!query) {
//       return NextResponse.json({ error: 'Query is required' }, { status: 400 });
//     }

//     const contextPath = path.join(process.cwd(), 'context.txt');
//     console.log('Looking for context at:', contextPath); // Debug log
//     let context = '';
//     if (fs.existsSync(contextPath)) {
//       context = fs.readFileSync(contextPath, 'utf8');
//       console.log('Context loaded successfully');
//     } else {
//       console.error('context.txt not found at:', contextPath);
//       return NextResponse.json({ error: 'Knowledge base not available' }, { status: 500 });
//     }

//     const systemPrompt = `You are the CLUMOSS AI Assistant. Use the following context to answer user questions relevantly and accurately. If the query is not related to the context, politely redirect to topics about CLUMOSS.

// Context:
// ${context}`;

//     const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'nvidia/nemotron-nano-9b-v2:free',
//         messages: [
//           { role: 'system', content: systemPrompt },
//           { role: 'user', content: query },
//         ],
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`API request failed with status ${response.status}`);
//     }

//     const data = await response.json();
//     const aiResponse = data.choices[0]?.message?.content?.trim() || 'No response generated';
//     console.log('AI response generated:', aiResponse); // Debug log

//     return NextResponse.json({ response: aiResponse }, { status: 200 });
//   } catch (error) {
//     console.error('API route error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// export function GET() {
//   return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 });
// }






// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// export async function POST(req: Request) {
//   console.log('API route /api/ask hit at', new Date().toISOString(), 'with headers:', Object.fromEntries(req.headers));
//   try {
//     const { query } = await req.json();
//     console.log('Received query:', query);

//     if (!query) {
//       return NextResponse.json({ error: 'Query is required' }, { status: 400 });
//     }

//     const contextPath = path.join(process.cwd(), 'context.txt');
//     console.log('Looking for context at:', contextPath);
//     let context = '';
//     if (fs.existsSync(contextPath)) {
//       context = fs.readFileSync(contextPath, 'utf8');
//       console.log('Context loaded successfully');
//     } else {
//       console.error('context.txt not found at:', contextPath);
//       return NextResponse.json({ error: 'Knowledge base not available' }, { status: 500 });
//     }

//     const systemPrompt = `You are the CLUMOSS AI Assistant. Use the following context to answer user questions relevantly and accurately. If the query is not related to the context, politely redirect to topics about CLUMOSS.

// Context:
// ${context}`;

//     const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'nvidia/nemotron-nano-9b-v2:free',
//         messages: [
//           { role: 'system', content: systemPrompt },
//           { role: 'user', content: query },
//         ],
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('OpenRouter API failed:', { status: response.status, body: errorText });
//       throw new Error(`API request failed with status ${response.status}: ${errorText}`);
//     }

//     const data = await response.json();
//     const aiResponse = data.choices[0]?.message?.content?.trim() || 'No response generated';
//     console.log('AI response generated:', aiResponse);

//     return NextResponse.json({ response: aiResponse }, {
//       status: 200,
//       headers: {
//         'Access-Control-Allow-Origin': '*', // Temporary wildcard for testing
//         'Access-Control-Allow-Methods': 'POST',
//         'Access-Control-Allow-Headers': 'Content-Type, Accept',
//       },
//     });
//   } catch (error) {
//     console.error('API route error:', { message: error.message, stack: error.stack });
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// export function GET() {
//   return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 });
// }



// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// export async function POST(req: Request) {
//   console.log('API route /api/ask hit at', new Date().toISOString(), 'with headers:', Object.fromEntries(req.headers));
//   try {
//     const { query } = await req.json();
//     console.log('Received query:', query);

//     if (!query) {
//       return NextResponse.json({ error: 'Query is required' }, { status: 400 });
//     }

//     const contextPath = path.join(process.cwd(), 'context.txt');
//     console.log('Looking for context at:', contextPath);
//     let context = '';
//     if (fs.existsSync(contextPath)) {
//       context = fs.readFileSync(contextPath, 'utf8');
//       console.log('Context loaded successfully');
//     } else {
//       console.error('context.txt not found at:', contextPath);
//       return NextResponse.json({ error: 'Knowledge base not available' }, { status: 500 });
//     }

//     const systemPrompt = `You are the CLUMOSS AI Assistant. Use the following context to answer user questions relevantly and accurately. If the query is not related to the context, politely redirect to topics about CLUMOSS.

// Context:
// ${context}`;

//     const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'nvidia/nemotron-nano-9b-v2:free',
//         messages: [
//           { role: 'system', content: systemPrompt },
//           { role: 'user', content: query },
//         ],
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('OpenRouter API failed:', { status: response.status, body: errorText });
//       throw new Error(`API request failed with status ${response.status}: ${errorText}`);
//     }

//     const data = await response.json();
//     const aiResponse = data.choices[0]?.message?.content?.trim() || 'No response generated';
//     console.log('AI response generated:', aiResponse);

//     return NextResponse.json({ response: aiResponse }, {
//       status: 200,
//       headers: {
//         'Access-Control-Allow-Origin': '*', // Allow all origins
//         'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Explicitly allow methods
//         'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
//       },
//     });
//   } catch (error) {
//     console.error('API route error:', { message: error.message, stack: error.stack });
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// export function OPTIONS() {
//   return NextResponse.json({}, {
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
//     },
//   });
// }

// export function GET() {
//   return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 });
// }



// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// // Handle CORS preflight
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
//       'Access-Control-Max-Age': '86400',
//     },
//   });
// }

// export async function POST(req: Request) {
//   console.log('=== API ROUTE HIT ===');
//   console.log('Time:', new Date().toISOString());
//   console.log('Origin:', req.headers.get('origin'));
  
//   try {
//     const { query } = await req.json();
//     console.log('Query received:', query);

//     if (!query) {
//       return NextResponse.json(
//         { error: 'Query is required' },
//         { 
//           status: 400,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//             'Access-Control-Allow-Headers': 'Content-Type, Accept',
//           },
//         }
//       );
//     }

//     const contextPath = path.join(process.cwd(), 'context.txt');
//     console.log('Context path:', contextPath);
    
//     let context = '';
//     if (fs.existsSync(contextPath)) {
//       context = fs.readFileSync(contextPath, 'utf8');
//       console.log('Context loaded, length:', context.length);
//     } else {
//       console.error('context.txt not found!');
//       return NextResponse.json(
//         { error: 'Knowledge base not available' },
//         { 
//           status: 500,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//             'Access-Control-Allow-Headers': 'Content-Type, Accept',
//           },
//         }
//       );
//     }

//     const systemPrompt = `You are the CLUMOSS AI Assistant. Use the following context to answer user questions accurately and professionally. Keep responses concise and direct.

// Context:
// ${context}`;

//     console.log('Calling OpenRouter API...');
//     const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'nvidia/nemotron-nano-9b-v2:free',
//         messages: [
//           { role: 'system', content: systemPrompt },
//           { role: 'user', content: query },
//         ],
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('OpenRouter error:', response.status, errorText);
//       throw new Error(`API failed: ${response.status}`);
//     }

//     const data = await response.json();
//     const aiResponse = data.choices[0]?.message?.content?.trim() || 'No response generated';
//     console.log('AI Response generated:', aiResponse.substring(0, 100) + '...');

//     return NextResponse.json(
//       { response: aiResponse },
//       {
//         status: 200,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//           'Access-Control-Allow-Headers': 'Content-Type, Accept',
//         },
//       }
//     );
//   } catch (error: any) {
//     console.error('=== ERROR ===');
//     console.error('Message:', error.message);
//     console.error('Stack:', error.stack);
    
//     return NextResponse.json(
//       { error: 'Internal server error', details: error.message },
//       { 
//         status: 500,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//           'Access-Control-Allow-Headers': 'Content-Type, Accept',
//         },
//       }
//     );
//   }
// }

// export async function GET() {
//   return NextResponse.json(
//     { error: 'Method not allowed. Use POST.' },
//     { 
//       status: 405,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//         'Access-Control-Allow-Headers': 'Content-Type, Accept',
//       },
//     }
//   );
// }



import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function POST(req: Request) {
  console.log('=== API ROUTE HIT ===');
  console.log('Time:', new Date().toISOString());
  console.log('Origin:', req.headers.get('origin'));
  
  try {
    const body = await req.json();
    const { query } = body as { query?: string };
    console.log('Query received:', query);

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Accept',
          },
        }
      );
    }

    const contextPath = path.join(process.cwd(), 'context.txt');
    console.log('Context path:', contextPath);
    
    let context = '';
    if (fs.existsSync(contextPath)) {
      context = fs.readFileSync(contextPath, 'utf8');
      console.log('Context loaded, length:', context.length);
    } else {
      console.error('context.txt not found!');
      return NextResponse.json(
        { error: 'Knowledge base not available' },
        { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Accept',
          },
        }
      );
    }

    const systemPrompt = `You are the CLUMOSS AI Assistant.

Your task:
1. Use the following context to answer user queries accurately and professionally.
2. Respond in the same language as the user's question.
3. Supported languages: English (default), Arabic, Chinese, French, Japanese, German, Spanish, Russian, and Hindi.
4. If the language cannot be confidently identified, answer in English.
5. Keep answers concise and clear (maximum 3–4 lines).
6. Maintain a polite, professional, and helpful tone.

${context}`;

    console.log('Calling OpenRouter API...');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://clumoss.com',
        'X-Title': 'CLUMOSS AI Assistant',
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-nano-9b-v2:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
        temperature: 0.1,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', response.status, errorText);
      throw new Error(`API failed: ${response.status}`);
    }

    const data = await response.json() as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };
    
    const aiResponse = data.choices?.[0]?.message?.content?.trim() || 'No response generated';
    console.log('AI Response generated:', aiResponse.substring(0, 100) + '...');

    return NextResponse.json(
      { response: aiResponse },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Accept',
        },
      }
    );
  } catch (error) {
    console.error('=== ERROR ===');
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Message:', errorMessage);
    if (errorStack) {
      console.error('Stack:', errorStack);
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Accept',
        },
      }
    );
  }
}

//comment

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { 
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
      },
    }
  );
}