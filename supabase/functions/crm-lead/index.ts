import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const encoder = new TextEncoder();

async function signHmacSha256(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function bad(status: number, message: string, extra: Record<string, unknown> = {}) {
  return new Response(JSON.stringify({ error: message, ...extra }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return bad(405, 'Method not allowed');

  const WEBHOOK_URL = Deno.env.get('CASE_CRM_WEBHOOK_URL');
  const WEBHOOK_SECRET = Deno.env.get('CASE_CRM_WEBHOOK_SECRET');
  if (!WEBHOOK_URL || !WEBHOOK_SECRET) {
    return bad(500, 'CRM webhook not configured');
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return bad(400, 'Invalid JSON');
  }

  const c = payload?.contact ?? {};
  const name = String(c.name ?? '').trim();
  const email = String(c.email ?? '').trim();
  const phone = String(c.phone ?? '').trim();

  if (!name || name.length > 200) return bad(400, 'name inválido');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
    return bad(400, 'email inválido');
  }
  if (phone.length > 40) return bad(400, 'phone inválido');

  const body = JSON.stringify({
    contact: {
      name,
      email,
      phone: phone || undefined,
      company: String(c.company ?? '').slice(0, 200) || undefined,
      position: String(c.position ?? '').slice(0, 120) || undefined,
      source: String(c.source ?? 'caseej-site').slice(0, 60),
      notes: String(c.notes ?? '').slice(0, 2000) || undefined,
    },
  });

  const signature = await signHmacSha256(WEBHOOK_SECRET, body);

  const upstream = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-case-signature': `sha256=${signature}`,
    },
    body,
  });

  const text = await upstream.text();
  if (!upstream.ok) {
    console.error(`CRM webhook failed [${upstream.status}]: ${text}`);
    return new Response(
      JSON.stringify({ error: 'CRM webhook failed', status: upstream.status, details: text }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  return new Response(JSON.stringify({ ok: true, upstream: text }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});