(function(){
'use strict';

var root=document.documentElement;
var $=function(s,r){return (r||document).querySelector(s);};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});};

/* ============ Textes ============ */
var I18N={
fr:{
tour_title:'Visite guidée',tour_of:'Étape {a} sur {b}',tour_next:'Suivant',tour_prev:'Précédent',tour_skip:'Passer la visite',tour_end:'Terminer',tour_again:'Revoir la visite guidée',tour_again_sub:'Un tour rapide pour prendre en main Diasporact.',
tour1_t:'Bienvenue sur Diasporact',tour1_d:'Diasporact est l’espace de la diaspora mauritanienne : on s’y informe, on s’entraide et on monte des projets ensemble. Cette visite dure deux minutes. Vous pouvez la rouvrir à tout moment.',
tour2_t:'Les cinq onglets du bas',tour2_d:'Accueil : vos tâches et les annonces. Canaux : les groupes par thème ou par pays. Projets : ce qui se construit. Entraide : demander ou apporter de l’aide. Alertes : ce qui vous concerne.',
tour3_t:'Rejoignez un canal',tour3_d:'Un canal réunit les membres autour d’un thème. Demandez à le rejoindre : le modérateur valide votre demande, puis vous accédez aux projets et à l’entraide du canal.',tour3_b:'Voir les canaux',
tour4_t:'Les annonces officielles',tour4_d:'Les annonces des porte-parole et de l’équipe s’affichent sur l’accueil. Touchez « Lu » pour confirmer votre lecture, et le bouton de partage pour les envoyer sur WhatsApp.',tour4_b:'Voir l’accueil',
tour5_t:'Les projets',tour5_d:'Proposez un projet ou rejoignez-en un : prenez une tâche, marquez-la terminée, commentez. Chaque projet indique les compétences recherchées.',tour5_b:'Voir les projets',
tour6_t:'L’entraide',tour6_d:'Une difficulté (papiers, études, santé, installation…) ? Décrivez votre situation : seuls les référents du domaine la voient. Rien n’est public.',tour6_b:'Voir l’entraide',
tour7_t:'Votre profil et votre sécurité',tour7_d:'Dans « Moi », ajoutez votre nom, votre pays et vos compétences. Protégez aussi votre compte avec un mot de passe, et gardez précieusement votre code de secours : c’est lui qui permet de retrouver l’accès.',tour7_b:'Ouvrir « Moi »',
tour8_t:'Langue et thème',tour8_d:'Le bouton de langue en haut de l’écran bascule entre français, anglais et arabe. La lune active le mode sombre.',
tour9_t:'Fonctions IA (phase test)',tour9_d:'Vous testez deux fonctions : la traduction sous les textes, et « Discussion → projet » à la création d’un projet. L’IA peut se tromper : vérifiez toujours. Le texte envoyé n’est pas conservé.',tour9_b:'Créer un projet',
tour10_t:'Vos retours comptent',tour10_d:'Vous testez Diasporact avant son ouverture. Si quelque chose est confus, lent ou ne marche pas, notez la page, ce que vous attendiez et ce qui s’est passé, puis transmettez-le à l’équipe qui vous a invité.',
app_name:'Diasporact',app_short:'Diasporact',demo:'Démo',close:'Fermer',back:'Retour',cancel:'Annuler',
continue:'Continuer',send:'Envoyer',copy:'Copier',publish:'Publier',share:'Partager',
nav_home:'Accueil',nav_canals:'Canaux',nav_projects:'Projets',nav_help:'Entraide',nav_alerts:'Alertes',
inv_from:'Invitation reçue dans un groupe WhatsApp',inv_title:'Rejoignez Diasporact',
inv_sub:'Vous êtes invité·e à rejoindre le canal « {canal} ».',
inv_preview:'Ce que vous voyez avant validation',inv_preview_sub:'Description du canal et annonces officielles, en lecture seule.',
pseudo_label:'Choisissez votre pseudo',pseudo_help:'Unique. 3 à 20 caractères : lettres, chiffres, point, tiret.',
pseudo_ok:'@{p} est disponible.',pseudo_taken:'@{p} est déjà pris. Essayez :',pseudo_bad:'Utilisez 3 à 20 caractères : lettres, chiffres, point ou tiret.',
pick_title:'Choisissez vos canaux',pick_sub:'Le modérateur de chaque canal valide votre demande.',pick_invited:'Canal de l’invitation',pick_send:'Envoyer mes demandes',
code_title:'Votre code de récupération',code_sub:'Notez-le. Il permet de retrouver votre compte sur un autre appareil.',code_noted:'J’ai noté mon code',code_enter:'Entrer',code_sent:'Demandes envoyées',
hello:'Bonjour',todo:'À faire pour vous',nothing:'Rien en attente pour le moment.',
todo_pending:'Demande en attente : {x}',todo_pending_sub:'Validation par le modérateur du canal',todo_task:'Tâche à faire : {x}',
todo_reqs:'Demandes d’adhésion à valider : {x}',todo_help:'Demandes d’entraide à traiter : {x}',
ann_title:'Annonces officielles',official:'Officiel',read_btn:'J’ai lu',read_done:'Lu',reads:'lectures',until:'Jusqu’au {d}',publish_ann:'Publier une annonce officielle',
recruit_title:'Projets qui recrutent',
canal_member:'Membre',canal_pending:'En attente',canal_join:'Demander à rejoindre',canal_mod:'Modérateur',canal_members:'membres',
canal_wa:'Ouvrir le groupe WhatsApp',canal_wa_note:'Les discussions libres se tiennent dans le groupe WhatsApp du canal. Ici, on suit les projets et les actions.',
canal_pending_banner:'Demande en attente de validation par @{m}. Vous pouvez lire les annonces en attendant.',
canal_locked:'Rejoignez ce canal pour voir les projets et l’entraide.',
tab_ann:'Annonces',tab_proj:'Projets',tab_help:'Entraide',tab_mod:'Modération',
no_ann:'Aucune annonce pour le moment.',no_proj:'Aucun projet dans ce canal.',
mod_reqs:'Demandes d’adhésion',mod_none:'Aucune demande en attente.',accept:'Accepter',refuse:'Refuser',
invite_link:'Lien d’invitation',invite_exp:'Expire dans 7 jours',invite_rotate:'Révoquer et créer un nouveau lien',
proj_mine:'Mes projets',proj_all:'Tous les projets',proj_none_mine:'Vous ne participez à aucun projet pour le moment.',new_project:'Proposer un projet',
st_progress:'En cours',st_recruit:'Recrute',st_done:'Terminé',owner:'Porteur',objective:'Objectif',needs:'Besoins',milestones:'Jalons',tasks:'Tâches',
tk_todo:'À faire',tk_doing:'En cours',tk_done:'Fait',take:'Je prends',mark_done:'Marquer fait',unassigned:'Non assignée',tasks_count:'{a}/{b} tâches',
follow:'Suivre',follow_title:'Notifications de ce projet',fo_all:'Tout',fo_all_d:'Tâches, jalons et commentaires',fo_mil:'Jalons seulement',fo_mil_d:'Uniquement quand une étape est atteinte',fo_none:'Rien',fo_none_d:'Aucune notification (vos tâches restent signalées)',
apply:'Rejoindre le projet',applied:'Candidature envoyée',in_team:'Vous faites partie de l’équipe',
comments:'Commentaires',cmt_ph:'Ajouter un commentaire (280 caractères max)',team:'Équipe',
proj_locked:'Ce projet appartient au canal « {x} ». Seuls ses membres peuvent le suivre.',proj_locked_visitor:'Créez votre pseudo depuis un lien d’invitation pour demander l’accès.',
help_mine:'Mes demandes',help_todo:'À traiter dans vos domaines',help_none:'Aucune demande pour le moment.',new_help:'Nouvelle demande',
hs_open:'Ouverte',hs_doing:'Prise en charge',hs_solved:'Résolue',claim:'Prendre en charge',solve:'Marquer résolue',
help_priv:'Visible uniquement par vous et les référents du domaine',help_priv_ref:'Visible uniquement par les référents du domaine',
domain:'Domaine',country:'Pays de résidence',urgency:'Urgence',u_normal:'Normale',u_urgent:'Urgente',situation:'Décrivez votre situation',
dm_adm:'Administratif',dm_jur:'Juridique',dm_ins:'Installation',dm_ret:'Retour et investissement',dm_san:'Santé',by:'Pris en charge par @{x}',
alerts_title:'Réglages',push:'Notifications push',push_note:'Sur iPhone, ajoutez l’app à l’écran d’accueil pour recevoir les push.',digest:'Résumé quotidien',digest_note:'Regroupe les mises à jour de vos projets en un seul message.',mark_all:'Tout marquer comme lu',no_alerts:'Aucune notification.',
my_account:'Mon compte',recov:'Code de récupération',show:'Afficher',hide:'Masquer',recov_note:'Rattacher un e-mail ou un numéro sera possible plus tard.',lang:'Langue',theme:'Thème',th_light:'Blanc',th_dark:'Noir',logout:'Se déconnecter',my_canals:'Mes canaux',roles:'Rôles',
r_member:'Membre',r_mod:'Modérateur de {x}',r_ref:'Référent : {x}',r_speaker:'Porte-parole officiel',r_spk:'Porte-parole ({x})',
name_section:'Nom et prénom',firstname_label:'Prénom',lastname_label:'Nom',name_public_note:'Optionnel, visible publiquement. Si renseigné, votre pseudo apparaît en grisé en dessous à la place du pseudo seul.',
share_title:'Partager dans WhatsApp',share_prev:'Message à publier dans le groupe',share_open:'Ouvrir WhatsApp',share_copy:'Copier le message',
share_note:'Le lien affiche un aperçu et ramène directement sur la fiche. Les membres du canal peuvent agir, les autres peuvent demander l’accès.',
wa_title:'Simulation d’un groupe WhatsApp',wa_note:'Les discussions libres restent ici. Les liens ouvrent l’outil.',wa_open:'Ouvrir le lien',
t_pending:'Demande envoyée à @{m}',t_copied:'Copié',t_copy_fail:'Copie impossible : sélectionnez le texte.',t_accepted:'@{p} accepté·e. Notification envoyée.',t_refused:'@{p} refusé·e.',
t_took:'Tâche prise. L’équipe est informée.',t_done:'Tâche terminée. Bravo.',t_applied:'Candidature envoyée à @{o}',t_help_sent:'Demande transmise aux référents du domaine',
t_claimed:'Demande prise en charge. @{p} est notifié·e.',t_solved:'Demande marquée comme résolue',t_new_link:'Nouveau lien créé. L’ancien ne fonctionne plus.',
t_push_on:'Push activées. Dans la version réelle, le navigateur demandera votre autorisation.',t_no_notif:'Aucune notification : vous suivez ce projet sur « Rien ».',
t_ann_pub:'Annonce publiée',t_proj_pub:'Projet publié dans le canal',
f_canal:'Canal',f_title:'Titre',f_needs:'Besoins (séparés par des virgules)',f_due:'Échéance',f_body:'Texte',f_target:'Diffusion',f_all:'Tous les canaux (admin)',f_country_opt:'Toute la diaspora d’un pays',f_country_ph:'Pays',f_until:'Valable jusqu’au',req:'Champ obligatoire',
n_task:'Tâche assignée : {x}',n_mil:'Jalon atteint : {x}',n_cmt:'Nouveau commentaire sur {x}',n_acc:'Demande acceptée : vous êtes membre de {x}',n_ann:'Nouvelle annonce officielle : {x}',n_claim:'Votre demande d’entraide est prise en charge par @{x}',
n_welcome:'Bienvenue. Vos demandes sont en cours de validation.',
now:'à l’instant',min:'il y a {n} min',hour:'il y a {n} h',day:'il y a {n} j',ai_tag:'Généré par IA · à vérifier',ai_sim:'Dans cette démo, l’analyse est simulée par des règles simples.',from_chat:'Depuis une discussion',chat_btn:'À partir d’une discussion',chat_intro:'Collez une discussion WhatsApp : l’IA propose une fiche projet avec décisions, questions ouvertes et actions. Vous relisez et corrigez avant de publier.',chat_consent:'Ne collez qu’une discussion dont les participants acceptent le partage. Rien n’est conservé.',chat_ph:'Un message par ligne : « Prénom : message »',chat_sample:'Utiliser un exemple',chat_go:'Analyser la discussion',chat_loading:'Analyse en cours…',chat_empty:'Collez d’abord une discussion.',chat_back:'Modifier le texte',cr_actions:'Actions repérées (décochez pour écarter)',cr_decisions:'Décisions repérées',cr_questions:'Questions restées ouvertes',cr_none:'Rien repéré',cr_create:'Créer le projet',cr_by:'proposé par @{x}',ch_decisions:'Décisions de la discussion : ',ch_questions:'Questions ouvertes : ',dictate:'Dicter',voice_sim:'Saisie vocale simulée dans la démo',voice_listen:'Je vous écoute…',voice_demo_c:'Je peux m’en occuper cette semaine.',voice_demo_h:'Bonjour, je dois renouveler mon passeport rapidement et je ne sais pas par où commencer.',voice_demo_x:'Sidi : on pourrait organiser une collecte de livres pour une bibliothèque ?',dg_title:'Votre résumé personnalisé',dg_sub:'Rédigé dans votre langue à partir de votre activité.',dg_freq:'Fréquence',dg_daily:'Chaque jour',dg_weekly:'Chaque semaine',dg_task:'Tâche à faire : {x} ({p})',dg_ann:'Annonce officielle à lire : {x}',dg_proj:'{x} : {a}/{b} tâches terminées',dg_help:'{x} demande(s) d’entraide attendent un référent',dg_reqs:'{x} demande(s) d’adhésion à traiter',dg_myhelp:'Votre demande d’entraide est suivie par @{x}',dg_none:'Rien de nouveau.',dg_wa:'Aperçu dans WhatsApp',dg_note:'Les annonces officielles sont citées telles quelles, jamais reformulées.',dg_wa_note:'Message envoyé sur WhatsApp avec un lien vers l’app (prévu via l’API WhatsApp Business).',sk_title:'Compétences',sk_opt:'Mises en relation par compétences',sk_opt_note:'Si activé, votre pseudo et vos compétences peuvent être proposés aux porteurs de projets. Vous décidez toujours de répondre.',sk_in:'Mes compétences (séparées par des virgules)',sk_save:'Enregistrer',sk_saved:'Compétences enregistrées',match_title:'Membres qui pourraient aider',match_note:'Seuls les membres ayant activé les mises en relation apparaissent. Vous les sollicitez, ils décident.',match_why:'Compétence « {s} » ↔ besoin « {n} »',match_prop:'Proposer de contribuer',match_sent:'Proposition envoyée à @{x}',match_done:'Proposé',match_none:'Aucune suggestion pour le moment.',match_home:'Projets qui recherchent vos compétences',match_home_why:'Besoin : {n}',ai_help_t:'Suggestions de l’assistant',ai_help_dom:'Domaine suggéré : {x}',ai_help_urg:'Cela semble urgent : marquer comme urgent',ai_help_faq:'Une fiche pratique pourrait répondre :',ai_help_view:'Voir la fiche',ai_help_ok:'Cela répond à ma question',ai_help_ok_t:'Content d’avoir pu aider. Votre demande n’a pas été envoyée.',ai_help_note:'Ne remplace pas l’avis d’un référent.',faq_title:'Fiches pratiques',faq_sub:'Rédigées et validées par les référents.',faq_by:'Validée par @{x}',faq_note:'Information indicative : vérifiez toujours auprès de l’organisme officiel.',draft_btn:'Brouillon de réponse',draft_title:'Brouillon de réponse',draft_note:'Proposition de l’IA à partir des fiches existantes. Relisez et modifiez : rien n’est envoyé sans vous.',draft_faq:'Ajouter cette réponse aux fiches pratiques',draft_send:'Envoyer la réponse',draft_sent:'Réponse envoyée à @{x}',draft_hi:'Bonjour @{x}, merci pour votre message.',draft_generic:'Voici ce que je peux vous indiquer : …',draft_bye:'Je reste disponible pour préciser. — @{x}',reply_from:'Réponse de @{x}',n_reply:'Réponse reçue à votre demande d’entraide.',tr_do:'Traduire',tr_auto:'Traduction automatique',tr_orig:'Voir l’original',cr_add:'Ajouter',act_title:'Que voulez-vous faire ?',th_help:'Demander de l’aide',th_proj:'Lancer un projet',th_chat:'Projet depuis une discussion',th_canals:'Découvrir les canaux',fs_title:'Premiers pas',fs_sub:'On discute sur WhatsApp, on agit ici : projets, entraide et annonces officielles.',fs_1:'Rejoindre un canal',fs_1p:'Demande envoyée : en attente du modérateur',fs_2:'Lire une annonce officielle',fs_3:'Prendre une tâche ou lancer un projet',fs_4:'Indiquer vos compétences',fs_hide:'Masquer',fs_prog:'{a}/{b} faits',see_projects:'Voir les projets ouverts',search_proj:'Rechercher un projet, un besoin…',search_none:'Aucun résultat.',proj_see_all:'Voir tous les projets',cf_ok:'Confirmer',cf_logout:'Vous allez être déconnecté. Vérifiez que vous avez noté votre code de récupération : il est indispensable pour retrouver votre compte.',cf_rotate:'Renouveler le lien d’invitation',cf_rotate_t:'L’ancien lien sera révoqué : les personnes qui ne l’ont pas encore utilisé ne pourront plus rejoindre avec celui-ci.',cr_add_ph:'Saisir un élément…',cr_del:'Retirer',cr_empty_hint:'Rien n’a été repéré automatiquement : complétez vous-même les éléments ci-dessous.',tab_honor:'À l’honneur',bd_title:'Badges',bd_rules:'Les badges d’engagement comptent uniquement des actions validées (tâche terminée, entraide résolue, lecture confirmée), jamais le nombre de messages. Les badges de profil sont attribués après vérification par un modérateur.',bd_profile:'Badges de profil vérifiés',bd_none:'Aucun badge de profil pour le moment.',bd_req:'Demander un badge de profil',bd_eng:'Badges d’engagement',bd_next:'{a}/{b} pour le niveau suivant',bd_max:'niveau maximum',bd_honor:'Apparaître parmi les membres à l’honneur',bd_honor_note:'Les canaux mettent en avant leurs membres les plus actifs. Vous pouvez choisir de ne pas y figurer.',bd_type:'Type de badge',bd_note:'Justification (profession, organisation…)',bd_note_help:'Un modérateur vérifie votre demande avant d’attribuer le badge. Aucun justificatif n’est conservé dans cette démo.',bd_sent:'Demande envoyée aux modérateurs',bd_pending:'En attente : {x}',bd_reqs:'Demandes de badge',bd_none_req:'Aucune demande de badge.',bd_grant:'Attribuer',bd_granted:'Badge attribué à @{x}',bd_denied:'Demande refusée',b_mod:'Modérateur',b_ref:'Référent',b_speaker:'Porte-parole',b_relay:'Relais au pays',b_expert:'Expert vérifié · {x}',hn_title:'Membres à l’honneur',hn_sub:'Les plus actifs de ce canal ces dernières semaines.',hn_line:'{t} tâches · {h} entraides · {p} projets',hn_note:'Basé sur des actions validées. Merci à celles et ceux qui font avancer la communauté.',hn_none:'Pas encore de membre à l’honneur.',n_badge:'Nouveau badge : {x}'
},
ar:{
tour_title:'جولة تعريفية',tour_of:'الخطوة {a} من {b}',tour_next:'التالي',tour_prev:'السابق',tour_skip:'تخطي الجولة',tour_end:'إنهاء',tour_again:'إعادة الجولة التعريفية',tour_again_sub:'جولة سريعة للتعرّف على Diasporact.',
tour1_t:'مرحباً بك في Diasporact',tour1_d:'Diasporact فضاء الجالية الموريتانية: نتابع فيه الأخبار، ونتعاون، ونبني المشاريع معاً. تستغرق هذه الجولة دقيقتين، ويمكنك إعادتها في أي وقت.',
tour2_t:'علامات التبويب الخمس في الأسفل',tour2_d:'الرئيسية: مهامك والإعلانات. القنوات: المجموعات حسب الموضوع أو البلد. المشاريع: ما يُبنى الآن. المساعدة: طلب العون أو تقديمه. التنبيهات: ما يخصّك.',
tour3_t:'انضمّ إلى قناة',tour3_d:'تجمع القناة الأعضاء حول موضوع واحد. اطلب الانضمام، ويوافق المشرف على طلبك، ثم تصل إلى مشاريع القناة ومساعدتها.',tour3_b:'عرض القنوات',
tour4_t:'الإعلانات الرسمية',tour4_d:'تظهر إعلانات المتحدثين والفريق في الصفحة الرئيسية. اضغط «تمت القراءة» لتأكيد قراءتك، وزر المشاركة لإرسالها عبر واتساب.',tour4_b:'عرض الرئيسية',
tour5_t:'المشاريع',tour5_d:'اقترح مشروعاً أو انضمّ إلى مشروع: خذ مهمة، وأنهِها، وعلّق. يذكر كل مشروع المهارات المطلوبة.',tour5_b:'عرض المشاريع',
tour6_t:'المساعدة',tour6_d:'تواجه صعوبة (أوراق، دراسة، صحة، استقرار…)؟ صِف وضعك: لا يراه إلا مرجعو المجال. لا شيء منشور للعموم.',tour6_b:'عرض المساعدة',
tour7_t:'ملفك وأمان حسابك',tour7_d:'في «أنا» أضف اسمك وبلدك ومهاراتك. احمِ حسابك أيضاً بكلمة مرور، واحتفظ برمز الاسترجاع جيداً: به تستعيد الوصول إلى حسابك.',tour7_b:'فتح «أنا»',
tour8_t:'اللغة والمظهر',tour8_d:'يبدّل زر اللغة أعلى الشاشة بين الفرنسية والإنجليزية والعربية. ويفعّل القمر الوضع الداكن.',
tour9_t:'ميزات الذكاء الاصطناعي (مرحلة التجربة)',tour9_d:'تجرّب ميزتين: الترجمة أسفل النصوص، و«من النقاش إلى مشروع» عند إنشاء مشروع. قد يخطئ الذكاء الاصطناعي، فتحقّق دائماً. النص المُرسَل لا يُحفظ.',tour9_b:'إنشاء مشروع',
tour10_t:'ملاحظاتك مهمة',tour10_d:'أنت تجرّب Diasporact قبل افتتاحه. إن كان شيء غامضاً أو بطيئاً أو لا يعمل، دوّن الصفحة وما كنت تتوقعه وما حدث، ثم أبلغ به الفريق الذي دعاك.',
app_name:'Diasporact',app_short:'Diasporact',demo:'تجربة',close:'إغلاق',back:'رجوع',cancel:'إلغاء',
continue:'متابعة',send:'إرسال',copy:'نسخ',publish:'نشر',share:'مشاركة',
nav_home:'الرئيسية',nav_canals:'القنوات',nav_projects:'المشاريع',nav_help:'المساعدة',nav_alerts:'التنبيهات',
inv_from:'دعوة وصلتك عبر مجموعة واتساب',inv_title:'انضم إلى Diasporact',
inv_sub:'أنت مدعو للانضمام إلى قناة «{canal}».',
inv_preview:'ما يمكنك رؤيته قبل القبول',inv_preview_sub:'وصف القناة والإعلانات الرسمية للقراءة فقط.',
pseudo_label:'اختر اسمك المستعار',pseudo_help:'فريد. من 3 إلى 20 حرفاً: أحرف لاتينية وأرقام ونقطة وشرطة.',
pseudo_ok:'@{p} متاح.',pseudo_taken:'@{p} مستخدم مسبقاً. جرّب:',pseudo_bad:'استخدم من 3 إلى 20 حرفاً: أحرف لاتينية وأرقام ونقطة أو شرطة.',
pick_title:'اختر قنواتك',pick_sub:'يوافق مشرف كل قناة على طلبك.',pick_invited:'قناة الدعوة',pick_send:'إرسال طلباتي',
code_title:'رمز الاستعادة الخاص بك',code_sub:'دوّنه. يتيح لك استعادة حسابك على جهاز آخر.',code_noted:'دوّنت الرمز',code_enter:'دخول',code_sent:'الطلبات المرسلة',
hello:'مرحباً',todo:'مهام تنتظرك',nothing:'لا شيء في الانتظار حالياً.',
todo_pending:'طلب قيد الانتظار: {x}',todo_pending_sub:'بانتظار موافقة مشرف القناة',todo_task:'مهمة للإنجاز: {x}',
todo_reqs:'طلبات انضمام بانتظار المراجعة: {x}',todo_help:'طلبات مساعدة بانتظار المعالجة: {x}',
ann_title:'الإعلانات الرسمية',official:'رسمي',read_btn:'قرأت',read_done:'تمت القراءة',reads:'قراءة',until:'حتى {d}',publish_ann:'نشر إعلان رسمي',
recruit_title:'مشاريع تبحث عن مساهمين',
canal_member:'عضو',canal_pending:'قيد الانتظار',canal_join:'طلب الانضمام',canal_mod:'المشرف',canal_members:'عضو',
canal_wa:'فتح مجموعة واتساب',canal_wa_note:'النقاشات الحرة تجري في مجموعة واتساب الخاصة بالقناة. هنا نتابع المشاريع والإجراءات.',
canal_pending_banner:'طلبك بانتظار موافقة @{m}. يمكنك قراءة الإعلانات في الأثناء.',
canal_locked:'انضم إلى هذه القناة لمشاهدة المشاريع والمساعدة.',
tab_ann:'الإعلانات',tab_proj:'المشاريع',tab_help:'المساعدة',tab_mod:'الإشراف',
no_ann:'لا توجد إعلانات حالياً.',no_proj:'لا توجد مشاريع في هذه القناة.',
mod_reqs:'طلبات الانضمام',mod_none:'لا توجد طلبات قيد الانتظار.',accept:'قبول',refuse:'رفض',
invite_link:'رابط الدعوة',invite_exp:'ينتهي خلال 7 أيام',invite_rotate:'إلغاء الرابط وإنشاء رابط جديد',
proj_mine:'مشاريعي',proj_all:'كل المشاريع',proj_none_mine:'لا تشارك في أي مشروع حالياً.',new_project:'اقتراح مشروع',
st_progress:'قيد التنفيذ',st_recruit:'يبحث عن مساهمين',st_done:'منجز',owner:'صاحب المشروع',objective:'الهدف',needs:'الاحتياجات',milestones:'المراحل',tasks:'المهام',
tk_todo:'للإنجاز',tk_doing:'قيد التنفيذ',tk_done:'تم',take:'أتولى المهمة',mark_done:'تم الإنجاز',unassigned:'غير مسندة',tasks_count:'{a}/{b} مهام',
follow:'متابعة',follow_title:'إشعارات هذا المشروع',fo_all:'كل التحديثات',fo_all_d:'المهام والمراحل والتعليقات',fo_mil:'المراحل فقط',fo_mil_d:'فقط عند بلوغ مرحلة',fo_none:'لا شيء',fo_none_d:'بدون إشعارات (تبقى مهامك مُشعَرة)',
apply:'الانضمام إلى المشروع',applied:'أُرسل الطلب',in_team:'أنت ضمن الفريق',
comments:'التعليقات',cmt_ph:'أضف تعليقاً (280 حرفاً كحد أقصى)',team:'الفريق',
proj_locked:'ينتمي هذا المشروع إلى قناة «{x}». يمكن لأعضائها فقط متابعته.',proj_locked_visitor:'أنشئ اسمك المستعار عبر رابط دعوة لطلب الدخول.',
help_mine:'طلباتي',help_todo:'بانتظار المعالجة في مجالاتك',help_none:'لا توجد طلبات حالياً.',new_help:'طلب جديد',
hs_open:'مفتوح',hs_doing:'قيد المعالجة',hs_solved:'تم الحل',claim:'أتولى الطلب',solve:'تم الحل',
help_priv:'ظاهر لك وللمرجعيين في المجال فقط',help_priv_ref:'ظاهر للمرجعيين في المجال فقط',
domain:'المجال',country:'بلد الإقامة',urgency:'الاستعجال',u_normal:'عادية',u_urgent:'مستعجلة',situation:'صف وضعك',
dm_adm:'إداري',dm_jur:'قانوني',dm_ins:'الاستقرار',dm_ret:'العودة والاستثمار',dm_san:'صحي',by:'تتولاه @{x}',
alerts_title:'الإعدادات',push:'إشعارات فورية',push_note:'على آيفون، أضف التطبيق إلى الشاشة الرئيسية لتلقي الإشعارات.',digest:'ملخص يومي',digest_note:'يجمع تحديثات مشاريعك في رسالة واحدة.',mark_all:'تعليم الكل كمقروء',no_alerts:'لا توجد إشعارات.',
my_account:'حسابي',recov:'رمز الاستعادة',show:'إظهار',hide:'إخفاء',recov_note:'سيكون ربط بريد إلكتروني أو رقم هاتف ممكناً لاحقاً.',lang:'اللغة',theme:'المظهر',th_light:'أبيض',th_dark:'أسود',logout:'تسجيل الخروج',my_canals:'قنواتي',roles:'الأدوار',
r_member:'عضو',r_mod:'مشرف {x}',r_ref:'مرجعي: {x}',r_speaker:'ناطق رسمي',r_spk:'ناطق باسم {x}',
name_section:'الاسم الكامل',firstname_label:'الاسم الأول',lastname_label:'اسم العائلة',name_public_note:'اختياري وظاهر للجميع. إن تم إدخاله، يظهر المعرّف (@) باهتاً أسفله بدلاً من المعرّف وحده.',
share_title:'المشاركة في واتساب',share_prev:'الرسالة المراد نشرها في المجموعة',share_open:'فتح واتساب',share_copy:'نسخ الرسالة',
share_note:'سيعرض الرابط معاينة ويقود مباشرة إلى البطاقة. يمكن لأعضاء القناة التفاعل، ويمكن لغيرهم طلب الدخول.',
wa_title:'محاكاة مجموعة واتساب',wa_note:'تبقى النقاشات الحرة هنا. والروابط تفتح الأداة.',wa_open:'فتح الرابط',
t_pending:'أُرسل الطلب إلى @{m}',t_copied:'تم النسخ',t_copy_fail:'تعذّر النسخ: حدّد النص.',t_accepted:'تم قبول @{p}. أُرسل إشعار.',t_refused:'تم رفض @{p}.',
t_took:'تم إسناد المهمة إليك. الفريق على علم.',t_done:'اكتملت المهمة. أحسنت.',t_applied:'أُرسل الطلب إلى @{o}',t_help_sent:'أُحيل الطلب إلى مرجعيي المجال',
t_claimed:'تم تولي الطلب. أُشعر @{p}.',t_solved:'تم وسم الطلب كمحلول',t_new_link:'أُنشئ رابط جديد. الرابط القديم لم يعد يعمل.',
t_push_on:'تم تفعيل الإشعارات. في النسخة الفعلية سيطلب المتصفح إذنك.',t_no_notif:'لا إشعار: أنت تتابع هذا المشروع على «لا شيء».',
t_ann_pub:'تم نشر الإعلان',t_proj_pub:'تم نشر المشروع في القناة',
f_canal:'القناة',f_title:'العنوان',f_needs:'الاحتياجات (مفصولة بفواصل)',f_due:'الموعد النهائي',f_body:'النص',f_target:'النشر',f_all:'كل القنوات (الإدارة)',f_country_opt:'كل جالية بلد',f_country_ph:'البلد',f_until:'صالح حتى',req:'حقل مطلوب',
n_task:'مهمة أُسندت إليك: {x}',n_mil:'بلوغ مرحلة: {x}',n_cmt:'تعليق جديد على {x}',n_acc:'تم قبول طلبك: أنت عضو في {x}',n_ann:'إعلان رسمي جديد: {x}',n_claim:'تتولى @{x} طلب المساعدة الخاص بك',
n_welcome:'مرحباً بك. طلباتك قيد المراجعة.',
now:'الآن',min:'منذ {n} د',hour:'منذ {n} س',day:'منذ {n} ي',ai_tag:'أُنشئ بالذكاء الاصطناعي · يُرجى التحقق',ai_sim:'في هذه النسخة التجريبية يُحاكى التحليل بقواعد بسيطة.',from_chat:'من نقاش',chat_btn:'انطلاقاً من نقاش',chat_intro:'الصق نقاشاً من واتساب: يقترح الذكاء الاصطناعي بطاقة مشروع بالقرارات والأسئلة المفتوحة والإجراءات. تراجعها وتصححها قبل النشر.',chat_consent:'لا تلصق إلا نقاشاً يوافق مشاركوه على مشاركته. لا يُحفظ أي شيء.',chat_ph:'رسالة في كل سطر: «الاسم: الرسالة»',chat_sample:'استخدام مثال',chat_go:'تحليل النقاش',chat_loading:'جارٍ التحليل…',chat_empty:'الصق نقاشاً أولاً.',chat_back:'تعديل النص',cr_actions:'الإجراءات المرصودة (ألغِ التحديد للاستبعاد)',cr_decisions:'القرارات المرصودة',cr_questions:'أسئلة بقيت مفتوحة',cr_none:'لا شيء',cr_create:'إنشاء المشروع',cr_by:'اقترحها @{x}',ch_decisions:'قرارات النقاش: ',ch_questions:'أسئلة مفتوحة: ',dictate:'إملاء',voice_sim:'إدخال صوتي مُحاكى في النسخة التجريبية',voice_listen:'أنا أستمع إليك…',voice_demo_c:'يمكنني التكفل بذلك هذا الأسبوع.',voice_demo_h:'مرحباً، يجب أن أجدد جواز سفري بسرعة ولا أعرف من أين أبدأ.',voice_demo_x:'Sidi : on pourrait organiser une collecte de livres pour une bibliothèque ?',dg_title:'ملخصك الشخصي',dg_sub:'مكتوب بلغتك انطلاقاً من نشاطك.',dg_freq:'التكرار',dg_daily:'كل يوم',dg_weekly:'كل أسبوع',dg_task:'مهمة عليك: {x} ({p})',dg_ann:'إعلان رسمي للقراءة: {x}',dg_proj:'{x}: {a}/{b} مهام منجزة',dg_help:'{x} طلب(ات) مساعدة تنتظر مرجعياً',dg_reqs:'{x} طلب(ات) انضمام للمعالجة',dg_myhelp:'يتابع @{x} طلب المساعدة الخاص بك',dg_none:'لا جديد.',dg_wa:'معاينة في واتساب',dg_note:'تُنقل الإعلانات الرسمية كما هي دون إعادة صياغة.',dg_wa_note:'رسالة تُرسل عبر واتساب مع رابط إلى التطبيق (مخطط لها عبر واجهة WhatsApp Business).',sk_title:'الكفاءات',sk_opt:'الربط حسب الكفاءات',sk_opt_note:'عند التفعيل قد يُقترح اسمك المستعار وكفاءاتك على حاملي المشاريع. تقرر دائماً هل تستجيب.',sk_in:'كفاءاتي (مفصولة بفواصل)',sk_save:'حفظ',sk_saved:'تم حفظ الكفاءات',match_title:'أعضاء قد يساعدون',match_note:'لا يظهر إلا الأعضاء الذين فعّلوا الربط. أنت تدعوهم وهم يقررون.',match_why:'كفاءة «{s}» ↔ حاجة «{n}»',match_prop:'اقتراح المساهمة',match_sent:'أُرسل الاقتراح إلى @{x}',match_done:'تم الاقتراح',match_none:'لا اقتراحات حالياً.',match_home:'مشاريع تبحث عن كفاءاتك',match_home_why:'الحاجة: {n}',ai_help_t:'اقتراحات المساعد',ai_help_dom:'المجال المقترح: {x}',ai_help_urg:'يبدو الأمر عاجلاً: تحديده كعاجل',ai_help_faq:'قد تجيب بطاقة عملية:',ai_help_view:'عرض البطاقة',ai_help_ok:'هذا يجيب عن سؤالي',ai_help_ok_t:'سعيد بأنني ساعدت. لم يُرسل طلبك.',ai_help_note:'لا يغني عن رأي المرجعي.',faq_title:'بطاقات عملية',faq_sub:'يحررها المرجعيون ويصادقون عليها.',faq_by:'صادق عليها @{x}',faq_note:'معلومة إرشادية: تحقق دائماً لدى الجهة الرسمية.',draft_btn:'مسودة رد',draft_title:'مسودة رد',draft_note:'اقتراح من الذكاء الاصطناعي انطلاقاً من البطاقات الموجودة. راجعه وعدّله: لا يُرسل شيء دونك.',draft_faq:'إضافة هذا الرد إلى البطاقات العملية',draft_send:'إرسال الرد',draft_sent:'أُرسل الرد إلى @{x}',draft_hi:'مرحباً @{x}، شكراً على رسالتك.',draft_generic:'إليك ما يمكنني إفادتك به: …',draft_bye:'أبقى رهن إشارتك للتوضيح. — @{x}',reply_from:'رد @{x}',n_reply:'وصل رد على طلب المساعدة الخاص بك.',tr_do:'ترجمة',tr_auto:'ترجمة آلية',tr_orig:'عرض الأصل',cr_add:'إضافة',act_title:'ماذا تريد أن تفعل؟',th_help:'طلب مساعدة',th_proj:'إطلاق مشروع',th_chat:'مشروع من نقاش',th_canals:'اكتشاف القنوات',fs_title:'الخطوات الأولى',fs_sub:'نتناقش في واتساب ونعمل هنا: المشاريع والتضامن والإعلانات الرسمية.',fs_1:'الانضمام إلى قناة',fs_1p:'أُرسل طلبك: بانتظار المشرف',fs_2:'قراءة إعلان رسمي',fs_3:'تولّي مهمة أو إطلاق مشروع',fs_4:'تحديد كفاءاتك',fs_hide:'إخفاء',fs_prog:'{a}/{b} منجز',see_projects:'عرض المشاريع المفتوحة',search_proj:'ابحث عن مشروع أو حاجة…',search_none:'لا نتائج.',proj_see_all:'عرض كل المشاريع',cf_ok:'تأكيد',cf_logout:'سيتم تسجيل خروجك. تأكد من تدوين رمز الاسترجاع: لا غنى عنه لاستعادة حسابك.',cf_rotate:'تجديد رابط الدعوة',cf_rotate_t:'سيُلغى الرابط القديم: لن يتمكن من لم يستعمله بعد من الانضمام به.',cr_add_ph:'اكتب عنصراً…',cr_del:'إزالة',cr_empty_hint:'لم يُرصد شيء تلقائياً: أكمل العناصر أدناه بنفسك.',tab_honor:'المكرَّمون',bd_title:'الشارات',bd_rules:'تحتسب شارات الالتزام الأفعال المعتمدة فقط (مهمة منجزة، مساعدة محلولة، قراءة مؤكدة) ولا تحتسب عدد الرسائل أبداً. تُمنح شارات الملف بعد تحقق أحد المشرفين.',bd_profile:'شارات الملف الموثَّقة',bd_none:'لا شارة ملف حالياً.',bd_req:'طلب شارة ملف',bd_eng:'شارات الالتزام',bd_next:'{a}/{b} للمستوى التالي',bd_max:'المستوى الأقصى',bd_honor:'الظهور ضمن الأعضاء المكرَّمين',bd_honor_note:'تُبرز القنوات أنشط أعضائها. يمكنك اختيار عدم الظهور.',bd_type:'نوع الشارة',bd_note:'التبرير (المهنة، الجهة…)',bd_note_help:'يتحقق أحد المشرفين من طلبك قبل منح الشارة. لا تُحفظ أي وثيقة في هذه النسخة التجريبية.',bd_sent:'أُرسل الطلب إلى المشرفين',bd_pending:'قيد الانتظار: {x}',bd_reqs:'طلبات الشارات',bd_none_req:'لا طلبات شارات.',bd_grant:'منح',bd_granted:'مُنحت الشارة لـ @{x}',bd_denied:'رُفض الطلب',b_mod:'مشرف',b_ref:'مرجعي',b_speaker:'ناطق رسمي',b_relay:'مندوب في الوطن',b_expert:'خبير موثَّق · {x}',hn_title:'الأعضاء المكرَّمون',hn_sub:'الأنشط في هذه القناة خلال الأسابيع الأخيرة.',hn_line:'{t} مهام · {h} مساعدات · {p} مشاريع',hn_note:'بناءً على أفعال معتمدة. شكراً لكل من يدفع المجتمع إلى الأمام.',hn_none:'لا أعضاء مكرَّمون بعد.',n_badge:'شارة جديدة: {x}'
}};

