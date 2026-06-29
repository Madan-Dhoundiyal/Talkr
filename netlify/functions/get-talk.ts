import type { Handler } from '@netlify/functions';

const DID_API_KEY = process.env.DID_API_KEY!;

export const handler: Handler = async (event) => {
  const id = event.queryStringParameters?.id;
  if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'Missing id' }) };

  const response = await fetch(`https://api.d-id.com/talks/${id}`, {
    headers: {
      'Authorization': `Basic ${Buffer.from(DID_API_KEY).toString('base64')}`,
    },
  });

  const data = await response.json();
  return {
    statusCode: response.ok ? 200 : response.status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
};
