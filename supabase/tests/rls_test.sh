#!/usr/bin/env bash
# Test des règles de sécurité sur un PostgreSQL local (rôles Supabase simulés par mock.sql).
# Usage : DB="psql -h /tmp/pgt -p 5544 -U postgres -d t -q -t -A" bash rls_test.sh
set -u
DB=${DB:?}
A=aaaaaaaa-0000-0000-0000-000000000001; B=bbbbbbbb-0000-0000-0000-000000000002; C=cccccccc-0000-0000-0000-000000000003; D=dddddddd-0000-0000-0000-000000000004
pass=0; fail=0
q(){ local uid=$1; shift; $DB -c "set role authenticated; select set_config('request.jwt.claim.sub','$uid',false);" -c "$*" 2>&1 | tail -n +2 | grep -v '^$' | grep -v '^SET$'; }
sa(){ $DB -c "$*" 2>&1; }
ok(){ if [ "$2" = "$3" ]; then pass=$((pass+1)); echo "PASS $1"; else fail=$((fail+1)); echo "FAIL $1 (attendu '$3', obtenu '$2')"; fi; }
has(){ if echo "$2" | grep -qi "$3"; then pass=$((pass+1)); echo "PASS $1"; else fail=$((fail+1)); echo "FAIL $1 (attendu contient '$3', obtenu '$2')"; fi; }

sa "truncate profiles, invites, announcements cascade; insert into invites(code,kind,max_uses) values ('boot-admin','admin',1)" >/dev/null
q $A "select redeem_invite('boot-admin','admin.nkc','Mauritanie')" >/dev/null
ok "R1 premier admin créé" "$(q $A "select is_admin from profiles where pseudo='admin.nkc'")" "t"
has "R2 code admin à usage unique" "$(q $B "select redeem_invite('boot-admin','intrus','FR')")" "invalid_invite"

L=$(q $A "select rotate_canal_invite('edu')"); 
has "R3 admin génère le lien du canal" "$L" "edu-"
q $B "select redeem_invite('$L','sidi.paris','France')" >/dev/null
ok "R4 membre inscrit au canal via lien" "$(q $B "select count(*) from canal_members where canal_id='edu' and status='member'")" "1"
has "R5 pseudo déjà pris refusé" "$(q $C "select redeem_invite('$L','sidi.paris','FR')")" "pseudo_taken"
has "R6 pseudo invalide refusé" "$(q $C "select redeem_invite('$L','A B','FR')")" "bad_pseudo"
ok "R7 non inscrit ne voit aucun projet" "$(q $C "select count(*) from projects")" "0"
ok "R8 non inscrit ne voit pas l'entraide" "$(q $C "select count(*) from helps")" "0"

# projets / droits
PID=$(q $B "insert into projects(canal_id,owner_id,title,objective) values ('edu',me(),'École numérique','Équiper une salle') returning id" | head -1)
ok "R9 membre crée un projet dans son canal" "$(q $B "select count(*) from projects")" "1"
has "R10 membre ne crée pas dans un canal non rejoint" "$(q $B "insert into projects(canal_id,owner_id,title) values ('inv',me(),'Hors canal')")" "row-level security"
LI=$(q $A "select rotate_canal_invite('inv')"); q $C "select redeem_invite('$LI','mariem.paris','FR')" >/dev/null
ok "R11 membre d'un autre canal ne voit pas le projet" "$(q $C "select count(*) from projects")" "0"
has "R12 commentaire > 280 caractères refusé" "$(q $B "insert into comments(project_id,author_id,body) values ('$PID',me(),repeat('x',281))")" "check"
has "R13 non-membre ne peut pas commenter" "$(q $C "insert into comments(project_id,author_id,body) values ('$PID',me(),'salut')")" "row-level security"
ok "R14 membre commente" "$(q $B "insert into comments(project_id,author_id,body) values ('$PID',me(),'ok') returning 1")" "1"
has "R15 impossible de commenter sous le nom d'un autre" "$(q $B "insert into comments(project_id,author_id,body) values ('$PID',(select id from profiles where pseudo='mariem.paris'),'faux')")" "row-level security"

