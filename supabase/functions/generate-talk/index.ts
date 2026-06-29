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
    const { sourceUrl, script, voice } = await req.json();

    const res = await fetch(`${DID_BASE}/talks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(DID_API_KEY + ':')}`,
      },
      body: JSON.stringify({
        source_url: sourceUrl,
        script: {
          type: 'text',
          input: script,
          provider: {
            type: 'microsoft',
            voice_id: voice,
          },
        },
        config: { fluent: true, pad_audio: 0 },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.description ?? 'D-ID error' }), {
        status: res.status,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

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
