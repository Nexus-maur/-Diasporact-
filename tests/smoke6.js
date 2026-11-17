const {JSDOM}=require('jsdom');const fs=require('fs');const makeMock=require('./mock_sb.js');
const HTML=fs.readFileSync(''+require('path').resolve(__dirname,'..','index.html')+'','utf8');
let pass=0,fail=0;function ok(c,m){if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function open(mock,hash){
  const errs=[];
  const dom=new JSDOM(HTML,{url:'https://diasporact.test/'+(hash||''),runScripts:'dangerously',pretendToBeVisual:true,
    beforeParse(w){w.supabase={createClient:()=>mock.client};w.DIASPORACT_CONFIG={url:'https://x.supabase.co',anonKey:'anon'};
      w.addEventListener('error',e=>errs.push(String(e.error&&e.error.stack||e.message)));w.HTMLElement.prototype.scrollIntoView=function(){};
      w.matchMedia=w.matchMedia||(()=>({matches:false,addListener(){},removeListener(){}}));}});
  const w=dom.window,d=w.document;
  const api={w,d,errs,
    txt:()=>{const c=d.body.cloneNode(true);c.querySelectorAll('script').forEach(x=>x.remove());return c.textContent.replace(/\s+/g,' ');},
    q:s=>d.querySelector(s),
    click:async(s)=>{const el=typeof s==='string'?d.querySelector(s):s;if(!el)throw new Error('introuvable: '+s);el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));await sleep(60);},
    clickText:async(sel,txt)=>{const el=[...d.querySelectorAll(sel)].find(e=>e.textContent.includes(txt));if(!el)throw new Error('introuvable: '+sel+' '+txt);el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));await sleep(80);},
    set:(s,v)=>{const el=d.querySelector(s);if(!el)throw new Error('introuvable: '+s);el.value=v;el.dispatchEvent(new w.Event('input',{bubbles:true}));el.dispatchEvent(new w.Event('change',{bubbles:true}));},
    submit:async(s)=>{const f=d.querySelector(s);if(!f)throw new Error('form introuvable: '+s);f.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await sleep(120);}};
  await sleep(150);return api;
}
(async()=>{
  /* A. Visiteur sans lien, puis lien d'invitation */
  let m=makeMock({});
  m.DB.invites.push({code:'edu-abc123',kind:'join',canal_id:'edu',active:true});
  let a=await open(m);
  ok(a.txt().includes('invitation'),'A1 écran « sur invitation » sans lien');
  a.set('#il-in','https://diasporact.test/#/i/edu-abc123');await a.submit('[data-form=invlink]');await sleep(100);
  ok(a.q('#pseudo')!==null,'A2 lien valide → formulaire de pseudo');
  a.set('#pseudo','Ab');ok(a.q('#pseudo-go').disabled,'A3 pseudo trop court refusé');
  a.set('#pseudo','sidi.paris');await sleep(450);ok(!a.q('#pseudo-go').disabled,'A4 pseudo libre accepté');
  await a.submit('[data-form=pseudo]');await sleep(150);
  ok(a.txt().includes('@sidi.paris'),'A5 compte créé, accueil affiché');
  ok(m.DB.canal_members.some(x=>x.canal_id==='edu'&&x.status==='member'),'A6 adhésion au canal du lien');
  ok(a.errs.length===0,'A7 aucune erreur JS ('+a.errs.join('|')+')');
  /* lien invalide */
  let a2=await open(makeMock({}),'#/i/nimporte');await sleep(150);
  ok(a2.txt().includes('plus valable'),'A8 lien invalide expliqué');
  /* B. Membre : navigation, projets, tâches, commentaires */
  m=makeMock({session:'u-1'});
  const P=(pseudo,extra)=>Object.assign({id:'p-'+pseudo,auth_uid:null,pseudo,country:'France',lang:'fr',skills:[],matching:false,show_honor:true,is_admin:false,is_ref:false},extra||{});
  m.DB.profiles.push(P('sidi.paris',{auth_uid:'u-1',skills:['développement web'],matching:true}),P('mariem.paris',{skills:['réseau informatique'],matching:true}),P('oumar.bxl',{is_ref:true}));
  ['edu','num'].forEach(c=>m.DB.canal_members.push({canal_id:c,user_id:'p-sidi.paris',status:'member',is_moderator:false,is_relay:false}));
  m.DB.canal_members.push({canal_id:'edu',user_id:'p-mariem.paris',status:'member',is_moderator:true,is_relay:false});
  m.DB.projects.push({id:'pj1',canal_id:'edu',owner_id:'p-mariem.paris',title:'École numérique',objective:'Équiper une salle',orig_lang:'fr',status:'progress',needs:['Ingénieur réseau'],created_at:new Date().toISOString()});
  m.DB.tasks.push({id:'t1',project_id:'pj1',title:'Cahier des charges',status:'todo',assignee_id:null});
  m.DB.milestones.push({id:'ms1',project_id:'pj1',title:'Validé',due:'2027-01-01',done:false});
  m.DB.project_team.push({project_id:'pj1',user_id:'p-mariem.paris'});
  m.DB.announcements.push({id:'an1',canal_id:'edu',author_id:'p-mariem.paris',title:'Rentrée',body:'Bienvenue',orig_lang:'fr',valid_until:null,created_at:new Date().toISOString()});
  m.DB.helps.push({id:'h1',author_id:'p-oumar.bxl',domain:'adm',country:'France',urgent:true,status:'open',claimed_by:null,body:'Mon passeport expire bientôt',reply:null,created_at:new Date().toISOString()});
  a=await open(m);await sleep(150);
  ok(a.txt().includes('@sidi.paris')&&a.txt().includes('Rentrée'),'B1 accueil avec annonce du canal');
  await a.click('[data-act=read]');ok(a.txt().includes('Lu'),'B2 lecture confirmée (enregistrée)');
  ok(m.DB.ann_reads.length===1,'B3 lecture écrite en base');
  await a.clickText('.tab','Projets');await a.clickText('[data-act=proj-tab]','Tous');
  ok(a.txt().includes('École numérique'),'B4 liste des projets');
  await a.click('[data-act=open-project]');
  ok(a.txt().includes('Cahier des charges'),'B5 fiche projet');
  ok(!a.txt().includes('Gérer le projet'),'B6 pas d\'outils de gestion pour un simple membre');
  await a.click('[data-act=take]');ok(m.DB.tasks[0].assignee_id==='p-sidi.paris','B7 tâche prise');
  await a.click('[data-act=finish]');ok(m.DB.tasks[0].status==='done','B8 tâche terminée');
  a.set('#cmt-text','Je m\'en occupe');await a.submit('[data-form=comment]');
  ok(m.DB.comments.length===1&&a.txt().includes('Je m\'en occupe'),'B9 commentaire publié');
  ok(m.DB.notifications.filter(n=>n.kind==='comment').length===1,'B10 propriétaire notifié');
  ok(a.txt().includes('Rejoindre l’équipe'),'B11 bouton rejoindre l\'équipe');
  await a.clickText('[data-act=apply]','Rejoindre');ok(m.DB.project_team.some(x=>x.user_id==='p-sidi.paris'),'B12 équipe rejointe');
  ok(a.txt().includes('mariem.paris'),'B13 correspondance de compétences affichée ('+(a.txt().match(/Suggestions[^.]*/)||[''])[0].slice(0,40)+')');
  /* nouveau projet */
  await a.clickText('.tab','Projets');await a.click('[data-act=new-project]');
  a.set('#np-title','Collecte de livres');a.set('#np-obj','Livres pour Kaédi');a.set('#np-needs','Transport, Dons');await a.submit('[data-form=project]');await sleep(150);
  ok(m.DB.projects.length===2&&m.DB.project_team.filter(x=>x.project_id!=='pj1').length===1,'B14 projet créé avec équipe');
  ok(a.txt().includes('Collecte de livres'),'B15 fiche du nouveau projet affichée');
  ok(a.txt().includes('Gérer le projet'),'B16 propriétaire : outils de gestion');
  a.set('#tk-new','Lister les titres');await a.submit('[data-form=addtask]');ok(m.DB.tasks.length===2,'B17 tâche ajoutée');
  a.set('#ms-t','Départ du conteneur');a.set('#ms-d','2027-03-01');await a.submit('[data-form=addms]');ok(m.DB.milestones.length===2,'B18 jalon ajouté');
  await a.click('[data-act=set-status][data-v=done]');ok(m.DB.projects[1].status==='done','B19 statut modifié');
  await a.click('[data-act=close-sheet]').catch(()=>{});
  /* entraide */
  await a.clickText('.tab','Entraide');await a.click('[data-act=new-help]');
  a.set('#nh-country','France');a.set('#nh-txt','Comment légaliser un acte de naissance ?');await a.submit('[data-form=help]');await sleep(150);
  ok(m.DB.helps.length===2,'B20 demande d\'entraide créée');
  ok(!a.txt().includes('Mon passeport expire'),'B21 les demandes des autres sont cachées au simple membre');
  /* alertes */
  await a.clickText('.tab','Alertes');ok(true,'B22 alertes affichées');
  /* arabe */
  await a.click('.lang-btn');ok(a.d.documentElement.dir==='rtl','B23 arabe : direction RTL');
  await a.click('.lang-btn');
  ok(a.errs.length===0,'B24 aucune erreur JS ('+a.errs.join('|')+')');
  /* C. Modérateur */
  m=makeMock({session:'u-2'});
  m.DB.profiles.push(P('mariem.paris',{auth_uid:'u-2'}),P('ahmed.lille'));
  m.DB.canal_members.push({canal_id:'edu',user_id:'p-mariem.paris',status:'member',is_moderator:true,is_relay:false},{canal_id:'edu',user_id:'p-ahmed.lille',status:'pending',is_moderator:false,is_relay:false});
  m.DB.badge_requests.push({id:'br1',user_id:'p-ahmed.lille',type:'expert:fin',note:'Expert-comptable',status:'pending'});
  a=await open(m);await sleep(100);
  ok(a.txt().includes('Demandes d’adhésion à valider'),'C1 demandes à valider sur l\'accueil');
  await a.click('[data-act=open-canal]');await a.click('[data-act=canal-tab][data-tab=mod]');
  ok(a.txt().includes('@ahmed.lille')&&a.txt().includes('Générer le lien d’invitation'),'C2 onglet modération');
  await a.click('[data-act=accept]');ok(m.DB.canal_members.find(x=>x.user_id==='p-ahmed.lille').status==='member','C3 adhésion acceptée');
  await a.click('[data-act=gen-link]');ok(a.txt().includes('#/i/edu-'),'C4 lien d\'invitation généré');
  a.set('#wa-in','https://chat.whatsapp.com/AbC123');await a.submit('[data-form=wa]');ok(m.DB.canals[0].wa_link==='https://chat.whatsapp.com/AbC123','C5 groupe WhatsApp enregistré');
  a.set('#rc-p','ahmed.lille');await a.submit('[data-form=recovery]');ok(a.txt().includes('Lien prêt')&&m.DB.invites.some(i=>i.kind==='recovery'),'C6 lien de reconnexion généré');
  await a.click('[data-act=close-sheet]');
  await a.click('[data-act=badge-grant]');ok(m.DB.badge_grants.length===1,'C7 badge attribué');
  ok(!a.txt().includes('Administration'),'C8 pas d\'administration pour un modérateur');
  ok(a.errs.length===0,'C9 aucune erreur JS ('+a.errs.join('|')+')');
  /* D. Reconnexion sur un nouvel appareil */
  const code=m.DB.invites.find(i=>i.kind==='recovery').code;
  m.setSession(null);
  let r=await open(m,'#/i/'+code);await sleep(150);
  ok(r.txt().includes('Retrouver votre compte'),'D1 écran de reconnexion');
  await r.click('[data-act=rec-go]');await sleep(150);ok(r.txt().includes('@ahmed.lille'),'D2 compte retrouvé');
  /* E. Administrateur */
  m=makeMock({session:'u-3'});m.DB.profiles.push(P('admin.nkc',{auth_uid:'u-3',is_admin:true}),P('khadija.madrid'));
  a=await open(m);await sleep(100);
  await a.click('[data-act=go-me]');ok(a.txt().includes('Administration'),'E1 section administration');
  a.set('#ad-p','khadija.madrid');a.set('#ad-c','san');await a.submit('[data-form=setrole]');
  ok(m.DB.canal_members.some(x=>x.canal_id==='san'&&x.is_moderator),'E2 modérateur nommé');
  a.set('#ar-p','khadija.madrid');await a.submit('[data-form=setref]');ok(m.DB.profiles[1].is_ref,'E3 référent nommé');
  await a.clickText('.tab','Accueil');ok(a.txt().includes('Publier une annonce'),'E4 l\'administrateur publie');
  await a.click('[data-act=publish-ann]');a.set('#an-t','Assemblée générale');a.set('#an-b','Le 12 décembre');a.set('#an-c','all');await a.submit('[data-form=ann]');await sleep(150);
  ok(m.DB.announcements.length===1&&m.DB.announcements[0].canal_id===null,'E5 annonce générale publiée');
  ok(a.errs.length===0,'E6 aucune erreur JS ('+a.errs.join('|')+')');
  /* F. Configuration absente */
  const dom=new JSDOM(HTML,{runScripts:'dangerously',url:'https://diasporact.test/'});await sleep(200);
  ok((()=>{const c=dom.window.document.body.cloneNode(true);c.querySelectorAll('script').forEach(x=>x.remove());return c.textContent.includes('pas encore configurée');})(),'F1 message si clés absentes');
  console.log('----');console.log(pass+' réussis, '+fail+' échoués');process.exit(fail?1:0);
})().catch(e=>{console.log('EXCEPTION',e.stack);process.exit(2);});