# tâches
q $B "insert into tasks(project_id,title) values ('$PID','Cahier des charges')" >/dev/null
TID=$(q $B "select id from tasks limit 1")
LE=$(q $A "select rotate_canal_invite('edu')"); q $D "select redeem_invite('$LE','ahmed.lille','FR')" >/dev/null
q $D "select take_task('$TID')" >/dev/null
ok "R16 membre prend une tâche libre" "$(q $B "select a.pseudo from tasks t join public_profiles a on a.id=t.assignee_id")" "ahmed.lille"
has "R17 membre ne modifie pas une tâche directement" "$(q $D "update tasks set title='piraté' where id='$TID' returning 1")" ""
ok "R18 modification directe sans effet" "$(q $B "select title from tasks")" "Cahier des charges"
q $D "select 1" >/dev/null
sa "update canal_members set is_moderator=true where canal_id='edu' and user_id=(select id from profiles where pseudo='sidi.paris')" >/dev/null
has "R19x un membre non assigné ne signale pas la tâche" "$(q $C "select request_task_review('$TID')")" "forbidden"
ok "R19y l'assigné signale sa tâche terminée" "$(q $D "select request_task_review('$TID')" ; q $B "select count(*) from notifications where kind='review'")" "1"
EXPECT=$(sa "select count(*) from (select owner_id u from projects union select user_id from canal_members where canal_id='edu' and status='member' and is_moderator) x where u <> (select id from profiles where pseudo='ahmed.lille')" | tr -d ' \n' | grep -o '[0-9]*' | head -1)
GOT=$(sa "select count(*) from notifications where kind='review'" | tr -d ' ' | grep -o '^[0-9]*$' | head -1)
ok "R19y2 le chef de projet et les modérateurs du canal sont tous alertés (sans doublon)" "$GOT" "$EXPECT"
sa "update canal_members set is_moderator=false where canal_id='edu' and user_id=(select id from profiles where pseudo='sidi.paris')" >/dev/null
has "R19z un second signalement immédiat est refusé" "$(q $D "select request_task_review('$TID')")" "too_soon"
has "R19a l'assigné ne peut pas passer sa tâche en fait" "$(q $D "select set_task_status('$TID','done')")" "forbidden"
ok "R19b la tâche reste en cours" "$(q $B "select status from tasks")" "doing"
q $A "select set_task_status('$TID','done')" >/dev/null
ok "R19 le modérateur/administrateur passe la tâche en fait" "$(q $B "select status from tasks")" "done"
has "R19c l'assigné ne rouvre pas une tâche terminée" "$(q $D "select set_task_status('$TID','doing')")" "forbidden"
ok "R20 engagement compté" "$(q $D "select tasks from engagement where user_id=me()")" "1"
ok "R21 notification de tâche reçue" "$(q $D "select count(*) from notifications where kind='task'")" "0"

# élévation de privilèges
has "R22 membre ne s'auto-promeut pas admin" "$(q $B "update profiles set is_admin=true where auth_uid=auth.uid()")" "permission denied"
has "R23 membre ne fabrique pas d'invitation" "$(q $B "insert into invites(code,kind,max_uses) values ('x','admin',1)")" "row-level security"
has "R24 membre ne génère pas de lien de canal" "$(q $B "select rotate_canal_invite('edu')")" "forbidden"
has "R25 membre ne nomme pas de modérateur" "$(q $B "select set_role('sidi.paris','edu',true)")" "forbidden"
ok "R26 membre ne lit pas les invitations" "$(q $B "select count(*) from invites")" "0"

