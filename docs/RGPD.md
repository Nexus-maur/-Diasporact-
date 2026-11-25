# Protection des données personnelles (RGPD) — Diasporact

Document de référence sur la façon dont Diasporact traite les données de ses
membres, et sur ce qui a été mis en place pour respecter le RGPD. Mis à jour
le 23/11/2026, à la suite d'un audit de sécurité complet (voir le récapitulatif
des correctifs en fin de document).

## 1. Qui fait quoi

Diasporact est opéré par Nexus Mauritanie, qui est **responsable de
traitement** au sens du RGPD. L'hébergement technique est sous-traité à :
- **Supabase** (base de données, authentification) — région **eu-west-1**
  (Irlande, Union européenne).
- **Vercel** (hébergement du site statique, CDN) — société américaine ;
  utilisée ici uniquement pour servir des fichiers statiques (HTML/CSS/JS),
  aucune donnée personnelle de membre n'y transite ni n'y est stockée — le
  site appelle directement l'API Supabase depuis le navigateur du membre.
- **GitHub** (code source du projet, et sauvegardes quotidiennes de la base
  de données sur une branche privée `backup-data`) — société américaine.

- **Anthropic** (API Claude, société américaine) — **uniquement pour les
  fonctions d'IA de la phase test** (voir section 10). Le texte envoyé n'est
  pas conservé par Diasporact.

Le RGPD impose une vigilance particulière sur les transferts hors UE : voir
section 7.

## 2. Données collectées

Diasporact applique un principe de **minimisation volontaire** depuis sa
conception : pas d'email, pas de numéro de téléphone. Le nom complet (nom et
prénom) a été ajouté le 25/11/2026 comme donnée **facultative** : un membre
qui ne le renseigne pas reste identifié uniquement par son pseudo, comme
avant.

| Donnée | Obligatoire | Usage |
|---|---|---|
| Pseudo | Oui | Identification au sein de l'app |
| Nom et prénom | Non (facultatif) | Affichés publiquement à la place du pseudo seul si renseignés (le pseudo reste visible, en plus petit, pour les liens @pseudo) |
| Mot de passe (haché par Supabase Auth) | Oui | Connexion multi-appareils |
| Pays de résidence | Non (facultatif) | Affiché aux autres membres si renseigné ; sert aussi à déterminer qui reçoit les annonces d'un porte-parole de ce pays |
| Compétences (si activé "matching") | Non | Mise en relation entraide/projets |
| Contenus créés (projets, tâches, commentaires, annonces, demandes d'entraide) | — | Fonctionnement du service |
| Code de récupération de compte (haché) | Oui | Récupération d'accès en cas de mot de passe perdu |

Aucune donnée de géolocalisation précise, aucune donnée bancaire, aucune
pièce d'identité n'est collectée. L'inscription se fait uniquement sur
invitation (lien envoyé via WhatsApp par un membre existant), il n'y a pas
d'inscription ouverte au public.

## 3. Base légale

Le traitement repose sur :
- **L'exécution d'un contrat / la fourniture d'un service demandé par la
  personne** (art. 6.1.b RGPD) pour les données strictement nécessaires au
  fonctionnement du compte (pseudo, mot de passe, contenus créés).
- **Le consentement** (art. 6.1.a) pour les données facultatives : pays de
  résidence, compétences et activation du "matching". Ces champs sont
  éditables et supprimables à tout moment par le membre lui-même depuis son
  profil.

Il n'y a pas de profilage automatisé ni de décision individuelle
automatisée au sens de l'art. 22 RGPD : le "matching" affiche une liste à
des membres humains, qui décident eux-mêmes de contacter ou non quelqu'un.

## 4. Durée de conservation

- **Compte actif** : les données sont conservées tant que le compte existe.
- **Suppression de compte** : un membre peut supprimer définitivement son
  compte à tout moment depuis l'écran "Mon profil" (fonction
  `delete_my_account()`). Cela supprime son profil et anonymise/retire ses
  contenus personnels selon la logique de la fonction en base.
