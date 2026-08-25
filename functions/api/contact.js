/* ============================================================================
   POST /api/contact  —  Cloudflare Pages Function
   ----------------------------------------------------------------------------
   Receives the RFQ form and relays it as email through Resend.

   Required environment variables (Pages > Settings > Environment variables):
     RESEND_API_KEY   your Resend API key            e.g. re_xxxxxxxx
     CONTACT_TO       where enquiries are delivered  e.g. sales@vespersupply.com
     CONTACT_FROM     a verified sender on your domain
                      e.g. "Vesper Supply <website@vespersupply.com>"

   Optional:
     CONTACT_CC       anyone copied on every enquiry, comma separated
                      e.g. "jdawley@vespersupply.com, samuel@vespersupply.com"

   CONTACT_TO accepts a comma-separated list too, so enquiries can go to
   several mailboxes rather than one.

   The API key is only ever read server-side. It is never sent to the browser.
   ========================================================================== */

const MAX = { name: 120, company: 160, email: 200, category: 80, details: 4000 };

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

function clean(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

// "a@b.com, c@d.com" -> ['a@b.com', 'c@d.com']. Tolerates trailing commas and
// stray whitespace, because these are typed into a dashboard field by hand.
function addressList(value) {
  if (typeof value !== 'string') return [];
  return value.split(',').map(function (a) { return a.trim(); }).filter(Boolean);
}

// Deliberately permissive: the point is to catch typos, not to police
// what is technically a valid address.
function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'Could not read that submission.' }, 400);
  }

  // Honeypot: a field hidden from people. Anything in it is a bot, so accept
  // the request and quietly discard it rather than telling them it failed.
  if (clean(data.website, 100)) return json({ ok: true });

  const name     = clean(data.name, MAX.name);
  const company  = clean(data.company, MAX.company);
  const email    = clean(data.email, MAX.email);
  const category = clean(data.category, MAX.category);
  const details  = clean(data.details, MAX.details);

  const missing = [];
  if (!name) missing.push('name');
  if (!company) missing.push('company');
  if (!email) missing.push('email');
  if (!details) missing.push('details');
  if (missing.length) {
    return json({ ok: false, error: 'Missing required fields.', fields: missing }, 400);
  }
  if (!looksLikeEmail(email)) {
    return json({ ok: false, error: 'That email address does not look right.', fields: ['email'] }, 400);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    // Misconfiguration is ours, not the sender's — say so plainly and log it.
    console.error('contact: missing RESEND_API_KEY, CONTACT_TO or CONTACT_FROM');
    return json({ ok: false, error: 'The form is not configured yet.' }, 500);
  }

  // Everyone copied is internal, so cc rather than bcc: replying to all
  // reaches the enquirer and the rest of the team in one go.
  const cc = addressList(env.CONTACT_CC);

  const rows = [
    ['Name', name], ['Company', company], ['Email', email], ['Category', category || '—']
  ];

  const html =
    '<h2 style="font:600 16px system-ui;margin:0 0 16px">New RFQ from the website</h2>' +
    '<table style="font:14px system-ui;border-collapse:collapse">' +
    rows.map(function (r) {
      return '<tr><td style="padding:4px 16px 4px 0;color:#666">' + r[0] +
             '</td><td style="padding:4px 0"><strong>' + escapeHtml(r[1]) + '</strong></td></tr>';
    }).join('') +
    '</table>' +
    '<p style="font:14px system-ui;margin:20px 0 6px;color:#666">Requirement</p>' +
    '<p style="font:14px/1.6 system-ui;margin:0;white-space:pre-wrap">' + escapeHtml(details) + '</p>';

  const text =
    rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n') +
    '\n\nRequirement:\n' + details;

  let resendResponse;
  try {
    resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + env.RESEND_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(Object.assign({
        from: env.CONTACT_FROM,
        to: addressList(env.CONTACT_TO),
        reply_to: email,            // replying goes straight back to the enquirer
        subject: 'RFQ — ' + company + (category ? ' — ' + category : ''),
        html: html,
        text: text
      }, cc.length ? { cc: cc } : {}))
    });
  } catch (err) {
    console.error('contact: resend unreachable', err);
    return json({ ok: false, error: 'Could not send just now.' }, 502);
  }

  if (!resendResponse.ok) {
    console.error('contact: resend rejected', resendResponse.status, await resendResponse.text());
    return json({ ok: false, error: 'Could not send just now.' }, 502);
  }

  return json({ ok: true });
}

// Anything other than POST on this route.
export async function onRequest(context) {
  if (context.request.method === 'POST') return onRequestPost(context);
  return json({ ok: false, error: 'Method not allowed.' }, 405);
}