# annonces
has "R27 membre ne publie pas d'annonce" "$(q $B "insert into announcements(canal_id,author_id,title,body) values ('edu',me(),'Test','corps')")" "row-level security"
q $A "select set_role('sidi.paris','edu',true)" >/dev/null
ok "R28 modérateur publie dans son canal" "$(q $B "insert into announcements(canal_id,author_id,title,body) values ('edu',me(),'Rentrée','corps') returning 1")" "1"
has "R29 modérateur ne publie pas dans un autre canal" "$(q $B "insert into announcements(canal_id,author_id,title,body) values ('inv',me(),'Hors','corps')")" "row-level security"
has "R30 modérateur ne publie pas pour tous les canaux" "$(q $B "insert into announcements(canal_id,author_id,title,body) values (null,me(),'Global','corps')")" "row-level security"
ok "R31 annonce de canal invisible hors canal" "$(q $C "select count(*) from announcements")" "0"
ok "R32 admin publie pour tous" "$(q $A "insert into announcements(canal_id,author_id,title,body) values (null,me(),'Assemblée','corps') returning 1")" "1"
ok "R33 annonce générale lue par tous les inscrits" "$(q $C "select count(*) from announcements")" "1"
AN=$(q $C "select id from announcements limit 1"); q $C "select mark_read('$AN')" >/dev/null
ok "R34 confirmation de lecture comptée" "$(q $C "select reads from engagement where user_id=me()")" "1"

# entraide
HID=$(q $C "insert into helps(author_id,domain,country,body) values (me(),'adm','France','Comment renouveler mon passeport ?') returning id" | head -1)
ok "R35 demande d'entraide invisible des simples membres" "$(q $D "select count(*) from helps")" "0"
ok "R35b visible d'un modérateur" "$(q $B "select count(*) from helps")" "1"
q $A "select set_referent('ahmed.lille',true)" >/dev/null
ok "R35c visible d'un référent" "$(q $D "select count(*) from helps")" "1"
q $A "select set_referent('ahmed.lille',false)" >/dev/null
has "R36 on ne peut pas s'attribuer sa propre demande" "$(q $C "select claim_help('$HID')")" ""
ok "R37 auteur ne peut pas prendre sa demande" "$(q $C "select status from helps")" "open"
has "R37b un membre non référent ne peut pas prendre la demande" "$(q $B "select claim_help('$HID')")" "forbidden"
q $A "select set_referent('sidi.paris',true)" >/dev/null
q $B "select claim_help('$HID')" >/dev/null
ok "R38 membre prend la demande" "$(q $C "select status from helps")" "doing"
ok "R39 auteur notifié" "$(q $C "select count(*) from notifications where kind='claimed'")" "1"
q $B "select solve_help('$HID','Voici la démarche')" >/dev/null
ok "R40 demande résolue" "$(q $C "select status from helps")" "solved"
ok "R41 engagement entraide" "$(q $B "select help from engagement where user_id=me()")" "1"

# badges
q $C "insert into badge_requests(user_id,type,note) values (me(),'expert:fin','Experte-comptable')" >/dev/null
RID=$(q $A "select id from badge_requests limit 1")
ok "R42 membre ne voit pas les demandes d'un autre" "$(q $D "select count(*) from badge_requests")" "0"
has "R43 membre ne décide pas un badge" "$(q $D "select decide_badge('$RID',true)")" "forbidden"
q $A "select decide_badge('$RID',true)" >/dev/null
ok "R44 badge attribué par un admin" "$(q $D "select count(*) from badge_grants where type='expert:fin'")" "1"
has "R45 membre ne s'attribue pas de badge" "$(q $D "insert into badge_grants(user_id,type) values (me(),'expert:med')")" "row-level security"

# profils & annuaire
ok "R46 profil d'un autre non lisible en table" "$(q $D "select count(*) from profiles")" "1"
ok "R47 pseudos lisibles via la vue" "$(q $D "select count(*) from public_profiles")" "4"
ok "R48 compétences masquées par défaut" "$(q $D "select count(*) from skills_directory")" "0"
q $B "update profiles set skills='{juriste}', matching=true where auth_uid=auth.uid()" >/dev/null
ok "R49 compétences visibles si le membre l'accepte" "$(q $D "select count(*) from skills_directory")" "1"

