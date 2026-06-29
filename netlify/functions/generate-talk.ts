import type { Handler } from '@netlify/functions';

const DID_API_KEY = process.env.DID_API_KEY!;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const { sourceUrl, script, voice } = JSON.parse(event.body || '{}');

  const response = await fetch('https://api.d-id.com/talks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(DID_API_KEY).toString('base64')}`,
    },
    body: JSON.stringify({
      source_url: sourceUrl,
      script: {
        type: 'text',
        input: script,
        provider: { type: 'microsoft', voice_id: voice },
      },
      config: { fluent: true, pad_audio: 0 },
    }),
  });

  const data = await response.json();
  return {
    statusCode: response.ok ? 200 : response.status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
};
