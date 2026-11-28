# AfriKafo

Application web mobile (PWA) de la diaspora mauritanienne : canaux modérés, projets et suivi, entraide, annonces officielles, recherche de compétences. WhatsApp reste le lieu de la discussion libre ; ici, uniquement des actions structurées.

**Version 1 (réelle)** : site statique (Vercel) + base Supabase, entrée par lien d’invitation envoyé sur WhatsApp. Chaque membre choisit un mot de passe pour se connecter depuis plusieurs appareils ; aucun email n'est collecté.

- Mise en place : [docs/MISE_EN_PLACE.md](docs/MISE_EN_PLACE.md)
- Cahier de recette : [docs/RECETTE.md](docs/RECETTE.md)
- Base de données et règles de sécurité : `supabase/schema.sql`, tests `supabase/tests/`
- Protection des données (RGPD) : [docs/RGPD.md](docs/RGPD.md)
- Tests de l’interface : `npm install && npm run test:ui`

## Signaler une faille de sécurité

Si vous découvrez une vulnérabilité, merci de la signaler de façon responsable plutôt que de la rendre publique : **board.kalidia@gmail.com**. Nous répondons et corrigeons avant toute divulgation.