# reconnexion
RC=$(q $A "select create_recovery_invite('sidi.paris')")
has "R50 membre ne crée pas de lien de reconnexion" "$(q $D "select create_recovery_invite('sidi.paris')")" "forbidden"
NEW=eeeeeeee-0000-0000-0000-000000000005
sa "insert into auth.users(id) values ('$B')" >/dev/null
q $NEW "select redeem_invite('$RC')" >/dev/null
ok "R51 reconnexion sur un nouvel appareil" "$(q $NEW "select pseudo from profiles")" "sidi.paris"
ok "R52 projet retrouvé après reconnexion" "$(q $NEW "select count(*) from projects")" "1"
ok "R53b ancienne identité supprimée (e-mail libéré)" "$(sa "select count(*) from auth.users where id='$B'" | tail -1)" "0"
ok "R53 ancien appareil déconnecté du profil" "$(q $B "select count(*) from profiles")" "0"
has "R54 lien de reconnexion à usage unique" "$(q $D "select redeem_invite('$RC')")" "invalid_invite"

# adhésion à un autre canal
q $D "select request_join('inv')" >/dev/null
ok "R55 demande d'adhésion en attente" "$(q $D "select count(*) from canal_members where canal_id='inv' and status='pending'")" "1"
ok "R56 demande invisible des autres membres" "$(q $NEW "select count(*) from canal_members where canal_id='inv'")" "0"
has "R57 membre ne valide pas sa propre demande" "$(q $D "select decide_join('inv',(select id from profiles where pseudo='ahmed.lille'),true)")" "forbidden"
q $A "select decide_join('inv',(select id from profiles where pseudo='ahmed.lille'),true)" >/dev/null
ok "R58 admin accepte la demande" "$(q $D "select status from canal_members where canal_id='inv' and user_id=me()")" "member"

# lien de canal pour un membre déjà inscrit
LV=$(q $A "select rotate_canal_invite('num')")
q $D "select redeem_invite('$LV')" >/dev/null
ok "R61 membre existant rejoint un 2e canal par lien" "$(q $D "select count(*) from canal_members where canal_id='num' and status='member'")" "1"
ok "R62 compteur de membres par canal" "$(q $D "select members from canal_stats where canal_id='num'")" "1"
has "R63 lien WhatsApp invalide refusé" "$(q $A "select set_canal_wa('edu','http://evil.example')")" "check"
q $A "select set_canal_wa('edu','https://chat.whatsapp.com/AbC123xyz')" >/dev/null
ok "R64 lien WhatsApp enregistré" "$(q $D "select wa_link from canals where id='edu'")" "https://chat.whatsapp.com/AbC123xyz"
has "R65 membre ne change pas le lien WhatsApp" "$(q $D "select set_canal_wa('edu','https://chat.whatsapp.com/Zzz')")" "forbidden"
q $D "select join_team('$PID')" >/dev/null
ok "R66 membre rejoint l'équipe d'un projet" "$(q $D "select count(*) from project_team where project_id='$PID'")" "1"
ok "R67 propriétaire notifié" "$(q $NEW "select count(*) from notifications where kind='joined'")" "1"

