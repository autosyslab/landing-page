import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { assistantId } = JSON.parse(event.body || '{}');

    if (!assistantId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Assistant ID is required' }),
      };
    }

    const vapiApiKey = process.env.VAPI_API_KEY;

    if (!vapiApiKey) {
      console.error('VAPI_API_KEY not configured');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Service configuration error' }),
      };
    }

    const response = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vapiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId,
        type: 'web',
        maxDurationSeconds: 144
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('VAPI API error:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to start call', details: errorData }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error in start-vapi-call function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };
