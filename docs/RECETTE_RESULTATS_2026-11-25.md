# Recette en direct sur le site réel — 25/11/2026

Passe de recette fonctionnelle exécutée directement contre l'environnement de
production (Supabase `dygvyrxatgwazdfvwoaz`, site Vercel
`https://diasporact-valpha-nexus-ma-uritanie.vercel.app/`), via des appels
REST/RPC réels (inscription anonyme Supabase + appels des mêmes fonctions
que l'application), sans toucher à la session du compte administrateur déjà
connecté dans le navigateur.

## Périmètre couvert dans cette passe

Choix délibéré : tout ce qui pouvait être vérifié de façon sûre et répétable
sans mot de passe et sans risquer la session admin existante. Les cas
nécessitant un mot de passe, plusieurs appareils ou plusieurs jours
d'observation sont explicitement laissés de côté (voir plus bas).

| ID | Résultat observé | Statut |
|---|---|---|
| ACC-02 | `redeem_invite` avec un code inexistant → erreur serveur `invalid_invite`, aucun compte créé. | **OK** |
| ACC-03 | `peek_invite` sur un code de canal valide → retourne bien l'aperçu du canal (nom fr/ar). | **OK** |
| ACC-04 | `redeem_invite` avec pseudo "Ab" (2 caractères) → erreur serveur `bad_pseudo`. Le format est donc bien vérifié côté serveur, pas seulement côté interface. | **OK** |
| ACC-05 | `redeem_invite` avec le pseudo déjà pris "nexus" → erreur serveur `pseudo_taken`. | **OK** |
| ACC-06 | 5 comptes de test créés via `redeem_invite` avec un pseudo libre → `ok:true`, adhésion au canal du lien confirmée (table `canal_members`). | **OK** |
| ACC-07 | Un même compte (même pseudo, même token) a utilisé un 2e lien d'un autre canal (`cul`) → adhésion ajoutée aux deux canaux, aucun second compte créé. | **OK** |
| SEC-03 | Appel REST avec la seule clé anon (sans aucune session) sur `canals` → refusé net (permission denied), confirmé sous charge le même jour que le correctif (voir `TEST_DE_CHARGE.md`). Avec une session anonyme Supabase sans invitation (créée mais n'ayant rejoint aucun canal) : `canals`, `public_profiles`, `skills_directory` renvoient tous `[]`, aucune fuite de données. | **OK** — *note : le texte original de SEC-03 ("aucune donnée renvoyée hors canaux et ping") décrivait un comportement antérieur au correctif RLS du jour de la faille ; le comportement actuel, plus strict (canaux lui-même non lisible sans session), est une amélioration et non une régression.* |
| SEC-04 | Avec un compte membre standard : lecture directe de `profiles?id=eq.<id-admin-nexus>` → `[]` (aucune donnée). Tentative de modification (`PATCH country`) du même profil → `[]` (0 ligne affectée, refusé). Lecture de son propre profil → fonctionne normalement. | **OK** |
| CAN-03 | Un compte n'ayant rejoint que le canal `edu` ne voit aucun projet d'un autre canal via `projects` (RLS `is_member(canal_id)`). *Limite : la base de production ne contenait aucun projet au moment du test, donc ce résultat confirme l'absence de fuite mais ne confirme pas positivement qu'un projet du bon canal, lui, s'affiche — à revérifier dès qu'un projet réel existera.* | **OK (partiel)** |

## Explicitement non couvert dans cette passe

- **ACC-08, ACC-09 à ACC-21** (sessions sur plusieurs jours, mots de passe,
  reconnexion multi-appareil, code de secours) : nécessitent soit plusieurs
  jours d'observation, soit la saisie d'un vrai mot de passe par un humain —
  hors du périmètre d'un script automatisé exécuté en une session.
- **SEC-01** (rejouer `rls_test.sh`) : déjà rejoué et documenté dans
  `TEST_DE_CHARGE.md` le 23/11 (106/106 tests passants sur les cas R92-R98
  liés à la faille corrigée) ; non rerejoué ligne à ligne dans cette passe.
- **SEC-05** (injection de code dans un titre de projet) : nécessite de
  créer un projet via l'interface et de vérifier visuellement l'échappement
  à l'écran — un appel REST brut ne teste pas le rendu DOM. À faire en
  manuel.
- **SEC-06, SEC-07, SEC-08, SEC-09, SEC-10** : vérifications d'infrastructure
  (limites Supabase, en-têtes HTTP, décisions RGPD déjà couvertes par
  `RGPD.md`, aléa des codes d'invitation) plutôt que des parcours
  fonctionnels — à faire en revue manuelle ponctuelle, pas en script.
- **ROL-\*, CAN-01/02/04 à 11, PRJ-\*, ENT-\*, BDG-\*, PRO-\*, LNG-\*, MOB-\*,
  SAU-\*, PERF-\*** : nécessitent soit l'interface (rôles, modération,
  bascule de langue, installation PWA), soit plusieurs appareils/jours, soit
  une décision de direction (SAU-03/04) — hors du périmètre REST de cette
  passe. Le pilote de 7 jours à 20 testeurs (critère de Go/No-Go n°5) reste
  la prochaine étape naturelle pour couvrir le reste.

## Comptes de test créés

5 comptes anonymes de test ont été créés pendant cette passe (pseudos
`test-sec*`), rattachés aux canaux `edu` et/ou `cul`. Ils peuvent être
supprimés avant l'ouverture au public si besoin (aucune donnée personnelle
réelle associée).