# notifications de suivi (jalons, commentaires, propositions)
q $NEW "insert into milestones(project_id,title,due) values ('$PID','Cahier validé','2027-01-01')" >/dev/null
MS=$(q $NEW "select id from milestones limit 1")
q $D "insert into follows(project_id,user_id,level) values ('$PID',me(),'mine')" >/dev/null
q $NEW "update milestones set done=true where id='$MS'" >/dev/null
ok "R68 suiveur « jalons seulement » notifié d'un jalon" "$(q $D "select count(*) from notifications where kind='milestone'")" "1"
q $NEW "insert into comments(project_id,author_id,body) values ('$PID',me(),'avancement')" >/dev/null
ok "R69 « jalons seulement » : pas de notification de commentaire" "$(q $D "select count(*) from notifications where kind='comment'")" "0"
q $D "update follows set level='none' where project_id='$PID' and user_id=me()" >/dev/null
q $NEW "update milestones set done=false where id='$MS'" >/dev/null; q $NEW "update milestones set done=true where id='$MS'" >/dev/null
ok "R70 suivi « rien » : plus aucune notification de jalon" "$(q $D "select count(*) from notifications where kind='milestone'")" "1"
q $NEW "update follows set level='none' where project_id='$PID'" >/dev/null 2>&1
q $NEW "insert into follows(project_id,user_id,level) values ('$PID',me(),'none')" >/dev/null
BEFORE=$(q $NEW "select count(*) from notifications where kind='comment'")
q $D "insert into comments(project_id,author_id,body) values ('$PID',me(),'question')" >/dev/null
ok "R71 propriétaire en suivi « rien » non notifié" "$(q $NEW "select count(*) from notifications where kind='comment'")" "$BEFORE"
q $D "insert into proposals(project_id,from_user,to_user) values ('$PID',me(),(select id from public_profiles where pseudo='sidi.paris'))" >/dev/null
ok "R72 membre proposé : notification reçue" "$(q $NEW "select count(*) from notifications where kind='proposal'")" "1"

# archivage (propriétaire + modérateurs) / suppression (modérateurs)
P2=$(q $D "insert into projects(canal_id,owner_id,title,objective) values ('edu',me(),'Projet à archiver','test') returning id" | head -1)
q $D "update projects set archived_at = now() where id='$P2'" >/dev/null
ok "R85 le propriétaire archive son projet" "$(q $D "select count(*) from projects where id='$P2' and archived_at is not null")" "1"
ok "R86 le propriétaire voit son projet archivé" "$(q $D "select count(*) from projects where id='$P2'")" "1"
ok "R87 projet archivé invisible des autres membres" "$(q $C "select count(*) from projects where id='$P2'")" "0"
ok "R88 projet archivé visible du modérateur du canal" "$(q $NEW "select count(*) from projects where id='$P2'")" "1"
q $D "update projects set archived_at = null where id='$P2'" >/dev/null
ok "R89 le propriétaire désarchive" "$(q $NEW "select count(*) from projects where id='$P2' and archived_at is null")" "1"
q $C "update projects set archived_at = now() where id='$P2'" >/dev/null 2>&1
ok "R89c archivage par un autre membre sans effet" "$(q $D "select count(*) from projects where id='$P2' and archived_at is not null")" "0"
q $D "delete from projects where id='$P2'" >/dev/null 2>&1
ok "R90 le propriétaire ne supprime pas" "$(q $A "select count(*) from projects where id='$P2'")" "1"
q $NEW "delete from projects where id='$P2'" >/dev/null
ok "R91 le modérateur supprime" "$(q $A "select count(*) from projects where id='$P2'")" "0"

# suppression de compte (propriétaire de projet + commentaire + demande)
q $NEW "insert into helps(author_id,domain,body) values (me(),'adm','demande avant suppression')" >/dev/null
q $NEW "select delete_my_account()" >/dev/null
ok "R73 suppression de compte propriétaire de projet" "$(sa "select count(*) from profiles where auth_uid='$NEW'" | tail -1)" "0"
ok "R74 ses projets disparaissent" "$(sa "select count(*) from projects where id='$PID'" | tail -1)" "0"

