import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const DID_API_KEY = Deno.env.get('DID_API_KEY')!;
const DID_BASE    = 'https://api.d-id.com';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const url = new URL(req.url);
    const id  = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers: cors });

    const res = await fetch(`${DID_BASE}/talks/${id}`, {
      headers: { 'Authorization': `Basic ${btoa(DID_API_KEY + ':')}` },
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
});
