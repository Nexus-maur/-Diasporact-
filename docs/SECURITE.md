# Sécurité — process pour toute nouvelle fonctionnalité

Ce document est la checklist à suivre à chaque ajout de table, vue, fonction
RPC ou colonne touchant les données des membres. La faille trouvée le
23/11/2026 (vues `public_profiles` et consorts lisibles par une session
anonyme sans invitation) venait d'un oubli de cette checklist — elle existe
pour que ça ne se reproduise pas.

## À chaque nouvelle table

- [ ] RLS activé (`alter table ... enable row level security`). Par défaut,
      sans policy, une table avec RLS activé est invisible de tous sauf
      `service_role` — c'est l'état sûr. L'oubli d'`enable row level security`
      est pire que l'oubli d'une policy : il expose la table à qui a un
      `grant` dessus, sans aucun filtre par ligne.
- [ ] Policies explicites pour `select`, `insert`, `update`, `delete` —
      ne jamais compter sur l'absence de policy pour bloquer : être explicite.
- [ ] `grant` posé sur la table (`grant select on ... to authenticated`)
      seulement pour ce qui doit l'être. Un `grant` sans policy correspondante
      ne sert à rien mais un oubli de `grant` fait échouer silencieusement
      toutes les requêtes — tester les deux sens.

## À chaque nouvelle vue avec `security_invoker = false`

C'est le point qui a causé la faille. Une vue `security_invoker = false`
tourne avec les privilèges du propriétaire et **contourne le RLS** des
tables qu'elle lit. Elle doit donc filtrer elle-même qui peut voir quoi :

- [ ] La vue filtre explicitement sur `me() is not null` (ou une condition
      équivalente) si elle ne doit être lue que par des membres déjà
      enregistrés — jamais `where true` ni l'absence de clause.
- [ ] Vérifier que le filtre fonctionne pour une session authentifiée
      **mais sans profil** (`auth.signInAnonymously()` ne demande aucune
      invitation et donne immédiatement une session « authenticated »).
      C'est le cas de test qui aurait attrapé la faille plus tôt.

## À chaque nouvelle fonction RPC

- [ ] `security definer` seulement si nécessaire (la fonction doit agir
      avec plus de droits que l'appelant) ; sinon `security invoker`.
- [ ] Vérifier `auth.uid()` / `me()` en tout début de fonction et lever une
      exception si `null`, sauf si la fonction est volontairement ouverte
      à tous (`ping()`).
- [ ] Vérifier les droits métier (`is_mod()`, `is_admin()`, propriétaire...)
      avant toute modification, jamais après.
- [ ] `grant execute` posé explicitement sur la fonction, au bon rôle.
- [ ] Pas de SQL dynamique construit par concaténation de texte utilisateur
      (`execute 'select ... ' || p_input`) — toujours des paramètres typés.

## Avant de pousser en production

- [ ] Test RLS ajouté dans `supabase/tests/rls_test.sh` pour le nouveau
      comportement, y compris le cas négatif (qui ne doit PAS pouvoir faire
      quoi) — la suite doit rester à 100 % de réussite.
- [ ] Recette live avec un compte non-membre / anonyme sans invitation pour
      toute nouvelle donnée affichée publiquement ou presque.
- [ ] Si la fonctionnalité touche des données personnelles : vérifier
      qu'elle reste cohérente avec [docs/RGPD.md](RGPD.md) (minimisation,
      pas de nouvel usage sans base légale, export/suppression toujours
      complets).

## Après un incident

- [ ] Corriger en production dès que possible.
- [ ] Ajouter le ou les tests de non-régression correspondants.
- [ ] Noter l'incident (nature, période d'exposition, données concernées,
      correctif) — nécessaire pour l'obligation RGPD de notification sous
      72h en cas de violation de données, voir [docs/RGPD.md](RGPD.md).