- **Sauvegardes** : la sauvegarde quotidienne automatique (branche GitHub
  privée `backup-data`) ne conserve que les **30 derniers jours** : le workflow
  `.github/workflows/backup.yml` supprime l'historique plus ancien à chaque
  exécution (le plus ancien des 30 commits devient la nouvelle racine). Un
  compte supprimé peut donc subsister dans les sauvegardes 30 jours au plus.
  Mis en place le 25/11/2026 ; à vérifier au prochain passage du workflow
  (GitHub peut garder un temps les objets devenus inaccessibles).
- **Comptes inactifs** : aucune purge automatique pour inactivité prolongée
  n'est en place actuellement. À envisager (ex. email ou notification après
  12-24 mois d'inactivité avant suppression), mais difficile tant qu'aucun
  email n'est collecté — à trancher avec Élie.

## 5. Droits des personnes

| Droit | Mise en œuvre |
|---|---|
| Droit d'accès | Le membre voit déjà ses données dans l'app ; en plus, le bouton d'export (ci-dessous) donne une vue exhaustive et structurée. |
| Droit à la portabilité | Fonction `export_my_data()` (RPC Supabase), exposée dans l'app via le bouton **"Télécharger mes données"** (écran Mon profil → section "Confidentialité et mes données"). Génère un fichier JSON téléchargeable contenant : profil, canaux, projets créés, tâches assignées, commentaires, suivis, propositions envoyées/reçues, demandes et prises en charge d'entraide, annonces publiées/lues, demandes et octrois de badges, notifications. Mis en production le 23/11/2026. |
| Droit à l'effacement | Fonction `delete_my_account()` (préexistante), exposée via le bouton **"Supprimer mon compte"** sur le même écran. |
| Droit de rectification | Le membre peut modifier pseudo, nom, prénom, pays, compétences et mot de passe directement dans l'app. |
| Droit d'opposition / retrait du consentement | Un membre peut désactiver le "matching", vider le champ pays, ou effacer son nom et prénom (retour à l'affichage par pseudo seul) à tout moment ; cela arrête l'usage correspondant immédiatement. |
| Droit à la limitation | Pas d'implémentation technique dédiée à ce jour (cas d'usage rare vu le périmètre de l'app) ; une demande serait traitée manuellement par le responsable de traitement. |

Toute demande qui ne pourrait pas être traitée directement dans l'app peut
être adressée à **board.kalidia@gmail.com**.

## 6. Mesures de sécurité en place

**Rôle porte-parole (25/11/2026)** : un porte-parole peut diffuser une
annonce à toute la diaspora d'un pays (et non plus seulement à son canal).
La visibilité est contrôlée côté base (RLS) : un membre ne voit une telle
annonce que si son propre champ "pays de résidence" correspond (comparaison
insensible à la casse et aux espaces) à celui ciblé par l'annonce ; aucune
nouvelle donnée personnelle n'est collectée pour cela, le rôle s'appuie sur
le pays déjà déclaré par chaque membre. Seul un administrateur peut désigner
un porte-parole (table `spokespersons`, plusieurs porte-paroles possibles
par pays). Limite connue : la correspondance de pays repose sur une
comparaison textuelle simple (pas de normalisation des accents) — un pays
saisi avec une orthographe très différente de la liste de suggestions
pourrait ne pas être rattaché correctement ; à surveiller si ce cas se
présente en usage réel.

Audit de sécurité réalisé le 23/11/2026, avec les correctifs suivants :

- **Faille corrigée — fuite de données via des vues publiques** : les vues
  `public_profiles`, `skills_directory`, `canal_stats`, `canal_mods`,
  `ann_read_counts`, ainsi que la lecture de la table `canals`, étaient
  accessibles à n'importe quelle session Supabase authentifiée de façon
  anonyme (`auth.signInAnonymously()`, ne nécessitant aucune invitation),
  exposant pseudo, pays, statut admin et compétences de tous les membres
  sans qu'aucune invitation n'ait été utilisée. **Corrigé** : ces vues et
  cette policy filtrent désormais explicitement sur l'appartenance à un
  profil enregistré (`me() is not null`). Vérifié par des tests automatisés
  (voir `supabase/tests/rls_test.sh`, cas R92-R98).
