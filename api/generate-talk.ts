import type { VercelRequest, VercelResponse } from '@vercel/node';

const DID_API_KEY = process.env.DID_API_KEY!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sourceUrl, script, voice } = req.body as {
    sourceUrl: string;
    script: string;
    voice: string;
  };

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
  return res.status(response.ok ? 200 : response.status).json(data);
}
