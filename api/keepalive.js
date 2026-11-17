// Tâche quotidienne (cron Vercel) : interroge la base pour éviter la mise en pause du plan gratuit Supabase.
// Variables Vercel : SUPABASE_URL, SUPABASE_ANON_KEY (et facultativement CRON_SECRET).
module.exports = async (req, res) => {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== 'Bearer ' + secret) return res.status(401).json({ ok: false });
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return res.status(500).json({ ok: false, error: 'missing_env' });
  try {
    const r = await fetch(url.replace(/\/$/, '') + '/rest/v1/rpc/ping', {
      method: 'POST',
      headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: '{}'
    });
    const body = await r.text();
    if (!r.ok) return res.status(502).json({ ok: false, status: r.status });
    return res.status(200).json({ ok: body.includes('ok'), at: new Date().toISOString() });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'unreachable' });
  }
};
