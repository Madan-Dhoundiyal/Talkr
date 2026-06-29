import type { VercelRequest, VercelResponse } from '@vercel/node';

const DID_API_KEY = process.env.DID_API_KEY!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id' });

  const response = await fetch(`https://api.d-id.com/talks/${id}`, {
    headers: {
      'Authorization': `Basic ${Buffer.from(DID_API_KEY).toString('base64')}`,
    },
  });

  const data = await response.json();
  return res.status(response.ok ? 200 : response.status).json(data);
}