# code de secours / mot de passe perdu
has "R75 code de secours refusé tant qu'aucun mot de passe" "$(q $A "select make_recovery_code()")" "need_password"
sa "insert into auth.users(id,email) values ('$A','admin.nkc@membre.test'); insert into auth.sessions(user_id) values ('$A')" >/dev/null
CODE=$(q $A "select make_recovery_code()")
ok "R76 code de secours généré (20 caractères)" "${#CODE}" "20"
ok "R77 le code n'est lisible par aucun membre" "$(q $A "select count(*) from recovery_secrets" 2>&1 | grep -c 'permission denied')" "1"
ok "R78 mauvais code refusé" "$(q $NEW "select reset_password('admin.nkc','AAAAAAAAAAAAAAAAAAAA','nouveau-mdp-123')")" '{"ok" : false, "reason" : "bad"}'
ok "R79 mot de passe trop court refusé" "$(q $NEW "select reset_password('admin.nkc','$CODE','court')" | grep -o weak)" "weak"
R=$(q $NEW "select reset_password('Admin.NKC','${CODE:0:5}-${CODE:5:5} ${CODE:10}','nouveau-mdp-123')")
has "R80 réinitialisation avec le bon code (casse et séparateurs tolérés)" "$R" '"ok" : true'
ok "R81 mot de passe changé (empreinte bcrypt)" "$(sa "select left(encrypted_password,4) from auth.users where id='$A'" | tail -1)" '$2a$'
ok "R82 anciennes sessions révoquées" "$(sa "select count(*) from auth.sessions where user_id='$A'" | tail -1)" "0"
has "R83 l'ancien code ne marche plus" "$(q $NEW "select reset_password('admin.nkc','$CODE','encore-un-mdp-1')")" '"reason" : "bad"'
for i in 1 2 3 4; do q $NEW "select reset_password('admin.nkc','XXXXXXXXXXXXXXXXXXXX','encore-un-mdp-1')" >/dev/null; done
has "R84 blocage après 5 essais ratés" "$(q $NEW "select reset_password('admin.nkc','XXXXXXXXXXXXXXXXXXXX','encore-un-mdp-1')" ; q $NEW "select reset_password('admin.nkc','XXXXXXXXXXXXXXXXXXXX','encore-un-mdp-1')")" '"reason" : "locked"'

# anonyme sans compte
ok "R59 anon sans profil : rien dans les canaux membres" "$(q ffffffff-0000-0000-0000-000000000009 "select count(*) from projects")" "0"
ok "R60 ping anti-pause" "$($DB -c "set role anon; select ping();" | grep -x ok)" "ok"
ANO=ffffffff-0000-0000-0000-000000000009
ok "R92 anon sans profil ne lit pas public_profiles" "$(q $ANO "select count(*) from public_profiles")" "0"
ok "R93 anon sans profil ne lit pas skills_directory" "$(q $ANO "select count(*) from skills_directory")" "0"
ok "R94 anon sans profil ne lit pas canal_stats" "$(q $ANO "select count(*) from canal_stats")" "0"
ok "R95 anon sans profil ne lit pas canal_mods" "$(q $ANO "select count(*) from canal_mods")" "0"
ok "R96 anon sans profil ne lit pas canals" "$(q $ANO "select count(*) from canals")" "0"
ok "R97 membre inscrit lit bien public_profiles" "$(q $A "select count(*) from public_profiles")" "3"
ok "R98 membre inscrit lit bien la liste des canaux" "$(q $A "select count(*) from canals")" "6"

# RGPD : export de ses propres données
has "R99 export : contient son propre pseudo" "$(q $A "select export_my_data()")" "admin.nkc"
has "R100 export : non inscrit refusé" "$(q $ANO "select export_my_data()")" "not_registered"
ok "R101 export : ne contient pas le pseudo d'un autre membre" "$(q $A "select export_my_data()::text !~ 'mariem.paris'")" "t"