/* ============ Données de démonstration (fictives) ============ */
var CANALS=[
 {id:'edu',ico:'book',n:{fr:'Éducation & jeunesse',ar:'التعليم والشباب'},d:{fr:'Bourses, mentorat, écoles et projets pour la jeunesse mauritanienne.',ar:'منح وإرشاد ومدارس ومشاريع لفائدة الشباب الموريتاني.'}},
 {id:'inv',ico:'chart',n:{fr:'Investissement & entrepreneuriat',ar:'الاستثمار وريادة الأعمال'},d:{fr:'Créer, financer et développer des activités entre la diaspora et la Mauritanie.',ar:'إنشاء الأنشطة وتمويلها وتطويرها بين الجالية وموريتانيا.'}},
 {id:'san',ico:'heart',n:{fr:'Santé & solidarité',ar:'الصحة والتضامن'},d:{fr:'Missions médicales, collectes et soutien aux familles.',ar:'بعثات طبية وحملات جمع وإسناد للأسر.'}},
 {id:'adm',ico:'file',n:{fr:'Démarches & installation',ar:'الإجراءات والاستقرار'},d:{fr:'Papiers, installation à l’étranger, retour au pays.',ar:'الأوراق والاستقرار في الخارج والعودة إلى الوطن.'}},
 {id:'num',ico:'chip',n:{fr:'Numérique & innovation',ar:'الرقمنة والابتكار'},d:{fr:'Outils, compétences et startups technologiques.',ar:'أدوات ومهارات ومؤسسات ناشئة تقنية.'}},
 {id:'cul',ico:'palm',n:{fr:'Culture & patrimoine',ar:'الثقافة والتراث'},d:{fr:'Mémoire, langues, arts et événements culturels.',ar:'الذاكرة واللغات والفنون والفعاليات الثقافية.'}}
];
var DOMAINS=['adm','jur','ins','ret','san'];




/* ---- Textes bilingues, annuaire, fiches pratiques (fictifs) ---- */


var CONCEPTS=[['net',/r[ée]seau|informatique|ing[ée]nieur|t[ée]l[ée]com/i],['dev',/d[ée]velopp|web|front|num[ée]rique/i],['des',/design|graphi/i],['med',/m[ée]decin|sant[ée]|m[ée]dic/i],['log',/logisti|export|transport|douane/i],['jur',/juridi|juriste|droit|avocat/i],['tra',/traduct|arabe/i],['fin',/financ|comptab|banque/i],['mkt',/distribution|commerc|vente/i]];




/* ---- Badges ---- */
var ENG=[
 {id:'reader',ico:'eye',m:'reads',lv:[1,5,15],n:{fr:'Lecteur attentif',ar:'قارئ منتبه'},d:{fr:'Confirmer la lecture d’annonces officielles',ar:'تأكيد قراءة الإعلانات الرسمية'}},
 {id:'doer',ico:'check',m:'tasks',lv:[1,5,15],n:{fr:'Contributeur',ar:'مساهم'},d:{fr:'Terminer des tâches de projet',ar:'إنجاز مهام المشاريع'}},
 {id:'builder',ico:'folder',m:'proj',lv:[1,3,6],n:{fr:'Porteur de projet',ar:'حامل مشروع'},d:{fr:'Lancer des projets dans les canaux',ar:'إطلاق مشاريع في القنوات'}},
 {id:'helper',ico:'life',m:'help',lv:[1,5,10],n:{fr:'Main tendue',ar:'يد العون'},d:{fr:'Aider à résoudre des demandes d’entraide',ar:'المساعدة في حل طلبات التضامن'}},
 {id:'connector',ico:'people',m:'links',lv:[1,3,8],n:{fr:'Connecteur',ar:'همزة وصل'},d:{fr:'Proposer à des membres de contribuer à un projet',ar:'اقتراح المساهمة في مشروع على أعضاء'}}
];
var EXPERT={med:{fr:'Santé',ar:'الصحة'},jur:{fr:'Juridique',ar:'القانون'},net:{fr:'Ingénierie & numérique',ar:'الهندسة والرقمنة'},log:{fr:'Logistique',ar:'اللوجستيك'},fin:{fr:'Finance & comptabilité',ar:'المالية والمحاسبة'},edu:{fr:'Éducation',ar:'التعليم'}};

/* Traductions anglaises des données de référence (les canaux ajoutés en base gardent leur nom français). */
(function(){
  var EN={canal:{edu:['Education & youth','Scholarships, mentoring, schools and projects for Mauritanian youth.'],inv:['Investment & entrepreneurship','Creating, financing and growing businesses between the diaspora and Mauritania.'],san:['Health & solidarity','Medical missions, fundraisers and support for families.'],adm:['Paperwork & settling in','Documents, settling abroad, returning home.'],num:['Digital & innovation','Tools, skills and tech startups.'],cul:['Culture & heritage','Memory, languages, arts and cultural events.']},
   eng:{reader:['Attentive reader','Confirm reading of official announcements'],doer:['Contributor','Complete project tasks'],builder:['Project lead','Start projects in the channels'],helper:['Helping hand','Help solve help requests'],connector:['Connector','Suggest that members contribute to a project']},
   exp:{med:'Health',jur:'Legal',net:'Engineering & digital',log:'Logistics',fin:'Finance & accounting',edu:'Education'}};
  CANALS.forEach(function(k){var e=EN.canal[k.id];if(e){k.n.en=e[0];k.d.en=e[1];}});
  ENG.forEach(function(b){var e=EN.eng[b.id];if(e){b.n.en=e[0];b.d.en=e[1];}});
  Object.keys(EN.exp).forEach(function(k){if(EXPERT[k])EXPERT[k].en=EN.exp[k];});
})();

function loadTheme(){try{return localStorage.getItem('hcd-theme')==='dark'?'dark':'light';}catch(e){return 'light';}}
function saveTheme(v){try{localStorage.setItem('hcd-theme',v);}catch(e){}}




/* ============ État ============ */




/* ============ Utilitaires ============ */











