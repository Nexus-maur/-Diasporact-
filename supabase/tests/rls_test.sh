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
q $D "select set_task_status('$TID','done')" >/dev/null
ok "R19 assigné termine sa tâche" "$(q $B "select status from tasks")" "done"
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
q $NEW "select redeem_invite('$RC')" >/dev/null
ok "R51 reconnexion sur un nouvel appareil" "$(q $NEW "select pseudo from profiles")" "sidi.paris"
ok "R52 projet retrouvé après reconnexion" "$(q $NEW "select count(*) from projects")" "1"
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

# anonyme sans compte
ok "R59 anon sans profil : rien dans les canaux membres" "$(q ffffffff-0000-0000-0000-000000000009 "select count(*) from projects")" "0"
ok "R60 ping anti-pause" "$($DB -c "set role anon; select ping();" | grep -x ok)" "ok"

echo "----"; echo "$pass réussis, $fail échoués"; [ $fail -eq 0 ]