- **Row Level Security (RLS)** activé et testé (106 tests automatisés
  passants) sur l'ensemble des tables sensibles : seules les lignes
  concernant l'utilisateur connecté, ou autorisées par son rôle
  (modérateur, admin), sont accessibles.
- **En-têtes de sécurité HTTP** ajoutés sur toutes les réponses du site
  (`vercel.json`) : `Content-Security-Policy` stricte (scripts limités à
  `'self'`, après extraction de tout le JavaScript inline dans un fichier
  séparé `app.js`), `Strict-Transport-Security` (HSTS, 2 ans,
  sous-domaines inclus, preload), `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY`, `Referrer-Policy:
  strict-origin-when-cross-origin`, `Permissions-Policy` désactivant
  caméra/micro/géolocalisation/paiement/USB.
- **Secrets d'authentification** : mots de passe et codes de récupération
  hachés par Supabase Auth (bcrypt), jamais stockés ni transmis en clair.
- **Transport chiffré** : HTTPS forcé partout (Vercel + Supabase), HSTS
  activé pour empêcher tout downgrade HTTP.
- **Protection du dépôt de sauvegardes** : la branche `backup-data`
  (contenant des dumps JSON complets de la base) est sur un dépôt GitHub
  **privé**, et les déploiements Vercel associés sont protégés par "Vercel
  Authentication" (connexion + appartenance à l'équipe requises) — vérifié
  que ces dumps ne sont pas exposés publiquement par un déploiement preview.
- **Secrets d'infrastructure** (`CRON_SECRET`, clé Supabase, etc.) stockés
  en variables d'environnement Vercel, jamais commités dans le dépôt.
- **Canal de signalement responsable** : adresse publique
  **board.kalidia@gmail.com** indiquée dans le `README.md` pour tout
  signalement de faille, avant toute divulgation publique.
- **Process pour les futures fonctionnalités** : une checklist dédiée a été
  rédigée pour qu'aucune nouvelle table/vue/fonction ne reproduise ce type
  de faille — voir [docs/SECURITE.md](SECURITE.md).

Mesures encore à la main d'Élie (ne peuvent pas être faites à sa place) :
- Activer la double authentification (2FA) sur les comptes Supabase,
  Vercel et GitHub de l'organisation.
- Définir lui-même un mot de passe fort pour le compte administrateur
  `nexus` (je ne dois pas le choisir à sa place).
- Décider d'un éventuel passage de Supabase au plan payant (Pro), qui
  apporterait notamment des sauvegardes automatiques avec point de
  restauration (PITR), utile en cas d'incident grave.

## 7. Transferts internationaux

- **Supabase (base de données, authentification)** : hébergé dans la
  région **eu-west-1 (Irlande, UE)**. Les données des membres restent donc
  dans l'Union européenne pour leur traitement principal — c'est le point
  le plus sensible du RGPD et il est aujourd'hui conforme sans mesure
  supplémentaire nécessaire.
- **GitHub (sauvegardes quotidiennes)** : GitHub est une société
  américaine. Les sauvegardes quotidiennes de la base (dumps JSON
  contenant des données personnelles) sont stockées sur une branche privée
  de ce dépôt. Cela constitue un transfert de données hors UE. GitHub
  adhère au cadre **EU-U.S. Data Privacy Framework**, ce qui constitue une
  base légale reconnue pour ce transfert, mais cela mérite d'être
  mentionné explicitement dans la politique de confidentialité destinée
  aux membres, et réévalué si ce cadre venait à changer (comme ce fut le
  cas par le passé avec le Privacy Shield).
- **Vercel (hébergement statique)** : société américaine, mais ne reçoit
  et ne stocke aucune donnée personnelle de membre (sert uniquement des
  fichiers HTML/CSS/JS publics ; toutes les données transitent directement
  entre le navigateur du membre et Supabase). Le risque RGPD lié à Vercel
  est donc minimal.