function fmt(d){try{return new Date(d+'T12:00:00').toLocaleDateString(S.lang==='ar'?'ar-u-nu-latn':S.lang==='en'?'en-GB':'fr-FR',{day:'numeric',month:'short',year:'numeric'});}catch(e){return d;}}
function rel(at){var m=Math.floor((Date.now()-at)/60000);if(m<1)return t('now');if(m<60)return t('min',{n:m});if(m<1440)return t('hour',{n:Math.floor(m/60)});return t('day',{n:Math.floor(m/1440)});}
function dataAttrs(o){return Object.keys(o||{}).map(function(k){return 'data-'+k+'="'+esc(o[k])+'"';}).join(' ');}
var ICONS={
 home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
 hash:'<path d="M5 9h14M4 15h14M10 4L8 20M16 4l-2 16"/>',
 folder:'<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',
 life:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9"/>',
 bell:'<path d="M6 16v-5a6 6 0 0112 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 004 0"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 share:'<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
 chat:'<path d="M4 5h16v11H9l-5 4z"/>',lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
 chev:'<path d="M9 6l6 6-6 6"/>',back:'<path d="M15 6l-6 6 6 6"/>',
 mega:'<path d="M4 10v4h3l7 4V6L7 10z"/><path d="M17 9a4 4 0 010 6"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 people:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.3-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 5a3.5 3.5 0 010 7M18 14.8c1.8.7 3 2.5 3.5 5.2"/>',
 link:'<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
 copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>',
 book:'<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 19V5"/>',
 chart:'<path d="M4 20V4M4 20h16"/><path d="M8 16l4-5 3 3 5-7"/>',
 heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"/>',
 file:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
 chip:'<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4"/>',
 palm:'<path d="M12 21V11"/><path d="M12 11C9 11 6 9 5 6c3 0 6 1 7 5zM12 11c3 0 6-2 7-5-3 0-6 1-7 5zM12 11C10 8 10 5 12 3c2 2 2 5 0 8z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>',
 moon:'<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>',
 spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
};
function ic(n,s){s=s||20;return '<svg class="ic" width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[n]||'')+'</svg>';}
function logoSvg(){var d='';for(var i=0;i<7;i++){var a=i/7*Math.PI*2-Math.PI/2;d+='<circle cx="'+(24+14*Math.cos(a)).toFixed(1)+'" cy="'+(24+14*Math.sin(a)).toFixed(1)+'" r="3.2" fill="var(--yellow)"/>';}return '<svg class="logo" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="13" fill="var(--hero-b)"/>'+d+'<circle cx="24" cy="24" r="4.5" fill="var(--red)" stroke="var(--hero-ink)" stroke-width="1.5"/></svg>';}
function av(p,sz){var h=0;for(var i=0;i<p.length;i++)h=(h*31+p.charCodeAt(i))%3;return '<span class="av '+['g','y','r'][h]+'"'+(sz?' style="--s:'+sz+'px"':'')+'>'+esc(p.charAt(0).toUpperCase())+'</span>';}
function chip(txt,cls){return '<span class="chip '+(cls||'')+'">'+txt+'</span>';}
function projStatus(p){return p.status==='recruit'?chip(T('st_recruit'),'yellow'):p.status==='done'?chip(T('st_done')):chip(T('st_progress'),'green');}
function progress(p){var d=p.tasks.filter(function(k){return k.status==='done';}).length,n=p.tasks.length;return {d:d,n:n,pct:n?Math.round(d/n*100):0};}


function unread(){return S.notifs.filter(function(n){return !n.read;}).length;}
var toastTimer;
function toast(m){var el=$('#toast');el.textContent=m;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(function(){el.hidden=true;},3200);}
function copyText(txt){
  return new Promise(function(res,rej){
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(res,function(){fallback();});}else{fallback();}
    function fallback(){try{var ta=document.createElement('textarea');ta.value=txt;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;opacity:0;inset-inline-start:0;top:0';document.body.appendChild(ta);ta.select();var ok=document.execCommand&&document.execCommand('copy');document.body.removeChild(ta);ok?res():rej();}catch(e){rej();}}
  });
}
function doCopy(txt){copyText(txt).then(function(){toast(t('t_copied'));},function(){toast(t('t_copy_fail'));});}
function refQueue(){return S.helps.filter(function(h){return S.me.ref.indexOf(h.dom)>-1&&h.who!==S.me.pseudo;});}

/* ============ Navigation ============ */
var TABS=[['home','home','nav_home'],['canals','hash','nav_canals'],['projects','folder','nav_projects'],['help','life','nav_help'],['alerts','bell','nav_alerts']];
function go(name,params,replace){if(!replace){var v0=$('#view');if(v0)S.route._y=v0.scrollTop;S.stack.push(S.route);}S.route={name:name,params:params||{}};render(true);}
function tab(name){S.stack=[];S.route={name:name,params:{}};render(true);}
function back(){var r=S.stack.pop();S.route=r||(hasAccount()?{name:'home',params:{}}:{name:'inv1',params:{}});render(true);if(r&&r._y)$('#view').scrollTop=r._y;}
function tabOf(r){return {home:'home',canals:'canals',canal:'canals',projects:'projects',project:'projects',newProject:'projects',help:'help',newHelp:'help',alerts:'alerts'}[r]||'';}


/* ============ IA (simulée dans le prototype) ============ */




function concepts(x){return CONCEPTS.filter(function(k){return k[1].test(x);}).map(function(k){return k[0];});}
function overlap(a,b){return a.filter(function(x){return b.indexOf(x)>-1;});}

function mySkillProjects(){
  if(!S.me.matching||!S.me.skills.length)return [];
  var cm=concepts(S.me.skills.join(' ')),out=[];
  S.projects.forEach(function(p){if(!isMember(p.canal)||p.team.indexOf(S.me.pseudo)>-1||p.owner===S.me.pseudo)return;
    var n=p.needs.filter(function(x){return overlap(cm,concepts(x)).length;})[0];if(n)out.push({p:p,need:n});});
  return out;
}

function skillsSection(){
  return '<section class="card stack s8"><h2 class="h3">'+T('sk_title')+'</h2>'+toggle('toggle-matching',S.me.matching,T('sk_opt'),T('sk_opt_note'))+
  '<form data-form="skills" class="stack s8"><div class="field"><label for="sk-in">'+T('sk_in')+'</label><input type="text" id="sk-in" maxlength="120" autocomplete="off" value="'+esc(S.me.skills.join(', '))+'"></div><button class="btn sm" type="submit">'+T('sk_save')+'</button></form></section>';
}



/* Discussion -> projet */





/* Entraide : fiches, suggestions, brouillon */


function replyHtml(hq){return '<div class="reply"><p class="who">'+T('reply_from',{x:hq.reply.by})+'</p><p>'+esc(hq.reply.txt)+'</p></div>';}



/* Saisie vocale (réelle si le navigateur la propose, sinon simulée) */



/* ============ Badges ============ */

function lvl(b,st){var n=0;b.lv.forEach(function(x,i){if(st[b.m]>=x)n=i+1;});return n;}
function pts(st){return st.tasks*3+st.help*5+st.proj*4+st.reads+st.links*2;}
function dots(n,max){var o='';for(var i=0;i<max;i++)o+=i<n?'●':'○';return '<span class="dots" aria-label="'+T('bd_lvl',{n:n})+'">'+o+'</span>';}


function bdg(ico,label,cls){return '<span class="bdg '+cls+'">'+ic(ico,11)+esc(label)+'</span>';}
function roleList(p){
  var r=roleOf(p),o=[];
  if(r.speaker)o.push(['mega',t('b_speaker'),'red']);
  if(r.mod&&r.mod.length)o.push(['check',t('b_mod'),'green']);
  else if(r.ref)o.push(['life',t('b_ref'),'yellow']);
  if(r.expert)o.push(['check',t('b_expert',{x:c(EXPERT[r.expert])}),'green']);
  if(r.relay)o.push(['palm',t('b_relay'),'']);
  return o;
}
function pBadges(p){var o=roleList(p).slice(0,2);return o.length?' <span class="bdgs">'+o.map(function(x){return bdg(x[0],x[1],x[2]);}).join('')+'</span>':'';}
function typeLabel(ty){return ty==='relay'?t('b_relay'):t('b_expert',{x:c(EXPERT[ty.split(':')[1]])});}
function badgesSection(){
  var st=statsOf(S.me.pseudo),g=S.grants[S.me.pseudo]||{},pc=[];
  if(g.expert)pc.push(bdg('check',t('b_expert',{x:c(EXPERT[g.expert])}),'green'));
  if(g.relay)pc.push(bdg('palm',t('b_relay'),''));
  S.badgeReqs.filter(function(r){return r.p===S.me.pseudo;}).forEach(function(r){pc.push(chip(ic('clock',14)+esc(t('bd_pending',{x:typeLabel(r.type)})),'yellow'));});
  return '<section class="card stack s8"><h2 class="h3">'+T('bd_title')+'</h2><p class="muted small">'+T('bd_rules')+'</p>'+
  '<div class="lbl">'+T('bd_profile')+'</div>'+(pc.length?'<div class="chips">'+pc.join('')+'</div>':'<p class="muted small">'+T('bd_none')+'</p>')+
  '<button class="btn sm" data-act="badge-req">'+T('bd_req')+'</button>'+
  '<div class="lbl">'+T('bd_eng')+'</div>'+ENG.map(function(b){var n=lvl(b,st),nx=b.lv[n];
    return '<div class="li" style="align-items:flex-start"><span class="ico" style="'+(n?'':'opacity:.45')+'">'+ic(b.ico,18)+'</span><span class="grow"><span class="t">'+C(b.n)+'</span> '+dots(n,3)+'<br><span class="muted small">'+C(b.d)+' · '+(nx?T('bd_next',{a:st[b.m],b:nx}):T('bd_max'))+'</span></span></div>';}).join('')+
  toggle('toggle-honor',S.me.showHonor,T('bd_honor'),T('bd_honor_note'))+'</section>';
}

function badgeReqHtml(){
  var rq=S.badgeReqs.filter(function(r){return r.p!==S.me.pseudo;});
  return '<section><h2 class="h2">'+T('bd_reqs')+(rq.length?'<span class="count">'+rq.length+'</span>':'')+'</h2>'+(rq.length?'<div class="card list">'+rq.map(function(r){return '<div class="li" style="align-items:flex-start">'+av(r.p)+'<span class="grow"><span class="t">@'+esc(r.p)+'</span><br><span class="small">'+esc(typeLabel(r.type))+'</span><br><span class="muted small">'+esc(r.note)+'</span></span><span class="stack s8"><button class="btn sm primary" data-act="badge-grant" data-id="'+r.id+'">'+T('bd_grant')+'</button><button class="btn sm" data-act="badge-deny" data-id="'+r.id+'">'+T('refuse')+'</button></span></div>';}).join('')+'</div>':'<p class="empty">'+T('bd_none_req')+'</p>')+'</section>';
}
function openBadgeReq(){
  var opts=Object.keys(EXPERT).map(function(k){return '<option value="expert:'+k+'">'+esc(t('b_expert',{x:c(EXPERT[k])}))+'</option>';}).join('')+'<option value="relay">'+T('b_relay')+'</option>';
  openSheet(t('bd_req'),'<form data-form="badgereq" class="stack s8"><div class="field"><label for="bq-type">'+T('bd_type')+'</label><select id="bq-type">'+opts+'</select></div><div class="field"><label for="bq-note">'+T('bd_note')+'</label><textarea id="bq-note" maxlength="200" rows="3"></textarea></div><p class="muted small">'+T('bd_note_help')+'</p><button class="btn primary block" type="submit">'+T('send')+'</button></form>');
}


/* ============ Confort d'usage ============ */
function tabBadge(k,un){var n=0;if(k==='alerts')n=un;else if(k==='help'&&S.me.ref.length)n=refQueue().filter(function(h){return h.status==='open';}).length;else if(k==='canals')S.me.mod.forEach(function(id){n+=(S.reqs[id]||[]).length;});return n?'<span class="badge">'+n+'</span>':'';}
function confirmSheet(title,msg,act,id){openSheet(title,'<p>'+esc(msg)+'</p><div class="row"><button class="btn grow" data-act="close-sheet">'+T('cancel')+'</button><button class="btn primary grow" data-act="'+act+'" data-id="'+esc(id||'')+'">'+T('cf_ok')+'</button></div>');}


function projListHtml(){
  var list=S.projects.filter(function(p){return isMember(p.canal);}),shown=S.projTab==='mine'?list.filter(myProject):list,q=(S.projQ||'').trim().toLowerCase();
  if(q)shown=shown.filter(function(p){return (p.t.fr+' '+p.t.ar+' '+p.needs.join(' ')+' '+c(canalOf(p.canal).n)).toLowerCase().indexOf(q)>-1;});
  if(!shown.length)return q?'<p class="empty">'+T('search_none')+'</p>':(S.projTab==='mine'?'<div class="empty">'+T('proj_none_mine')+'<br><button class="btn sm" style="margin-top:8px" data-act="proj-tab" data-tab="all">'+T('proj_see_all')+'</button></div>':'<p class="empty">'+T('no_proj')+'</p>');
  return shown.map(projCard).join('');
}
/* ============ Vues ============ */

function projCard(p){
  var pr=progress(p),k=canalOf(p.canal);
  return '<button class="card pcard" data-act="open-project" data-id="'+esc(p.id)+'"><div class="row between wrap">'+chip(C(k.n))+projStatus(p)+'</div><h3>'+C(p.t)+'</h3>'+
   '<div class="bar" aria-hidden="true"><i style="--w:'+pr.pct+'%"></i></div><div class="row between muted small"><span>'+T('tasks_count',{a:pr.d,b:pr.n})+'</span><span>'+idInline(p.owner)+'</span></div></button>';
}
function todoItems(){
  var out=[];
  Object.keys(S.mem).forEach(function(id){if(S.mem[id]==='pending')out.push({ico:'clock',title:T('todo_pending',{x:c(canalOf(id).n)}),sub:T('todo_pending_sub'),act:'open-canal',data:{id:id}});});
  S.projects.forEach(function(p){p.tasks.forEach(function(k){if(k.who===S.me.pseudo&&k.status!=='done')out.push({ico:'check',title:T('todo_task',{x:k.t}),sub:C(p.t),act:'open-project',data:{id:p.id}});});});
  S.me.mod.forEach(function(id){var n=(S.reqs[id]||[]).length;if(n)out.push({ico:'people',title:T('todo_reqs',{x:n}),sub:C(canalOf(id).n),act:'open-canal',data:{id:id,tab:'mod'}});});
  if(S.me.ref.length){var n2=refQueue().filter(function(h){return h.status==='open';}).length;if(n2)out.push({ico:'life',title:T('todo_help',{x:n2}),sub:S.me.ref.map(function(d){return t('dm_'+d);}).map(esc).join(', '),act:'tab',data:{tab:'help'}});}
  return out;
}
function vHome(){
  var todo=todoItems(),anns=visibleAnns(),rec=S.projects.filter(function(p){return p.status==='recruit'&&isMember(p.canal);});
  var h='<section><p class="eyebrow">'+T('hello')+'</p><h1 class="page">'+idInline(S.me.pseudo)+'</h1><button class="lnk" data-act="tour-open">'+ic('life',14)+' '+T('tour_again')+'</button></section>';
  h+=startCard()+tilesHtml()+((S.hideFb||(S.fb||[]).some(function(r){return r.uid===S.me.id;}))?'':fbCard());
  h+='<section><h2 class="h2">'+T('todo')+(todo.length?'<span class="count">'+todo.length+'</span>':'')+'</h2>';
  h+=todo.length?'<div class="card list">'+todo.map(function(i){return '<button class="li" data-act="'+i.act+'" '+dataAttrs(i.data)+'><span class="ico">'+ic(i.ico,18)+'</span><span class="grow"><span class="t">'+i.title+'</span><br><span class="muted small">'+i.sub+'</span></span><span class="flip muted">'+ic('chev',18)+'</span></button>';}).join('')+'</div>':'<div class="empty">'+T('nothing')+'<br><button class="btn sm" style="margin-top:8px" data-act="tab" data-tab="projects">'+T('see_projects')+'</button></div>';
  h+='</section><section id="ann-sec"><h2 class="h2">'+T('ann_title')+'</h2><div class="stack">'+anns.map(function(a){return annCard(a,false);}).join('')+'</div></section>';
  if(rec.length)h+='<section><h2 class="h2">'+T('recruit_title')+'</h2><div class="stack">'+rec.map(projCard).join('')+'</div></section>';
  var sp=mySkillProjects();
  if(sp.length)h+='<section><div class="row between wrap"><h2 class="h2" style="margin:0">'+T('match_home')+'</h2></div><div class="stack" style="margin-top:8px">'+sp.map(function(x){return '<div>'+projCard(x.p)+'<p class="muted small" style="margin-top:4px">'+T('match_home_why',{n:x.need})+'</p></div>';}).join('')+'</div></section>';
  return h;
}
function statusChip(id){var s=mem(id);return s==='member'?chip(T('canal_member'),'green'):s==='pending'?chip(T('canal_pending'),'yellow'):'';}
function vCanals(){
  return '<div class="card list">'+CANALS.map(function(k){var s=mem(k.id);
    return '<div class="li"><button class="row grow" style="text-align:start;min-width:0" data-act="open-canal" data-id="'+k.id+'"><span class="ico">'+ic(k.ico,18)+'</span><span class="grow"><span class="t">'+C(k.n)+'</span><br><span class="muted small">'+k.count+' '+T('canal_members')+'</span></span></button>'+
    (s?statusChip(k.id):'<button class="btn sm" data-act="join" data-id="'+k.id+'">'+T('canal_join')+'</button>')+'</div>';}).join('')+'</div>';
}
function vCanal(p){
  var k=canalOf(p.id),st=mem(p.id);
  var tabs=[['ann','tab_ann']];if(st==='member'){tabs.push(['proj','tab_proj'],['help','tab_help'],['honor','tab_honor']);}if(isMod(p.id))tabs.push(['mod','tab_mod']);
  var cur=p.tab||S.canalTab[p.id]||'ann';if(!tabs.some(function(x){return x[0]===cur;}))cur='ann';S.canalTab[p.id]=cur;
  var h='<section class="card stack s8"><div class="row"><span class="ico-lg">'+ic(k.ico,22)+'</span><div class="grow"><h2 class="h3">'+C(k.n)+'</h2><p class="muted small">'+k.count+' '+T('canal_members')+(k.mod?' · '+T('canal_mod')+' '+idInline(k.mod):'')+'</p></div>'+statusChip(p.id)+'</div><p>'+C(k.d)+'</p>';
  h+='<button class="btn block" data-act="wa-group" data-id="'+k.id+'">'+ic('chat',18)+T('canal_wa')+'</button><p class="muted small">'+T('canal_wa_note')+'</p></section>';
  if(!st)h+='<button class="btn primary block" data-act="join" data-id="'+k.id+'">'+T('canal_join')+'</button>';
  if(st==='pending')h+='<div class="banner">'+ic('clock',18)+'<span>'+T('canal_pending_banner',{m:k.mod})+'</span></div>';
  h+='<div class="tabs" role="tablist">'+tabs.map(function(x){return '<button role="tab" aria-selected="'+(cur===x[0])+'" data-act="canal-tab" data-id="'+k.id+'" data-tab="'+x[0]+'">'+T(x[1])+'</button>';}).join('')+'</div>';
  if(cur==='ann'){var as=S.anns.filter(function(a){return a.canal===k.id||a.canal==='all';});h+='<div class="stack">'+(as.length?as.map(function(a){return annCard(a,st!=='member');}).join(''):'<p class="empty">'+T('no_ann')+'</p>')+'</div>';if(!st)h+='<p class="muted small">'+T('canal_locked')+'</p>';}
  if(cur==='proj'){var ps=S.projects.filter(function(x){return x.canal===k.id;});h+='<button class="btn block" data-act="new-project" data-id="'+k.id+'">'+ic('plus',18)+T('new_project')+'</button><div class="stack">'+(ps.length?ps.map(projCard).join(''):'<p class="empty">'+T('no_proj')+'</p>')+'</div>';}
  if(cur==='help'){h+='<button class="btn primary block" data-act="new-help">'+ic('plus',18)+T('new_help')+'</button><p class="muted small">'+ic('lock',14)+' '+T('help_priv')+'</p>';}
  if(cur==='honor')h+=honorHtml(k.id);
  if(cur==='mod'){var rq=S.reqs[k.id]||[];
    h+='<section><h2 class="h2">'+T('mod_reqs')+(rq.length?'<span class="count">'+rq.length+'</span>':'')+'</h2>'+(rq.length?'<div class="card list">'+rq.map(function(r){return '<div class="li">'+av(r.p)+'<span class="grow t">@'+esc(r.p)+'</span><button class="btn sm primary" data-act="accept" data-id="'+k.id+'" data-p="'+esc(r.p)+'" data-uid="'+esc(r.id)+'">'+T('accept')+'</button><button class="btn sm" data-act="refuse" data-id="'+k.id+'" data-p="'+esc(r.p)+'" data-uid="'+esc(r.id)+'">'+T('refuse')+'</button></div>';}).join('')+'</div>':'<p class="empty">'+T('mod_none')+'</p>')+'</section>';
    h+=modTools(k);}
  if(cur==='mod')h+=badgeReqHtml();
  return h;
}
function myProject(p){return p.owner===S.me.pseudo||p.team.indexOf(S.me.pseudo)>-1||p.tasks.some(function(k){return k.who===S.me.pseudo;});}
function vProjects(){
  var list=S.projects.filter(function(p){return isMember(p.canal);});
  var mine=list.filter(myProject);var shown=S.projTab==='mine'?mine:list;
  var h='<div class="seg" role="tablist"><button role="tab" aria-selected="'+(S.projTab==='mine')+'" data-act="proj-tab" data-tab="mine">'+T('proj_mine')+'</button><button role="tab" aria-selected="'+(S.projTab==='all')+'" data-act="proj-tab" data-tab="all">'+T('proj_all')+'</button></div>';
  h+='<button class="btn primary block" data-act="new-project">'+ic('plus',18)+T('new_project')+'</button>';
  h+='<input type="text" id="proj-q" inputmode="search" autocomplete="off" aria-label="'+esc(t('search_proj'))+'" placeholder="'+esc(t('search_proj'))+'" value="'+esc(S.projQ)+'"><div class="stack" id="proj-list">'+projListHtml()+'</div>';
  if(S.archived.length)h+='<section class="card stack s8"><h2 class="h3">'+T('pj_archived_t')+'</h2><p class="muted small">'+T('pj_archived_note')+'</p>'+S.archived.map(function(a){return '<div class="li"><span class="grow t">'+esc(a.t)+'</span><button class="btn sm" data-act="archive-project" data-id="'+a.id+'" data-v="0">'+T('pj_unarchive')+'</button>'+(isMod(a.canal)?'<button class="btn sm danger" data-act="delete-project" data-id="'+a.id+'">'+T('pj_delete')+'</button>':'')+'</div>';}).join('')+'</section>';
  return h;
}

/* Tâches : vue liste ou vue Kanban (colonnes fixes pendant la phase test). */
function taskAct(pj,k2){
  if(k2.status==='done')return chip(ic('check',14)+T('tk_done'),'green');
  if(!k2.who)return '<button class="btn sm" data-act="take" data-id="'+pj.id+'" data-task="'+k2.id+'">'+T('take')+'</button>';
  /* Seuls le chef de projet et les modérateurs valident une tâche : l'assigné voit qu'elle attend leur validation. */
  if(canEdit(pj))return (k2.rev?chip(ic('bell',14)+T('tk_asked'),'yellow'):'')+'<button class="btn sm primary" data-act="finish" data-id="'+pj.id+'" data-task="'+k2.id+'">'+T('mark_done')+'</button>';
  if(k2.who===S.me.pseudo)return k2.rev?chip(ic('check',14)+T('tk_alerted'),'yellow'):'<button class="btn sm" data-act="task-review" data-id="'+pj.id+'" data-task="'+k2.id+'">'+ic('bell',16)+T('tk_review_btn')+'</button><span class="muted small">'+T('tk_review')+'</span>';
  return k2.rev?chip(ic('bell',14)+T('tk_asked'),'yellow'):'';
}
function taskView(){var v='board';try{v=localStorage.getItem('dp-tv')==='list'?'list':'board';}catch(e){}return v;}
function tasksSection(pj){
  var v=taskView(),order={doing:0,todo:1,done:2},body='';
  if(v==='list'){
    body=pj.tasks.slice().sort(function(a,b){return order[a.status]-order[b.status];}).map(function(k2){
      return '<div class="tk"><span class="dot '+k2.status+'"></span><span class="grow"><span class="t">'+esc(k2.t)+'</span><br><span class="muted small">'+(k2.who?idInline(k2.who):T('unassigned'))+'</span></span>'+taskAct(pj,k2)+'</div>';}).join('');
  }else{
    var cols=[['todo','tk_todo'],['doing','tk_doing'],['done','tk_done']];
    body='<div class="kb" role="list">'+cols.map(function(col){
      var items=pj.tasks.filter(function(k2){return k2.status===col[0];});
      return '<div class="kb-col" role="listitem" aria-label="'+esc(t(col[1]))+'"><div class="kb-h"><span class="dot '+col[0]+'"></span><b>'+T(col[1])+'</b><span class="count">'+items.length+'</span></div>'+
        (items.length?items.map(function(k2){return '<div class="kb-card"><span class="t">'+esc(k2.t)+'</span><span class="muted small">'+(k2.who?idInline(k2.who):T('unassigned'))+'</span>'+taskAct(pj,k2)+'</div>';}).join(''):'<p class="muted small kb-empty">'+T('kb_empty')+'</p>')+'</div>';}).join('')+'</div>';
  }
  return '<section class="card stack s8"><div class="row between wrap"><h2 class="h2" style="margin:0">'+T('tasks')+'</h2><div class="seg" role="group" aria-label="'+esc(t('kb_view'))+'"><button aria-pressed="'+(v==='board')+'" data-act="task-view" data-v="board">'+T('kb_board')+'</button><button aria-pressed="'+(v==='list')+'" data-act="task-view" data-v="list">'+T('kb_list')+'</button></div></div>'+body+
    '<button class="btn sm kb-cols" data-act="kb-cols" aria-haspopup="dialog">'+ic('chart',16)+T('kb_cols')+' <span class="chip">'+T('kb_soon')+'</span></button></section>';
}
function vProject(p){
  var pj=projOf(p.id);if(!pj)return '';
  var k=canalOf(pj.canal),member=hasAccount()&&isMember(pj.canal),pr=progress(pj);
  var h='<section class="stack s8"><div class="row wrap">'+chip(C(k.n))+projStatus(pj)+'</div><h1 class="page">'+C(pj.t)+'</h1><div class="bar" aria-hidden="true"><i style="--w:'+pr.pct+'%"></i></div><p class="muted small">'+T('tasks_count',{a:pr.d,b:pr.n})+' · '+T('owner')+' '+idInline(pj.owner)+'</p>'+trBlock('p:'+pj.id,pj.obj,pj.t.fr)+'</section>';
  if(!member){
    h+='<div class="banner info">'+ic('lock',18)+'<span>'+(hasAccount()?T('proj_locked',{x:c(k.n)}):T('proj_locked_visitor'))+'</span></div>';
    h+=hasAccount()?(mem(pj.canal)==='pending'?'':'<button class="btn primary block" data-act="join" data-id="'+k.id+'">'+T('canal_join')+'</button>'):'<button class="btn primary block" data-act="wa-invite">'+T('canal_join')+'</button>';
    return h;
  }
  var f=S.follow[pj.id]||'all',inTeam=pj.team.indexOf(S.me.pseudo)>-1||pj.owner===S.me.pseudo;
  h+='<div class="row wrap"><button class="btn sm" data-act="follow-sheet" data-id="'+pj.id+'">'+ic('bell',16)+T('follow')+' · '+T('fo_'+(f==='milestones'?'mil':f))+'</button><button class="btn sm" data-act="share" data-kind="project" data-id="'+pj.id+'">'+ic('share',16)+T('share')+'</button>';
  if(inTeam)h+=chip(T('in_team'),'green');else h+='<button class="btn sm primary" data-act="apply" data-id="'+pj.id+'">'+T('apply')+'</button>';
  h+='</div>';
  h+='<section><h2 class="h2">'+T('needs')+'</h2><div class="chips">'+pj.needs.map(function(n){return chip(esc(n),'yellow');}).join('')+'</div></section>';
  h+=matchSection(pj,inTeam);
  h+='<section class="card"><h2 class="h2">'+T('milestones')+'</h2>'+pj.ms.map(function(m){return '<div class="ms"><span class="dot'+(m.done?' done':'')+'"></span><span class="grow">'+esc(m.t)+'</span><span class="muted small">'+(m.date?esc(fmt(m.date)):'')+'</span>'+(canEdit(pj)?'<button class="lnk" data-act="ms-toggle" data-id="'+pj.id+'" data-ms="'+m.id+'" data-done="'+(m.done?1:0)+'" aria-label="'+(m.done?'↺':'✓')+'">'+(m.done?'↺':'✓')+'</button>':'')+'</div>';}).join('')+'</section>';
  h+=tasksSection(pj);
  h+='<section class="card"><h2 class="h2">'+T('comments')+'</h2>'+(pj.cmts.length?pj.cmts.map(function(m){return '<div class="cmt">'+av(m.by)+'<div class="grow"><p class="who">'+idInline(m.by)+pBadges(m.by)+' <span class="muted small" style="font-weight:400">'+esc(rel(m.at))+'</span></p><p>'+esc(m.t)+'</p></div></div>';}).join(''):'')+
    '<form data-form="comment" data-id="'+pj.id+'" class="stack s8" style="margin-top:8px"><label class="lbl" for="cmt-text" hidden>'+T('comments')+'</label><textarea id="cmt-text" maxlength="280" rows="2" placeholder="'+T('cmt_ph')+'"></textarea><div class="row between"><span id="cmt-n" class="muted small">0/280</span><span class="row"><button class="btn sm primary" type="submit">'+T('publish')+'</button></span></div></form></section>';
  h+=manageSection(pj);
  h+='<section><h2 class="h2">'+T('team')+'</h2><div class="chips">'+pj.team.map(function(m){return '<span class="chip">'+av(m,20)+idInline(m)+'</span>'+pBadges(m);}).join('')+'</div></section>';
  return h;
}


function toggle(id,on,label,note){return '<div class="li" style="padding:12px 0"><span class="grow"><span class="t">'+label+'</span><br><span class="muted small">'+note+'</span></span><button class="sw" role="switch" aria-checked="'+on+'" aria-label="'+label+'" data-act="'+id+'"></button></div>';}


function fieldCanalOptions(sel){return Object.keys(S.mem).filter(isMember).map(function(id){return '<option value="'+id+'"'+(id===sel?' selected':'')+'>'+C(canalOf(id).n)+'</option>';}).join('');}
function vNewProject(p){
  var sel=p.canal||Object.keys(S.mem).filter(isMember)[0];
  if(!sel)return '<h1 class="page">'+T('new_project')+'</h1><div class="banner">'+ic('lock',18)+'<span>'+T('canal_locked')+'</span></div>';
  return '<h1 class="page">'+T('new_project')+'</h1>'+(S.me.ai?'<section class="card stack s8 ai-box"><h2 class="h3">'+T('ai_chat_t')+' '+chip(T('ai_tag'))+'</h2><p class="muted small">'+T('ai_chat_intro')+'</p><p class="muted small">'+T('chat_consent')+'</p><textarea id="ai-chat" maxlength="6000" placeholder="'+esc(t('ai_chat_ph'))+'"></textarea><button type="button" class="btn sm" data-act="ai-chat">'+T('ai_chat_go')+'</button></section>':'')+'<form data-form="project" class="stack" novalidate>'+
  '<div class="field"><label for="np-canal">'+T('f_canal')+'</label><select id="np-canal">'+fieldCanalOptions(sel)+'</select></div>'+
  '<div class="field"><label for="np-title">'+T('f_title')+'</label><input type="text" id="np-title" maxlength="80" autocomplete="off"></div>'+
  '<div class="field"><label for="np-obj">'+T('objective')+'</label><textarea id="np-obj" maxlength="300"></textarea></div>'+
  '<div class="field"><label for="np-needs">'+T('f_needs')+'</label><input type="text" id="np-needs" maxlength="160" autocomplete="off"></div>'+
  '<div class="field"><label for="np-due">'+T('f_due')+'</label><input type="date" id="np-due"></div>'+
  '<p class="fb err" id="np-err"></p><div class="row"><button type="button" class="btn grow" data-act="back">'+T('cancel')+'</button><button type="submit" class="btn primary grow">'+T('publish')+'</button></div></form>';
}

/* Parcours d'arrivée */




function titleFor(r,p){
  switch(r){case 'canals':return t('nav_canals');case 'projects':return t('nav_projects');case 'help':return t('nav_help');case 'alerts':return t('nav_alerts');
    case 'canal':return c(canalOf(p.id).n);case 'project':return projOf(p.id)?c(projOf(p.id).t):'';case 'newProject':return t('new_project');case 'newHelp':return t('new_help');case 'me':return t('my_account');case 'feedback':return L3('Votre avis','رأيك','Your feedback');case 'prereg':return L3('Préinscription','التسجيل المسبق','Pre-registration');default:return t('app_short');}
}

/* ============ Rendu ============ */
var COUNTRIES=[["MR","Mauritanie","موريتانيا","Mauritania"],["FR","France","فرنسا","France"],["SN","Sénégal","السنغال","Senegal"],["ML","Mali","مالي","Mali"],["MA","Maroc","المغرب","Morocco"],["DZ","Algérie","الجزائر","Algeria"],["TN","Tunisie","تونس","Tunisia"],["EG","Égypte","مصر","Egypt"],["LY","Libye","ليبيا","Libya"],["CI","Côte d’Ivoire","كوت ديفوار","Ivory Coast"],["GN","Guinée","غينيا","Guinea"],["GM","Gambie","غامبيا","Gambia"],["GW","Guinée-Bissau","غينيا بيساو","Guinea-Bissau"],["BF","Burkina Faso","بوركينا فاسو","Burkina Faso"],["NE","Niger","النيجر","Niger"],["NG","Nigeria","نيجيريا","Nigeria"],["GH","Ghana","غانا","Ghana"],["CM","Cameroun","الكاميرون","Cameroon"],["GA","Gabon","الغابون","Gabon"],["CG","Congo","الكونغو","Congo"],["CD","RD Congo","الكونغو الديمقراطية","DR Congo"],["AO","Angola","أنغولا","Angola"],["ZA","Afrique du Sud","جنوب أفريقيا","South Africa"],["SA","Arabie saoudite","السعودية","Saudi Arabia"],["AE","Émirats arabes unis","الإمارات","United Arab Emirates"],["QA","Qatar","قطر","Qatar"],["KW","Koweït","الكويت","Kuwait"],["BH","Bahreïn","البحرين","Bahrain"],["OM","Oman","عمان","Oman"],["JO","Jordanie","الأردن","Jordan"],["LB","Liban","لبنان","Lebanon"],["TR","Turquie","تركيا","Turkey"],["ES","Espagne","إسبانيا","Spain"],["PT","Portugal","البرتغال","Portugal"],["IT","Italie","إيطاليا","Italy"],["DE","Allemagne","ألمانيا","Germany"],["BE","Belgique","بلجيكا","Belgium"],["NL","Pays-Bas","هولندا","Netherlands"],["LU","Luxembourg","لوكسمبورغ","Luxembourg"],["CH","Suisse","سويسرا","Switzerland"],["GB","Royaume-Uni","المملكة المتحدة","United Kingdom"],["IE","Irlande","أيرلندا","Ireland"],["SE","Suède","السويد","Sweden"],["NO","Norvège","النرويج","Norway"],["DK","Danemark","الدنمارك","Denmark"],["FI","Finlande","فنلندا","Finland"],["AT","Autriche","النمسا","Austria"],["PL","Pologne","بولندا","Poland"],["RU","Russie","روسيا","Russia"],["UA","Ukraine","أوكرانيا","Ukraine"],["US","États-Unis","الولايات المتحدة","United States"],["CA","Canada","كندا","Canada"],["MX","Mexique","المكسيك","Mexico"],["BR","Brésil","البرازيل","Brazil"],["AR","Argentine","الأرجنتين","Argentina"],["CN","Chine","الصين","China"],["JP","Japon","اليابان","Japan"],["KR","Corée du Sud","كوريا الجنوبية","South Korea"],["IN","Inde","الهند","India"],["PK","Pakistan","باكستان","Pakistan"],["MY","Malaisie","ماليزيا","Malaysia"],["AU","Australie","أستراليا","Australia"],["NZ","Nouvelle-Zélande","نيوزيلندا","New Zealand"],["SD","Soudan","السودان","Sudan"],["TD","Tchad","تشاد","Chad"],["CV","Cap-Vert","الرأس الأخضر","Cape Verde"],["GQ","Guinée équatoriale","غينيا الاستوائية","Equatorial Guinea"],["BJ","Bénin","بنين","Benin"],["TG","Togo","توغو","Togo"],["SL","Sierra Leone","سيراليون","Sierra Leone"],["LR","Libéria","ليبيريا","Liberia"],["MG","Madagascar","مدغشقر","Madagascar"],["EH","Sahara occidental","الصحراء الغربية","Western Sahara"],["IQ","Irak","العراق","Iraq"],["PS","Palestine","فلسطين","Palestine"]];
var _cmap=null;
function _cn(x){return String(x||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’'`.\-]/g,' ').replace(/\s+/g,' ').trim();}
function flagEmoji(iso){return String.fromCodePoint(0x1F1E6+iso.charCodeAt(0)-65,0x1F1E6+iso.charCodeAt(1)-65);}
function flagFor(txt){
  if(!_cmap){_cmap={};COUNTRIES.forEach(function(c){_cmap[c[0].toLowerCase()]=c[0];for(var i=1;i<4;i++)_cmap[_cn(c[i])]=c[0];});['royaume uni','uk','usa','etats unis d amerique','emirats','emirats arabes','republique democratique du congo','rdc','cote d ivoire'].forEach(function(k,i){var m={'royaume uni':'GB','uk':'GB','usa':'US','etats unis d amerique':'US','emirats':'AE','emirats arabes':'AE','republique democratique du congo':'CD','rdc':'CD','cote d ivoire':'CI'};_cmap[k]=m[k];});}
  var raw=String(txt||'');if(!raw.trim())return '';
  var iso=_cmap[_cn(raw)];if(!iso){var parts=raw.split(/[,(\/–)]| - /).filter(function(x){return x.trim();});for(var i=parts.length-1;i>=0&&!iso;i--)iso=_cmap[_cn(parts[i])];}
  return iso?flagEmoji(iso):'';
}
function countryInput(id,val,attrs){
  var nm=S.lang==='ar'?2:S.lang==='en'?3:1,fl=flagFor(val);
  return '<div class="cpick"><div class="cp-row"><input type="text" id="'+id+'" list="dl-'+id+'" '+(attrs||'')+' value="'+esc(val||'')+'"><button type="button" class="cp-btn" data-act="cp-toggle" data-id="'+id+'" aria-expanded="false" aria-label="'+esc(T('cp_pick'))+'"><span class="flg" id="cpf-'+id+'">'+(fl||'\uD83C\uDF0D')+'</span></button></div><div class="cp-panel" id="cpp-'+id+'" hidden></div><datalist id="dl-'+id+'">'+COUNTRIES.map(function(c){return '<option value="'+esc(c[nm])+'"></option>';}).join('')+'</datalist></div>';
}
/* Sélecteur de pays par drapeaux : grille filtrable, ouverte sous le champ (fonctionne aussi dans une fenêtre). */
function cpFlag(id){var f=$('#cpf-'+id),i=$('#'+id);if(f&&i)f.textContent=flagFor(i.value)||'\uD83C\uDF0D';}
function cpGrid(id,q){
  var nm=S.lang==='ar'?2:S.lang==='en'?3:1,nq=_cn(q);
  var rows=COUNTRIES.filter(function(c){if(!nq)return true;for(var i=0;i<4;i++)if(_cn(c[i]).indexOf(nq)>-1)return true;return false;});
  return rows.length?rows.map(function(c){return '<button type="button" class="cp-item" data-act="cp-pick" data-id="'+id+'" data-v="'+esc(c[nm])+'"><span class="flg">'+flagEmoji(c[0])+'</span><span>'+esc(c[nm])+'</span></button>';}).join(''):'<p class="muted small">'+T('cp_none')+'</p>';
}
/* Identité affichée : nom complet si renseigné (optionnel, public), pseudo toujours présent mais grisé dans ce cas. */
function nameOf(p){return (S.names&&S.names[p])||'';}
function idInline(p){var n=nameOf(p);return n?esc(n)+' <span class="muted small">@'+esc(p)+'</span>':'@'+esc(p);}
function decorateFlags(el){
  if(!el||!S.flags)return;
  var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var pn=n.parentNode&&n.parentNode.nodeName;return (pn==='SCRIPT'||pn==='STYLE'||pn==='TEXTAREA'||pn==='OPTION'||pn==='TITLE')?NodeFilter.FILTER_REJECT:(n.nodeValue.indexOf('@')>-1?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT);}}),nodes=[],n;
  while((n=w.nextNode()))nodes.push(n);
  nodes.forEach(function(tn){
    var v=tn.nodeValue,re=/(^|[^\w.@])@([a-z0-9][a-z0-9._-]{2,23})/g,m,last=0,out=[],hit=false;
    while((m=re.exec(v))){
      var ps=m[2],f=S.flags[ps];if(!f){ps=ps.replace(/[._-]+$/,'');f=S.flags[ps];}
      if(!f)continue;
      var end=m.index+m[1].length+1+ps.length;out.push(v.slice(last,end),f);last=end;hit=true;re.lastIndex=end;
    }
    if(!hit)return;
    out.push(v.slice(last));
    var fr=document.createDocumentFragment();
    for(var i=0;i<out.length;i+=2){fr.appendChild(document.createTextNode(out[i]));if(i+1<out.length){var sp=document.createElement('span');sp.className='flg';sp.setAttribute('aria-hidden','true');sp.textContent=' '+out[i+1];fr.appendChild(sp);}}
    tn.parentNode.replaceChild(fr,tn);
  });
}
function render(resetScroll){
  var acct=hasAccount(),r=S.route.name,p=S.route.params||{};
  if(!acct&&['load','inv0','inv1','invRec','prereg'].indexOf(r)<0){S.route={name:'inv0',params:{}};r='inv0';p={};}
  root.lang=S.lang;root.dir=S.lang==='ar'?'rtl':'ltr';
  root.setAttribute('data-theme',S.theme==='dark'?'dark':'light');
  var tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.setAttribute('content',S.theme==='dark'?'#0E1511':'#FFFFFF');
  var onb=r.indexOf('inv')===0||r==='load'||r==='prereg',detail=['canal','project','newProject','newHelp','me','feedback'].indexOf(r)>-1&&S.stack.length>0;
  var tb=(detail?'<button class="icon-btn flip" data-act="back" aria-label="'+T('back')+'">'+ic('back',22)+'</button>':logoSvg())+'<h1>'+esc(titleFor(r,p))+'</h1><button class="icon-btn lang-btn" data-act="toggle-lang" aria-label="'+esc(S.lang==='fr'?'English':S.lang==='en'?'العربية':'Français')+'">'+(S.lang==='fr'?'EN':S.lang==='en'?'ع':'FR')+'</button><button class="icon-btn" data-act="toggle-theme" aria-label="'+esc(S.theme==='dark'?t('th_light'):t('th_dark'))+'">'+ic(S.theme==='dark'?'sun':'moon',20)+'</button>'+(acct&&!onb?'<button class="icon-btn me-btn" data-act="go-me" aria-label="'+T('my_account')+'">'+av(S.me.pseudo,32)+'</button>':'');
  $('#topbar').innerHTML=tb;
  var view=$('#view'),y=view.scrollTop;
  view.innerHTML=(VIEWS[r]||vHome)(p);decorateFlags(view);
  view.scrollTop=resetScroll?0:y;
  var bar=$('#tabbar');
  if(acct&&!onb){bar.hidden=false;var cur=tabOf(r),un=unread();bar.innerHTML=TABS.map(function(x){return '<button class="tab" data-act="tab" data-tab="'+x[0]+'"'+(cur===x[0]?' aria-current="page"':'')+'>'+ic(x[1],22)+'<span class="tab-l">'+T(x[2])+'</span>'+tabBadge(x[0],un)+'</button>';}).join('');}
  else bar.hidden=true;
  mount(r);maybeTour();
}
function mount(r){
  var tbs=document.querySelector('.tabs'),at=tbs&&tbs.querySelector('[aria-selected="true"]');if(at&&root.dir!=='rtl')tbs.scrollLeft=at.offsetLeft-tbs.clientWidth/2+at.offsetWidth/2;
  if(r==='inv1'){updatePseudo();}
}




/* ============ Fenêtres ============ */
var lastFocus=null;
function openSheet(title,body,cls){
  closeSheet(true);lastFocus=document.activeElement;
  var r=$('#sheets');
  r.innerHTML='<div class="scrim" data-act="close-sheet"></div><div class="sheet '+(cls||'')+'" role="dialog" aria-modal="true" aria-label="'+esc(title)+'"><div class="sheet-h"><h2>'+esc(title)+'</h2><button class="icon-btn" data-act="close-sheet" aria-label="'+T('close')+'">'+ic('x',20)+'</button></div><div class="sheet-b">'+body+'</div></div>';
  decorateFlags(r);r.hidden=false;var f=r.querySelector('.sheet-b button,.sheet-b input,.sheet-b textarea,.sheet-b select');if(f)f.focus();
}
function closeSheet(silent){var r=$('#sheets');r.hidden=true;r.innerHTML='';if(!silent&&lastFocus&&lastFocus.focus){try{lastFocus.focus();}catch(e){}}}

function openShare(kind,id){
  var m=shareMessage(kind,id);S._msg=m.text;
  openSheet(t('share_title'),'<p class="muted small">'+T('share_prev')+'</p><div class="chat"><div class="bub out"><p>'+esc(m.text.split('https://')[0])+'</p><div class="lc"><b>'+esc(m.title)+'</b><span class="muted small">'+esc(m.sub)+'</span><span class="url" dir="ltr">'+esc(m.url)+'</span></div></div></div>'+
   '<div class="row wrap"><button class="btn grow" data-act="copy-msg">'+ic('copy',18)+T('share_copy')+'</button><a class="btn primary grow" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(m.text)+'">'+ic('chat',18)+T('share_open')+'</a></div><p class="muted small">'+T('share_note')+'</p>');
}

function openFollow(id){
  var cur=S.follow[id]||'all';
  openSheet(t('follow_title'),['all','milestones','none'].map(function(v){var k=v==='milestones'?'mil':v;return '<button class="rad" role="radio" aria-checked="'+(cur===v)+'" data-act="pick-follow" data-id="'+id+'" data-v="'+v+'"><span class="o"></span><span class="grow"><span class="t">'+T('fo_'+k)+'</span><br><span class="muted small">'+T('fo_'+k+'_d')+'</span></span></button>';}).join(''));
}



/* ============ Actions ============ */












/* Hors ligne (version installable uniquement) */
if('serviceWorker' in navigator&&document.querySelector('link[rel="manifest"]')){
  window.addEventListener('load',function(){navigator.serviceWorker.register('./sw.js').catch(function(){});});
}

/* ---- Textes de la version réelle ---- */
Object.assign(I18N.fr,{
loading:'Chargement…',e_generic:'Une erreur est survenue. Réessayez dans un instant.',e_invite:'Ce lien n’est plus valable. Demandez-en un nouveau au modérateur de votre canal.',
e_taken:'Ce pseudo vient d’être pris. Choisissez-en un autre.',e_already:'Vous avez déjà un compte sur cet appareil.',e_denied:'Action non autorisée.',e_unknown:'Aucun membre avec ce pseudo.',
e_net:'Connexion impossible. Vérifiez votre réseau et réessayez.',cfg_missing:'L’application n’est pas encore configurée (clés Supabase manquantes).',
inv0_title:'Diasporact fonctionne sur invitation',inv0_sub:'Demandez le lien d’invitation au modérateur de votre canal dans le groupe WhatsApp, puis ouvrez-le, ou collez-le ci-dessous.',
inv0_ph:'Collez le lien reçu',inv0_go:'Ouvrir le lien',inv0_bad:'Lien non reconnu.',
pseudo_help:'Unique. 3 à 24 caractères : lettres, chiffres, point, tiret ou souligné.',pseudo_bad:'Utilisez 3 à 24 caractères : lettres, chiffres, point, tiret ou souligné.',pseudo_check:'Vérification…',
country_label:'Pays de résidence (facultatif)',cp_pick:'Choisir un pays par son drapeau',ai_tr_btn:'Traduire (IA)',ai_tr_hide:'Masquer',ai_tr_wait:'Traduction en cours…',ai_consent_t:'Utiliser l’IA',ai_consent_b:'Pour cette fonction, le texte concerné est envoyé à un service d’IA (Anthropic, États-Unis) qui renvoie un résultat. Rien n’est conservé par Diasporact. Le résultat peut contenir des erreurs : relisez-le. Ne collez que des contenus que vous pouvez partager.',ai_agree:'J’ai compris, continuer',ai_err:'L’IA n’a pas pu répondre. Réessayez.',ai_err_quota:'Limite quotidienne d’utilisations de l’IA atteinte. Revenez demain.',ai_err_off:'L’IA est momentanément indisponible.',ai_err_tester:'L’IA est réservée aux testeurs désignés.',ai_chat_t:'Depuis une discussion (IA)',ai_chat_intro:'Collez une discussion : l’IA propose un titre, un objectif et des besoins. Vous relisez et corrigez avant de publier.',ai_chat_go:'Proposer une fiche',ai_chat_ph:'Collez ici la discussion (6000 caractères maximum)',ai_chat_wait:'Analyse en cours…',ai_chat_none:'L’IA n’a pas trouvé de projet dans ce texte.',ai_filled:'Proposition ajoutée au formulaire : relisez avant de publier.',r_ai:'Testeur IA',adm_ai:'Testeur IA',adm_ai_on:'Peut utiliser les fonctions IA (20 utilisations par jour)',privacy_link:'En créant un compte, vous acceptez que ces informations soient utilisées comme décrit dans la <a href="confidentialite.html" target="_blank" rel="noopener">politique de confidentialité</a>.',cp_search:'Rechercher un pays',cp_none:'Aucun pays trouvé. Vous pouvez aussi saisir le nom librement.',create_account:'Créer mon compte',pw_label:'Mot de passe',sc_title:'Code de secours',sc_note:'Si vous perdez votre mot de passe, ce code vous permet d’en choisir un nouveau vous-même. Il ne s’affiche qu’une fois.',sc_gen:'Générer un nouveau code',sc_gen_warn:'Le précédent code ne fonctionnera plus.',sc_show:'Notez votre code de secours',sc_keep:'Conservez-le hors de l’application (papier, gestionnaire de mots de passe). Chaque utilisation en génère un nouveau.',sc_copy:'Copier le code',sc_done:'C’est noté',forgot:'Mot de passe oublié ?',fg_sub:'Entrez votre pseudo, votre code de secours et un nouveau mot de passe.',fg_code:'Code de secours',fg_go:'Changer mon mot de passe',e_code:'Pseudo ou code de secours incorrect.',e_locked:'Trop d’essais. Réessayez dans 15 minutes.',fg_nocode:'Pas de code ? Demandez un lien de reconnexion à un modérateur.',pw_help:'8 caractères minimum. Il vous permet de retrouver votre compte sur n’importe quel appareil.',pw_short:'Le mot de passe doit contenir au moins 8 caractères.',e_login:'Pseudo ou mot de passe incorrect.',pw_later:'Compte créé, mais le mot de passe n’a pas pu être enregistré. Ajoutez-le depuis l’onglet Moi.',have_acct:'J’ai déjà un compte',login_go:'Me connecter',login_sub:'Retrouvez votre compte sur cet appareil avec votre pseudo et votre mot de passe.',secure_t:'Sécuriser mon compte',secure_note:'Ajoutez un mot de passe pour retrouver votre compte sur n’importe quel appareil, sans lien de reconnexion.',secure_go:'Enregistrer le mot de passe',pw_ok:'Mot de passe enregistré.',pw_new:'Nouveau mot de passe',acct_ok_t:'Compte protégé',acct_ok_note:'Connectez-vous avec @{p} et votre mot de passe sur n’importe quel appareil. Mot de passe perdu : demandez un lien de reconnexion à un modérateur.',change_pw:'Changer le mot de passe',logout_t:'Se déconnecter de cet appareil',t_logged_in:'Connecté.',
rec_title:'Retrouver votre compte',rec_sub:'Ce lien de reconnexion vous rattache à votre compte sur cet appareil. Il ne fonctionne qu’une fois.',rec_go:'Retrouver mon compte',
adm_first:'Premier administrateur',adm_first_sub:'Ce compte aura tous les droits d’administration.',
joined:'Vous avez rejoint {x}.',welcome_in:'Bienvenue sur Diasporact.',
recov:'Changer de téléphone',recov_note:'Sans mot de passe, votre compte reste lié à cet appareil. En cas de perte d’accès, un modérateur peut vous envoyer un lien de reconnexion sur WhatsApp.',
del_account:'Supprimer mon compte',del_t:'Votre profil sera supprimé définitivement. Cette action ne peut pas être annulée.',t_deleted:'Compte supprimé.',
adm_title:'Administration',adm_role:'Nommer un modérateur ou un relais',adm_pseudo:'Pseudo du membre',adm_canal:'Canal',adm_mod:'Modérateur du canal',adm_relay:'Relais local',adm_save:'Enregistrer',
adm_ref:'Référent entraide',adm_ref_on:'Référent entraide (voit et traite les demandes)',t_saved:'Enregistré.',
adm_spk:'Porte-parole d’un pays',adm_spk_country:'Pays',adm_spk_on:'Porte-parole de ce pays (peut diffuser une annonce à toute sa diaspora)',
rc_title:'Lien de reconnexion',rc_help:'Pour un membre qui a changé d’appareil. Valable 7 jours, à usage unique.',rc_make:'Générer le lien',rc_ready:'Lien prêt',
wa_set:'Groupe WhatsApp du canal',wa_set_ph:'https://chat.whatsapp.com/…',wa_none:'Le groupe WhatsApp de ce canal n’a pas encore été ajouté.',wa_bad:'Lien WhatsApp invalide.',
inv_gen:'Générer le lien d’invitation',inv_none:'Aucun lien actif.',
t_ms:'Jalon mis à jour.',add_task:'Ajouter une tâche',task_ph:'Nouvelle tâche',add_ms:'Ajouter un jalon',ms_ph:'Jalon',manage:'Gérer le projet',pj_archive:'Archiver le projet',pj_unarchive:'Désarchiver',pj_delete:'Supprimer le projet',pj_mod_only:'Réservé aux modérateurs.',pj_archived_t:'Projets archivés',pj_archived_note:'Visibles uniquement de leur propriétaire et des modérateurs. La suppression est réservée aux modérateurs.',pj_arch_ok:'Projet archivé.',pj_unarch_ok:'Projet désarchivé.',pj_del_t:'Le projet, ses tâches, jalons et commentaires seront supprimés définitivement. Vous pouvez l’archiver à la place. Cette action ne peut pas être annulée.',pj_del_ok:'Projet supprimé.',pj_status:'Statut du projet',
reply_btn:'Répondre',reply_title:'Répondre à la demande',reply_ph:'Votre réponse',reply_send:'Envoyer et clore',help_priv:'Visible uniquement par vous et les référents entraide',help_priv_ref:'Visible uniquement par les référents entraide',
n_joined:'@{x} a rejoint votre projet',n_prop:'On vous propose de contribuer au projet {x}',t_claimed2:'Demande prise en charge.',b_speaker:'Administrateur',r_speaker:'Administrateur',
apply:'Rejoindre l’équipe',t_applied:'Vous faites partie de l’équipe.',t_sent_req:'Demande envoyée.',
no_dir:'Aucun profil ne correspond pour le moment.',empty_canals:'Rejoignez un canal avec un lien d’invitation.',
share_note:'Le message s’ouvre dans WhatsApp : vous choisissez le groupe.',invite_exp:'Le lien reste valable jusqu’à ce que vous en générez un nouveau.',
privacy_t:'Confidentialité et mes données',privacy_export:'Télécharger mes données',privacy_export_note:'Un fichier avec tout ce que l’application sait de vous : profil, canaux, projets, entraide, annonces, notifications.',privacy_policy:'Comment vos données sont utilisées',t_exported:'Données exportées.',
privacy_title2:'Confidentialité',privacy_body:'<p>Diasporact ne demande ni e-mail ni téléphone : seulement un pseudo que vous choisissez. Le prénom et le nom, le pays de résidence et les compétences sont facultatifs et publics pour les autres membres (les compétences seulement si vous activez l’option).</p><p>Vos données sont hébergées dans l’Union européenne, ne sont jamais vendues ni partagées avec un tiers, et ne sont visibles que des autres membres invités, selon vos canaux. Une sauvegarde quotidienne est conservée 30 jours au maximum.</p><p>Vous pouvez à tout moment modifier vos informations, télécharger vos données ou supprimer définitivement votre compte depuis cet écran.</p><p><a href="confidentialite.html" target="_blank" rel="noopener">'+'Lire la politique de confidentialité complète</a></p><p class="muted small">Pour une demande ou un signalement : board.kalidia@gmail.com</p>'
});
Object.assign(I18N.ar,{
loading:'جارٍ التحميل…',e_generic:'حدث خطأ. أعد المحاولة بعد قليل.',e_invite:'هذا الرابط لم يعد صالحاً. اطلب رابطاً جديداً من مشرف قناتك.',
e_taken:'هذا الاسم أُخذ للتو. اختر اسماً آخر.',e_already:'لديك حساب بالفعل على هذا الجهاز.',e_denied:'إجراء غير مسموح.',e_unknown:'لا يوجد عضو بهذا الاسم.',
e_net:'تعذر الاتصال. تحقق من الشبكة وأعد المحاولة.',cfg_missing:'التطبيق غير مهيأ بعد (مفاتيح Supabase ناقصة).',
inv0_title:'يعمل Diasporact بالدعوة',inv0_sub:'اطلب رابط الدعوة من مشرف قناتك في مجموعة واتساب، ثم افتحه أو الصقه أدناه.',
inv0_ph:'الصق الرابط المستلم',inv0_go:'فتح الرابط',inv0_bad:'رابط غير معروف.',
pseudo_help:'فريد. من 3 إلى 24 حرفاً: حروف وأرقام ونقطة وشرطة أو شرطة سفلية.',pseudo_bad:'استعمل من 3 إلى 24 حرفاً: حروف وأرقام ونقطة وشرطة أو شرطة سفلية.',pseudo_check:'جارٍ التحقق…',
country_label:'بلد الإقامة (اختياري)',cp_pick:'اختيار بلد من خلال علمه',ai_tr_btn:'ترجمة (ذكاء اصطناعي)',ai_tr_hide:'إخفاء',ai_tr_wait:'جارٍ الترجمة…',ai_consent_t:'استخدام الذكاء الاصطناعي',ai_consent_b:'في هذه الميزة يُرسل النص المعني إلى خدمة ذكاء اصطناعي (Anthropic، الولايات المتحدة) التي تُرجع نتيجة. لا يحتفظ Diasporact بأي شيء. قد تحتوي النتيجة على أخطاء: راجعها. لا تلصق إلا ما يمكنك مشاركته.',ai_agree:'فهمت، متابعة',ai_err:'تعذّر على الذكاء الاصطناعي الرد. أعد المحاولة.',ai_err_quota:'بلغت الحد اليومي لاستخدام الذكاء الاصطناعي. عد غداً.',ai_err_off:'الذكاء الاصطناعي غير متاح مؤقتاً.',ai_err_tester:'الذكاء الاصطناعي مخصص للمختبرين المعيّنين.',ai_chat_t:'انطلاقاً من نقاش (ذكاء اصطناعي)',ai_chat_intro:'الصق نقاشاً: يقترح الذكاء الاصطناعي عنواناً وهدفاً واحتياجات. تراجعها وتصححها قبل النشر.',ai_chat_go:'اقتراح بطاقة',ai_chat_ph:'الصق النقاش هنا (6000 حرف كحد أقصى)',ai_chat_wait:'جارٍ التحليل…',ai_chat_none:'لم يجد الذكاء الاصطناعي مشروعاً في هذا النص.',ai_filled:'أُضيف الاقتراح إلى النموذج: راجعه قبل النشر.',r_ai:'مختبِر الذكاء الاصطناعي',adm_ai:'مختبِر الذكاء الاصطناعي',adm_ai_on:'يمكنه استخدام ميزات الذكاء الاصطناعي (20 استخداماً في اليوم)',privacy_link:'بإنشاء حساب فإنك توافق على استخدام هذه المعلومات كما هو موضح في <a href="confidentialite.html#ar" target="_blank" rel="noopener">سياسة الخصوصية</a>.',cp_search:'ابحث عن بلد',cp_none:'لا يوجد بلد مطابق. يمكنك أيضًا كتابة الاسم يدويًا.',create_account:'إنشاء حسابي',pw_label:'كلمة المرور',sc_title:'رمز الطوارئ',sc_note:'إذا فقدت كلمة المرور فهذا الرمز يتيح لك اختيار كلمة جديدة بنفسك. يظهر مرة واحدة فقط.',sc_gen:'إنشاء رمز جديد',sc_gen_warn:'لن يعمل الرمز السابق بعد الآن.',sc_show:'دوّن رمز الطوارئ',sc_keep:'احتفظ به خارج التطبيق (ورقة أو مدير كلمات المرور). كل استخدام يولّد رمزاً جديداً.',sc_copy:'نسخ الرمز',sc_done:'تم التدوين',forgot:'نسيت كلمة المرور؟',fg_sub:'أدخل اسم المستخدم ورمز الطوارئ وكلمة مرور جديدة.',fg_code:'رمز الطوارئ',fg_go:'تغيير كلمة المرور',e_code:'اسم المستخدم أو رمز الطوارئ غير صحيح.',e_locked:'محاولات كثيرة. أعد المحاولة بعد 15 دقيقة.',fg_nocode:'ليس لديك رمز؟ اطلب من مشرف رابط إعادة اتصال.',pw_help:'8 أحرف على الأقل. تتيح لك استعادة حسابك على أي جهاز.',pw_short:'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل.',e_login:'اسم المستخدم أو كلمة المرور غير صحيحة.',pw_later:'تم إنشاء الحساب لكن تعذّر حفظ كلمة المرور. أضفها من تبويب «أنا».',have_acct:'لدي حساب بالفعل',login_go:'تسجيل الدخول',login_sub:'استعد حسابك على هذا الجهاز باسم المستخدم وكلمة المرور.',secure_t:'تأمين حسابي',secure_note:'أضف كلمة مرور لاستعادة حسابك على أي جهاز دون رابط إعادة اتصال.',secure_go:'حفظ كلمة المرور',pw_ok:'تم حفظ كلمة المرور.',pw_new:'كلمة مرور جديدة',acct_ok_t:'الحساب محمي',acct_ok_note:'سجّل الدخول باسم @{p} وكلمة المرور على أي جهاز. إذا نسيت كلمة المرور فاطلب من مشرف رابط إعادة اتصال.',change_pw:'تغيير كلمة المرور',logout_t:'تسجيل الخروج من هذا الجهاز',t_logged_in:'تم تسجيل الدخول.',
rec_title:'استعادة حسابك',rec_sub:'يربط هذا الرابط حسابك بهذا الجهاز. يعمل مرة واحدة فقط.',rec_go:'استعادة حسابي',
adm_first:'المشرف الأول',adm_first_sub:'سيملك هذا الحساب كل صلاحيات الإدارة.',
joined:'انضممت إلى {x}.',welcome_in:'مرحباً بك في Diasporact.',
recov:'تغيير الهاتف',recov_note:'بدون كلمة مرور يبقى حسابك مرتبطاً بهذا الجهاز. عند فقدان الوصول يمكن للمشرف إرسال رابط إعادة اتصال عبر واتساب.',
del_account:'حذف حسابي',del_t:'سيُحذف ملفك نهائياً. لا يمكن التراجع عن هذا الإجراء.',t_deleted:'تم حذف الحساب.',
adm_title:'الإدارة',adm_role:'تعيين مشرف أو مرجع محلي',adm_pseudo:'اسم العضو',adm_canal:'القناة',adm_mod:'مشرف القناة',adm_relay:'مرجع محلي',adm_save:'حفظ',
adm_ref:'مرجع التضامن',adm_ref_on:'مرجع التضامن (يرى الطلبات ويعالجها)',t_saved:'تم الحفظ.',
adm_spk:'ناطق باسم بلد',adm_spk_country:'البلد',adm_spk_on:'ناطق باسم هذا البلد (يمكنه نشر إعلان لكل جاليته)',
rc_title:'رابط إعادة الاتصال',rc_help:'لعضو غيّر جهازه. صالح 7 أيام ويُستعمل مرة واحدة.',rc_make:'إنشاء الرابط',rc_ready:'الرابط جاهز',
wa_set:'مجموعة واتساب للقناة',wa_set_ph:'https://chat.whatsapp.com/…',wa_none:'لم تُضف مجموعة واتساب لهذه القناة بعد.',wa_bad:'رابط واتساب غير صالح.',
inv_gen:'إنشاء رابط الدعوة',inv_none:'لا يوجد رابط نشط.',
t_ms:'تم تحديث المرحلة.',add_task:'إضافة مهمة',task_ph:'مهمة جديدة',add_ms:'إضافة مرحلة',ms_ph:'مرحلة',manage:'إدارة المشروع',pj_archive:'أرشفة المشروع',pj_unarchive:'إلغاء الأرشفة',pj_delete:'حذف المشروع',pj_mod_only:'للمشرفين فقط.',pj_archived_t:'المشاريع المؤرشفة',pj_archived_note:'ظاهرة لصاحب المشروع والمشرفين فقط. الحذف للمشرفين فقط.',pj_arch_ok:'تمت أرشفة المشروع.',pj_unarch_ok:'أُلغيت أرشفة المشروع.',pj_del_t:'سيُحذف المشروع ومهامه ومراحله وتعليقاته نهائياً. يمكنك أرشفته بدلاً من ذلك. لا يمكن التراجع عن هذا الإجراء.',pj_del_ok:'تم حذف المشروع.',pj_status:'حالة المشروع',
reply_btn:'الرد',reply_title:'الرد على الطلب',reply_ph:'ردّك',reply_send:'إرسال وإغلاق',help_priv:'لا يراه إلا أنت ومراجع التضامن',help_priv_ref:'لا يراه إلا مراجع التضامن',
n_joined:'انضم @{x} إلى مشروعك',n_prop:'يُقترح عليك المساهمة في مشروع {x}',t_claimed2:'تم تولي الطلب.',b_speaker:'مشرف عام',r_speaker:'مشرف عام',
apply:'الانضمام إلى الفريق',t_applied:'أصبحت عضواً في الفريق.',t_sent_req:'تم إرسال الطلب.',
no_dir:'لا توجد ملفات مطابقة حالياً.',empty_canals:'انضم إلى قناة عبر رابط دعوة.',
share_note:'تُفتح الرسالة في واتساب: تختار المجموعة.',invite_exp:'يبقى الرابط صالحاً حتى تنشئ رابطاً جديداً.',
privacy_t:'الخصوصية وبياناتي',privacy_export:'تحميل بياناتي',privacy_export_note:'ملف يحتوي على كل ما يعرفه التطبيق عنك: الملف الشخصي، القنوات، المشاريع، التضامن، الإعلانات، الإشعارات.',privacy_policy:'كيف تُستخدم بياناتك',t_exported:'تم تصدير البيانات.',
privacy_title2:'الخصوصية',privacy_body:'<p>لا يطلب Diasporact بريداً إلكترونياً ولا رقم هاتف: فقط اسم مستخدم تختاره. الاسم الأول واسم العائلة وبلد الإقامة والمهارات اختيارية وظاهرة للأعضاء الآخرين (المهارات فقط إذا فعّلت الخيار).</p><p>تُستضاف بياناتك داخل الاتحاد الأوروبي ولا تُباع ولا تُشارك مع أي طرف ثالث، ولا يراها إلا الأعضاء المدعوون الآخرون حسب قنواتك. تُحفظ نسخة احتياطية يومية لمدة 30 يوماً كحد أقصى.</p><p>يمكنك في أي وقت تعديل معلوماتك أو تحميل بياناتك أو حذف حسابك نهائياً من هذه الشاشة.</p><p><a href="confidentialite.html#ar" target="_blank" rel="noopener">قراءة سياسة الخصوصية كاملة</a></p><p class="muted small">لأي طلب أو إبلاغ: board.kalidia@gmail.com</p>'
});
I18N.en={"tour_title": "Guided tour","tour_of": "Step {a} of {b}","tour_next": "Next","tour_prev": "Back","tour_skip": "Skip the tour","tour_end": "Finish","tour_again": "Replay the guided tour","tour_again_sub": "A quick tour to get started with Diasporact.","tour1_t": "Welcome to Diasporact","tour1_d": "Diasporact is the space of the Mauritanian diaspora: stay informed, help each other and build projects together. This tour takes two minutes. You can reopen it at any time.","tour2_t": "The five tabs at the bottom","tour2_d": "Home: your tasks and announcements. Channels: groups by theme or country. Projects: what is being built. Help: ask for or offer help. Alerts: what concerns you.","tour3_t": "Join a channel","tour3_d": "A channel brings members together around a theme. Ask to join: the moderator approves your request, then you get access to the channel’s projects and help requests.","tour3_b": "See the channels","tour4_t": "Official announcements","tour4_d": "Announcements from spokespersons and the team appear on the home screen. Tap “Read” to confirm you have read one, and the share button to send it on WhatsApp.","tour4_b": "Go to Home","tour5_t": "Projects","tour5_d": "Propose a project or join one: take a task, mark it done, comment. Each project lists the skills it is looking for.","tour5_b": "See the projects","tour6_t": "Help","tour6_d": "Facing a difficulty (paperwork, studies, health, settling in…)? Describe your situation: only the referents for that area can see it. Nothing is public.","tour6_b": "See help requests","tour7_t": "Your profile and security","tour7_d": "In “Me”, add your name, country and skills. Also protect your account with a password, and keep your backup code safe: it is what lets you regain access.","tour7_b": "Open “Me”","tour8_t": "Language and theme","tour8_d": "The language button at the top of the screen switches between French, English and Arabic. The moon turns on dark mode.","tour9_t": "AI features (test phase)","tour9_d": "You are testing two features: translation under texts, and “Discussion → project” when creating a project. The AI can make mistakes: always check. The text you send is not stored.","tour9_b": "Create a project","tour10_t": "Your feedback matters","tour10_d": "You are testing Diasporact before its launch. If something is confusing, slow or broken, note the page, what you expected and what happened, then pass it on to the team that invited you.","app_name": "Diasporact","app_short": "Diasporact","demo": "Demo","close": "Close","back": "Back","cancel": "Cancel","continue": "Continue","send": "Send","copy": "Copy","publish": "Publish","share": "Share","nav_home": "Home","nav_canals": "Channels","nav_projects": "Projects","nav_help": "Help","nav_alerts": "Alerts","inv_from": "Invitation received in a WhatsApp group","inv_title": "Join Diasporact","inv_sub": "You are invited to join the “{canal}” channel.","inv_preview": "What you see before approval","inv_preview_sub": "Channel description and official announcements, read-only.","pseudo_label": "Choose your username","pseudo_help": "Unique. 3 to 24 characters: letters, digits, dot, hyphen or underscore.","pseudo_ok": "@{p} is available.","pseudo_taken": "@{p} is already taken. Try:","pseudo_bad": "Use 3 to 24 characters: letters, digits, dot, hyphen or underscore.","pick_title": "Choose your channels","pick_sub": "Each channel’s moderator approves your request.","pick_invited": "Channel from the invitation","pick_send": "Send my requests","code_title": "Your recovery code","code_sub": "Write it down. It lets you recover your account on another device.","code_noted": "I have noted my code","code_enter": "Enter","code_sent": "Requests sent","hello": "Hello","todo": "To do for you","nothing": "Nothing pending for now.","todo_pending": "Pending request: {x}","todo_pending_sub": "Awaiting approval by the channel moderator","todo_task": "Task to do: {x}","todo_reqs": "Membership requests to review: {x}","todo_help": "Help requests to handle: {x}","ann_title": "Official announcements","official": "Official","read_btn": "I have read it","read_done": "Read","reads": "reads","until": "Until {d}","publish_ann": "Publish an official announcement","recruit_title": "Projects that are recruiting","canal_member": "Member","canal_pending": "Pending","canal_join": "Ask to join","canal_mod": "Moderator","canal_members": "members","canal_wa": "Open the WhatsApp group","canal_wa_note": "Open discussions happen in the channel’s WhatsApp group. Here, we follow projects and actions.","canal_pending_banner": "Request awaiting approval by @{m}. You can read the announcements in the meantime.","canal_locked": "Join this channel to see its projects and help requests.","tab_ann": "Announcements","tab_proj": "Projects","tab_help": "Help","tab_mod": "Moderation","no_ann": "No announcements for now.","no_proj": "No projects in this channel.","mod_reqs": "Membership requests","mod_none": "No pending requests.","accept": "Accept","refuse": "Decline","invite_link": "Invitation link","invite_exp": "The link stays valid until you generate a new one.","invite_rotate": "Revoke and create a new link","proj_mine": "My projects","proj_all": "All projects","proj_none_mine": "You are not taking part in any project yet.","new_project": "Propose a project","st_progress": "In progress","st_recruit": "Recruiting","st_done": "Completed","owner": "Lead","objective": "Objective","needs": "Needs","milestones": "Milestones","tasks": "Tasks","tk_todo": "To do","tk_doing": "In progress","tk_done": "Done","take": "I’ll take it","mark_done": "Mark as done","unassigned": "Unassigned","tasks_count": "{a}/{b} tasks","follow": "Follow","follow_title": "Notifications for this project","fo_all": "Everything","fo_all_d": "Tasks, milestones and comments","fo_mil": "Milestones only","fo_mil_d": "Only when a stage is reached","fo_none": "Nothing","fo_none_d": "No notifications (your own tasks are still flagged)","apply": "Join the team","applied": "Application sent","in_team": "You are part of the team","comments": "Comments","cmt_ph": "Add a comment (280 characters max)","team": "Team","proj_locked": "This project belongs to the “{x}” channel. Only its members can follow it.","proj_locked_visitor": "Create your username from an invitation link to request access.","help_mine": "My requests","help_todo": "To handle in your areas","help_none": "No requests for now.","new_help": "New request","hs_open": "Open","hs_doing": "Being handled","hs_solved": "Solved","claim": "Take charge","solve": "Mark as solved","help_priv": "Visible only to you and the help referents","help_priv_ref": "Visible only to the help referents","domain": "Area","country": "Country of residence","urgency": "Urgency","u_normal": "Normal","u_urgent": "Urgent","situation": "Describe your situation","dm_adm": "Administrative","dm_jur": "Legal","dm_ins": "Settling in","dm_ret": "Return and investment","dm_san": "Health","by": "Handled by @{x}","alerts_title": "Settings","push": "Push notifications","push_note": "On iPhone, add the app to your home screen to receive push notifications.","digest": "Daily summary","digest_note": "Groups your project updates into a single message.","mark_all": "Mark all as read","no_alerts": "No notifications.","my_account": "My account","recov": "Changing phone","show": "Show","hide": "Hide","recov_note": "Without a password, your account stays tied to this device. If you lose access, a moderator can send you a reconnection link on WhatsApp.","lang": "Language","theme": "Theme","th_light": "White","th_dark": "Black","logout": "Log out","my_canals": "My channels","roles": "Roles","r_member": "Member","r_mod": "Moderator of {x}","r_ref": "Referent: {x}","r_speaker": "Administrator","r_spk": "Spokesperson ({x})","name_section": "First and last name","firstname_label": "First name","lastname_label": "Last name","name_public_note": "Optional, publicly visible. If provided, your username appears in grey below it instead of the username alone.","share_title": "Share on WhatsApp","share_prev": "Message to post in the group","share_open": "Open WhatsApp","share_copy": "Copy the message","share_note": "The message opens in WhatsApp: you choose the group.","wa_title": "WhatsApp group simulation","wa_note": "Open discussions stay here. Links open the tool.","wa_open": "Open the link","t_pending": "Request sent to @{m}","t_copied": "Copied","t_copy_fail": "Could not copy: select the text.","t_accepted": "@{p} accepted. Notification sent.","t_refused": "@{p} declined.","t_took": "Task taken. The team has been informed.","t_done": "Task completed. Well done.","t_applied": "You are part of the team.","t_help_sent": "Request passed on to the area referents","t_claimed": "Request taken in charge. @{p} has been notified.","t_solved": "Request marked as solved","t_new_link": "New link created. The old one no longer works.","t_push_on": "Push enabled. In the real version, the browser will ask for your permission.","t_no_notif": "No notifications: you follow this project on “Nothing”.","t_ann_pub": "Announcement published","t_proj_pub": "Project published in the channel","f_canal": "Channel","f_title": "Title","f_needs": "Needs (separated by commas)","f_due": "Due date","f_body": "Text","f_target": "Audience","f_all": "All channels (admin)","f_country_opt": "The whole diaspora of one country","f_country_ph": "Country","f_until": "Valid until","req": "Required field","n_task": "Task assigned: {x}","n_mil": "Milestone reached: {x}","n_cmt": "New comment on {x}","n_acc": "Request accepted: you are a member of {x}","n_ann": "New official announcement: {x}","n_claim": "Your help request is being handled by @{x}","n_welcome": "Welcome. Your requests are being reviewed.","now": "just now","min": "{n} min ago","hour": "{n} h ago","day": "{n} d ago","ai_tag": "AI-generated · please check","ai_sim": "In this demo, the analysis is simulated with simple rules.","from_chat": "From a discussion","chat_btn": "From a discussion","chat_intro": "Paste a WhatsApp discussion: the AI proposes a project sheet with decisions, open questions and actions. You review and correct before publishing.","chat_consent": "Only paste a discussion whose participants agree to share it. Nothing is stored.","chat_ph": "One message per line: “First name: message”","chat_sample": "Use an example","chat_go": "Analyse the discussion","chat_loading": "Analysing…","chat_empty": "Paste a discussion first.","chat_back": "Edit the text","cr_actions": "Actions spotted (untick to discard)","cr_decisions": "Decisions spotted","cr_questions": "Questions left open","cr_none": "Nothing spotted","cr_create": "Create the project","cr_by": "proposed by @{x}","ch_decisions": "Decisions from the discussion: ","ch_questions": "Open questions: ","dictate": "Dictate","voice_sim": "Voice input simulated in the demo","voice_listen": "I’m listening…","voice_demo_c": "I can take care of it this week.","voice_demo_h": "Hello, I need to renew my passport quickly and I don’t know where to start.","voice_demo_x": "Sidi: could we organise a book drive for a library?","dg_title": "Your personalised summary","dg_sub": "Written in your language from your activity.","dg_freq": "Frequency","dg_daily": "Every day","dg_weekly": "Every week","dg_task": "Task to do: {x} ({p})","dg_ann": "Official announcement to read: {x}","dg_proj": "{x}: {a}/{b} tasks completed","dg_help": "{x} help request(s) waiting for a referent","dg_reqs": "{x} membership request(s) to review","dg_myhelp": "Your help request is being followed by @{x}","dg_none": "Nothing new.","dg_wa": "Preview in WhatsApp","dg_note": "Official announcements are quoted as written, never reworded.","dg_wa_note": "Message sent on WhatsApp with a link to the app (planned via the WhatsApp Business API).","sk_title": "Skills","sk_opt": "Skill-based matching","sk_opt_note": "If enabled, your username and skills can be suggested to project leads. You always decide whether to respond.","sk_in": "My skills (separated by commas)","sk_save": "Save","sk_saved": "Skills saved","match_title": "Members who could help","match_note": "Only members who enabled matching appear. You approach them, they decide.","match_why": "Skill “{s}” ↔ need “{n}”","match_prop": "Suggest contributing","match_sent": "Suggestion sent to @{x}","match_done": "Suggested","match_none": "No suggestions for now.","match_home": "Projects looking for your skills","match_home_why": "Need: {n}","ai_help_t": "Assistant suggestions","ai_help_dom": "Suggested area: {x}","ai_help_urg": "This looks urgent: mark as urgent","ai_help_faq": "A practical guide might answer this:","ai_help_view": "View the guide","ai_help_ok": "This answers my question","ai_help_ok_t": "Glad we could help. Your request was not sent.","ai_help_note": "Does not replace a referent’s advice.","faq_title": "Practical guides","faq_sub": "Written and validated by the referents.","faq_by": "Validated by @{x}","faq_note": "Indicative information: always check with the official body.","draft_btn": "Draft a reply","draft_title": "Reply draft","draft_note": "AI suggestion based on the existing guides. Review and edit: nothing is sent without you.","draft_faq": "Add this answer to the practical guides","draft_send": "Send the reply","draft_sent": "Reply sent to @{x}","draft_hi": "Hello @{x}, thank you for your message.","draft_generic": "Here is what I can tell you: …","draft_bye": "I remain available to clarify. — @{x}","reply_from": "Reply from @{x}","n_reply": "A reply was received to your help request.","tr_do": "Translate","tr_auto": "Automatic translation","tr_orig": "See the original","cr_add": "Add","act_title": "What would you like to do?","th_help": "Ask for help","th_proj": "Start a project","th_chat": "Project from a discussion","th_canals": "Discover the channels","fs_title": "Getting started","fs_sub": "We chat on WhatsApp, we act here: projects, help and official announcements.","fs_1": "Join a channel","fs_1p": "Request sent: awaiting the moderator","fs_2": "Read an official announcement","fs_3": "Take a task or start a project","fs_4": "Add your skills","fs_hide": "Hide","fs_prog": "{a}/{b} done","see_projects": "See open projects","search_proj": "Search for a project, a need…","search_none": "No results.","proj_see_all": "See all projects","cf_ok": "Confirm","cf_logout": "You are about to be logged out. Make sure you have noted your recovery code: it is essential to recover your account.","cf_rotate": "Renew the invitation link","cf_rotate_t": "The old link will be revoked: people who have not used it yet will no longer be able to join with it.","cr_add_ph": "Enter an item…","cr_del": "Remove","cr_empty_hint": "Nothing was spotted automatically: fill in the items below yourself.","tab_honor": "In the spotlight","bd_title": "Badges","bd_rules": "Engagement badges only count validated actions (task completed, help request solved, reading confirmed), never the number of messages. Profile badges are granted after verification by a moderator.","bd_profile": "Verified profile badges","bd_none": "No profile badges yet.","bd_req": "Request a profile badge","bd_eng": "Engagement badges","bd_next": "{a}/{b} to the next level","bd_max": "maximum level","bd_honor": "Appear among the members in the spotlight","bd_honor_note": "Channels highlight their most active members. You can choose not to appear.","bd_type": "Badge type","bd_note": "Justification (profession, organisation…)","bd_note_help": "A moderator checks your request before granting the badge. No supporting documents are kept in this demo.","bd_sent": "Request sent to the moderators","bd_pending": "Pending: {x}","bd_reqs": "Badge requests","bd_none_req": "No badge requests.","bd_grant": "Grant","bd_granted": "Badge granted to @{x}","bd_denied": "Request declined","b_mod": "Moderator","b_ref": "Referent","b_speaker": "Administrator","b_relay": "Local relay","b_expert": "Verified expert · {x}","hn_title": "Members in the spotlight","hn_sub": "The most active in this channel in recent weeks.","hn_line": "{t} tasks · {h} helped · {p} projects","hn_note": "Based on validated actions. Thanks to everyone who moves the community forward.","hn_none": "No member in the spotlight yet.","n_badge": "New badge: {x}","loading": "Loading…","e_generic": "Something went wrong. Please try again in a moment.","e_invite": "This link is no longer valid. Ask your channel moderator for a new one.","e_taken": "This username has just been taken. Choose another one.","e_already": "You already have an account on this device.","e_denied": "Action not allowed.","e_unknown": "No member with this username.","e_net": "Cannot connect. Check your network and try again.","cfg_missing": "The application is not configured yet (Supabase keys missing).","inv0_title": "Diasporact works by invitation","inv0_sub": "Ask your channel moderator in the WhatsApp group for the invitation link, then open it, or paste it below.","inv0_ph": "Paste the link you received","inv0_go": "Open the link","inv0_bad": "Link not recognised.","pseudo_check": "Checking…","country_label": "Country of residence (optional)","cp_pick": "Choose a country by its flag","ai_tr_btn": "Translate (AI)","ai_tr_hide": "Hide","ai_tr_wait": "Translating…","ai_consent_t": "Use AI","ai_consent_b": "For this feature, the text concerned is sent to an AI service (Anthropic, United States) which returns a result. Diasporact keeps nothing. The result may contain errors: review it. Only paste content you are allowed to share.","ai_agree": "I understand, continue","ai_err": "The AI could not respond. Please try again.","ai_err_quota": "Daily limit of AI uses reached. Come back tomorrow.","ai_err_off": "The AI is temporarily unavailable.","ai_err_tester": "The AI is reserved for designated testers.","ai_chat_t": "From a discussion (AI)","ai_chat_intro": "Paste a discussion: the AI proposes a title, an objective and needs. You review and correct before publishing.","ai_chat_go": "Suggest a project sheet","ai_chat_ph": "Paste the discussion here (6,000 characters maximum)","ai_chat_wait": "Analysing…","ai_chat_none": "The AI did not find a project in this text.","ai_filled": "Suggestion added to the form: review before publishing.","r_ai": "AI tester","adm_ai": "AI tester","adm_ai_on": "Can use the AI features (20 uses per day)","privacy_link": "By creating an account, you agree that this information is used as described in the <a href=\"confidentialite.html#en\" target=\"_blank\" rel=\"noopener\">privacy policy</a>.","cp_search": "Search for a country","cp_none": "No country found. You can also type the name freely.","create_account": "Create my account","pw_label": "Password","sc_title": "Backup code","sc_note": "If you lose your password, this code lets you choose a new one yourself. It is only shown once.","sc_gen": "Generate a new code","sc_gen_warn": "The previous code will stop working.","sc_show": "Write down your backup code","sc_keep": "Keep it outside the app (paper, password manager). Each use generates a new one.","sc_copy": "Copy the code","sc_done": "Noted","forgot": "Forgot your password?","fg_sub": "Enter your username, your backup code and a new password.","fg_code": "Backup code","fg_go": "Change my password","e_code": "Incorrect username or backup code.","e_locked": "Too many attempts. Try again in 15 minutes.","fg_nocode": "No code? Ask a moderator for a reconnection link.","pw_help": "At least 8 characters. It lets you recover your account on any device.","pw_short": "The password must contain at least 8 characters.","e_login": "Incorrect username or password.","pw_later": "Account created, but the password could not be saved. Add it from the Me tab.","have_acct": "I already have an account","login_go": "Log in","login_sub": "Recover your account on this device with your username and password.","secure_t": "Secure my account","secure_note": "Add a password to recover your account on any device, without a reconnection link.","secure_go": "Save the password","pw_ok": "Password saved.","pw_new": "New password","acct_ok_t": "Account protected","acct_ok_note": "Log in with @{p} and your password on any device. Lost your password: ask a moderator for a reconnection link.","change_pw": "Change the password","logout_t": "Log out of this device","t_logged_in": "Logged in.","rec_title": "Recover your account","rec_sub": "This reconnection link ties you back to your account on this device. It works only once.","rec_go": "Recover my account","adm_first": "First administrator","adm_first_sub": "This account will have all administration rights.","joined": "You have joined {x}.","welcome_in": "Welcome to Diasporact.","del_account": "Delete my account","del_t": "Your profile will be permanently deleted. This action cannot be undone.","t_deleted": "Account deleted.","adm_title": "Administration","adm_role": "Appoint a moderator or a relay","adm_pseudo": "Member’s username","adm_canal": "Channel","adm_mod": "Channel moderator","adm_relay": "Local relay","adm_save": "Save","adm_ref": "Help referent","adm_ref_on": "Help referent (sees and handles requests)","t_saved": "Saved.","adm_spk": "Spokesperson for a country","adm_spk_country": "Country","adm_spk_on": "Spokesperson for this country (can broadcast an announcement to its whole diaspora)","rc_title": "Reconnection link","rc_help": "For a member who changed device. Valid for 7 days, single use.","rc_make": "Generate the link","rc_ready": "Link ready","wa_set": "Channel WhatsApp group","wa_set_ph": "https://chat.whatsapp.com/…","wa_none": "This channel’s WhatsApp group has not been added yet.","wa_bad": "Invalid WhatsApp link.","inv_gen": "Generate the invitation link","inv_none": "No active link.","t_ms": "Milestone updated.","add_task": "Add a task","task_ph": "New task","add_ms": "Add a milestone","ms_ph": "Milestone","manage": "Manage the project","pj_archive": "Archive the project","pj_unarchive": "Unarchive","pj_delete": "Delete the project","pj_mod_only": "Reserved for moderators.","pj_archived_t": "Archived projects","pj_archived_note": "Visible only to their owner and the moderators. Deletion is reserved for moderators.","pj_arch_ok": "Project archived.","pj_unarch_ok": "Project unarchived.","pj_del_t": "The project, its tasks, milestones and comments will be permanently deleted. You can archive it instead. This action cannot be undone.","pj_del_ok": "Project deleted.","pj_status": "Project status","reply_btn": "Reply","reply_title": "Reply to the request","reply_ph": "Your reply","reply_send": "Send and close","n_joined": "@{x} joined your project","n_prop": "You are invited to contribute to the project {x}","t_claimed2": "Request taken in charge.","t_sent_req": "Request sent.","no_dir": "No profile matches for now.","empty_canals": "Join a channel with an invitation link.","privacy_t": "Privacy and my data","privacy_export": "Download my data","privacy_export_note": "A file with everything the app knows about you: profile, channels, projects, help requests, announcements, notifications.","privacy_policy": "How your data is used","t_exported": "Data exported.","privacy_title2": "Privacy","privacy_body": "<p>Diasporact asks for neither an email address nor a phone number: only a username that you choose. First and last name, country of residence and skills are optional and visible to other members (skills only if you turn the option on).</p><p>Your data is hosted in the European Union, is never sold or shared with a third party, and is visible only to the other invited members, according to your channels. A daily backup is kept for 30 days at most.</p><p>You can edit your information, download your data or permanently delete your account at any time from this screen.</p><p><a href=\"confidentialite.html#en\" target=\"_blank\" rel=\"noopener\">Read the full privacy policy</a></p><p class=\"muted small\">For a request or a report: board.kalidia@gmail.com</p>"};
Object.assign(I18N.fr,{tk_review:'Seul le chef de projet la passe en « Fait ».',tk_review_btn:'Signaler : j’ai terminé',tk_alerted:'Chef de projet alerté',tk_asked:'Validation demandée',t_review_sent:'Alerte envoyée au chef de projet.',n_review:'Tâche terminée à valider : {x}',e_too_soon:'Alerte déjà envoyée il y a peu. Patientez un peu.',kb_view:'Affichage des tâches',kb_board:'Kanban',kb_list:'Liste',kb_empty:'Aucune tâche',kb_cols:'Personnaliser les colonnes',kb_soon:'Bientôt',kb_cols_t:'Colonnes personnalisables',kb_cols_d:'Bientôt, vous pourrez renommer, ajouter et réordonner les colonnes du Kanban selon votre façon de travailler. Pendant la phase test, les colonnes sont fixes : À faire, En cours, Fait.',kb_add:'Ajouter une colonne'});
Object.assign(I18N.ar,{tk_review:'رئيس المشروع وحده ينقلها إلى «منجزة».',tk_review_btn:'أبلغ: أنهيتها',tk_alerted:'تم تنبيه رئيس المشروع',tk_asked:'طُلب التأكيد',t_review_sent:'أُرسل التنبيه إلى رئيس المشروع.',n_review:'مهمة منتهية بانتظار التأكيد: {x}',e_too_soon:'أُرسل التنبيه قبل قليل. انتظر قليلاً.',kb_view:'عرض المهام',kb_board:'كانبان',kb_list:'قائمة',kb_empty:'لا مهام',kb_cols:'تخصيص الأعمدة',kb_soon:'قريباً',kb_cols_t:'أعمدة قابلة للتخصيص',kb_cols_d:'قريباً ستتمكن من إعادة تسمية أعمدة لوحة كانبان وإضافتها وترتيبها بما يناسب طريقة عملك. خلال مرحلة التجربة تكون الأعمدة ثابتة: للإنجاز، قيد التنفيذ، منجزة.',kb_add:'إضافة عمود'});
Object.assign(I18N.en,{tk_review:'Only the project lead can mark it as Done.',tk_review_btn:'Report: I’ve finished',tk_alerted:'Project lead alerted',tk_asked:'Validation requested',t_review_sent:'Alert sent to the project lead.',n_review:'Finished task to validate: {x}',e_too_soon:'An alert was already sent a moment ago. Please wait a little.',kb_view:'Task view',kb_board:'Kanban',kb_list:'List',kb_empty:'No tasks',kb_cols:'Customise columns',kb_soon:'Coming soon',kb_cols_t:'Customisable columns',kb_cols_d:'Soon you will be able to rename, add and reorder the Kanban columns to fit the way you work. During the test phase the columns are fixed: To do, In progress, Done.',kb_add:'Add a column'});

/* ============ Accès Supabase ============ */
var CFG=window.DIASPORACT_CONFIG||{};
var sb=null;
function client(){
  if(sb)return sb;
  if(!window.supabase||!CFG.url||!CFG.anonKey)return null;
  sb=window.supabase.createClient(CFG.url,CFG.anonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
  return sb;
}
function q(p){return Promise.resolve(p).then(function(r){if(r.error)throw r.error;return r.data;});}
function pseudoMail(p){return String(p||'').trim().toLowerCase().replace(/^@/,'')+'@membre.diasporact.app';}
function errMsg(e){
  var m=String((e&&(e.message||e.error_description))||e||'');
  if(/too_soon/.test(m))return t('e_too_soon');
  if(/invalid_invite/.test(m))return t('e_invite');
  if(/pseudo_taken|profiles_pseudo_key/.test(m))return t('e_taken');
  if(/bad_pseudo/.test(m))return t('pseudo_bad');
  if(/already_registered/.test(m))return t('e_already');
  if(/unknown_pseudo/.test(m))return t('e_unknown');
  if(/wa_link/.test(m))return t('wa_bad');
  if(/bad_code/.test(m))return t('e_code');
  if(/locked_code/.test(m))return t('e_locked');
  if(/need_password/.test(m))return t('secure_note');
  if(/Invalid login credentials/i.test(m))return t('e_login');
  if(/weak_password|at least \d+ char|Password should/i.test(m))return t('pw_short');
  if(/forbidden|row-level security|permission denied/.test(m))return t('e_denied');
  if(/Failed to fetch|NetworkError|Load failed/i.test(m))return t('e_net');
  return t('e_generic');
}
function loadLang(){var v=null;try{v=localStorage.getItem('dp-lang');}catch(e){}if(v==='ar'||v==='en'||v==='fr')return v;var nl='';try{nl=String(navigator.language||'').slice(0,2).toLowerCase();}catch(e){}return nl==='ar'?'ar':nl==='fr'?'fr':nl?'en':'fr';}
function saveLang(v){try{localStorage.setItem('dp-lang',v);}catch(e){}}
function appUrl(path){return location.origin+location.pathname.replace(/index\.html$/,'')+'#/'+path;}

/* ============ État ============ */
var S={aiTr:{},aiSrc:{},
  lang:loadLang(),theme:loadTheme(),
  me:{id:null,pseudo:null,mod:[],ref:[],admin:false,skills:[],matching:false,showHonor:true,country:''},
  mem:{},route:{name:'load',params:{}},stack:[],busy:false,
  auth:{code:null,peek:null,err:''},draft:{pseudo:'',country:''},
  hideStart:false,projQ:'',projTab:'mine',canalTab:{},
  follow:{},proposed:{},read:{},
  projects:[],archived:[],helps:[],anns:[],reqs:{},notifs:[],invites:{},cmem:{},
  badgeReqs:[],grants:{},roles:{},eng:{},dir:[],pub:{}
};
function t(k,v){var s=(I18N[S.lang]&&I18N[S.lang][k]);if(s==null)s=I18N.fr[k];if(s==null)s=k;if(v){for(var x in v){s=s.split('{'+x+'}').join(v[x]);}}return s;}
function T(k,v){return esc(t(k,v));}
function c(o){return o?(o[S.lang]||o.fr||''):'';}
function L3(fr,ar,en){return S.lang==='ar'?ar:S.lang==='en'?en:fr;}
function C(o){return esc(c(o));}
function canalOf(id){return CANALS.filter(function(x){return x.id===id;})[0]||{id:id,ico:'hash',n:{fr:id,ar:id},d:{fr:'',ar:''},mod:'',count:0,wa:''};}
function projOf(id){return S.projects.filter(function(x){return x.id===id;})[0];}
function annOf(id){return S.anns.filter(function(x){return x.id===id;})[0];}
function mem(id){return S.mem[id]||null;}
function isMember(id){return S.mem[id]==='member'||S.me.admin;}
function isMod(id){return S.me.admin||S.me.mod.indexOf(id)>-1;}
function hasAccount(){return !!S.me.pseudo;}

/* ============ Chargement des données ============ */
var refreshing=null;
function refresh(){
  if(refreshing)return refreshing;
  refreshing=doRefresh().then(function(r){refreshing=null;return r;},function(e){refreshing=null;throw e;});
  return refreshing;
}
function doRefresh(){
  var cl=client();
  return cl.auth.getSession().then(function(r){
    var ses=r.data&&r.data.session;if(!ses)return false;S.anon=!!(ses.user&&ses.user.is_anonymous);
    return q(cl.from('profiles').select('*').eq('auth_uid',ses.user.id).maybeSingle()).then(function(meRow){
      if(!meRow)return false;
      var id=meRow.id;
      return Promise.all([
        q(cl.from('canals').select('*').order('sort')),q(cl.from('canal_stats').select('*')),q(cl.from('canal_mods').select('*')),
        q(cl.from('public_profiles').select('*')),q(cl.from('canal_members').select('*')),
        q(cl.from('projects').select('*').order('created_at',{ascending:false})),q(cl.from('milestones').select('*').order('due')),
        q(cl.from('tasks').select('*')),q(cl.from('project_team').select('*')),q(cl.from('comments').select('*').order('created_at')),
        q(cl.from('helps').select('*').order('created_at',{ascending:false})),q(cl.from('announcements').select('*').order('created_at',{ascending:false})),
        q(cl.from('ann_reads').select('ann_id').eq('user_id',id)),q(cl.from('ann_read_counts').select('*')),
        q(cl.from('notifications').select('*').order('created_at',{ascending:false}).limit(50)),
        q(cl.from('badge_requests').select('*').eq('status','pending')),q(cl.from('badge_grants').select('*')),
        q(cl.from('engagement').select('*')),q(cl.from('skills_directory').select('*')),
        q(cl.from('follows').select('*').eq('user_id',id)),q(cl.from('proposals').select('*').eq('from_user',id)),
        q(cl.from('invites').select('*').eq('active',true).eq('kind','join').order('created_at')),
        q(cl.from('spokesperson_list').select('*')),
        q(cl.from('ai_testers').select('user_id')),
        q(cl.from('feedback').select('*').order('created_at',{ascending:false})),
        q(cl.from('preregistrations').select('*').order('created_at',{ascending:false}))
      ]).then(function(d){applyData(meRow,d);return true;});
    });
  });
}
function applyData(me,d){
  var canals=d[0],stats=d[1],mods=d[2],pubs=d[3],cms=d[4],projs=d[5],mss=d[6],tks=d[7],team=d[8],cmts=d[9],helps=d[10],anns=d[11],myReads=d[12],rcount=d[13],notifs=d[14],breqs=d[15],grants=d[16],eng=d[17],dir=d[18],fol=d[19],props=d[20],invs=d[21],spks=d[22]||[],aits=d[23]||[],fbs=d[24]||[],pres=d[25]||[];
  var pp={};S.pubId={};S.honorOk={};S.names={};pubs.forEach(function(p){pp[p.id]=p.pseudo;S.pubId[p.pseudo]=p.id;S.honorOk[p.pseudo]=p.show_honor!==false;var nm=((p.first_name||'')+' '+(p.last_name||'')).trim();if(nm)S.names[p.pseudo]=nm;});S.pub=pp;S.flags={};pubs.forEach(function(p){var f=flagFor(p.country);if(f)S.flags[p.pseudo]=f;});
  S.spkCountries=[];spks.forEach(function(s){if(s.pseudo===me.pseudo)S.spkCountries.push(s.country);});
  S.fb=fbs.map(function(r){return {uid:r.user_id,who:pp[r.user_id]||'',a:r.answers||{},lang:r.lang||'',at:(r.created_at||'').slice(0,16).replace('T',' ')};});
  S.pre=pres.map(function(r){return {fn:r.first_name||'',ct:r.contact,co:r.country||'',cn:r.canals||[],lang:r.lang||'',at:(r.created_at||'').slice(0,16).replace('T',' ')};});
  /* canaux */
  canals.forEach(function(row){var k=CANALS.filter(function(x){return x.id===row.id;})[0];
    if(!k){k={id:row.id,ico:row.ico,n:{fr:row.name_fr,ar:row.name_ar},d:{fr:row.desc_fr,ar:row.desc_ar}};CANALS.push(k);}
    var st=stats.filter(function(x){return x.canal_id===row.id;})[0],md=mods.filter(function(x){return x.canal_id===row.id&&x.is_moderator;})[0];
    k.count=st?+st.members:0;k.mod=md?md.pseudo:'';k.wa=row.wa_link||'';});
  /* moi */
  S.me={id:me.id,pseudo:me.pseudo,firstName:me.first_name||'',lastName:me.last_name||'',country:me.country||'',skills:me.skills||[],matching:!!me.matching,showHonor:me.show_honor!==false,admin:!!me.is_admin,mod:[],ref:(me.is_ref||me.is_admin)?DOMAINS.slice():[],spk:S.spkCountries||[],ai:aits.some(function(r){return r.user_id===me.id;})};
  S.mem={};S.reqs={};S.cmem={};
  cms.forEach(function(m){
    if(m.user_id===me.id){if(m.status==='member'||m.status==='pending')S.mem[m.canal_id]=m.status;if(m.status==='member'&&m.is_moderator)S.me.mod.push(m.canal_id);}
    else if(m.status==='pending'){(S.reqs[m.canal_id]=S.reqs[m.canal_id]||[]).push({p:pp[m.user_id],id:m.user_id});}
    if(m.status==='member')(S.cmem[m.canal_id]=S.cmem[m.canal_id]||[]).push(pp[m.user_id]);
  });
  if(S.me.admin)CANALS.forEach(function(k){S.mem[k.id]='member';});
  /* rôles affichés sous les pseudos */
  S.roles={};function R(p){return S.roles[p]||(S.roles[p]={});}
  mods.forEach(function(m){var r=R(m.pseudo);if(m.is_moderator)(r.mod=r.mod||[]).push(m.canal_id);if(m.is_relay)r.relay=true;});
  pubs.forEach(function(p){if(p.is_ref)R(p.pseudo).ref=true;if(p.is_admin)R(p.pseudo).speaker=true;});
  S.grants={};grants.forEach(function(g){var p=pp[g.user_id];if(!p)return;var o=S.grants[p]=S.grants[p]||{};if(g.type==='relay')o.relay=true;else o.expert=g.type.split(':')[1];});
  S.badgeReqs=breqs.map(function(r){return {id:r.id,p:pp[r.user_id],type:r.type,note:r.note};});
  S.eng={};eng.forEach(function(e){var p=pp[e.user_id];if(p)S.eng[p]={reads:+e.reads,tasks:+e.tasks,proj:+e.proj,help:+e.help,links:+e.links};});
  S.dir=dir.filter(function(x){return x.id!==me.id;}).map(function(x){return {p:x.pseudo,c:x.country,sk:x.skills||[],open:true};});
  /* projets */
  S.archived=projs.filter(function(p){return p.archived_at&&(isMod(p.canal_id)||p.owner_id===me.id);}).map(function(p){return {id:p.id,canal:p.canal_id,t:p.title,owner:pp[p.owner_id]};});
  S.projects=projs.filter(function(p){return !p.archived_at;}).map(function(p){
    var tm=team.filter(function(x){return x.project_id===p.id;}).map(function(x){return pp[x.user_id];}).filter(Boolean),ow=pp[p.owner_id];
    if(tm.indexOf(ow)<0)tm.unshift(ow);
    return {id:p.id,canal:p.canal_id,t:{fr:p.title,ar:p.title_ar||p.title},owner:ow,status:p.status,
      obj:{fr:p.objective,ar:p.objective_ar||p.objective,orig:p.orig_lang||'fr'},needs:p.needs||[],
      ms:mss.filter(function(m){return m.project_id===p.id;}).map(function(m){return {id:m.id,t:m.title,date:m.due||'',done:m.done};}),
      tasks:tks.filter(function(k){return k.project_id===p.id;}).map(function(k){return {id:k.id,t:k.title,status:k.status,who:k.assignee_id?pp[k.assignee_id]:null,rev:k.review_at||null};}),
      team:tm,cmts:cmts.filter(function(m){return m.project_id===p.id;}).map(function(m){return {id:m.id,by:pp[m.author_id],t:m.body,at:Date.parse(m.created_at)};})};
  });
  /* entraide */
  S.helps=helps.map(function(h){return {id:h.id,who:pp[h.author_id],dom:h.domain,country:h.country,urgent:h.urgent,status:h.status,by:h.claimed_by?pp[h.claimed_by]:null,txt:h.body,reply:h.reply?{by:pp[h.claimed_by],txt:h.reply}:null};});
  /* annonces */
  var cnt={};rcount.forEach(function(x){cnt[x.ann_id]=+x.n;});
  S.read={};myReads.forEach(function(x){S.read[x.ann_id]=true;});
  S.anns=anns.map(function(a){return {id:a.id,canal:a.canal_id||(a.country?'country:'+a.country:'all'),country:a.country||'',t:{fr:a.title,ar:a.title_ar||a.title},body:{fr:a.body,ar:a.body_ar||a.body,orig:a.orig_lang||'fr'},date:(a.created_at||'').slice(0,10),until:a.valid_until||'',reads:cnt[a.id]||0};});
  /* notifications */
  S.notifs=notifs.map(function(n){
    function tx(l,key,x){return I18N[l][key].split('{x}').join(x==null?'':x);}
    var o={id:n.id,type:'info',route:null,params:{},read:n.read,at:Date.parse(n.created_at)},k=n.kind,pj=projOf(n.ref)||{};
    if(k==='welcome'){o.fr=tx('fr','n_welcome');o.ar=tx('ar','n_welcome');o.en=tx('en','n_welcome');o.route='home';}
    else if(k==='accepted'){var cn=canalOf(n.ref).n;o.type='canal';o.fr=tx('fr','n_acc',cn.fr);o.ar=tx('ar','n_acc',cn.ar);o.en=tx('en','n_acc',cn.en||cn.fr);o.route='canal';o.params={id:n.ref};}
    else if(k==='review'){o.type='task';o.fr=tx('fr','n_review',n.body);o.ar=tx('ar','n_review',n.body);o.en=tx('en','n_review',n.body);o.route='project';o.params={id:n.ref};}
    else if(k==='task'){o.type='task';o.fr=tx('fr','n_task',n.body);o.ar=tx('ar','n_task',n.body);o.en=tx('en','n_task',n.body);o.route='project';o.params={id:n.ref};}
    else if(k==='comment'){o.fr=tx('fr','n_cmt',n.body);o.ar=tx('ar','n_cmt',n.body);o.en=tx('en','n_cmt',n.body);o.route='project';o.params={id:n.ref};}
    else if(k==='milestone'){o.fr=tx('fr','n_mil',n.body);o.ar=tx('ar','n_mil',n.body);o.en=tx('en','n_mil',n.body);o.route='project';o.params={id:n.ref};}
    else if(k==='proposal'){o.type='task';o.fr=tx('fr','n_prop',n.body);o.ar=tx('ar','n_prop',n.body);o.en=tx('en','n_prop',n.body);o.route='project';o.params={id:n.ref};}
    else if(k==='joined'){o.fr=tx('fr','n_joined',n.body);o.ar=tx('ar','n_joined',n.body);o.en=tx('en','n_joined',n.body);o.route='project';o.params={id:n.ref};}
    else if(k==='claimed'){o.type='help';o.fr=tx('fr','n_claim',n.body);o.ar=tx('ar','n_claim',n.body);o.en=tx('en','n_claim',n.body);o.route='help';}
    else{o.fr=n.body;o.ar=n.body;o.en=n.body;}
    return o;});
  /* invitations actives (visibles seulement des modérateurs) */
  S.invites={};invs.forEach(function(i){S.invites[i.canal_id]=i.code;});
  /* suivi, propositions */
  S.follow={};fol.forEach(function(f){S.follow[f.project_id]=f.level==='mine'?'milestones':f.level;});
  S.proposed={};props.forEach(function(x){S.proposed[x.project_id+'|'+pp[x.to_user]]=true;});
}
/* Écriture : exécute l'appel, recharge les données, réaffiche. */
function mut(fn,ok,after){
  if(S.busy)return Promise.resolve();S.busy=true;
  return Promise.resolve().then(fn).then(function(r){return refresh().then(function(){return r;});}).then(function(r){
    S.busy=false;if(after)after(r);render();if(ok)toast(typeof ok==='function'?ok(r):t(ok));
  }).catch(function(e){S.busy=false;toast(errMsg(e));render();});
}

/* ============ Vues et fonctions de la version réelle ============ */
function trBlock(key,o,title){
  var s=typeof o==='string'?o:(o[S.lang]||o.fr||'');
  var raw=typeof o==='string'?o:(o.fr||'');
  return '<p dir="'+(/[؀-ۿ]/.test(s)?'rtl':'ltr')+'" style="white-space:pre-line">'+esc(s)+'</p>'+aiTrUi(key,(title?title+'\n\n':'')+raw);
}

/* ============ IA (phase test, testeurs désignés) ============ */
/* Traduction à la demande dans la langue de l'interface ; le résultat n'est ni enregistré ni partagé. */
function aiTrUi(key,src){
  if(!S.me||!S.me.ai||!src||src.trim().length<3)return '';
  S.aiSrc[key]=src;var st=S.aiTr[key];
  if(st&&st.loading)return '<p class="muted small">'+T('ai_tr_wait')+'</p>';
  if(st&&st.text)return '<div class="ai-box"><div class="row between"><span>'+chip(T('ai_tag'))+'</span><button class="btn sm" data-act="ai-tr-hide" data-id="'+esc(key)+'">'+T('ai_tr_hide')+'</button></div><p dir="'+(/[؀-ۿ]/.test(st.text)?'rtl':'ltr')+'" style="white-space:pre-line">'+esc(st.text)+'</p></div>';
  return '<div><button class="btn sm" data-act="ai-tr" data-id="'+esc(key)+'">'+T('ai_tr_btn')+'</button></div>';
}
function aiGate(fn){
  var ok=false;try{ok=localStorage.getItem('dp-ai-ok')==='1';}catch(e){}
  if(ok)return fn();
  S._aiNext=fn;
  openSheet(t('ai_consent_t'),'<p>'+T('ai_consent_b')+'</p><div class="row"><button class="btn grow" data-act="close-sheet">'+T('cancel')+'</button><button class="btn primary grow" data-act="ai-agree">'+T('ai_agree')+'</button></div>');
}
function aiCall(body){
  var cl=client();if(!cl)return Promise.reject({code:'ai_unavailable'});
  return cl.auth.getSession().then(function(r){
    var tk=r.data&&r.data.session&&r.data.session.access_token;if(!tk){var e=new Error('no_session');e.code='no_session';throw e;}
    return fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tk},body:JSON.stringify(body)});
  }).then(function(res){
    return res.json().catch(function(){return {};}).then(function(j){
      if(!res.ok||!j.ok){var e=new Error(j.error||('http_'+res.status));e.code=j.error||('http_'+res.status);throw e;}
      return j;
    });
  });
}
function aiErr(e){var k=e&&e.code;return t(k==='quota'?'ai_err_quota':k==='ai_unavailable'?'ai_err_off':k==='not_tester'?'ai_err_tester':'ai_err');}
function canEdit(p){return hasAccount()&&(p.owner===S.me.pseudo||isMod(p.canal));}
function matchNeed(pj){
  var out=[],used={};
  pj.needs.forEach(function(n){var cn=concepts(n);if(!cn.length)return;
    for(var i=0;i<S.dir.length;i++){var m=S.dir[i];if(used[m.p]||pj.team.indexOf(m.p)>-1||pj.owner===m.p)continue;
      var sk=m.sk.filter(function(x){return overlap(cn,concepts(x)).length;})[0];
      if(sk){used[m.p]=1;out.push({need:n,m:m,skill:sk});break;}}});
  return out.slice(0,4);
}
function matchSection(pj,inTeam){
  if(!inTeam)return '';
  var sg=matchNeed(pj);
  return '<section class="card stack s8" id="match"><h2 class="h3">'+T('match_title')+'</h2><p class="muted small">'+T('match_note')+'</p>'+
  (sg.length?sg.map(function(g){var done=S.proposed[pj.id+'|'+g.m.p];
    return '<div class="li" style="align-items:flex-start">'+av(g.m.p)+'<span class="grow"><span class="t">'+idInline(g.m.p)+'</span>'+pBadges(g.m.p)+' <span class="muted small">· '+esc(g.m.c||'')+'</span><br><span class="muted small">'+T('match_why',{s:g.skill,n:g.need})+'</span></span>'+
    (done?chip(ic('check',14)+T('match_done'),'green'):'<button class="btn sm" data-act="propose" data-id="'+esc(pj.id)+'" data-p="'+esc(g.m.p)+'">'+T('match_prop')+'</button>')+'</div>';}).join(''):'<p class="empty">'+T('match_none')+'</p>')+'</section>';
}
function statsOf(p){var b=S.eng[p]||{};return {reads:b.reads||0,tasks:b.tasks||0,proj:b.proj||0,help:b.help||0,links:b.links||0};}
function checkBadges(){return false;}
function roleOf(p){var r={},b=S.roles[p]||{};if(b.speaker)r.speaker=true;if(b.mod&&b.mod.length)r.mod=b.mod;if(b.ref)r.ref=true;if(b.relay)r.relay=true;var g=S.grants[p]||{};if(g.expert)r.expert=g.expert;if(g.relay)r.relay=true;return r;}
function honorHtml(id){
  var list=(S.cmem[id]||[]).filter(function(p){return p&&(p===S.me.pseudo?S.me.showHonor:S.honorOk[p]!==false);}).map(function(p){return {p:p,st:statsOf(p)};});
  list=list.filter(function(x){return pts(x.st)>0;}).sort(function(a,b){return pts(b.st)-pts(a.st);}).slice(0,3);
  return '<section><h2 class="h2">'+T('hn_title')+'</h2><p class="muted small" style="margin-bottom:8px">'+T('hn_sub')+'</p>'+
  (list.length?'<div class="card list">'+list.map(function(x){return '<div class="li" style="align-items:flex-start">'+av(x.p)+'<span class="grow"><span class="t">'+idInline(x.p)+'</span>'+pBadges(x.p)+'<br><span class="muted small">'+T('hn_line',{t:x.st.tasks,h:x.st.help,p:x.st.proj})+'</span></span></div>';}).join('')+'</div>':'<p class="empty">'+T('hn_none')+'</p>')+'<p class="muted small" style="margin-top:8px">'+T('hn_note')+'</p></section>';
}
function visibleAnns(){
  var today=new Date().toISOString().slice(0,10);
  // RLS filtre déjà côté serveur (canal, pays ou générale) : on ne revérifie ici que l'appartenance aux canaux.
  return S.anns.filter(function(a){return (a.canal==='all'||a.canal.indexOf('country:')===0||isMember(a.canal))&&(!a.until||a.until>=today);});
}
function tilesHtml(){
  var isM=Object.keys(S.mem).some(isMember),canPub=S.me.admin||S.me.mod.length||(S.me.spk&&S.me.spk.length);
  if(!isM&&!canPub)return '';
  /* Un porte-parole (ou l'admin) sans canal ne voit que la publication ; aide et projets exigent d'être membre d'un canal. */
  var ts=isM?[['life','new-help','th_help'],['folder','new-project','th_proj'],['hash','tab','th_canals']]:[];
  if(canPub)ts.push(['mega','publish-ann','publish_ann']);
  return '<section><h2 class="h2">'+T('act_title')+'</h2><div class="tiles">'+ts.map(function(x){return '<button class="tile" data-act="'+x[1]+'"'+(x[1]==='tab'?' data-tab="canals"':'')+'><span class="ico">'+ic(x[0],20)+'</span>'+T(x[2])+'</button>';}).join('')+'</div></section>';
}
function startCard(){
  if(S.hideStart)return '';
  var isM=Object.keys(S.mem).some(isMember);
  var it=[
   {d:isM,t:t('fs_1'),a:'tab',tab:'canals'},
   {d:Object.keys(S.read).length>0,t:t('fs_2'),a:'scroll-ann'},
   {d:S.projects.some(function(p){return p.owner===S.me.pseudo||p.tasks.some(function(k){return k.who===S.me.pseudo;});}),t:t('fs_3'),a:'tab',tab:'projects'},
   {d:S.me.skills.length>0,t:t('fs_4'),a:'go-me'}];
  var n=it.filter(function(x){return x.d;}).length;if(n===it.length)return '';
  return '<section class="stack s8"><div class="row between"><h2 class="h2" style="margin:0">'+T('fs_title')+'</h2><button class="lnk" data-act="hide-start">'+T('fs_hide')+'</button></div><p class="muted small">'+T('fs_sub')+'</p><div class="bar" aria-hidden="true"><i style="--w:'+Math.round(n/it.length*100)+'%"></i></div><p class="muted small">'+T('fs_prog',{a:n,b:it.length})+'</p>'+
  '<div class="card list">'+it.map(function(x,i){return '<button class="li'+(x.d?' done':'')+'" data-act="'+x.a+'"'+(x.tab?' data-tab="'+x.tab+'"':'')+'><span class="ico">'+(x.d?ic('check',18):'<b>'+(i+1)+'</b>')+'</span><span class="grow t">'+esc(x.t)+'</span><span class="flip muted">'+ic('chev',18)+'</span></button>';}).join('')+'</div></section>';
}
function annCard(a,ro){
  var isCountry=a.canal.indexOf('country:')===0;
  var h='<article class="card ann"><div class="row between"><span class="row">'+chip(T('official'),'red')+(isCountry?chip(esc(a.country)):(a.canal!=='all'?chip(C(canalOf(a.canal).n)):''))+'</span><span class="muted small">'+esc(fmt(a.date))+'</span></div>';
  h+='<h3>'+C(a.t)+'</h3>'+trBlock('a:'+a.id,a.body,a.t.fr);
  if(a.until)h+='<p class="muted small">'+T('until',{d:fmt(a.until)})+'</p>';
  h+='<div class="row between wrap"><span class="muted small">'+a.reads+' '+T('reads')+'</span>';
  if(!ro){h+='<span class="row">';
    h+=S.read[a.id]?chip(ic('check',14)+T('read_done'),'green'):'<button class="btn sm" data-act="read" data-id="'+esc(a.id)+'">'+T('read_btn')+'</button>';
    h+='<button class="btn sm" data-act="share" data-kind="ann" data-id="'+esc(a.id)+'" aria-label="'+T('share')+'">'+ic('share',16)+'</button></span>';}
  return h+'</div></article>';
}
function modTools(k){
  var code=S.invites[k.id],link=code?appUrl('i/'+code):'';
  return '<section class="card stack s8"><h2 class="h3">'+T('invite_link')+'</h2>'+
   (link?'<p class="linkbox" dir="ltr" style="overflow-wrap:anywhere">'+esc(link)+'</p><p class="muted small">'+T('invite_exp')+'</p><div class="row wrap"><button class="btn sm" data-act="copy-link" data-id="'+k.id+'">'+ic('copy',16)+T('copy')+'</button><button class="btn sm" data-act="share" data-kind="invite" data-id="'+k.id+'">'+ic('share',16)+T('share')+'</button><button class="btn sm danger" data-act="rotate-link" data-id="'+k.id+'">'+T('invite_rotate')+'</button></div>'
        :'<p class="muted small">'+T('inv_none')+'</p><button class="btn sm primary" data-act="gen-link" data-id="'+k.id+'">'+T('inv_gen')+'</button>')+'</section>'+
  '<section class="card stack s8"><h2 class="h3">'+T('wa_set')+'</h2><form data-form="wa" data-id="'+k.id+'" class="stack s8"><input type="url" id="wa-in" dir="ltr" autocomplete="off" placeholder="'+T('wa_set_ph')+'" value="'+esc(k.wa||'')+'"><button class="btn sm" type="submit">'+T('adm_save')+'</button></form></section>'+
  '<section class="card stack s8"><h2 class="h3">'+T('rc_title')+'</h2><p class="muted small">'+T('rc_help')+'</p><form data-form="recovery" class="stack s8"><div class="pfx" dir="ltr">@<input type="text" id="rc-p" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="24" aria-label="'+esc(t('adm_pseudo'))+'"></div><button class="btn sm" type="submit">'+T('rc_make')+'</button></form></section>';
}
function manageSection(pj){
  if(!canEdit(pj))return '';
  return '<section class="card stack s8"><h2 class="h3">'+T('manage')+'</h2><div class="lbl">'+T('pj_status')+'</div><div class="seg">'+['recruit','progress','done'].map(function(v){return '<button aria-pressed="'+(pj.status===v)+'" data-act="set-status" data-id="'+pj.id+'" data-v="'+v+'">'+T('st_'+v)+'</button>';}).join('')+'</div>'+
  '<form data-form="addtask" data-id="'+pj.id+'" class="row"><input type="text" id="tk-new" class="grow" maxlength="200" autocomplete="off" placeholder="'+esc(t('task_ph'))+'" aria-label="'+esc(t('add_task'))+'"><button class="btn sm" type="submit">'+ic('plus',16)+T('add_task')+'</button></form>'+
  '<form data-form="addms" data-id="'+pj.id+'" class="stack s8"><div class="row"><input type="text" id="ms-t" class="grow" maxlength="120" autocomplete="off" placeholder="'+esc(t('ms_ph'))+'" aria-label="'+esc(t('add_ms'))+'"><input type="date" id="ms-d" aria-label="'+esc(t('f_due'))+'"></div><button class="btn sm" type="submit">'+ic('plus',16)+T('add_ms')+'</button></form>'+'<div class="row wrap"><button class="btn sm" data-act="archive-project" data-id="'+pj.id+'" data-v="1">'+T('pj_archive')+'</button>'+(isMod(pj.canal)?'<button class="btn sm danger" data-act="delete-project" data-id="'+pj.id+'">'+T('pj_delete')+'</button>':'')+'</div>'+'</section>';
}
function helpCard(hq,mode){
  var stc=hq.status==='open'?chip(T('hs_open'),'red'):hq.status==='doing'?chip(T('hs_doing'),'yellow'):chip(T('hs_solved'),'green');
  var h='<article class="card stack s8"><div class="row between wrap"><span class="row">'+chip(T('dm_'+hq.dom))+(hq.urgent?chip(T('u_urgent'),'urgent'):'')+'</span>'+stc+'</div>';
  h+='<p style="white-space:pre-line">'+esc(hq.txt)+'</p>'+aiTrUi('h:'+hq.id,hq.txt)+'<p class="muted small">'+(mode==='ref'?idInline(hq.who)+' · ':'')+esc(hq.country)+(hq.by?' · '+T('by',{x:hq.by}):'')+'</p>';
  if(hq.reply)h+=replyHtml(hq);
  if(mode==='ref'&&hq.status==='open')h+='<button class="btn sm primary" data-act="claim" data-id="'+hq.id+'">'+T('claim')+'</button>';
  if(hq.status==='doing'&&hq.by===S.me.pseudo)h+='<button class="btn sm primary" data-act="reply" data-id="'+hq.id+'">'+T('reply_btn')+'</button>';
  if(hq.status==='doing'&&(hq.who===S.me.pseudo||hq.by===S.me.pseudo))h+='<button class="btn sm" data-act="solve" data-id="'+hq.id+'">'+ic('check',16)+T('solve')+'</button>';
  return h+'</article>';
}
function vHelp(){
  var mine=S.helps.filter(function(x){return x.who===S.me.pseudo;}),q2=refQueue().filter(function(x){return x.status!=='solved';});
  var h='<button class="btn primary block" data-act="new-help">'+ic('plus',18)+T('new_help')+'</button><p class="muted small row">'+ic('lock',14)+' '+T('help_priv')+'</p>';
  if(S.me.ref.length)h+='<section><h2 class="h2">'+T('help_todo')+(q2.length?'<span class="count">'+q2.length+'</span>':'')+'</h2><p class="muted small" style="margin-bottom:8px">'+T('help_priv_ref')+'</p><div class="stack">'+(q2.length?q2.map(function(x){return helpCard(x,'ref');}).join(''):'<p class="empty">'+T('help_none')+'</p>')+'</div></section>';
  h+='<section><h2 class="h2">'+T('help_mine')+'</h2><div class="stack">'+(mine.length?mine.map(function(x){return helpCard(x,'mine');}).join(''):'<p class="empty">'+T('help_none')+'</p>')+'</div></section>';
  return h;
}
function vAlerts(){
  var h='<div class="row between"><h2 class="h2" style="margin:0">'+T('nav_alerts')+'</h2>'+(unread()?'<button class="btn sm" data-act="mark-all">'+T('mark_all')+'</button>':'')+'</div>';
  h+=S.notifs.length?'<div class="card list">'+S.notifs.map(function(n){return '<button class="li" data-act="alert-open" data-id="'+esc(n.id)+'"><span class="ico" style="'+(n.read?'background:var(--surface2);color:var(--ink2)':'')+'">'+ic(n.type==='task'?'check':n.type==='help'?'life':n.type==='canal'?'hash':'folder',18)+'</span><span class="grow"><span class="t" style="'+(n.read?'font-weight:400':'')+'">'+esc(n[S.lang]||n.fr)+'</span><br><span class="muted small">'+esc(rel(n.at))+'</span></span>'+(n.read?'':'<span class="chip green" aria-label="new">•</span>')+'</button>';}).join('')+'</div>':'<p class="empty">'+T('no_alerts')+'</p>';
  return h;
}
/* ============ Questionnaire de retours des testeurs ============ */
var FBQ=[
 {k:'device',ty:'one',q:['Sur quel appareil testez-vous surtout ?','على أي جهاز تجرّب غالبًا؟','Which device do you mostly test on?'],o:[['iphone','iPhone','iPhone','iPhone'],['android','Android','Android','Android'],['pc','Ordinateur','حاسوب','Computer'],['other','Autre','آخر','Other']]},
 {k:'easy',ty:'s5',q:['Prise en main : l’application est facile à comprendre.','سهولة الفهم: التطبيق سهل الاستيعاب.','Getting started: the app is easy to understand.']},
 {k:'tour',ty:'s5',q:['Le tutoriel (visite guidée) m’a aidé.','الجولة الإرشادية ساعدتني.','The guided tour helped me.']},
 {k:'nav',ty:'s5',q:['Je trouve facilement ce que je cherche.','أجد بسهولة ما أبحث عنه.','I easily find what I’m looking for.']},
 {k:'speed',ty:'s5',q:['L’application est rapide et fluide.','التطبيق سريع وسلس.','The app is fast and smooth.']},
 {k:'lang',ty:'s5',q:['Les textes (français, anglais, arabe) sont clairs et corrects.','النصوص (فرنسية، إنجليزية، عربية) واضحة وصحيحة.','The texts (French, English, Arabic) are clear and correct.']},
 {k:'trust',ty:'s5',q:['Je me sens en confiance pour mes données personnelles.','أشعر بالثقة تجاه بياناتي الشخصية.','I feel confident about my personal data.']},
 {k:'used',ty:'many',q:['Qu’avez-vous essayé ? (plusieurs choix)','ماذا جرّبت؟ (عدة خيارات)','What did you try? (several choices)'],o:[['canals','Canaux','القنوات','Channels'],['ann','Annonces','الإعلانات','Announcements'],['proj','Projets et tâches (Kanban)','المشاريع والمهام (كانبان)','Projects and tasks (Kanban)'],['help','Entraide','التضامن','Mutual help'],['ai','Assistant IA','المساعد الذكي','AI assistant','ai'],['notif','Notifications','الإشعارات','Notifications']]},
 {k:'ai',ty:'s5',ai:1,q:['L’assistant IA m’a été utile.','المساعد الذكي كان مفيدًا لي.','The AI assistant was useful to me.']},
 {k:'best',ty:'txt',q:['Ce qui vous a le plus plu','ما أعجبك أكثر','What you liked most']},
 {k:'issue',ty:'txt',q:['Un bug ou un point confus (où et que s’est-il passé ?)','خلل أو أمر غير واضح (أين وماذا حدث؟)','A bug or confusing point (where and what happened?)']},
 {k:'missing',ty:'txt',q:['Une fonction qu’il manque','ميزة ناقصة','A feature that is missing']},
 {k:'nps',ty:'nps',q:['Recommanderiez-vous Diasporact à un proche ? (0 = pas du tout, 10 = sûrement)','هل توصي بـ Diasporact لقريب؟ (0 = أبدًا، 10 = بالتأكيد)','Would you recommend Diasporact to someone close? (0 = not at all, 10 = definitely)']}
];
function fbO(o){return L3(o[1],o[2],o[3]);}
function fbQs(){return FBQ.filter(function(x){return !x.ai||S.me.ai;});}
function vFeedback(){
  var mine=(S.fb||[]).filter(function(r){return r.uid===S.me.id;}).length;
  var h='<section><h1 class="page">'+esc(L3('Votre avis sur Diasporact','رأيك في Diasporact','Your feedback on Diasporact'))+'</h1><p class="muted">'+esc(L3('Environ 3 minutes. Aucune question n’est obligatoire ; répondez à ce que vous voulez. Vos réponses sont lues par l’équipe uniquement.','حوالي 3 دقائق. لا يوجد سؤال إلزامي؛ أجب عمّا تشاء. لا يطّلع على إجاباتك سوى الفريق.','About 3 minutes. No question is required; answer what you like. Only the team reads your answers.'))+'</p></section>';
  if(mine)h+='<div class="banner">'+ic('check',18)+'<span>'+esc(L3('Vous avez déjà répondu — merci ! Vous pouvez envoyer un nouvel avis.','لقد أجبت من قبل — شكرًا! يمكنك إرسال رأي جديد.','You already answered — thank you! You can send a new one.'))+'</span></div>';
  h+='<form data-form="feedback" class="stack" novalidate>';
  fbQs().forEach(function(x,i){
    var qt=L3(x.q[0],x.q[1],x.q[2]),b='';
    if(x.ty==='s5'||x.ty==='nps'){
      var a=x.ty==='nps'?0:1,z=x.ty==='nps'?10:5;
      for(var n=a;n<=z;n++)b+='<label class="fbo"><input type="radio" name="fb_'+x.k+'" value="'+n+'"><span>'+n+'</span></label>';
      b='<div class="fbopts" dir="ltr">'+b+'</div>'+(x.ty==='s5'?'<div class="row fbend muted small" dir="ltr"><span>'+esc(L3('Pas du tout d’accord','لا أوافق إطلاقًا','Strongly disagree'))+'</span><span class="grow"></span><span>'+esc(L3('Tout à fait d’accord','أوافق تمامًا','Strongly agree'))+'</span></div>':'');
    }else if(x.ty==='one'||x.ty==='many'){
      var ty=x.ty==='one'?'radio':'checkbox';
      x.o.forEach(function(o){if(o[4]==='ai'&&!S.me.ai)return;b+='<label class="fbo"><input type="'+ty+'" name="fb_'+x.k+'" value="'+o[0]+'"><span>'+esc(fbO(o))+'</span></label>';});
      b='<div class="fbopts">'+b+'</div>';
    }else b='<textarea name="fb_'+x.k+'" maxlength="1000" rows="3" aria-label="'+esc(qt)+'"></textarea>';
    h+='<fieldset class="card stack s8 fbq"><legend class="lbl">'+(i+1)+'. '+esc(qt)+'</legend>'+b+'</fieldset>';
  });
  return h+'<p class="fb err" id="fb-err" aria-live="polite"></p><button class="btn primary block" type="submit">'+esc(L3('Envoyer mon avis','إرسال رأيي','Send my feedback'))+'</button></form>';
}
function fbCard(){
  return '<section class="card stack s8"><h2 class="h3">'+esc(L3('Donnez votre avis','شاركنا رأيك','Give your feedback'))+'</h2><p class="muted small">'+esc(L3('Questionnaire de 3 minutes pour nous aider à améliorer Diasporact.','استبيان من 3 دقائق لمساعدتنا على تحسين Diasporact.','A 3-minute questionnaire to help us improve Diasporact.'))+'</p><button class="btn sm primary" data-act="fb-open">'+esc(L3('Répondre au questionnaire','الإجابة على الاستبيان','Answer the questionnaire'))+'</button></section>';
}
function fbAnswers(f){
  var a={},qs=fbQs();
  qs.forEach(function(x){
    var els=f.querySelectorAll('[name="fb_'+x.k+'"]');
    if(x.ty==='txt'){var v=((els[0]||{}).value||'').trim().slice(0,1000);if(v)a[x.k]=v;}
    else if(x.ty==='many'){var m=[];for(var i=0;i<els.length;i++)if(els[i].checked)m.push(els[i].value);if(m.length)a[x.k]=m;}
    else{for(var j=0;j<els.length;j++)if(els[j].checked){a[x.k]=x.ty==='one'?els[j].value:+els[j].value;}}
  });
  return a;
}
function fbQLabel(k){var x=FBQ.filter(function(y){return y.k===k;})[0];return x?L3(x.q[0],x.q[1],x.q[2]):k;}
function fbSummary(){
  var rows=S.fb||[],h='<p class="muted small">'+esc(L3(rows.length+' réponse(s)',rows.length+' إجابة',rows.length+' response(s)'))+'</p>';
  if(!rows.length)return h;
  FBQ.forEach(function(x){
    var vals=rows.map(function(r){return r.a[x.k];}).filter(function(v){return v!=null&&v!=='';}),b='';
    if(!vals.length)return;
    if(x.ty==='s5'||x.ty==='nps'){var s=0;vals.forEach(function(v){s+=+v;});b='<b>'+(s/vals.length).toFixed(1)+(x.ty==='nps'?'/10':'/5')+'</b> <span class="muted small">('+vals.length+')</span>';}
    else if(x.ty==='txt'){b=vals.map(function(v){return '<blockquote class="small">'+esc(v)+'</blockquote>';}).join('');}
    else{var c={};vals.forEach(function(v){(Array.isArray(v)?v:[v]).forEach(function(z){c[z]=(c[z]||0)+1;});});
      b=Object.keys(c).map(function(z){var o=(x.o||[]).filter(function(oo){return oo[0]===z;})[0];return esc(o?fbO(o):z)+' : <b>'+c[z]+'</b>';}).join(' · ');}
    h+='<div class="stack s8"><div class="lbl">'+esc(fbQLabel(x.k))+'</div><div>'+b+'</div></div>';
  });
  return h;
}
function fbCsv(){
  var rows=S.fb||[],cols=FBQ.map(function(x){return x.k;});
  function cell(v){v=v==null?'':Array.isArray(v)?v.join('|'):String(v);if(/^[=+\-@]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"';}
  var out=[['date','pseudo','lang'].concat(cols).map(cell).join(',')];
  rows.forEach(function(r){out.push([r.at,r.who,r.lang].concat(cols.map(function(k){return r.a[k];})).map(cell).join(','));});
  return '﻿'+out.join('\r\n');
}
function fbAdmin(){
  if(!S.me.admin)return '';
  var u=appUrl('q');
  return '<section class="card stack s8"><h2 class="h3">'+esc(L3('Retours des testeurs','ملاحظات المختبرين','Tester feedback'))+'</h2><p class="muted small">'+esc(L3('Lien direct à envoyer aux testeurs :','رابط مباشر لإرساله للمختبرين:','Direct link to send to testers:'))+'</p><p class="linkbox" dir="ltr" style="overflow-wrap:anywhere">'+esc(u)+'</p>'+
  '<div class="row wrap"><button class="btn sm grow" data-act="fb-copy">'+ic('copy',16)+esc(L3('Copier le lien','نسخ الرابط','Copy link'))+'</button><button class="btn sm grow" data-act="fb-sum">'+esc(L3('Synthèse','الملخص','Summary'))+' ('+(S.fb||[]).length+')</button><button class="btn sm grow" data-act="fb-csv">CSV</button></div></section>';
}
/* ============ Préinscription (avant le lancement) ============ */
function vPrereg(){
  if(S.preDone)return heroBlock(L3('Préinscription','التسجيل المسبق','Pre-registration'),L3('Merci, vous êtes préinscrit(e) !','شكرًا، تم تسجيلك مسبقًا!','Thank you, you are pre-registered!'),L3('Nous vous contacterons dès l’ouverture de Diasporact, avec votre lien d’invitation.','سنتواصل معك فور افتتاح Diasporact مع رابط الدعوة الخاص بك.','We will contact you as soon as Diasporact opens, with your invitation link.'))+
    '<button class="btn block" data-act="pre-back">'+esc(L3('Retour','رجوع','Back'))+'</button>';
  var ck=CANALS.map(function(k){return '<label class="fbo"><input type="checkbox" name="pr_canal" value="'+k.id+'"><span>'+C(k.n)+'</span></label>';}).join('');
  return heroBlock(L3('Préinscription','التسجيل المسبق','Pre-registration'),L3('Rejoignez Diasporact dès son ouverture','انضم إلى Diasporact فور افتتاحه','Join Diasporact as soon as it opens'),L3('Laissez-nous votre contact : vous recevrez votre lien d’invitation au lancement.','اترك لنا وسيلة تواصل لتصلك دعوتك عند الإطلاق.','Leave us your contact and you will get your invitation link at launch.'))+
  '<form data-form="prereg" class="stack" novalidate>'+
  '<div class="field"><label for="pr-fn">'+esc(L3('Prénom (facultatif)','الاسم الأول (اختياري)','First name (optional)'))+'</label><input type="text" id="pr-fn" maxlength="60" autocomplete="given-name"></div>'+
  '<div class="field"><label for="pr-ct">'+esc(L3('E-mail ou numéro WhatsApp','البريد الإلكتروني أو رقم واتساب','Email or WhatsApp number'))+'</label><input type="text" id="pr-ct" maxlength="120" autocomplete="email" autocapitalize="none" spellcheck="false" dir="ltr" inputmode="email"></div>'+
  '<div class="field"><label for="pr-c">'+esc(L3('Pays de résidence (facultatif)','بلد الإقامة (اختياري)','Country of residence (optional)'))+'</label>'+countryInput('pr-c','','maxlength="60" autocomplete="country-name"')+'</div>'+
  '<fieldset class="card stack s8 fbq"><legend class="lbl">'+esc(L3('Vos centres d’intérêt (facultatif)','اهتماماتك (اختياري)','Your interests (optional)'))+'</legend><div class="fbopts">'+ck+'</div></fieldset>'+
  '<div style="position:absolute;left:-9999px" aria-hidden="true"><input type="text" id="pr-hp" tabindex="-1" autocomplete="off"></div>'+
  '<label class="pick" for="pr-ok"><input type="checkbox" id="pr-ok"><span class="grow t small">'+esc(L3('J’accepte d’être contacté(e) pour le lancement de Diasporact. Mes données ne servent qu’à cela et seront supprimées sur simple demande.','أوافق على التواصل معي بخصوص إطلاق Diasporact. تُستخدم بياناتي لهذا الغرض فقط وتُحذف عند الطلب.','I agree to be contacted about the Diasporact launch. My data is used only for that and deleted on request.'))+'</span></label>'+
  '<p class="muted small"><a href="confidentialite.html" target="_blank" rel="noopener">'+esc(L3('Politique de confidentialité','سياسة الخصوصية','Privacy policy'))+'</a></p>'+
  '<p class="fb err" id="pr-err" aria-live="polite"></p><button class="btn primary block" type="submit">'+esc(L3('Me préinscrire','سجّلني مسبقًا','Pre-register me'))+'</button><button class="btn block" type="button" data-act="pre-back">'+esc(L3('Retour','رجوع','Back'))+'</button></form>';
}
function preCard(){
  return '<section class="card stack s8"><h2 class="h3">'+esc(L3('Pas encore d’invitation ?','ليس لديك دعوة بعد؟','No invitation yet?'))+'</h2><p class="muted small">'+esc(L3('Préinscrivez-vous : nous vous enverrons votre lien au lancement.','سجّل مسبقًا: سنرسل لك رابطك عند الإطلاق.','Pre-register: we will send you your link at launch.'))+'</p><button class="btn sm primary" data-act="pre-open">'+esc(L3('Me préinscrire','سجّلني مسبقًا','Pre-register me'))+'</button></section>';
}
function preAdmin(){
  if(!S.me.admin)return '';
  return '<section class="card stack s8"><h2 class="h3">'+esc(L3('Préinscriptions','التسجيلات المسبقة','Pre-registrations'))+' ('+(S.pre||[]).length+')</h2><p class="muted small">'+esc(L3('Lien public à diffuser :','الرابط العام للنشر:','Public link to share:'))+'</p><p class="linkbox" dir="ltr" style="overflow-wrap:anywhere">'+esc(appUrl('preinscription'))+'</p>'+
  '<div class="row wrap"><button class="btn sm grow" data-act="pre-copy">'+ic('copy',16)+esc(L3('Copier le lien','نسخ الرابط','Copy link'))+'</button><button class="btn sm grow" data-act="pre-list">'+esc(L3('Voir la liste','عرض القائمة','View list'))+'</button><button class="btn sm grow" data-act="pre-csv">CSV</button></div></section>';
}
function preCsv(){
  function cell(v){v=v==null?'':Array.isArray(v)?v.join('|'):String(v);if(/^[=+\-@]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"';}
  var out=[['date','prenom','contact','pays','interets','langue'].map(cell).join(',')];
  (S.pre||[]).forEach(function(r){out.push([r.at,r.fn,r.ct,r.co,r.cn,r.lang].map(cell).join(','));});
  return '﻿'+out.join('\r\n');
}
function downloadText(name,txt,type){var blob=new Blob([txt],{type:type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url);},1000);}
function adminSection(){
  if(!S.me.admin)return '';
  return '<section class="card stack s8"><h2 class="h3">'+T('adm_title')+'</h2>'+
  '<form data-form="setrole" class="stack s8"><div class="lbl">'+T('adm_role')+'</div><div class="pfx" dir="ltr">@<input type="text" id="ad-p" maxlength="24" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="'+esc(t('adm_pseudo'))+'"></div>'+
  '<div class="field"><label for="ad-c">'+T('adm_canal')+'</label><select id="ad-c">'+CANALS.map(function(k){return '<option value="'+k.id+'">'+C(k.n)+'</option>';}).join('')+'</select></div>'+
  '<label class="pick" for="ad-m"><span class="grow t">'+T('adm_mod')+'</span><input type="checkbox" id="ad-m" checked></label><label class="pick" for="ad-r"><span class="grow t">'+T('adm_relay')+'</span><input type="checkbox" id="ad-r"></label><button class="btn sm primary" type="submit">'+T('adm_save')+'</button></form>'+
  '<form data-form="setref" class="stack s8"><div class="lbl">'+T('adm_ref')+'</div><div class="pfx" dir="ltr">@<input type="text" id="ar-p" maxlength="24" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="'+esc(t('adm_pseudo'))+'"></div><label class="pick" for="ar-o"><span class="grow t">'+T('adm_ref_on')+'</span><input type="checkbox" id="ar-o" checked></label><button class="btn sm primary" type="submit">'+T('adm_save')+'</button></form>'+
  '<form data-form="setspk" class="stack s8"><div class="lbl">'+T('adm_spk')+'</div><div class="pfx" dir="ltr">@<input type="text" id="as-p" maxlength="24" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="'+esc(t('adm_pseudo'))+'"></div>'+
  '<div class="field"><label for="as-c">'+T('adm_spk_country')+'</label>'+countryInput('as-c','','maxlength="60" autocomplete="off"')+'</div>'+
  '<label class="pick" for="as-o"><span class="grow t">'+T('adm_spk_on')+'</span><input type="checkbox" id="as-o" checked></label><button class="btn sm primary" type="submit">'+T('adm_save')+'</button></form>'+
  '<form data-form="setai" class="stack s8"><div class="lbl">'+T('adm_ai')+'</div><div class="pfx" dir="ltr">@<input type="text" id="ai-p" maxlength="24" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="'+esc(t('adm_pseudo'))+'"></div>'+
  '<label class="pick" for="ai-o"><span class="grow t">'+T('adm_ai_on')+'</span><input type="checkbox" id="ai-o" checked></label><button class="btn sm primary" type="submit">'+T('adm_save')+'</button></form></section>';
}
function vMe(){
  var roles=[chip(T('r_member'))];if(S.me.admin)roles.push(chip(T('r_speaker'),'red'));S.me.mod.forEach(function(id){roles.push(chip(T('r_mod',{x:c(canalOf(id).n)}),'green'));});
  if(S.me.ref.length)roles.push(chip(T('adm_ref'),'yellow'));
  (S.me.spk||[]).forEach(function(ctry){roles.push(chip(T('r_spk',{x:ctry}),'green'));});
  if(S.me.ai)roles.push(chip(T('r_ai'),'yellow'));
  var mine=Object.keys(S.mem).map(function(id){return '<div class="li"><span class="grow t">'+C(canalOf(id).n)+'</span>'+statusChip(id)+'</div>';}).join('');
  return '<section class="row">'+av(S.me.pseudo,52)+'<div class="grow"><h1 class="page" style="font-size:22px">'+idInline(S.me.pseudo)+'</h1></div></section>'+
  '<section><h2 class="h2">'+T('roles')+'</h2><div class="chips">'+roles.join('')+'</div></section>'+
  (mine?'<section><h2 class="h2">'+T('my_canals')+'</h2><div class="card list">'+mine+'</div></section>':'')+
  '<section class="card stack s8"><h2 class="h3">'+T('name_section')+'</h2><p class="muted small">'+T('name_public_note')+'</p><form data-form="myname" class="stack s8" novalidate>'+
    '<div class="row wrap"><div class="field grow" style="min-width:140px"><label for="my-fn">'+T('firstname_label')+'</label><input type="text" id="my-fn" maxlength="60" autocomplete="given-name" value="'+esc(S.me.firstName)+'"></div>'+
    '<div class="field grow" style="min-width:140px"><label for="my-ln">'+T('lastname_label')+'</label><input type="text" id="my-ln" maxlength="60" autocomplete="family-name" value="'+esc(S.me.lastName)+'"></div></div>'+
    '<button class="btn sm" type="submit">'+T('sk_save')+'</button></form></section>'+
  '<section class="card stack s8"><h2 class="h3">'+T('country')+'</h2><form data-form="mycountry" class="row" novalidate><div class="grow">'+countryInput('my-country',S.me.country,'maxlength="60" autocomplete="country-name" aria-label="'+esc(t('country'))+'"')+'</div><button class="btn sm" type="submit">'+T('sk_save')+'</button></form></section>'+
  '<section class="card stack s8"><h2 class="h3">'+T('tour_title')+'</h2><p class="muted small">'+T('tour_again_sub')+'</p><button class="btn sm" data-act="tour-open">'+T('tour_again')+'</button></section>'+
  fbCard()+badgesSection()+skillsSection()+adminSection()+fbAdmin()+preAdmin()+
  (S.anon?'<section class="card stack s8"><h2 class="h3">'+T('secure_t')+'</h2><p class="muted small">'+T('secure_note')+'</p>'+'<form data-form="setpw" class="stack s8" novalidate><input type="text" name="username" autocomplete="username" value="'+esc(S.me.pseudo)+'" tabindex="-1" aria-hidden="true" readonly style="position:absolute;opacity:0;height:0;width:0;pointer-events:none"><input type="password" id="sp-w" name="password" autocomplete="new-password" minlength="8" maxlength="72" dir="ltr" placeholder="'+esc(t('pw_new'))+'" aria-label="'+esc(t('pw_new'))+'"><button class="btn sm" type="submit">'+T(S.anon?'secure_go':'change_pw')+'</button></form>'+'</section>':'<section class="card stack s8"><h2 class="h3">'+ic('lock',16)+' '+T('acct_ok_t')+'</h2><p class="muted small">'+T('acct_ok_note',{p:esc(S.me.pseudo)})+'</p>'+'<div class="stack s8"><h3 class="h3">'+T('sc_title')+'</h3><p class="muted small">'+T('sc_note')+' '+T('sc_gen_warn')+'</p><button class="btn sm" data-act="gen-code">'+T('sc_gen')+'</button></div>'+'<form data-form="setpw" class="stack s8" novalidate><input type="text" name="username" autocomplete="username" value="'+esc(S.me.pseudo)+'" tabindex="-1" aria-hidden="true" readonly style="position:absolute;opacity:0;height:0;width:0;pointer-events:none"><input type="password" id="sp-w" name="password" autocomplete="new-password" minlength="8" maxlength="72" dir="ltr" placeholder="'+esc(t('pw_new'))+'" aria-label="'+esc(t('pw_new'))+'"><button class="btn sm" type="submit">'+T(S.anon?'secure_go':'change_pw')+'</button></form>'+'<button class="btn sm" data-act="logout">'+T('logout_t')+'</button></section>')+
  '<section class="card stack s8"><h2 class="h3">'+T('recov')+'</h2><p class="muted small">'+T('recov_note')+'</p></section>'+
  '<section class="stack s8"><div class="lbl">'+T('lang')+'</div><div class="seg"><button aria-pressed="'+(S.lang==='fr')+'" data-act="lang" data-v="fr">Français</button><button aria-pressed="'+(S.lang==='en')+'" data-act="lang" data-v="en">English</button><button aria-pressed="'+(S.lang==='ar')+'" data-act="lang" data-v="ar">العربية</button></div>'+
  '<div class="lbl">'+T('theme')+'</div><div class="seg">'+['light','dark'].map(function(v){return '<button aria-pressed="'+(S.theme===v)+'" data-act="theme" data-v="'+v+'">'+T('th_'+v)+'</button>';}).join('')+'</div></section>'+
  '<section class="card stack s8"><h2 class="h3">'+T('privacy_t')+'</h2><p class="muted small">'+T('privacy_export_note')+'</p><button class="btn sm" data-act="export-data">'+T('privacy_export')+'</button><button class="btn sm" data-act="privacy-info">'+T('privacy_policy')+'</button></section>'+
  '<button class="btn block danger" data-act="delete-account">'+T('del_account')+'</button>';
}
function vNewHelp(){
  return '<h1 class="page">'+T('new_help')+'</h1><form data-form="help" class="stack" novalidate>'+
  '<div class="field"><label for="nh-dom">'+T('domain')+'</label><select id="nh-dom">'+DOMAINS.map(function(d){return '<option value="'+d+'">'+T('dm_'+d)+'</option>';}).join('')+'</select></div>'+
  '<div class="field"><label for="nh-country">'+T('country')+'</label>'+countryInput('nh-country',S.me.country,'maxlength="40" autocomplete="off"')+'</div>'+
  '<div class="field"><label for="nh-urg">'+T('urgency')+'</label><select id="nh-urg"><option value="0">'+T('u_normal')+'</option><option value="1">'+T('u_urgent')+'</option></select></div>'+
  '<div class="field"><label for="nh-txt">'+T('situation')+'</label><textarea id="nh-txt" maxlength="500"></textarea></div>'+
  '<p class="muted small row">'+ic('lock',14)+' '+T('help_priv')+'</p><p class="fb err" id="nh-err"></p>'+
  '<div class="row"><button type="button" class="btn grow" data-act="back">'+T('cancel')+'</button><button type="submit" class="btn primary grow">'+T('send')+'</button></div></form>';
}
function heroBlock(eyebrow,title,sub){return '<section class="hero">'+logoSvg()+'<p class="eyebrow">'+eyebrow+'</p><h1>'+title+'</h1><p>'+sub+'</p></section>';}
function vLoad(){return heroBlock('','Diasporact',S.fatal?esc(S.fatal):T('loading'));}
function vInv0(){
  return heroBlock(T('inv_from'),T('inv0_title'),T('inv0_sub'))+(S.auth.err?'<div class="banner">'+ic('lock',18)+'<span>'+esc(S.auth.err)+'</span></div>':'')+
  '<form data-form="invlink" class="stack" novalidate><div class="field"><label for="il-in">'+T('inv0_ph')+'</label><input type="text" id="il-in" autocomplete="off" autocapitalize="none" spellcheck="false" dir="ltr"></div><button class="btn primary block" type="submit">'+T('inv0_go')+'</button></form>'+
  '<section class="card stack s8"><h2 class="h3">'+T('have_acct')+'</h2><p class="muted small">'+T('login_sub')+'</p><form data-form="login" class="stack s8" novalidate><div class="pfx" dir="ltr">@<input type="text" id="lg-p" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="24" aria-label="'+esc(t('pseudo_label'))+'"></div><input type="password" id="lg-w" name="password" autocomplete="current-password" maxlength="72" dir="ltr" aria-label="'+esc(t('pw_label'))+'"><button class="btn block" type="submit">'+T('login_go')+'</button></form><button class="btn sm" type="button" data-act="forgot">'+T('forgot')+'</button></section>'+preCard();
}
function vInv1(){
  var pk=S.auth.peek||{},adm=pk.kind==='admin',k=pk.canal?canalOf(pk.canal):null;
  var hero=adm?heroBlock(T('inv_from'),T('adm_first'),T('adm_first_sub')):heroBlock(T('inv_from'),T('inv_title'),T('inv_sub',{canal:k?c(k.n):''}));
  return hero+(k&&!adm?'<section class="card stack s8"><div class="row"><span class="ico-lg">'+ic(k.ico,20)+'</span><div class="grow"><h2 class="h3">'+C(k.n)+'</h2></div></div><p>'+C(k.d)+'</p></section>':'')+
  '<form data-form="pseudo" class="stack" novalidate><div class="field"><label for="pseudo">'+T('pseudo_label')+'</label><div class="pfx" dir="ltr">@<input type="text" id="pseudo" name="username" maxlength="24" autocomplete="username" autocapitalize="none" spellcheck="false" value="'+esc(S.draft.pseudo)+'"></div><p class="muted small">'+T('pseudo_help')+'</p><p class="fb" id="pseudo-fb" aria-live="polite"></p></div>'+
  '<div class="field"><label for="country">'+T('country_label')+'</label>'+countryInput('country',S.draft.country,'maxlength="60" autocomplete="country-name"')+'</div>'+
  '<div class="field"><label for="pw">'+T('pw_label')+'</label><input type="password" id="pw" name="password" autocomplete="new-password" minlength="8" maxlength="72" dir="ltr"><p class="muted small">'+T('pw_help')+'</p><p class="fb err" id="pw-fb" aria-live="polite"></p></div>'+
  '<p class="muted small">'+t('privacy_link')+'</p><button type="submit" class="btn primary block" id="pseudo-go" disabled>'+T('create_account')+'</button></form>';
}
function vInvRec(){return heroBlock(T('inv_from'),T('rec_title'),T('rec_sub'))+'<button class="btn primary block" data-act="rec-go">'+T('rec_go')+'</button>';}
var VIEWS={load:vLoad,inv0:vInv0,inv1:vInv1,invRec:vInvRec,home:vHome,canals:vCanals,canal:vCanal,projects:vProjects,project:vProject,newProject:vNewProject,help:vHelp,newHelp:vNewHelp,alerts:vAlerts,me:vMe,feedback:vFeedback,prereg:vPrereg};
var pseudoTimer,pseudoSeq=0;
function updatePseudo(){
  var inp=$('#pseudo');if(!inp)return;var v=inp.value.trim().toLowerCase(),fb=$('#pseudo-fb'),go=$('#pseudo-go');S.draft.pseudo=inp.value;
  fb.className='fb';go.disabled=true;clearTimeout(pseudoTimer);
  if(!v){fb.textContent='';return;}
  if(!/^[a-z0-9][a-z0-9._-]{2,23}$/.test(v)){fb.classList.add('err');fb.textContent=t('pseudo_bad');return;}
  fb.textContent=t('pseudo_check');var my=++pseudoSeq;
  pseudoTimer=setTimeout(function(){
    q(client().rpc('pseudo_available',{p:v})).then(function(ok){
      if(my!==pseudoSeq||!$('#pseudo'))return;fb=$('#pseudo-fb');fb.className='fb';
      if(ok){fb.classList.add('ok');fb.textContent='✓ '+t('pseudo_ok',{p:v});$('#pseudo-go').disabled=false;}
      else{fb.classList.add('err');fb.innerHTML=esc(t('pseudo_taken',{p:v}))+' '+[v+'.mr',v+'_'+new Date().getFullYear()].filter(function(s){return s.length<=24;}).map(function(s){return '<button type="button" class="chip" data-act="sug" data-v="'+esc(s)+'">@'+esc(s)+'</button>';}).join(' ');}
    }).catch(function(){if(my!==pseudoSeq)return;var f=$('#pseudo-fb');if(f){f.className='fb err';f.textContent=t('e_net');}});
  },350);
}
function shareMessage(kind,id){
  if(kind==='project'){var p=projOf(id),pr=progress(p),u=appUrl('p/'+p.id);return {text:c(p.t)+' : '+pr.d+'/'+pr.n+L3(' tâches terminées. Suivez l’avancement et participez : ',' مهام منجزة. تابع التقدم وشارك: ',' tasks completed. Follow the progress and take part: ')+u,title:c(p.t),sub:T('tasks_count',{a:pr.d,b:pr.n}),url:u};}
  if(kind==='ann'){var a=annOf(id),u2=appUrl('a/'+a.id);return {text:L3('Annonce officielle : ','إعلان رسمي: ','Official announcement: ')+c(a.t)+L3('. Lire et confirmer la lecture : ','. اقرأ وأكّد القراءة: ','. Read and confirm you have read it: ')+u2,title:c(a.t),sub:T('official'),url:u2};}
  var k=canalOf(id),u3=appUrl('i/'+S.invites[id]);return {text:L3('Rejoignez le canal « ','انضموا إلى قناة «','Join the channel “')+c(k.n)+L3(' » sur Diasporact : ','» على Diasporact: ',' ” on Diasporact: ')+u3,title:c(k.n),sub:T('app_name'),url:u3};
}
function openAnnForm(){
  var ids=S.me.admin?CANALS.map(function(k){return k.id;}):S.me.mod;
  var spkOpts=(S.me.spk||[]).map(function(ctry){return '<option value="pays:'+esc(ctry)+'">'+T('f_country_opt')+' : '+esc(ctry)+'</option>';}).join('');
  openSheet(t('publish_ann'),'<form data-form="ann" class="stack" novalidate><div class="field"><label for="an-t">'+T('f_title')+'</label><input type="text" id="an-t" maxlength="140" autocomplete="off"></div><div class="field"><label for="an-b">'+T('f_body')+'</label><textarea id="an-b" maxlength="2000"></textarea></div><div class="field"><label for="an-c">'+T('f_target')+'</label><select id="an-c">'+(S.me.admin?'<option value="all">'+T('f_all')+'</option>':'')+ids.map(function(id){return '<option value="'+id+'">'+C(canalOf(id).n)+'</option>';}).join('')+spkOpts+'</select></div><div class="field"><label for="an-u">'+T('f_until')+'</label><input type="date" id="an-u"></div><p class="fb err" id="an-err"></p><button type="submit" class="btn primary block">'+T('publish')+'</button></form>');
}

/* ============ Actions ============ */
function rpc(name,args){return q(client().rpc(name,args||{}));}
function tbl(n){return client().from(n);}
function pseudoId(p){return S.pubId[p];}
function showRecoveryCode(code){
  var g=String(code||'').replace(/(.{5})(?=.)/g,'$1-');S._msg=g;
  openSheet(t('sc_show'),'<p class="linkbox" dir="ltr" style="font-size:22px;letter-spacing:1px;text-align:center;font-family:ui-monospace,Menlo,monospace;overflow-wrap:anywhere">'+esc(g)+'</p><p class="muted small">'+T('sc_keep')+'</p><div class="row wrap"><button class="btn grow" data-act="copy-msg">'+ic('copy',18)+T('sc_copy')+'</button><button class="btn primary grow" data-act="close-sheet">'+T('sc_done')+'</button></div>');
}
function ensureSession(){var cl=client();return cl.auth.getSession().then(function(r){if(r.data.session)return;return cl.auth.signInAnonymously().then(function(x){if(x.error)throw x.error;});});}
function openForgot(){
  openSheet(t('forgot'),'<p class="muted small">'+T('fg_sub')+'</p><form data-form="forgot" class="stack s8" novalidate><div class="pfx" dir="ltr">@<input type="text" id="fg-p" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="24" aria-label="'+esc(t('pseudo_label'))+'"></div><input type="text" id="fg-c" autocomplete="off" autocapitalize="characters" spellcheck="false" dir="ltr" placeholder="'+esc(t('fg_code'))+'" aria-label="'+esc(t('fg_code'))+'"><input type="password" id="fg-w" name="password" autocomplete="new-password" minlength="8" maxlength="72" dir="ltr" placeholder="'+esc(t('pw_new'))+'" aria-label="'+esc(t('pw_new'))+'"><button class="btn primary block" type="submit">'+T('fg_go')+'</button></form><p class="muted small">'+T('fg_nocode')+'</p>');
}
function openRecoveryLink(code,pseudo){
  var u=appUrl('i/'+code),msg=L3('Lien de reconnexion à votre compte Diasporact : ','رابط إعادة الاتصال بحسابك على Diasporact: ','Link to reconnect to your Diasporact account: ')+u;S._msg=msg;
  openSheet(t('rc_ready')+' · @'+pseudo,'<p class="linkbox" dir="ltr" style="overflow-wrap:anywhere">'+esc(u)+'</p><p class="muted small">'+T('rc_help')+'</p><div class="row wrap"><button class="btn grow" data-act="copy-msg">'+ic('copy',18)+T('share_copy')+'</button><a class="btn primary grow" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(msg)+'">'+ic('chat',18)+T('share_open')+'</a></div>');
}
/* ============ Visite guidée (assistant de prise en main) ============ */
function tourDone(){try{return localStorage.getItem('dp-tour')==='1';}catch(e){return false;}}
function tourMark(){try{localStorage.setItem('dp-tour','1');}catch(e){}}
function tourSteps(){
  var st=[
   {i:'home',k:1},{i:'hash',k:2},
   {i:'hash',k:3,a:'tab:canals'},{i:'mega',k:4,a:'tab:home'},{i:'folder',k:5,a:'tab:projects'},{i:'life',k:6,a:'tab:help'},
   {i:'lock',k:7,a:'me'},{i:'globe',k:8}];
  if(S.me&&S.me.ai)st.push({i:'chat',k:9,a:'newproj'});
  st.push({i:'check',k:10,a:'fb'});
  return st;
}
function openTour(n){
  var st=tourSteps(),i=Math.max(0,Math.min(n||0,st.length-1)),x=st[i],last=i===st.length-1,dots='';
  S.tourI=i;
  for(var j=0;j<st.length;j++)dots+='<i'+(j===i?' class="on"':'')+'></i>';
  openSheet(t('tour_title'),'<div class="tour"><span class="ico-lg tour-ic">'+ic(x.i,26)+'</span><p class="muted small">'+T('tour_of',{a:i+1,b:st.length})+'</p><div class="tdots" aria-hidden="true">'+dots+'</div><h3 class="h3">'+T('tour'+x.k+'_t')+'</h3><p>'+T('tour'+x.k+'_d')+'</p>'+
   (x.a?'<button class="btn block" data-act="tour-go" data-go="'+x.a+'">'+T('tour'+x.k+'_b')+'</button>':'')+
   '<div class="row"><button class="btn grow" data-act="tour-prev"'+(i?'':' disabled')+'>'+T('tour_prev')+'</button><button class="btn primary grow" data-act="'+(last?'tour-end':'tour-next')+'">'+T(last?'tour_end':'tour_next')+'</button></div>'+
   (last?'':'<button class="lnk" data-act="tour-end">'+T('tour_skip')+'</button>')+'</div>','tour-sheet');
}
function maybeTour(){
  if(S._tourTry||tourDone()||!hasAccount()||S.route.name!=='home')return;
  S._tourTry=true;
  setTimeout(function(){var sh=$('#sheets');if(!sh||!sh.hidden||S.route.name!=='home'){S._tourTry=false;return;}openTour(0);},600);
}

Object.assign(I18N.fr,{tour10_b:'Donner mon avis (3 min)'});Object.assign(I18N.ar,{tour10_b:'شاركنا رأيك (3 دقائق)'});Object.assign(I18N.en,{tour10_b:'Give my feedback (3 min)'});
var ACT={
 'tour-open':function(){openTour(0);},
 'fb-open':function(){go('feedback');},
 'pre-open':function(){S.preDone=false;S.route={name:'prereg',params:{}};render(true);},
 'pre-back':function(){S.preDone=false;clearHash();S.route={name:'inv0',params:{}};render(true);},
 'pre-copy':function(){S._msg=appUrl('preinscription');ACT['copy-msg']();},
 'pre-csv':function(){downloadText('diasporact-preinscriptions.csv',preCsv(),'text/csv;charset=utf-8');},
 'pre-list':function(){var r=S.pre||[];openSheet(L3('Préinscriptions','التسجيلات المسبقة','Pre-registrations'),r.length?'<div class="card list">'+r.map(function(x){return '<div class="li"><span class="grow t">'+esc(x.fn||'—')+' · <span dir="ltr">'+esc(x.ct)+'</span><br><span class="muted small">'+esc((x.co?x.co+' · ':'')+x.at)+'</span></span></div>';}).join('')+'</div>':'<p class="muted">—</p>');},
 'fb-copy':function(){S._msg=appUrl('q');ACT['copy-msg']();},
 'fb-sum':function(){openSheet(L3('Synthèse des retours','ملخص الملاحظات','Feedback summary'),fbSummary());},
 'fb-csv':function(){var blob=new Blob([fbCsv()],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='diasporact-retours-testeurs.csv';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url);},1000);},
 'tour-next':function(){openTour((S.tourI||0)+1);},
 'tour-prev':function(){openTour((S.tourI||0)-1);},
 'tour-end':function(){tourMark();closeSheet();},
 'tour-go':function(d){tourMark();closeSheet(true);var a=String(d.go||'');if(a.indexOf('tab:')===0)tab(a.slice(4));else if(a==='me'){S.stack=[];go('me');}else if(a==='fb'){S.stack=[];go('feedback');}else if(a==='newproj')ACT['new-project']({});},
 'task-view':function(d){try{localStorage.setItem('dp-tv',d.v==='list'?'list':'board');}catch(e){}render();},
 'kb-cols':function(){openSheet(t('kb_cols_t'),'<p>'+T('kb_cols_d')+'</p><div class="kb-prev" aria-hidden="true"><span class="chip">'+T('tk_todo')+'</span><span class="chip">'+T('tk_doing')+'</span><span class="chip">'+T('tk_done')+'</span><span class="chip kb-add">+ '+T('kb_add')+'</span></div><button class="btn block" disabled aria-disabled="true">'+T('kb_cols')+' · '+T('kb_soon')+'</button><button class="btn primary block" data-act="close-sheet">'+T('close')+'</button>');},
 'task-review':function(d){mut(function(){return rpc('request_task_review',{p_task:d.task});},'t_review_sent');},
 tab:function(d){tab(d.tab);},
 back:function(){back();},
 'go-me':function(){go('me');},
 'close-sheet':function(){closeSheet();},
 'ai-agree':function(){try{localStorage.setItem('dp-ai-ok','1');}catch(e){}var f=S._aiNext;S._aiNext=null;closeSheet();if(f)f();},
 'ai-tr':function(d){var k=d.id;aiGate(function(){var src=S.aiSrc[k];if(!src)return;S.aiTr[k]={loading:true};render();
   aiCall({task:'translate',text:src,target:S.lang}).then(function(r){S.aiTr[k]={text:r.text};render();}).catch(function(e){delete S.aiTr[k];render();toast(aiErr(e));});});},
 'ai-tr-hide':function(d){delete S.aiTr[d.id];render();},
 'ai-chat':function(){var el=$('#ai-chat'),txt=el?el.value.trim():'';if(!txt){toast(t('chat_empty'));return;}
   aiGate(function(){var btn=document.querySelector('[data-act="ai-chat"]'),old=btn?btn.textContent:'';if(btn){btn.disabled=true;btn.textContent=t('ai_chat_wait');}
     aiCall({task:'project',text:txt,target:S.lang}).then(function(r){var p=r.project||{};
       if(!p.title&&!p.objective){toast(t('ai_chat_none'));return;}
       var a=$('#np-title'),b=$('#np-obj'),n=$('#np-needs');if(a)a.value=p.title||'';if(b)b.value=p.objective||'';if(n)n.value=(p.needs||[]).join(', ');toast(t('ai_filled'));
     }).catch(function(e){toast(aiErr(e));}).then(function(){if(btn){btn.disabled=false;btn.textContent=old;}});});},
 'cp-toggle':function(d,el){var pn=$('#cpp-'+d.id);if(!pn)return;var open=pn.hidden;
   document.querySelectorAll('.cp-panel').forEach(function(x){x.hidden=true;});document.querySelectorAll('.cp-btn').forEach(function(x){x.setAttribute('aria-expanded','false');});
   if(open){pn.innerHTML='<input type="text" class="cp-q" data-for="'+d.id+'" autocomplete="off" placeholder="'+esc(t('cp_search'))+'" aria-label="'+esc(t('cp_search'))+'"><div class="cp-grid" id="cpg-'+d.id+'">'+cpGrid(d.id,'')+'</div>';pn.hidden=false;el.setAttribute('aria-expanded','true');var q=pn.querySelector('.cp-q');if(q&&matchMedia('(hover:hover)').matches)q.focus();}},
 'cp-pick':function(d){var inp=$('#'+d.id);if(inp){inp.value=d.v;cpFlag(d.id);}var pn=$('#cpp-'+d.id);if(pn)pn.hidden=true;var b=document.querySelector('.cp-btn[data-id="'+d.id+'"]');if(b){b.setAttribute('aria-expanded','false');b.focus();}},
 'open-canal':function(d){go('canal',{id:d.id,tab:d.tab});},
 'open-project':function(d){go('project',{id:d.id});},
 join:function(d){mut(function(){return rpc('request_join',{p_canal:d.id});},function(){return t('t_pending',{m:canalOf(d.id).mod||'—'});});},
 'canal-tab':function(d){S.canalTab[d.id]=d.tab;S.route.params.tab=d.tab;render();},
 'proj-tab':function(d){S.projTab=d.tab;render();},
 read:function(d){mut(function(){return rpc('mark_read',{p_ann:d.id});});},
 share:function(d){openShare(d.kind,d.id);},
 'copy-msg':function(){doCopy(S._msg||'');},
 'copy-link':function(d){doCopy(appUrl('i/'+S.invites[d.id]));},
 'rotate-link':function(d){confirmSheet(t('cf_rotate'),t('cf_rotate_t'),'rotate-link-ok',d.id);},
 'rotate-link-ok':function(d){closeSheet(true);mut(function(){return rpc('rotate_canal_invite',{p_canal:d.id});},'t_new_link');},
 'gen-link':function(d){mut(function(){return rpc('rotate_canal_invite',{p_canal:d.id});},'t_new_link');},
 accept:function(d){mut(function(){return rpc('decide_join',{p_canal:d.id,p_user:d.uid,p_accept:true});},function(){return t('t_accepted',{p:d.p});});},
 refuse:function(d){mut(function(){return rpc('decide_join',{p_canal:d.id,p_user:d.uid,p_accept:false});},function(){return t('t_refused',{p:d.p});});},
 take:function(d){mut(function(){return rpc('take_task',{p_task:d.task});},'t_took');},
 finish:function(d){mut(function(){return rpc('set_task_status',{p_task:d.task,p_status:'done'});},'t_done');},
 apply:function(d){mut(function(){return rpc('join_team',{p_project:d.id});},'t_applied');},
 'follow-sheet':function(d){openFollow(d.id);},
 'pick-follow':function(d){closeSheet(true);mut(function(){return q(tbl('follows').upsert({project_id:d.id,user_id:S.me.id,level:d.v==='milestones'?'mine':d.v}));});},
 'new-project':function(d){go('newProject',{canal:d.id});},
 'new-help':function(){go('newHelp');},
 claim:function(d){mut(function(){return rpc('claim_help',{p_help:d.id});},'t_claimed2');},
 solve:function(d){mut(function(){return rpc('solve_help',{p_help:d.id,p_reply:null});},'t_solved');},
 reply:function(d){openSheet(t('reply_title'),'<form data-form="helpreply" data-id="'+esc(d.id)+'" class="stack s8"><textarea id="hr-txt" rows="6" maxlength="1000" placeholder="'+esc(t('reply_ph'))+'"></textarea><button class="btn primary block" type="submit">'+T('reply_send')+'</button></form>');},
 'mark-all':function(){mut(function(){return q(tbl('notifications').update({read:true}).eq('user_id',S.me.id));});},
 'alert-open':function(d){var n=S.notifs.filter(function(x){return x.id===d.id;})[0];if(!n)return;n.read=true;
   tbl('notifications').update({read:true}).eq('id',d.id).then(function(){});
   if(n.route&&n.route!=='home'&&(n.route!=='project'||projOf(n.params.id)))go(n.route,n.params);else render();},
 lang:function(d){S.lang=d.v;saveLang(d.v);if(hasAccount())tbl('profiles').update({lang:d.v}).eq('id',S.me.id).then(function(){});render();},
 'toggle-lang':function(){ACT.lang({v:S.lang==='fr'?'en':S.lang==='en'?'ar':'fr'});},
 theme:function(d){S.theme=d.v==='dark'?'dark':'light';saveTheme(S.theme);render();},
 'toggle-theme':function(){S.theme=S.theme==='dark'?'light':'dark';saveTheme(S.theme);render();},
 forgot:function(){openForgot();},
 'gen-code':function(){if(S.anon)return;S.busy=false;rpc('make_recovery_code').then(function(c){showRecoveryCode(c);}).catch(function(e){toast(errMsg(e));});},
 logout:function(){if(S.anon)return;client().auth.signOut().then(function(){location.href=location.pathname;});},
 'privacy-info':function(){openSheet(t('privacy_title2'),t('privacy_body'));},
 'export-data':function(){
   rpc('export_my_data').then(function(data){
     var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
     var url=URL.createObjectURL(blob);
     var a=document.createElement('a');a.href=url;a.download='diasporact-mes-donnees-'+S.me.pseudo+'.json';document.body.appendChild(a);a.click();
     setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url);},1000);
     toast(t('t_exported'));
   }).catch(function(e){toast(errMsg(e));});
 },
 'delete-account':function(){confirmSheet(t('del_account'),t('del_t'),'delete-ok','');},
 'delete-ok':function(){closeSheet(true);rpc('delete_my_account').then(function(){return client().auth.signOut();}).then(function(){toast(t('t_deleted'));setTimeout(function(){location.href=location.pathname;},900);}).catch(function(e){toast(errMsg(e));});},
 'publish-ann':function(){openAnnForm();},
 sug:function(d){var i=$('#pseudo');i.value=d.v;updatePseudo();i.focus();},
 'wa-group':function(d){var k=canalOf(d.id);if(k.wa)window.open(k.wa,'_blank','noopener');else toast(t('wa_none'));},
 propose:function(d){mut(function(){return q(tbl('proposals').insert({project_id:d.id,from_user:S.me.id,to_user:pseudoId(d.p)}));},function(){return t('match_sent',{x:d.p});});},
 'toggle-matching':function(){mut(function(){return q(tbl('profiles').update({matching:!S.me.matching}).eq('id',S.me.id));});},
 'toggle-honor':function(){mut(function(){return q(tbl('profiles').update({show_honor:!S.me.showHonor}).eq('id',S.me.id));});},
 'hide-start':function(){S.hideStart=true;render();},
 'scroll-ann':function(){var e=$('#ann-sec');if(e)e.scrollIntoView({behavior:'smooth',block:'start'});},
 'badge-req':function(){openBadgeReq();},
 'badge-grant':function(d){var r=S.badgeReqs.filter(function(x){return x.id===d.id;})[0];mut(function(){return rpc('decide_badge',{p_req:d.id,p_grant:true});},function(){return t('bd_granted',{x:r?r.p:''});});},
 'badge-deny':function(d){mut(function(){return rpc('decide_badge',{p_req:d.id,p_grant:false});},'bd_denied');},
 'ms-toggle':function(d){mut(function(){return q(tbl('milestones').update({done:d.done!=='1'}).eq('id',d.ms));},'t_ms');},
 'archive-project':function(d){var on=d.v==='1';mut(function(){return q(tbl('projects').update({archived_at:on?new Date().toISOString():null}).eq('id',d.id));},on?'pj_arch_ok':'pj_unarch_ok',function(){if(on){S.stack=[];S.route={name:'projects',params:{}};}});},
 'delete-project':function(d){confirmSheet(t('pj_delete'),t('pj_del_t'),'delete-project-ok',d.id);},
 'delete-project-ok':function(d){closeSheet(true);mut(function(){return q(tbl('projects').delete().eq('id',d.id));},'pj_del_ok',function(){S.stack=[];S.route={name:'projects',params:{}};});},
 'set-status':function(d){mut(function(){return q(tbl('projects').update({status:d.v}).eq('id',d.id));},'t_saved');},
 'rec-go':function(){var code=S.auth.code;mut(function(){return rpc('redeem_invite',{p_code:code});},'welcome_in',function(){clearHash();S.deep=null;S.stack=[];S.route={name:'home',params:{}};});}
};
document.addEventListener('click',function(e){
  var el=e.target.closest('[data-act]');if(!el)return;
  var fn=ACT[el.dataset.act];if(!fn)return;
  fn(el.dataset,el,e);
});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!$('#sheets').hidden)closeSheet();});
document.addEventListener('input',function(e){
  var id=e.target.id;
  if(id==='pseudo')updatePseudo();
  if(e.target.classList&&e.target.classList.contains('cp-q')){var g=$('#cpg-'+e.target.dataset['for']);if(g)g.innerHTML=cpGrid(e.target.dataset['for'],e.target.value);}
  if(id&&$('#cpf-'+id))cpFlag(id);
  if(id==='proj-q'){S.projQ=e.target.value;var pl=$('#proj-list');if(pl)pl.innerHTML=projListHtml();}
  if(id==='cmt-text'){var n=$('#cmt-n');if(n)n.textContent=e.target.value.length+'/280';}
});
function need(id,errId,msgKey){var el=$('#'+id);if(!el||!el.value.trim()){var e=$('#'+errId);if(e)e.textContent=t(msgKey||'req');if(el)el.focus();return null;}return el.value.trim();}
function list(v){return v.split(',').map(function(x){return x.trim();}).filter(Boolean);}
function codeFromInput(v){var parts=String(v||'').trim().split(/[\/#?\s]+/).filter(Boolean);return parts.length?parts[parts.length-1]:'';}
var FORMS={
 prereg:function(f){
   var e=$('#pr-err'),ct=($('#pr-ct').value||'').trim(),fn=($('#pr-fn').value||'').trim().slice(0,60),co=($('#pr-c').value||'').trim().slice(0,60);
   if($('#pr-hp').value){S.preDone=true;render(true);return;}
   if(!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(ct)&&!/^\+?[0-9 ().-]{8,20}$/.test(ct)){e.textContent=L3('Saisissez un e-mail ou un numéro WhatsApp valide.','أدخل بريدًا إلكترونيًا أو رقم واتساب صحيحًا.','Enter a valid email or WhatsApp number.');return;}
   if(!$('#pr-ok').checked){e.textContent=L3('Veuillez accepter d’être contacté(e).','يرجى الموافقة على التواصل معك.','Please agree to be contacted.');return;}
   var cn=[].slice.call(f.querySelectorAll('input[name=pr_canal]:checked')).map(function(i){return i.value;});
   if(S.busy)return;S.busy=true;e.textContent='';
   rpc('preregister',{p_first:fn,p_contact:ct,p_country:co,p_canals:cn,p_lang:S.lang}).then(function(){S.busy=false;S.preDone=true;render(true);}).catch(function(x){S.busy=false;e.textContent=/busy/.test(String(x&&x.message))?L3('Trop de demandes en ce moment, réessayez dans quelques minutes.','طلبات كثيرة حاليًا، أعد المحاولة بعد دقائق.','Too many requests right now, try again in a few minutes.'):L3('Une erreur est survenue. Réessayez dans un instant.','حدث خطأ. أعد المحاولة بعد قليل.','Something went wrong. Please try again shortly.');});
 },
 feedback:function(f){
   var a=fbAnswers(f);
   if(!Object.keys(a).length){var e=$('#fb-err');if(e)e.textContent=L3('Répondez à au moins une question.','أجب عن سؤال واحد على الأقل.','Answer at least one question.');return;}
   mut(function(){return q(tbl('feedback').insert({user_id:S.me.id,answers:a,lang:S.lang}));},function(){return L3('Merci pour votre avis !','شكرًا على رأيك!','Thank you for your feedback!');},function(){S.hideFb=true;S.stack=[];S.route={name:'home',params:{}};});
 },
 invlink:function(){var code=codeFromInput($('#il-in').value);if(!code){S.auth.err=t('inv0_bad');render();return;}startOnboarding(code);},
 pseudo:function(){
   var v=$('#pseudo').value.trim().toLowerCase(),country=($('#country').value||'').trim(),code=S.auth.code,pw=($('#pw')||{}).value||'';if(!/^[a-z0-9][a-z0-9._-]{2,23}$/.test(v)||!code)return;
   if(pw.length<8){$('#pw-fb').textContent=t('pw_short');$('#pw').focus();return;}
   S.pwFail=false;
   mut(function(){return rpc('redeem_invite',{p_code:code,p_pseudo:v,p_country:country}).then(function(r){
     return client().auth.updateUser({email:pseudoMail(v),password:pw}).then(function(x){if(x.error){S.pwFail=true;return r;}S.anon=false;return rpc('make_recovery_code').then(function(c){S._newCode=c;return r;},function(){return r;});},function(){S.pwFail=true;return r;});});},null,function(){clearHash();S.draft={pseudo:'',country:''};S.stack=[];S.route={name:'home',params:{}};toast(t(S.pwFail?'pw_later':'welcome_in'));if(S._newCode){var nc=S._newCode;S._newCode=null;setTimeout(function(){showRecoveryCode(nc);},350);}});
 },
 login:function(){
   var p=$('#lg-p').value.trim().toLowerCase().replace(/^@/,''),w=$('#lg-w').value;if(!p||!w){S.auth.err=t('e_login');render();return;}
   mut(function(){return client().auth.signInWithPassword({email:pseudoMail(p),password:w}).then(function(x){if(x.error)throw x.error;return x;});},'t_logged_in',function(){clearHash();S.auth={code:null,peek:null,err:''};S.stack=[];S.route={name:'home',params:{}};});
 },
 mycountry:function(){var v=($('#my-country').value||'').trim();mut(function(){return q(tbl('profiles').update({country:v}).eq('id',S.me.id));},'t_saved');},
 myname:function(){var fn=($('#my-fn').value||'').trim().slice(0,60),ln=($('#my-ln').value||'').trim().slice(0,60);mut(function(){return q(tbl('profiles').update({first_name:fn,last_name:ln}).eq('id',S.me.id));},'t_saved');},
 forgot:function(){
   var p=$('#fg-p').value.trim().toLowerCase().replace(/^@/,''),cd=$('#fg-c').value.trim(),w=$('#fg-w').value;
   if(!p||!cd){toast(t('e_code'));return;} if(w.length<8){toast(t('pw_short'));return;}
   mut(function(){return ensureSession().then(function(){return rpc('reset_password',{p_pseudo:p,p_code:cd,p_new:w});}).then(function(r){
     if(!r||!r.ok)throw new Error(r&&r.reason==='locked'?'locked_code':(r&&r.reason==='weak'?'weak_password':'bad_code'));
     return client().auth.signInWithPassword({email:pseudoMail(p),password:w}).then(function(x){if(x.error)throw x.error;S._newCode=r.code;});});},
   null,function(){closeSheet(true);clearHash();S.auth={code:null,peek:null,err:''};S.stack=[];S.route={name:'home',params:{}};toast(t('pw_ok'));var nc=S._newCode;S._newCode=null;if(nc)setTimeout(function(){showRecoveryCode(nc);},350);});
 },
 setpw:function(){
   var w=$('#sp-w').value;if(w.length<8){toast(t('pw_short'));return;}
   var upd=S.anon?{email:pseudoMail(S.me.pseudo),password:w}:{password:w};
   var wasAnon=S.anon;mut(function(){return client().auth.updateUser(upd).then(function(x){if(x.error)throw x.error;S.anon=false;return wasAnon?rpc('make_recovery_code').then(function(c){S._newCode=c;},function(){}):null;});},'pw_ok',function(){if(S._newCode){var nc=S._newCode;S._newCode=null;setTimeout(function(){showRecoveryCode(nc);},350);}});
 },
 badgereq:function(){var n=$('#bq-note').value.trim();if(!n){$('#bq-note').focus();return;}closeSheet(true);mut(function(){return q(tbl('badge_requests').insert({user_id:S.me.id,type:$('#bq-type').value,note:n}));},'bd_sent');},
 skills:function(){var sk=list($('#sk-in').value).slice(0,8);mut(function(){return q(tbl('profiles').update({skills:sk}).eq('id',S.me.id));},'sk_saved');},
 comment:function(f){var v=$('#cmt-text').value.trim();if(!v)return;mut(function(){return q(tbl('comments').insert({project_id:f.dataset.id,author_id:S.me.id,body:v.slice(0,280)}));});},
 addtask:function(f){var v=$('#tk-new').value.trim();if(!v)return;mut(function(){return q(tbl('tasks').insert({project_id:f.dataset.id,title:v}));},'t_saved');},
 addms:function(f){var v=$('#ms-t').value.trim(),d=$('#ms-d').value;if(!v)return;mut(function(){return q(tbl('milestones').insert({project_id:f.dataset.id,title:v,due:d||null}));},'t_saved');},
 project:function(){
   var title=need('np-title','np-err'),obj=title&&need('np-obj','np-err');if(!title||!obj)return;
   var needs=list($('#np-needs').value),canal=$('#np-canal').value,due=$('#np-due').value,pid=null;
   mut(function(){
     return q(tbl('projects').insert({canal_id:canal,owner_id:S.me.id,title:title,objective:obj,needs:needs,orig_lang:S.lang}).select('id').single()).then(function(row){
       pid=row.id;
       var ops=[q(tbl('project_team').insert({project_id:pid,user_id:S.me.id}))];
       if(due)ops.push(q(tbl('milestones').insert({project_id:pid,title:title,due:due})));
       return Promise.all(ops);
     });
   },'t_proj_pub',function(){S.stack.pop();S.route={name:'project',params:{id:pid}};setTimeout(function(){if(projOf(pid))openShare('project',pid);},50);});
 },
 help:function(){
   var country=need('nh-country','nh-err'),txt=country&&need('nh-txt','nh-err');if(!country||!txt)return;
   if(txt.length<10){$('#nh-err').textContent=t('req');return;}
   var dom=$('#nh-dom').value,urg=$('#nh-urg').value==='1';
   mut(function(){return q(tbl('helps').insert({author_id:S.me.id,domain:dom,country:country,urgent:urg,body:txt}));},'t_help_sent',function(){S.stack=[];S.route={name:'help',params:{}};});
 },
 helpreply:function(f){var v=$('#hr-txt').value.trim();if(!v)return;closeSheet(true);mut(function(){return rpc('solve_help',{p_help:f.dataset.id,p_reply:v});},'t_solved');},
 ann:function(){
   var title=need('an-t','an-err'),body=title&&need('an-b','an-err');if(!title||!body)return;
   var cv=$('#an-c').value,until=$('#an-u').value,aid=null,canalId=null,country=null;
   if(cv.indexOf('pays:')===0)country=cv.slice(5);else if(cv!=='all')canalId=cv;
   closeSheet(true);
   mut(function(){return q(tbl('announcements').insert({canal_id:canalId,country:country,author_id:S.me.id,title:title,body:body,orig_lang:S.lang,valid_until:until||null}).select('id').single()).then(function(r){aid=r.id;});},'t_ann_pub',function(){setTimeout(function(){if(aid&&annOf(aid))openShare('ann',aid);},50);});
 },
 wa:function(f){var v=$('#wa-in').value.trim();mut(function(){return rpc('set_canal_wa',{p_canal:f.dataset.id,p_link:v});},'t_saved');},
 recovery:function(){var p=$('#rc-p').value.trim().toLowerCase().replace(/^@/,'');if(!p)return;
   mut(function(){return rpc('create_recovery_invite',{p_pseudo:p});},null,function(code){openRecoveryLink(code,p);});},
 setrole:function(){var p=$('#ad-p').value.trim().toLowerCase().replace(/^@/,'');if(!p)return;
   mut(function(){return rpc('set_role',{p_pseudo:p,p_canal:$('#ad-c').value,p_moderator:$('#ad-m').checked,p_relay:$('#ad-r').checked});},'t_saved');},
 setref:function(){var p=$('#ar-p').value.trim().toLowerCase().replace(/^@/,'');if(!p)return;
   mut(function(){return rpc('set_referent',{p_pseudo:p,p_on:$('#ar-o').checked});},'t_saved');},
 setai:function(){var p=$('#ai-p').value.trim().toLowerCase().replace(/^@/,'');if(!p)return;
   mut(function(){return rpc('set_ai_tester',{p_pseudo:p,p_on:$('#ai-o').checked});},'t_saved');},
 setspk:function(){var p=$('#as-p').value.trim().toLowerCase().replace(/^@/,''),ctry=($('#as-c').value||'').trim();if(!p||!ctry)return;
   mut(function(){return rpc('set_spokesperson',{p_pseudo:p,p_country:ctry,p_on:$('#as-o').checked});},'t_saved');}
};
document.addEventListener('submit',function(e){e.preventDefault();var f=e.target,fn=FORMS[f.getAttribute('data-form')];if(fn)fn(f);});
document.addEventListener('change',function(e){if(e.target.id==='noted'){var b=$('#enter');if(b)b.disabled=!e.target.checked;}});

/* ============ Démarrage ============ */
function hashInfo(){if(/^#\/preinscription\/?$/.test(location.hash||''))return {k:'pre',v:''};if(/^#\/q\/?$/.test(location.hash||''))return {k:'q',v:''};var m=(location.hash||'').match(/^#\/(i|p|a)\/([^\/?#]+)/);return m?{k:m[1],v:decodeURIComponent(m[2])}:null;}
function clearHash(){try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}}
function goHome(){
  S.stack=[];var h=S.deep;S.deep=null;
  S.route=(h&&h.k==='p'&&projOf(h.v))?{name:'project',params:{id:h.v}}:{name:'home',params:{}};
  if(h&&h.k==='q'){S.stack=[{name:'home',params:{}}];S.route={name:'feedback',params:{}};}
  render(true);
}
function startOnboarding(code){
  S.auth.err='';var cl=client();
  return cl.auth.getSession().then(function(r){
    if(r.data.session)return;
    return cl.auth.signInAnonymously().then(function(x){if(x.error)throw x.error;});
  }).then(function(){return rpc('peek_invite',{p_code:code});}).then(function(pk){
    if(!pk){S.auth={code:null,peek:null,err:t('e_invite')};S.route={name:'inv0',params:{}};}
    else{S.auth={code:code,peek:pk,err:''};S.route={name:pk.kind==='recovery'?'invRec':'inv1',params:{}};}
    render(true);
  }).catch(function(e){S.auth={code:null,peek:null,err:errMsg(e)};S.route={name:'inv0',params:{}};render(true);});
}
function inviteWhileRegistered(code){
  return rpc('peek_invite',{p_code:code}).then(function(pk){
    if(!pk)throw new Error('invalid_invite');
    if(pk.kind==='join'&&pk.canal){return rpc('redeem_invite',{p_code:code}).then(refresh).then(function(){clearHash();goHome();S.route={name:'canal',params:{id:pk.canal}};render(true);toast(t('joined',{x:c({fr:pk.canal_fr,ar:pk.canal_ar})}));});}
    clearHash();goHome();toast(t('e_already'));
  }).catch(function(e){clearHash();goHome();toast(errMsg(e));});
}
function boot(){
  render(true);
  if(!client()){S.fatal=t('cfg_missing');render(true);return;}
  var h=hashInfo();
  client().auth.getSession().then(function(r){return r.data.session?refresh():false;}).then(function(ok){
    if(ok){if(h&&h.k==='i')return inviteWhileRegistered(h.v);S.deep=(h&&(h.k==='p'||h.k==='q'))?h:null;goHome();return;}
    if(h&&h.k==='i')return startOnboarding(h.v);
    S.route={name:(h&&h.k==='pre')?'prereg':'inv0',params:{}};render(true);
  }).catch(function(e){S.fatal=errMsg(e);render(true);});
  window.addEventListener('hashchange',function(){if(/^#\/i\//.test(location.hash))location.reload();else if(/^#\/q\/?$/.test(location.hash)&&hasAccount()&&S.route.name!=='feedback'){S.stack=[{name:'home',params:{}}];S.route={name:'feedback',params:{}};render(true);}});
  setInterval(function(){
    if(document.hidden||!hasAccount()||S.busy)return;
    var a=document.activeElement;if(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName))return;if(!$('#sheets').hidden)return;
    refresh().then(function(){render();}).catch(function(){});
  },60000);
}


boot();
})();
