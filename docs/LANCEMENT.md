# Checklist de lancement — Diasporact

À cocher dans l'ordre. Les cases « Élie » sont des décisions ou des actions que seul le responsable peut faire ; les autres sont des vérifications techniques. Le détail de chaque test se trouve dans [RECETTE.md](RECETTE.md).

Dernière mise à jour : 25/11/2026.

## 1. Déjà fait

- [x] Base Supabase en production, règles d'accès (RLS) testées (106 tests) et faille des vues publiques corrigée (23/11).
- [x] Recette en direct sur le site réel pour ACC-02 à ACC-07, SEC-03, SEC-04, CAN-03 ([résultats](RECETTE_RESULTATS_2026-11-25.md)).
- [x] Connexion par pseudo + mot de passe, code de secours, drapeaux, export et suppression de compte.
- [x] Nom et prénom facultatifs ; porte-paroles par pays ; sélecteur de pays par drapeaux (25/11).
- [x] Politique de confidentialité publique FR/AR (`confidentialite.html`), liée depuis « Moi » et l'inscription.
- [x] Rotation des sauvegardes sur 30 jours et table `spokespersons` incluse dans l'export (code poussé, à confirmer au prochain passage du workflow).
- [x] Tests automatiques à jour (`npm test` : API IA 14/14, interface 85/85) et règles de sécurité de la base rejouées en local (132/132, `supabase/tests/mock.sql` + `rls_test.sh`).
- [x] Fonctions IA de test (traduction FR/AR, discussion → projet) réservées aux testeurs désignés, avec quota ; migration appliquée en production (25/11).

## 2. Décisions et actions d'Élie (avant toute ouverture)

- [x] **SAU-04** — Décision (25/11/2026) : plan gratuit Vercel conservé jusqu'à fin 2026, à réexaminer en janvier 2027 (vérifier alors que l'usage reste autorisé par les conditions du plan).
- [x] **SAU-03** — Décision (25/11/2026) : plan gratuit Supabase conservé jusqu'à fin 2026 ; la sauvegarde quotidienne GitHub (backup-data) fait office de filet, à réexaminer en janvier 2027.
- [x] Activer la **double authentification** sur les comptes Supabase, Vercel et GitHub de l'organisation.
- [x] Définir un mot de passe fort pour le compte administrateur `nexus`.
- [ ] Relire `confidentialite.html` ; ajouter, si souhaité, les mentions légales de Nexus Mauritanie (adresse, immatriculation).

## 2 bis. Activer les fonctions IA pour la phase test

- [ ] **Élie** — Créer une clé API Anthropic dédiée, avec un plafond de dépense mensuel, et l'ajouter dans Vercel (Settings > Environment Variables) sous le nom `ANTHROPIC_API_KEY`, puis redéployer. Sans cette clé, l'IA reste « indisponible » et l'application fonctionne normalement.
- [ ] **Élie** — Lire les conditions d'utilisation de l'API d'Anthropic (conservation et usage des données) et les valider ([RGPD.md](RGPD.md) §10).
- [ ] Moi > Administration > Testeur IA : désigner les testeurs (20 utilisations par jour chacun).
- [ ] Rejouer IA-04, IA-05, IA-07 et IA-08 avec la vraie clé.

## 3. Vérifications techniques

- [ ] **INS-06/07** — Le cron Vercel `/api/keepalive` s'est exécuté sans erreur au moins une fois (Vercel > Settings > Cron Jobs).
- [x] **INS-08** — Secrets GitHub `SUPABASE_URL` et `SUPABASE_SERVICE_KEY` présents ; lancer à la main le workflow « Sauvegarde des données ». Vérifier : table `spokespersons` dans l'export, 30 commits au plus sur `backup-data`.
- [ ] **INS-10** — Essai de restauration d'un export dans un projet Supabase vierge (moins d'une heure).
- [ ] **SEC-06** — Limite de création de comptes anonymes par IP active ; activer un CAPTCHA si nécessaire.
- [ ] Supprimer les 5 comptes de test `test-sec*` créés pendant la recette du 25/11.
- [ ] Rejouer `supabase/tests/rls_test.sh` (SEC-01) après les dernières migrations.

## 4. Tests sur appareils (au moins un Android, un iPhone, un ordinateur)

- [ ] **MOB-01/02** — Installation de l'application (Android et iPhone).
- [ ] **ACC-08, ACC-14 à ACC-21** — Session conservée plusieurs jours, inscription avec mot de passe, connexion sur un second appareil, mot de passe oublié par code de secours.
- [ ] **ROL-\*, CAN-\*, PRJ-\*, ENT-\*** — Parcours avec de vrais rôles : modérateur, référent entraide, porte-parole, admin.
- [ ] **PAR-03** — Un porte-parole publie pour son pays avec un vrai compte ; un membre du même pays reçoit l'annonce, un membre d'un autre pays non.
- [ ] **LNG-01** — Français / arabe (droite à gauche) sur tous les écrans, y compris les nouveaux.
- [ ] **SEC-05** — Un titre de projet contenant du code s'affiche comme du texte.
- [ ] **CONF-01** — La page de confidentialité s'ouvre depuis l'app, en FR et en AR, et l'application reste utilisable ensuite.

## 5. Pilote puis ouverture

- [ ] Pilote de 7 jours avec 20 testeurs actifs, sans incident bloquant (critère Go/No-Go n°5) ; suivre PERF-01.
- [ ] Revue des critères Go/No-Go de [RECETTE.md](RECETTE.md) : 100 % des cas bloquants réussis, 95 % des majeurs, aucun défaut de sécurité ouvert.
- [ ] Ouverture : partager les liens d'invitation dans les groupes WhatsApp.

## 6. Après l'ouverture (non bloquant)

- [ ] Héberger soi-même les polices (Google Fonts reçoit l'adresse IP des visiteurs).
- [ ] Normaliser les accents dans la correspondance de pays des porte-paroles (PAR-06).
- [ ] Politique de purge des comptes inactifs, une fois un canal de contact disponible.
