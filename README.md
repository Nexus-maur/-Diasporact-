# Diasporact

Application web mobile (PWA) de la diaspora mauritanienne : canaux modérés, projets et suivi, entraide, annonces officielles, recherche de compétences. WhatsApp reste le lieu de la discussion libre ; ici, uniquement des actions structurées.

**Version 1 (réelle)** : site statique (Vercel) + base Supabase, entrée par lien d’invitation envoyé sur WhatsApp, sans email ni mot de passe.

- Mise en place : [docs/MISE_EN_PLACE.md](docs/MISE_EN_PLACE.md)
- Cahier de recette : [docs/RECETTE.md](docs/RECETTE.md)
- Base de données et règles de sécurité : `supabase/schema.sql`, tests `supabase/tests/`
- Tests de l’interface : `npm install && npm run test:ui`
