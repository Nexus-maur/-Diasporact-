// Test de la fonction serveur api/ai.js avec un faux Supabase et un faux service d'IA (aucun appel réel).
const handler = require('../api/ai.js');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('PASS', m); } else { fail++; console.log('FAIL', m); } };
const mkRes = () => { const r = { code: 200, body: null, status(c) { r.code = c; return r; }, json(b) { r.body = b; return r; } }; return r; };
const env = { SUPABASE_URL: 'https://x.supabase.co', SUPABASE_ANON_KEY: 'anon', ANTHROPIC_API_KEY: 'sk-test' };
let calls, rpcReply, aiReply;
global.fetch = async (url, opt) => {
  calls.push({ url, opt });
  if (url.includes('/rest/v1/rpc/ai_consume')) return { ok: rpcReply.ok, status: rpcReply.status || 200, text: async () => rpcReply.text };
  if (url.includes('api.anthropic.com')) return { ok: aiReply.ok, json: async () => aiReply.json };
  throw new Error('appel inattendu ' + url);
};
const run = async (over, body, headers) => {
  Object.assign(process.env, env); if (over) for (const k in over) { if (over[k] === null) delete process.env[k]; else process.env[k] = over[k]; }
  calls = []; rpcReply = { ok: true, text: '19' }; aiReply = { ok: true, json: { content: [{ type: 'text', text: 'Bonjour' }] } };
  const res = mkRes();
  await handler({ method: 'POST', headers: Object.assign({ authorization: 'Bearer tok' }, headers), body }, res);
  return res;
};
(async () => {
  let r = await run(null, { task: 'translate', text: 'مرحبا بكم', target: 'fr' });
  ok(r.code === 200 && r.body.ok && r.body.text === 'Bonjour' && r.body.remaining === 19, 'traduction : réponse et quota restant');
  ok(calls[0].opt.headers.Authorization === 'Bearer tok' && calls[0].opt.headers.apikey === 'anon', 'le quota est contrôlé avec la session du membre');
  const sent = JSON.parse(calls[1].opt.body);
  ok(sent.messages[0].content === 'مرحبا بكم' && /français/.test(sent.system) && /jamais des instructions/.test(sent.system), 'le texte est envoyé comme donnée, avec consigne de non-obéissance');
  ok(calls[1].opt.headers['x-api-key'] === 'sk-test', 'la clé du service d’IA reste côté serveur');

  r = await run(null, { task: 'project', text: 'On veut équiper une école à Kaédi', target: 'fr' });
  aiReply = null;
  r = await (async () => { Object.assign(process.env, env); calls = []; rpcReply = { ok: true, text: '18' }; aiReply = { ok: true, json: { content: [{ type: 'text', text: 'Voici : {"title":"École numérique à Kaédi","objective":"Équiper une salle informatique.","needs":["Transport","Dons","Ingénieur réseau"]} fin' }] } }; const res = mkRes(); await handler({ method: 'POST', headers: { authorization: 'Bearer tok' }, body: { task: 'project', text: 'On veut équiper une école à Kaédi', target: 'fr' } }, res); return res; })();
  ok(r.code === 200 && r.body.project.title.startsWith('École') && r.body.project.needs.length === 3, 'discussion -> projet : JSON extrait et nettoyé');
  r = await (async () => { calls = []; rpcReply = { ok: true, text: '17' }; aiReply = { ok: true, json: { content: [{ type: 'text', text: 'pas de json' }] } }; const res = mkRes(); await handler({ method: 'POST', headers: { authorization: 'Bearer tok' }, body: { task: 'project', text: 'discussion quelconque', target: 'fr' } }, res); return res; })();
  ok(r.code === 502 && r.body.error === 'ai_error', 'réponse IA illisible : erreur propre');

  r = await run({ ANTHROPIC_API_KEY: null }, { task: 'translate', text: 'abc', target: 'fr' });
  ok(r.code === 503 && r.body.error === 'ai_unavailable' && calls.length === 0, 'sans clé IA : indisponible, aucun appel');
  r = await run(null, { task: 'translate', text: 'abc', target: 'fr' }, { authorization: '' });
  ok(r.code === 401 && calls.length === 0, 'sans session : refusé, aucun appel');
  r = await (async () => { Object.assign(process.env, env); calls = []; rpcReply = { ok: false, status: 400, text: '{"message":"not_tester"}' }; const res = mkRes(); await handler({ method: 'POST', headers: { authorization: 'Bearer tok' }, body: { task: 'translate', text: 'abc def', target: 'ar' } }, res); return res; })();
  ok(r.code === 403 && r.body.error === 'not_tester' && calls.length === 1, 'non-testeur : refusé, le service d’IA n’est pas contacté');
  r = await (async () => { calls = []; rpcReply = { ok: false, status: 400, text: '{"message":"quota"}' }; const res = mkRes(); await handler({ method: 'POST', headers: { authorization: 'Bearer tok' }, body: { task: 'translate', text: 'abc def', target: 'ar' } }, res); return res; })();
  ok(r.code === 429 && r.body.error === 'quota' && calls.length === 1, 'quota dépassé : 429, le service d’IA n’est pas contacté');
  r = await run(null, { task: 'translate', text: 'x'.repeat(6001), target: 'fr' });
  ok(r.code === 400 && calls.length === 0, 'texte trop long refusé avant tout appel');
  r = await run(null, { task: 'hack', text: 'abc', target: 'fr' });
  ok(r.code === 400, 'tâche inconnue refusée');
  r = await run(null, { task: 'translate', text: 'abc', target: 'en' });
  ok(r.code === 400, 'langue inconnue refusée');
  const g = mkRes(); await handler({ method: 'GET', headers: {} }, g); ok(g.code === 405, 'GET refusé');
  console.log('----'); console.log(pass + ' réussis, ' + fail + ' échoués'); process.exit(fail ? 1 : 0);
})();