**Recommandation** : mentionner ces deux sous-traitants (Supabase, GitHub)
et leur rôle respectif dans une politique de confidentialité accessible
publiquement (actuellement, un résumé est affiché dans l'app via l'écran
"Confidentialité", mais un document autonome et plus complet serait plus
robuste juridiquement — à rédiger avec Élie si le projet grandit, car cela
touche à des choix qu'il doit valider lui-même, par exemple en cas de
changement de sous-traitant).

## 8. Registre de traitement (simplifié)

| Traitement | Finalité | Données | Base légale | Durée | Destinataires |
|---|---|---|---|---|---|
| Gestion de compte | Authentification, accès au service | Pseudo, mot de passe haché, code de récupération haché | Exécution du service | Durée du compte | Supabase (UE) |
| Profil public (dans l'app) | Permettre aux membres invités de se reconnaître | Pseudo, pays (facultatif) | Exécution du service / consentement (pays) | Durée du compte | Autres membres de canaux communs |
| Mise en relation ("matching") | Faciliter l'entraide entre membres | Compétences (facultatif) | Consentement | Jusqu'à désactivation | Autres membres ayant activé le matching |
| Projets / tâches / commentaires | Coordination d'actions collectives | Contenus textuels créés par le membre | Exécution du service | Durée du compte (ou archivage du projet) | Membres du canal concerné |
| Entraide | Demandes et prises en charge d'entraide | Contenu de la demande, domaine, pays, statut | Exécution du service | Durée du compte | Membres du canal concerné |
| Annonces officielles | Diffusion d'informations validées | Contenu de l'annonce, lecture par membre | Exécution du service | Durée de validité + historique | Membres du canal concerné |
| Sauvegarde | Continuité de service, reprise après incident | Dump complet de la base (toutes les catégories ci-dessus) | Intérêt légitime (continuité du service) | Non défini à ce jour (à corriger, voir section 9) | GitHub (US, branche privée) |

## 9. Procédure de notification de violation de données

En cas de violation de données personnelles (accès non autorisé, fuite,
perte) :

1. **Containment immédiat** : corriger la faille en production dès que
   possible (révoquer un accès, corriger une policy RLS, faire tourner un
   secret compromis).
2. **Qualification** : déterminer quelles catégories de données ont pu
   être exposées, pour combien de membres, et sur quelle période (en
   s'appuyant sur les logs Vercel/Supabase disponibles).
3. **Évaluation du risque** : au vu des données collectées par Diasporact
   (pas d'email, pas de données bancaires), le risque pour les personnes
   est généralement limité, mais chaque incident doit être évalué au cas
   par cas (ex. une fuite de pays de résidence + pseudo peut avoir un
   impact réel pour des personnes dans des contextes sensibles). Depuis le
   25/11/2026, le nom et le prénom sont un champ facultatif que le membre
   choisit lui-même de rendre public (comme le pseudo) ; une fuite touchant
   un membre ayant renseigné son nom réel associé à son pays de résidence
   mérite une vigilance accrue par rapport à un pseudo seul, dans les mêmes
   contextes sensibles.
4. **Notification à l'autorité de contrôle compétente** (en France, la
   CNIL) **sous 72 heures** à compter de la connaissance de la violation,
   si elle est susceptible d'engendrer un risque pour les droits et
   libertés des personnes concernées — sauf si le risque est jugé nul
   après analyse documentée.
5. **Notification aux personnes concernées** si le risque est élevé,
   via le canal disponible (annonce officielle dans l'app, ou message aux
   relais de canaux à diffuser sur WhatsApp, en l'absence d'email
   collecté).
6. **Documentation** : consigner l'incident (nature, période d'exposition,
   données concernées, mesures prises, décision de notifier ou non) —
   obligation du RGPD même quand la notification à la CNIL n'est pas
   nécessaire.
7. **Correctif de fond** : ajouter un test de non-régression (voir
   [docs/SECURITE.md](SECURITE.md)) pour que la même faille ne puisse pas
   se reproduire silencieusement.

Le signalement initial d'une faille (par un tiers ou un membre) se fait à
**board.kalidia@gmail.com**.

## 10. Fonctions d'IA (phase test, 25/11/2026)

- **Fonctions** : traduction français/arabe d'une annonce, d'un projet ou
  d'une demande d'entraide ; proposition de fiche projet (titre, objectif,
  besoins) à partir d'une discussion collée par le membre.
- **Accès** : réservé aux « testeurs IA » désignés par l'administrateur
  (table `ai_testers`, RPC `set_ai_tester`), limité à 20 utilisations par jour
  et par testeur (table `ai_usage`, RPC `ai_consume`). Le contrôle se fait côté
  serveur : la fonction `api/ai.js` appelle `ai_consume()` avec la session du
  membre avant de contacter le service d'IA.
- **Données** : le seul texte envoyé est celui que le testeur choisit de
  traduire ou de coller. Il est transmis à Anthropic (États-Unis) pour obtenir
  le résultat ; Diasporact ne conserve ni le texte ni la réponse. Une
  information est affichée avant le premier usage (message de consentement,
  une fois par appareil) et un rappel invite à ne coller que des discussions
  dont les participants acceptent le partage.
- **Base légale** : le consentement du testeur, qui déclenche lui-même chaque
  envoi après information.
- **Sécurité** : la clé du service d'IA n'existe que dans les variables
  d'environnement Vercel (`ANTHROPIC_API_KEY`) ; le texte du membre est donné
  à l'IA comme donnée à traiter, avec consigne de ne suivre aucune instruction
  qu'il contient ; le résultat s'affiche comme du texte (jamais comme du HTML)
  et rien n'est publié sans validation du membre.
- **À valider par Élie avant d'ouvrir à plus de testeurs** : les conditions
  d'utilisation de l'API d'Anthropic (conservation, usage des données), une
  clause de sous-traitance si nécessaire, et un plafond de dépense sur la clé.

## 11. Ce qui reste à faire (suivi)

- [x] Rotation des sauvegardes sur 30 jours (workflow `backup.yml`,
      25/11/2026) — à confirmer au prochain passage du workflow.
- [x] Politique de confidentialité publique : page `confidentialite.html`
      (FR/AR, 25/11/2026), liée depuis l'écran « Moi » et l'inscription.
      À faire relire par Élie ; à tenir à jour en cas de changement de
      sous-traitant ou de donnée collectée.
- [ ] Valider les conditions de l'API d'Anthropic (section 10) et poser un plafond de dépense sur la clé avant d'ouvrir l'IA à plus de testeurs.
- [ ] Envisager d'héberger soi-même les polices (Google Fonts reçoit l'adresse
      IP des visiteurs ; mentionné dans la politique en attendant).
- [ ] Ajouter à la politique les mentions légales de Nexus Mauritanie
      (adresse, immatriculation) si Élie le souhaite.
- [ ] Décider d'une politique de purge des comptes inactifs, une fois
      qu'un canal de contact (autre que WhatsApp via un relais) sera
      disponible si besoin.
- [ ] Activer la 2FA sur les comptes Supabase / Vercel / GitHub de
      l'organisation (action d'Élie).
- [ ] Décider d'un éventuel passage Supabase au plan Pro pour disposer de
      sauvegardes gérées avec point de restauration (action d'Élie).


## Questionnaire de retours des testeurs
- Table `feedback` (réponses en JSON, langue, date) ; un membre insère et lit
  ses propres réponses, l'administrateur lit toutes les réponses ; aucune
  modification ni suppression par les membres. Suppression en cascade avec le
  compte ; incluse dans l'export (`questionnaire_retours`) et la sauvegarde.
- Facultatif, aucune donnée sensible demandée ; texte libre limité à 1 000
  caractères par champ ; usage : amélioration de l'application en phase test.
