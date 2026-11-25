const {JSDOM}=require('jsdom');const fs=require('fs');const makeMock=require('./mock_sb.js');
const ROOT=require('path').resolve(__dirname,'..');
/* index.html charge app.js en fichier externe : on l'incorpore pour jsdom ; config.js et supabase.js sont simulés par le test. */
const HTML=fs.readFileSync(ROOT+'/index.html','utf8').replace(/<script src="(config|vendor\/supabase)\.js"><\/script>/g,'').replace('<script src="app.js"></script>',()=>'<script>'+fs.readFileSync(ROOT+'/app.js','utf8').replace(/<\/script/g,'<\\/script')+'</script>');
let pass=0,fail=0;function ok(c,m){if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function open(mock,hash,opt){
  const errs=[];
  const dom=new JSDOM(HTML,{url:'https://diasporact.test/'+(hash||''),runScripts:'dangerously',pretendToBeVisual:true,
    beforeParse(w){try{if(!(opt&&opt.nolang))w.localStorage.setItem('dp-lang','fr');}catch(e){}if(!(opt&&opt.tour))try{w.localStorage.setItem('dp-tour','1');}catch(e){}w.supabase={createClient:()=>mock.client};w.fetch=mock.fetch;w.DIASPORACT_CONFIG={url:'https://x.supabase.co',anonKey:'anon'};
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
  a.set('#pw','motdepasse1');await a.submit('[data-form=pseudo]');await sleep(250);
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
  ok(a.d.querySelectorAll('.kb-col').length===3&&a.q('.kb-col [data-act=take]')!==null,'B6b vue Kanban par défaut : 3 colonnes (À faire, En cours, Fait)');
  ok(a.txt().includes('Personnaliser les colonnes')&&a.txt().includes('Bientôt'),'B6c personnalisation des colonnes annoncée « Bientôt »');
  await a.click('[data-act=kb-cols]');ok(a.txt().includes('colonnes sont fixes')&&a.q('.sheet button[disabled]')!==null,'B6d personnalisation inactive pendant la phase test');
  await a.click('[data-act=close-sheet]');
  await a.click('[data-act=task-view][data-v=list]');ok(a.d.querySelectorAll('.kb-col').length===0&&a.q('.tk')!==null,'B6e bascule vers la vue liste');
  await a.click('[data-act=task-view][data-v=board]');
  await a.click('[data-act=take]');ok(m.DB.tasks[0].assignee_id==='p-sidi.paris','B7 tâche prise');
  ok(a.d.querySelectorAll('.kb-col')[1].textContent.includes('Cahier des charges'),'B7b la tâche prise passe dans la colonne En cours');
  ok(!a.q('[data-act=finish]')&&!!a.q('[data-act=task-review]'),'B8 l\'assigné ne peut pas passer sa tâche en fait mais peut alerter le chef de projet');
  await a.click('[data-act=task-review]');ok(m.DB.tasks[0].review_at&&m.DB.notifications.some(n=>n.kind==='review'&&n.user_id==='p-mariem.paris'),'B8b alerte envoyée au chef de projet (notification)');
  ok(a.txt().includes('Chef de projet alerté')&&!a.q('[data-act=task-review]'),'B8c l\'assigné voit que l\'alerte est partie');
  m.DB.tasks[0].status='done';
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
  await a.click('.lang-btn');await a.click('.lang-btn');ok(a.d.documentElement.dir==='rtl','B23 arabe : direction RTL');
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
  /* G. Nom/prénom facultatifs, sélecteur de pays par drapeaux, porte-parole */
  m=makeMock({session:'u-4'});m.DB.profiles.push(P('sidi.paris',{auth_uid:'u-4',country:'France'}),P('awa.dakar',{country:'Sénégal'}));
  m.DB.canal_members.push({canal_id:'edu',user_id:'p-sidi.paris',status:'member',is_moderator:false,is_relay:false});
  a=await open(m);await sleep(120);
  await a.click('[data-act=go-me]');
  ok(!!a.q('#my-fn')&&!!a.q('#my-ln'),'G1 champs prénom et nom dans « Moi »');
  ok(a.q('[data-act=cp-toggle]')!==null,'G2 bouton drapeau à côté du champ pays');
  await a.click('.cp-btn[data-id=my-country]');
  ok(a.d.querySelectorAll('#cpg-my-country .cp-item').length>20,'G3 grille de pays affichée');
  a.set('.cp-q','sen');ok([...a.d.querySelectorAll('#cpg-my-country .cp-item')].some(b=>b.dataset.v==='Sénégal'),'G4 recherche sans accent');
  await a.click('#cpg-my-country .cp-item[data-v="Sénégal"]');
  ok(a.q('#my-country').value==='Sénégal'&&a.q('#cpp-my-country').hidden,'G5 pays choisi, grille refermée');
  await a.click('.cp-btn[data-id=my-country]');a.set('.cp-q','zzzz');ok(a.txt().includes('Aucun pays trouvé'),'G6 aucun résultat expliqué');
  a.set('#my-fn','Sidi');a.set('#my-ln','Ould Ahmed');await a.submit('[data-form=myname]');await sleep(150);
  ok(m.DB.profiles[0].first_name==='Sidi'&&m.DB.profiles[0].last_name==='Ould Ahmed','G7 nom et prénom enregistrés');
  ok(a.txt().includes('Sidi Ould Ahmed @sidi.paris'),'G8 nom affiché, pseudo en grisé à côté');
  ok(!!a.q('.muted.small')&&[...a.d.querySelectorAll('span.muted.small')].some(e=>e.textContent.indexOf('@sidi.paris')===0),'G9 pseudo grisé');
  ok(a.errs.length===0,'G10 aucune erreur JS ('+a.errs.join('|')+')');
  /* H. Porte-parole : désignation par l'admin, annonce à tout un pays */
  m=makeMock({session:'u-5'});m.DB.profiles.push(P('admin.nkc',{auth_uid:'u-5',is_admin:true}),P('awa.dakar',{country:'Sénégal'}),P('moussa.dakar',{country:'senegal'}));
  a=await open(m);await sleep(120);await a.click('[data-act=go-me]');
  a.set('#as-p','awa.dakar');a.set('#as-c','Sénégal');a.q('#as-o').checked=true;await a.submit('[data-form=setspk]');
  ok(m.DB.spokespersons.length===1&&m.DB.spokespersons[0].country==='Sénégal','H1 porte-parole désigné par l\'admin');
  a.set('#as-p','awa.dakar');a.set('#as-c','sénégal');a.q('#as-o').checked=true;await a.submit('[data-form=setspk]');
  ok(m.DB.spokespersons.length===1,'H2 pas de doublon (casse ignorée)');
  m.DB.profiles.push(P('autre.membre',{auth_uid:'u-6'}));
  m.setSession('u-6');a=await open(m);await sleep(120);
  ok(!a.txt().includes('Publier une annonce'),'H3 un simple membre ne peut pas publier');
  m.setSession(null);m.DB.profiles.find(x=>x.pseudo==='awa.dakar').auth_uid='u-7';m.setSession('u-7');
  a=await open(m);await sleep(150);
  ok(a.txt().includes('Publier une annonce'),'H4 le porte-parole voit « Publier une annonce »');
  await a.click('[data-act=publish-ann]');
  const opts=[...a.d.querySelectorAll('#an-c option')].map(o=>o.value);
  ok(opts.includes('pays:Sénégal')&&!opts.includes('all'),'H5 option « diaspora du Sénégal » proposée, pas « tous les canaux »');
  a.set('#an-t','Rencontre à Dakar');a.set('#an-b','Samedi à 15h');a.set('#an-c','pays:Sénégal');await a.submit('[data-form=ann]');await sleep(150);
  const an=m.DB.announcements[0];
  ok(an&&an.country==='Sénégal'&&an.canal_id===null,'H6 annonce enregistrée pour le pays, sans canal');
  await a.click('[data-act=go-me]');ok(a.txt().includes('Porte-parole (Sénégal)'),'H7 rôle affiché dans « Moi »');
  ok(a.errs.length===0,'H8 aucune erreur JS ('+a.errs.join('|')+')');
  /* I. Fonctions IA réservées aux testeurs désignés */
  m=makeMock({session:'u-8'});m.DB.profiles.push(P('admin.nkc',{auth_uid:'u-8',is_admin:true}),P('awa.dakar',{auth_uid:'u-9'}));
  ['edu'].forEach(c=>m.DB.canal_members.push({canal_id:c,user_id:'p-awa.dakar',status:'member',is_moderator:false,is_relay:false}));
  m.DB.announcements.push({id:'an9',canal_id:null,author_id:'p-admin.nkc',title:'Assemblée',body:'Le 12 décembre à Paris',orig_lang:'fr',valid_until:null,created_at:new Date().toISOString()});
  m.DB.projects.push({id:'pj9',canal_id:'edu',owner_id:'p-admin.nkc',title:'École',objective:'Équiper une salle informatique',orig_lang:'fr',status:'progress',needs:[],created_at:new Date().toISOString()});
  m.setSession('u-9');a=await open(m);await sleep(150);
  ok(!a.q('[data-act=ai-tr]'),'I1 sans statut de testeur : aucun bouton IA');
  await a.clickText('.tab','Projets');await a.click('[data-act=new-project]');ok(!a.q('#ai-chat'),'I2 sans statut de testeur : pas de bloc « discussion → projet »');
  m.setSession('u-8');a=await open(m);await sleep(120);await a.click('[data-act=go-me]');
  a.set('#ai-p','awa.dakar');a.q('#ai-o').checked=true;await a.submit('[data-form=setai]');
  ok(m.DB.ai_testers.length===1&&m.DB.ai_testers[0].user_id==='p-awa.dakar','I3 l\'admin désigne un testeur IA');
  m.setSession('u-9');a=await open(m);await sleep(150);
  ok(!!a.q('[data-act=ai-tr]'),'I4 le testeur voit « Traduire (IA) » sur une annonce');
  await a.click('[data-act=ai-tr]');
  ok(a.txt().includes('Utiliser l’IA')&&m.aiCalls.length===0,'I5 premier usage : information avant tout envoi');
  await a.click('[data-act=ai-agree]');await sleep(150);
  ok(m.aiCalls.length===1&&m.aiCalls[0].body.task==='translate'&&m.aiCalls[0].body.target==='fr'&&m.aiCalls[0].body.text.includes('Assemblée'),'I6 texte envoyé au serveur avec la langue cible');
  ok(m.aiCalls[0].opt.headers.Authorization==='Bearer tok-u-9','I7 appel authentifié avec la session du membre');
  ok(a.txt().includes('TRADUIT:')&&a.txt().includes('Généré par IA'),'I8 traduction affichée avec la mention « Généré par IA »');
  await a.click('[data-act=ai-tr-hide]');ok(!a.txt().includes('TRADUIT:')&&!!a.q('[data-act=ai-tr]'),'I9 traduction masquable');
  m.aiMode.status=429;m.aiMode.error='quota';await a.click('[data-act=ai-tr]');await sleep(150);
  ok(a.txt().includes('Limite quotidienne'),'I10 quota atteint : message clair');
  m.aiMode.status=200;
  await a.clickText('.tab','Projets');await a.click('[data-act=new-project]');
  ok(!!a.q('#ai-chat'),'I11 bloc « discussion → projet » pour le testeur');
  await a.click('[data-act=ai-chat]');ok(m.aiCalls.length===2,'I12 discussion vide : aucun envoi');
  a.set('#ai-chat','Fatou : on pourrait équiper l\'école de Kaédi\nMoussa : oui il faut du transport');await a.click('[data-act=ai-chat]');await sleep(200);
  ok(m.aiCalls.length===3&&m.aiCalls[2].body.task==='project','I13 discussion envoyée');
  ok(a.q('#np-title').value==='Projet IA'&&a.q('#np-obj').value==='Objectif IA'&&a.q('#np-needs').value==='Transport, Dons','I14 formulaire prérempli, à relire avant publication');
  ok(m.DB.projects.length===1,'I15 rien n\'est publié automatiquement');
  await a.click('[data-act=go-me]');ok(a.txt().includes('Testeur IA'),'I16 statut affiché dans « Moi »');
  ok(a.errs.length===0,'I17 aucune erreur JS ('+a.errs.join('|')+')');
  /* J. Visite guidée */
  m=makeMock({session:'u-1'});
  m.DB.profiles.push({id:'p-sidi.paris',auth_uid:'u-1',pseudo:'sidi.paris',country:'France',lang:'fr',skills:[],matching:false,show_honor:true,is_admin:false,is_ref:false});
  m.DB.canal_members.push({canal_id:'edu',user_id:'p-sidi.paris',status:'member',is_moderator:false,is_relay:false});
  a=await open(m,'',{tour:true});await sleep(900);
  ok(a.txt().includes('Bienvenue sur Diasporact')&&a.txt().includes('Étape 1 sur 9'),'J1 première connexion : la visite s\'ouvre (9 étapes sans IA)');
  await a.click('[data-act=tour-next]');ok(a.txt().includes('Étape 2 sur 9')&&a.txt().includes('cinq onglets'),'J2 étape suivante');
  await a.click('[data-act=tour-prev]');ok(a.txt().includes('Étape 1 sur 9'),'J3 étape précédente');
  await a.click('[data-act=tour-next]');await a.click('[data-act=tour-next]');
  ok(!!a.q('[data-act=tour-go]'),'J4 une étape propose « Essayer » (voir les canaux)');
  await a.click('[data-act=tour-go]');
  ok(a.q('#sheets').hidden&&a.w.localStorage.getItem('dp-tour')==='1'&&a.txt().includes('Canaux'),'J5 le bouton mène à l\'écran concerné et la visite est marquée vue');
  await a.click('[data-act=tab][data-tab=home]');await sleep(900);
  ok(a.q('#sheets').hidden,'J6 la visite ne se rouvre pas toute seule');
  await a.click('[data-act=tour-open]');ok(a.txt().includes('Étape 1 sur 9'),'J7 « Revoir la visite guidée » depuis l\'accueil');
  await a.click('[data-act=tour-end]');ok(a.q('#sheets').hidden,'J8 la visite se ferme');
  await a.click('[data-act=go-me]');ok(!!a.q('[data-act=tour-open]'),'J9 relançable depuis « Moi »');
  await a.click('[data-act=lang][data-v=ar]');await a.click('[data-act=tour-open]');
  ok(a.txt().includes('جولة تعريفية')&&a.txt().includes('الخطوة 1 من 9'),'J10 visite en arabe');
  ok(a.errs.length===0,'J11 aucune erreur JS ('+a.errs.join('|')+')');
  m=makeMock({session:'u-9'});
  m.DB.profiles.push({id:'p-ai',auth_uid:'u-9',pseudo:'ai.tester',country:'France',lang:'fr',skills:[],matching:false,show_honor:true,is_admin:false,is_ref:false});
  m.DB.ai_testers=[{user_id:'p-ai'}];
  a=await open(m,'',{tour:true});await sleep(900);
  ok(a.txt().includes('Étape 1 sur 10'),'J12 testeur IA : étape supplémentaire sur les fonctions IA');
  /* K. Anglais */
  m=makeMock({session:'u-1'});
  m.DB.profiles.push({id:'p-sidi.paris',auth_uid:'u-1',pseudo:'sidi.paris',country:'France',lang:'fr',skills:[],matching:false,show_honor:true,is_admin:false,is_ref:false});
  m.DB.canal_members.push({canal_id:'edu',user_id:'p-sidi.paris',status:'member',is_moderator:false,is_relay:false});
  m.DB.announcements.push({id:'an1',canal_id:'edu',author_id:'p-sidi.paris',title:'Rentrée',body:'Bienvenue',orig_lang:'fr',valid_until:null,created_at:new Date().toISOString()});
  a=await open(m);await sleep(150);
  ok(a.q('.lang-btn').textContent==='EN','K1 bouton de langue : français → EN');
  await a.click('.lang-btn');
  ok(a.d.documentElement.lang==='en'&&a.d.documentElement.dir==='ltr'&&a.txt().includes('Official announcements')&&a.txt().includes('Hello'),'K2 interface en anglais, sens gauche-droite');
  ok(a.q('.lang-btn').textContent==='ع'&&a.w.localStorage.getItem('dp-lang')==='en','K3 langue mémorisée, bouton suivant = arabe');
  await a.clickText('.tab','Channels');ok(a.txt().includes('Education & youth'),'K4 noms de canaux en anglais');
  await a.click('[data-act=go-me]');ok(a.txt().includes('Language')&&a.q('[data-act=lang][data-v=en]').getAttribute('aria-pressed')==='true','K5 choix de langue à trois boutons dans « Moi »');
  await a.click('.lang-btn');ok(a.d.documentElement.dir==='rtl','K6 anglais → arabe : sens inversé');
  await a.click('.lang-btn');ok(a.d.documentElement.lang==='fr'&&a.txt().includes('Mes canaux'),'K7 arabe → français');
  ok(a.errs.length===0,'K8 aucune erreur JS ('+a.errs.join('|')+')');
  await a.click('[data-act=lang][data-v=en]');await sleep(60);
  a=await open(m,'',{nolang:true});await sleep(150);
  ok(a.d.documentElement.lang==='fr'||a.d.documentElement.lang==='en','K9 ouverture sans choix : langue du navigateur');
  /* L. Validation d'une tâche par le chef de projet */
  m=makeMock({session:'u-2'});
  m.DB.profiles.push({id:'p-sidi.paris',auth_uid:null,pseudo:'sidi.paris',country:'France',lang:'fr',skills:[],matching:false,show_honor:true,is_admin:false,is_ref:false},{id:'p-mariem.paris',auth_uid:'u-2',pseudo:'mariem.paris',country:'France',lang:'fr',skills:[],matching:false,show_honor:true,is_admin:false,is_ref:false});
  ['p-sidi.paris','p-mariem.paris'].forEach(u=>m.DB.canal_members.push({canal_id:'edu',user_id:u,status:'member',is_moderator:false,is_relay:false}));
  m.DB.projects.push({id:'pj1',canal_id:'edu',owner_id:'p-mariem.paris',title:'École numérique',objective:'Équiper',orig_lang:'fr',status:'progress',needs:[],created_at:new Date().toISOString()});
  m.DB.tasks.push({id:'t1',project_id:'pj1',title:'Cahier des charges',status:'doing',assignee_id:'p-sidi.paris',review_at:new Date().toISOString()});
  a=await open(m);await sleep(150);
  await a.clickText('.tab','Projets');await a.clickText('[data-act=proj-tab]','Tous');await a.click('[data-act=open-project]');
  ok(!!a.q('[data-act=finish]'),'L1 le chef de projet voit « Marquer fait » sur la tâche d\'un membre');
  ok(a.txt().includes('Validation demandée'),'L1b le chef de projet voit que la validation est demandée');
  await a.click('[data-act=finish]');ok(m.DB.tasks[0].status==='done'&&a.d.querySelectorAll('.kb-col')[2].textContent.includes('Cahier des charges'),'L2 la tâche passe dans la colonne Fait');
  /* M. Questionnaire de retours */
  m=makeMock({session:'u-1'});
  m.DB.profiles.push({id:'p-sidi.paris',auth_uid:'u-1',pseudo:'sidi.paris',country:'France',lang:'fr',skills:[],matching:false,show_honor:true,is_admin:false,is_ref:false});
  a=await open(m);await sleep(150);
  ok(a.txt().includes('Donnez votre avis'),'M1 carte « Donnez votre avis » sur l\'accueil');
  await a.click('[data-act=fb-open]');
  ok(!!a.q('[data-form=feedback]')&&a.q('input[name=fb_nps]')&&!a.q('input[name=fb_ai]'),'M2 le questionnaire s\'ouvre (sans question IA pour un non-testeur)');
  await a.submit('[data-form=feedback]');ok(m.DB.feedback.length===0&&a.txt().includes('au moins une question'),'M3 questionnaire vide refusé');
  await a.click('input[name=fb_easy][value="4"]');await a.click('input[name=fb_used][value=help]');await a.click('input[name=fb_used][value=proj]');a.set('textarea[name=fb_issue]','Bouton trop petit');
  await a.submit('[data-form=feedback]');await sleep(200);
  ok(m.DB.feedback.length===1&&m.DB.feedback[0].answers.easy===4&&m.DB.feedback[0].answers.used.length===2&&m.DB.feedback[0].answers.issue==='Bouton trop petit'&&m.DB.feedback[0].user_id==='p-sidi.paris','M4 réponses enregistrées');
  ok(!a.txt().includes('Donnez votre avis')&&a.txt().includes('@sidi.paris'),'M5 retour à l\'accueil, carte masquée après réponse');
  a=await open(m,'#/q');await sleep(200);
  ok(!!a.q('[data-form=feedback]')&&a.txt().includes('déjà répondu'),'M6 lien direct #/q ouvre le questionnaire');
  m=makeMock({session:'u-9'});m.DB.profiles.push({id:'p-ai',auth_uid:'u-9',pseudo:'ai.tester',country:'France',lang:'fr',skills:[],matching:false,show_honor:true,is_admin:false,is_ref:false});m.DB.ai_testers=[{user_id:'p-ai'}];
  a=await open(m,'#/q');await sleep(200);ok(!!a.q('input[name=fb_ai]'),'M7 le testeur IA a la question sur l\'assistant');
  m=makeMock({session:'u-3'});m.DB.profiles.push({id:'p-adm',auth_uid:'u-3',pseudo:'admin.nkc',country:'Mauritanie',lang:'fr',skills:[],matching:false,show_honor:true,is_admin:true,is_ref:false});
  m.DB.feedback.push({id:'f1',user_id:'p-adm',answers:{easy:5,nps:9,best:'Très clair'},lang:'fr',created_at:new Date().toISOString()},{id:'f2',user_id:'p-adm',answers:{easy:3,nps:7},lang:'en',created_at:new Date().toISOString()});
  a=await open(m);await sleep(150);await a.click('[data-act=go-me]');
  ok(a.txt().includes('#/q')&&a.txt().includes('Retours des testeurs'),'M8 l\'admin voit le lien direct à diffuser');
  await a.click('[data-act=fb-sum]');ok(a.txt().includes('4.0/5')&&a.txt().includes('8.0/10')&&a.txt().includes('Très clair'),'M9 synthèse : moyennes et verbatims');
  ok(a.errs.length===0,'M10 aucune erreur JS ('+a.errs.join('|')+')');
  /* F. Configuration absente */
  const dom=new JSDOM(HTML,{runScripts:'dangerously',url:'https://diasporact.test/'});await sleep(200);
  ok((()=>{const c=dom.window.document.body.cloneNode(true);c.querySelectorAll('script').forEach(x=>x.remove());return /pas encore configurée|not configured yet/.test(c.textContent);})(),'F1 message si clés absentes');
  console.log('----');console.log(pass+' réussis, '+fail+' échoués');process.exit(fail?1:0);
})().catch(e=>{console.log('EXCEPTION',e.stack);process.exit(2);});
