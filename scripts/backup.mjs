// Export de toutes les tables Supabase en JSON (clé « service_role », jamais exposée à l'application).
const hdr = k => (k.startsWith('eyJ') ? { apikey: k, Authorization: 'Bearer ' + k } : { apikey: k }); // les nouvelles clés sb_… ne se passent pas en Bearer
// Usage : SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/backup.mjs <dossier-de-sortie>
import { mkdir, writeFile } from 'node:fs/promises';

const TABLES = ['canals', 'profiles', 'canal_members', 'invites', 'projects', 'milestones', 'tasks', 'project_team',
  'comments', 'follows', 'proposals', 'helps', 'announcements', 'ann_reads', 'badge_requests', 'badge_grants', 'notifications', 'spokespersons', 'ai_testers', 'ai_usage', 'feedback', 'preregistrations'];
const url = (process.env.SUPABASE_URL || '').replace(/\/$/, ''), key = process.env.SUPABASE_SERVICE_KEY, out = process.argv[2];
if (!url || !key || !out) { console.error('Usage: SUPABASE_URL, SUPABASE_SERVICE_KEY et dossier de sortie requis'); process.exit(2); }

const H = hdr(key);
await mkdir(out, { recursive: true });
const summary = {};
for (const t of TABLES) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const r = await fetch(`${url}/rest/v1/${t}?select=*`, { headers: { ...H, Range: `${from}-${from + 999}`, 'Range-Unit': 'items' } });
    if (!r.ok) { console.error(`Échec ${t}: HTTP ${r.status} ${(await r.text()).slice(0, 300)} (type de clé : ${key.startsWith('sb_secret_') ? 'secrète' : key.startsWith('sb_publishable_') ? 'PUBLIQUE (mauvaise clé)' : key.startsWith('eyJ') ? 'JWT' : 'inconnu'}, longueur ${key.length})`); process.exit(1); }
    const page = await r.json();
    rows.push(...page);
    if (page.length < 1000) break;
  }
  await writeFile(`${out}/${t}.json`, JSON.stringify(rows, null, 1));
  summary[t] = rows.length;
}
await writeFile(`${out}/_resume.json`, JSON.stringify({ date: new Date().toISOString(), lignes: summary }, null, 1));
console.log('Sauvegarde OK', summary);
