# Recette AfriKafo — résultats du 28/11/2026

Cible : https://afrikafo.app (production, Supabase dygvyrxatgwazdfvwoaz).

## 1. Tests automatisés
| Suite | Résultat |
|---|---|
| `npm test` (API IA 15 + smoke jsdom) | 15 + 154 OK |
| Tests RLS/SQL (`supabase/tests/rls_test.sh`, PG16) | 204 OK |
| Responsive Playwright (320 / 375 / 414 / 768 / 1024 / 1440 px, clair/sombre, FR/AR) | aucun débordement, aucune erreur JS |

## 2. URL / nom
- Domaine afrikafo.app actif (Vercel + DNS IONOS + Site URL Supabase).
- Aucune URL en dur dans le code : liens générés via `location.origin` (invitations, pré-inscriptions).
- Canonical / og:url = https://afrikafo.app/ ; manifest, titre, logo « AfriKafo 2.255 » servis en prod.
- Volontairement inchangé : domaine technique des pseudo-emails `@membre.diasporact.app` (ne s'affiche jamais).

## 3. Scénarios en production (≈40 contrôles)
Testeurs, création de canaux (limite 3 pour un modérateur non-admin), accès, gestion des membres (retirer / nommer modérateur, protections), projets, sécurité (cloisonnement, injections HTML), pré-inscription publique et rejet des contacts invalides : **tous OK**.
- Acceptation admin d'une pré-inscription (simulée côté base avec l'identité admin) : lien personnel valable 30 jours, usage unique, 2ᵉ appel idempotent : OK.
- Export RGPD `export_my_data` : 19 rubriques, aucun secret exposé : OK (le « KO » initial venait du script de test, pas de l'application).

## 4. Nettoyage
Toutes les données de test (comptes, canaux, projets, pré-inscriptions « zz ») supprimées ; invitation testeur remise à 0 utilisation. État final : 3 profils, 6 canaux.

## 5. Points d'attention avant invitation
- Dire aux testeurs d'utiliser les liens afrikafo.app (anciens liens Vercel : comptes liés à l'ancienne origine).
- Relire les textes AR/EN, tester sur vrais iPhone/Android.
- Tant que la phase test n'est pas terminée, les modérateurs testeurs peuvent créer des canaux / régénérer leur lien.
- Le manifest peut encore afficher `orientation: portrait` (cache du navigateur) : à revérifier.
