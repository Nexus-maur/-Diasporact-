# Mise en place de Diasporact V1 (Supabase + Vercel + GitHub)

Durée : environ 45 minutes. Tout se fait depuis un ordinateur.

## 1. Supabase (base de données)
1. Créer un compte sur supabase.com, puis **New project** (région proche des membres, par exemple Paris / eu-west). Noter le mot de passe de la base dans votre gestionnaire de mots de passe.
2. **Authentication > Sign In / Providers** : activer **Allow anonymous sign-ins**, et vérifier que le fournisseur **Email** est activé avec **Confirm email désactivé** (les membres ne saisissent jamais d’e-mail : l’application utilise `pseudo@membre.diasporact.app` en interne pour la connexion par mot de passe).
3. **SQL Editor > New query** : coller le contenu de `supabase/schema.sql`, puis **Run**. Aucune erreur ne doit apparaître.
4. Toujours dans le SQL Editor, exécuter cette ligne (remplacez le code par un secret de votre choix, long et aléatoire) :
   `insert into invites(code, kind, max_uses) values ('VOTRE-CODE-SECRET', 'admin', 1);`
5. **Project Settings > API** : relever **Project URL** et la clé **anon public**. Relever aussi la clé **service_role** (secrète : elle ne va jamais dans le code).

## 2. Configuration du site
Modifier `config.js` dans le dépôt GitHub : renseigner `url` et `anonKey` (valeurs publiques, sans danger : la sécurité repose sur les règles de la base).

## 3. Vercel (hébergement)
1. Créer un compte sur vercel.com, **Add New > Project**, importer le dépôt GitHub. Framework : **Other**. Aucune commande de build. **Deploy**.
2. **Settings > Environment Variables** : ajouter `SUPABASE_URL`, `SUPABASE_ANON_KEY` (mêmes valeurs publiques), et `CRON_SECRET` (un secret aléatoire). Redéployer.
3. Contrôle : `https://afrikafo.app/api/keepalive` doit répondre 401 sans secret. Le cron quotidien interroge la base pour éviter la mise en pause du plan gratuit.

## 4. Premier administrateur
Ouvrir `https://afrikafo.app/#/i/VOTRE-CODE-SECRET`, choisir un pseudo : ce compte est administrateur (le code ne marche qu’une fois). Ensuite, depuis **Profil > Administration**, nommer les modérateurs de canaux ; chaque modérateur génère ensuite les liens d’invitation de son canal et les diffuse dans WhatsApp.

## 5. Sauvegarde nocturne (dépôt GitHub privé)
Dans le dépôt GitHub : **Settings > Secrets and variables > Actions** : ajouter `SUPABASE_URL` et `SUPABASE_SERVICE_KEY` (clé service_role). **Actions > Sauvegarde des données > Run workflow** pour un premier essai : la branche `backup-data` apparaît avec un fichier JSON par table. Le dépôt doit rester **privé** (il contient des données de membres dans cette branche).

## 6. Restauration (en cas de perte)
1. Nouveau projet Supabase : exécuter `schema.sql` (étapes 1 à 3), mettre à jour `config.js` et les variables Vercel.
2. Récupérer la branche `backup-data` (dossier `dump`), puis :
   `SUPABASE_URL=… SUPABASE_SERVICE_KEY=… node scripts/restore.mjs dump`
3. Dans un **nouveau** projet, les comptes d’appareils n’existent plus : chaque membre se reconnecte avec un lien de reconnexion fourni par un modérateur (Canal > Modération). Si les données sont perdues dans le **même** projet, ajouter `--keep-auth`.
Contrôle : exécuter ce scénario une fois avant l’ouverture (cas INS-10 de la recette).

## Tests automatiques
- Règles de sécurité : `DB="psql … -q -t -A" bash supabase/tests/rls_test.sh` (74 tests, base PostgreSQL de test).
- Interface : `npm install && npm run test:ui` (50 tests, base simulée).


## Adresse de production

Le site est publié sur **https://afrikafo.app** (domaine IONOS rattaché au projet Vercel `-diasporact-v.alpha`). Enregistrement DNS requis chez IONOS : `A` `@` → `216.198.79.1`. Les liens d'invitation sont construits à partir de l'adresse ouverte : ouvrez l'application depuis afrikafo.app pour générer des liens à cette adresse. L'adresse technique `@membre.diasporact.app` (identifiant de connexion interne, aucune boîte mail) ne doit **pas** être modifiée : elle lie les comptes existants.