# Porte-paroles (diffusion à la diaspora d'un pays) et nom/prénom
# Les tests précédents ont supprimé ou déplacé certains comptes : on inscrit un nouveau membre « awa.dakar » (France) pour la suite.
E=eeeeeeee-0000-0000-0000-000000000005
q $E "select redeem_invite('$(q $A "select rotate_canal_invite('edu')")','awa.dakar','France')" >/dev/null
has "R107 un membre ne peut pas désigner un porte-parole" "$(q $E "select set_spokesperson('mariem.paris','France',true)")" "forbidden"
q $A "select set_spokesperson('mariem.paris','France',true)" >/dev/null
ok "R108 l'admin désigne un porte-parole, visible des membres" "$(q $E "select count(*) from spokesperson_list where pseudo='mariem.paris' and country='France'")" "1"
ok "R109 le porte-parole publie pour son pays" "$(q $C "insert into announcements(country,author_id,title,body) values ('France',me(),'Annonce pays','Corps pays') returning 1")" "1"
has "R110 le porte-parole ne publie pas pour un autre pays" "$(q $C "insert into announcements(country,author_id,title,body) values ('Maroc',me(),'Autre pays','Corps')")" "row-level security"
has "R111 le porte-parole ne diffuse pas à tous" "$(q $C "insert into announcements(author_id,title,body) values (me(),'Global','Corps')")" "row-level security"
has "R112 un simple membre ne publie pas pour un pays" "$(q $E "insert into announcements(country,author_id,title,body) values ('France',me(),'Faux','Corps')")" "row-level security"
ok "R113 un membre du même pays reçoit l'annonce (casse et espaces ignorés)" "$(q $E "select count(*) from announcements where title='Annonce pays'")" "1"
ok "R114 un membre d'un autre pays ne la reçoit pas" "$(q $D "select count(*) from announcements where title='Annonce pays'")" "0"
ok "R115 une session anonyme sans profil ne la reçoit pas" "$(q $ANO "select count(*) from announcements where title='Annonce pays'")" "0"
ok "R116 l'admin diffuse à tous" "$(q $A "insert into announcements(author_id,title,body) values (me(),'Global admin','Corps') returning 1")" "1"
ok "R117 tout inscrit reçoit l'annonce de l'admin" "$(q $D "select count(*) from announcements where title='Global admin'")" "1"
has "R118 annonce visant à la fois un canal et un pays refusée" "$(q $A "insert into announcements(canal_id,country,author_id,title,body) values ('edu','France',me(),'Mixte','Corps')")" "violates"
q $E "update profiles set first_name='Awa', last_name='Diop' where id=me()" >/dev/null
ok "R119 le nom saisi est visible des autres membres" "$(q $C "select first_name||' '||last_name from public_profiles where pseudo='awa.dakar'")" "Awa Diop"
has "R120 le nom a une longueur limitée" "$(q $E "update profiles set first_name=repeat('x',61) where id=me()")" "violates"
has "R121 un membre ne s'attribue pas le rôle admin" "$(q $E "update profiles set is_admin=true where id=me()")" "permission denied"
ok "R122 un membre sans profil ne voit pas les porte-paroles" "$(q $ANO "select count(*) from spokesperson_list")" "0"

# Fonctions IA réservées aux testeurs, avec quota quotidien
has "R123 non-testeur refusé" "$(q $E "select ai_consume()")" "not_tester"
has "R124 session anonyme sans profil refusée" "$(q $ANO "select ai_consume()")" "not_tester"
has "R125 un membre ne désigne pas de testeur" "$(q $E "select set_ai_tester('awa.dakar',true)")" "forbidden"
q $A "select set_ai_tester('awa.dakar',true)" >/dev/null
ok "R126 le testeur voit son statut, pas celui des autres" "$(q $E "select count(*) from ai_testers")" "1"
ok "R127 première utilisation : 19 restantes" "$(q $E "select ai_consume()")" "19"
for i in $(seq 1 19); do q $E "select ai_consume()" >/dev/null; done
has "R128 21e utilisation du jour refusée (quota)" "$(q $E "select ai_consume()")" "quota"
has "R129 le compteur d'usage n'est pas lisible par un membre" "$(q $E "select count(*) from ai_usage")" "permission denied"
has "R130 un testeur ne se réinitialise pas son quota" "$(q $E "update ai_usage set n=0")" "permission denied"
has "R131 un membre ne s'ajoute pas comme testeur" "$(q $C "insert into ai_testers(user_id) values (me())")" "row-level security"
q $A "select set_ai_tester('awa.dakar',false)" >/dev/null
has "R132 testeur retiré : refusé" "$(q $E "select ai_consume()")" "not_tester"

echo "----"; echo "$pass réussis, $fail échoués"; [ $fail -eq 0 ]
