// Restauration des tables depuis un dossier de sauvegarde (produit par scripts/backup.mjs).
const hdr = k => (k.startsWith('eyJ') ? { apikey: k, Authorization: 'Bearer ' + k } : { apikey: k }); // les nouvelles clés sb_… ne se passent pas en Bearer
// Usage : SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/restore.mjs <dossier> [--keep-auth]
// Sans --keep-auth (nouveau projet Supabase), les liens profil <-> appareil sont effacés :
// chaque membre se reconnecte avec un lien de reconnexion fourni par un modérateur.
import { readFile } from 'node:fs/promises';

const ORDER = ['canals', 'profiles', 'canal_members', 'projects', 'milestones', 'tasks', 'project_team', 'comments', 'follows',
  'proposals', 'helps', 'announcements', 'ann_reads', 'badge_requests', 'badge_grants', 'notifications', 'invites'];
const url = (process.env.SUPABASE_URL || '').replace(/\/$/, ''), key = process.env.SUPABASE_SERVICE_KEY, dir = process.argv[2];
const keepAuth = process.argv.includes('--keep-auth');
if (!url || !key || !dir) { console.error('Usage: SUPABASE_URL, SUPABASE_SERVICE_KEY et dossier requis'); process.exit(2); }

for (const t of ORDER) {
  let rows = JSON.parse(await readFile(`${dir}/${t}.json`, 'utf8'));
  if (t === 'profiles' && !keepAuth) rows = rows.map(r => ({ ...r, auth_uid: null }));
  for (let i = 0; i < rows.length; i += 500) {
    const r = await fetch(`${url}/rest/v1/${t}`, {
      method: 'POST',
      headers: { ...hdr(key), 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(rows.slice(i, i + 500))
    });
    if (!r.ok) { console.error(`Échec ${t}: HTTP ${r.status} ${await r.text()}`); process.exit(1); }
  }
  console.log(`${t}: ${rows.length} lignes`);
}
console.log('Restauration terminée.');
