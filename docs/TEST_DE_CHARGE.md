# Test de charge maîtrisé — 23/11/2026

Test léger et contrôlé sur les endpoints publics de AfriKafo, pour
vérifier la tenue de l'API sous une charge raisonnable, sans viser un déni
de service destructeur. Réalisé depuis un navigateur réel (conditions
proches d'un utilisateur), en vagues de 8 à 10 requêtes simultanées
espacées de 400-500ms, pour un total de 50 requêtes par endpoint.

## Résultats

| Endpoint | Requêtes | Réussite | Latence p50 | Latence p95 |
|---|---|---|---|---|
| Page d'accueil (Vercel, CDN statique) | 50 | 50/50 (200) | 394 ms | 927 ms |
| `rpc/ping` (Supabase, endpoint public utilisé par le keepalive) | 50 | 50/50 (200) | 414 ms | 863 ms |
| `rest/v1/canals` avec la clé publique seule, sans session (rôle `anon`) | 50 | 0/50 — rejeté immédiatement | — | — |

Le dernier cas n'est **pas un échec de disponibilité** : il confirme que
le rôle Postgres `anon` (une requête qui ne présente même pas de session,
juste la clé publique) reçoit un refus de permission net et rapide
(`42501 permission denied for table canals`), car l'accès à `canals` n'est
accordé qu'au rôle `authenticated`, lui-même filtré par la policy RLS
`canals_read` corrigée le même jour (voir
[docs/RGPD.md](RGPD.md#6-mesures-de-sécurité-en-place)). C'est le
comportement attendu et sain.

Une vérification complémentaire a par ailleurs confirmé qu'une session
Supabase obtenue par inscription anonyme (`auth.signInAnonymously()`),
qui n'a donc pas de profil ni d'invitation, reçoit bien une réponse vide
(`[]`, HTTP 200) sur `canals`, `public_profiles` et `skills_directory` —
exactement le scénario de la faille corrigée ce jour-là. Ce point est déjà
couvert de façon automatisée et répétable par la suite de tests RLS
(`supabase/tests/rls_test.sh`, cas R92-R98, 106/106 tests passants), qui
reste la référence à faire tourner avant tout déploiement futur plutôt que
de la revérifier manuellement à chaque fois.

## Conclusion

- L'API Supabase et le site statique Vercel encaissent sans erreur une
  charge de 50 requêtes concurrentes par vague sur leurs endpoints publics,
  avec des temps de réponse de l'ordre de 0,4 à 1 seconde — cohérent avec
  un plan Supabase Free et un hébergement Vercel Hobby, qui n'ont pas de
  garantie de performance dédiée.
- Aucun comportement anormal observé (pas d'erreur 5xx, pas de fuite de
  données, pas de dégradation en cascade) sur le périmètre testé.
- Le volume testé reste volontairement modeste (quelques centaines de
  requêtes au total) : il valide la tenue de l'API à une charge d'usage
  normale, pas sa résistance à une attaque volumétrique de grande échelle
  (DDoS), ce qui est hors de portée des plans gratuits actuels et relève
  de la protection fournie en amont par les infrastructures Vercel et
  Supabase elles-mêmes plutôt que d'un correctif applicatif.
- **Point de vigilance pour la suite** : le plan Supabase Free a des quotas
  de requêtes/mois. Si l'usage réel grandit, surveiller ces quotas dans le
  tableau de bord Supabase (Project Settings → Usage) pour anticiper un
  éventuel passage au plan Pro.
