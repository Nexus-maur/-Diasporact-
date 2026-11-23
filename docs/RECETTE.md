# Cahier de recette — Diasporact V1

Objectif : décider de la mise en production sur la base de preuves. Chaque cas est rejoué **sur l’environnement réel** (Supabase + Vercel), même quand il est déjà couvert par un test automatique.

- **Auto** : déjà couvert par les tests automatiques (`supabase/tests/rls_test.sh`, `tests/smoke6.js`) ; à rejouer à la main sur l’environnement réel.
- **Manuel** : à exécuter par une personne.
- **Priorité** : Bloquant (pas de mise en production s’il échoue) · Majeur · Mineur.

## Critères de décision (Go / No-Go)

1. 100 % des cas **Bloquants** réussis.
2. Au moins 95 % des cas **Majeurs** réussis ; les échecs restants ont une solution de contournement écrite.
3. Aucun défaut de sécurité ouvert (famille SEC).
4. Test sur au moins 3 appareils : un Android, un iPhone, un ordinateur.
5. Pilote de 7 jours avec 20 testeurs actifs sans incident bloquant.
6. Décisions SAU-03 (plan Supabase) et SAU-04 (conditions Vercel) écrites.

## Limites connues de la V1

- Pas d’IA : résumé de discussion, traduction, assistant d’entraide arrivent en V1.1.
- Notifications dans l’application uniquement (pas de notification push du téléphone).
- L’application charge toutes les données visibles à chaque ouverture : à surveiller au-delà de quelques centaines de projets (PERF-03).
- Les référents d’entraide ne sont pas spécialisés par domaine : un référent voit toutes les demandes.
- Un compte est rattaché à un appareil ; le changement d’appareil passe par un lien de reconnexion fourni par un modérateur.


## Installation

| ID | Scénario | Rôle | Étapes | Résultat attendu | Mode | Priorité | Statut |
|---|---|---|---|---|---|---|---|
| INS-01 | Base créée | Admin technique | Créer le projet Supabase, exécuter supabase/schema.sql (SQL Editor). | Aucune erreur ; 6 canaux présents dans la table canals. | Manuel | Bloquant | À faire |
| INS-02 | Connexions anonymes | Admin technique | Authentication > Providers : activer « Allow anonymous sign-ins ». | Option active ; un lien d’invitation crée bien un compte. | Manuel | Bloquant | À faire |
| INS-03 | Premier administrateur | Admin technique | Insérer le code admin (SQL), ouvrir #/i/CODE, choisir un pseudo. | Compte créé avec droits d’administration ; le même code refusé une 2e fois. | Manuel | Bloquant | À faire |
| INS-04 | Configuration du site | Admin technique | Renseigner config.js (URL + clé anon), déployer. | Aucun message « pas encore configurée » ; l’écran d’invitation s’affiche. | Manuel | Bloquant | À faire |
| INS-05 | Déploiement Vercel | Admin technique | Importer le dépôt GitHub dans Vercel, déployer. | Site accessible en HTTPS ; déploiement automatique à chaque modification du dépôt. | Manuel | Bloquant | À faire |
| INS-06 | Anti-pause (tâche quotidienne) | Admin technique | Ajouter SUPABASE_URL, SUPABASE_ANON_KEY, CRON_SECRET dans Vercel ; appeler /api/keepalive avec le secret. | Réponse 200 {"ok":true} ; sans secret : 401. | Manuel | Bloquant | À faire |
| INS-07 | Exécution du cron | Admin technique | Vercel > Settings > Cron Jobs : vérifier l’exécution quotidienne (J+1). | Exécution journalisée sans erreur. | Manuel | Majeur | À faire |
| INS-08 | Sauvegarde nocturne | Admin technique | Ajouter les secrets GitHub SUPABASE_URL et SUPABASE_SERVICE_KEY ; lancer le workflow « Sauvegarde des données » à la main. | Branche backup-data créée avec 17 fichiers JSON + _resume.json. | Manuel | Bloquant | À faire |
| INS-09 | Secrets et dépôt privé | Admin technique | Vérifier que le dépôt est privé et que la clé service_role n’apparaît ni dans le code ni dans config.js. | Aucune clé secrète dans le dépôt ; dépôt privé. | Manuel | Bloquant | À faire |
| INS-10 | Restauration | Admin technique | Recharger un export JSON dans un projet Supabase vierge (procédure docs/MISE_EN_PLACE.md). | Données retrouvées ; temps total < 1 h. | Manuel | Majeur | À faire |

## Comptes

| ID | Scénario | Rôle | Étapes | Résultat attendu | Mode | Priorité | Statut |
|---|---|---|---|---|---|---|---|
| ACC-01 | Ouverture sans lien | Visiteur | Ouvrir le site sans lien d’invitation. | Écran « fonctionne sur invitation » ; champ pour coller un lien. | Auto | Bloquant | À faire |
| ACC-02 | Lien invalide | Visiteur | Ouvrir #/i/nimporte-quoi. | Message « lien plus valable », aucune création de compte. | Auto | Bloquant | À faire |
| ACC-03 | Lien de canal valide | Visiteur | Ouvrir un lien d’invitation de canal. | Aperçu du canal et formulaire de pseudo. | Auto | Bloquant | À faire |
| ACC-04 | Pseudo invalide | Visiteur | Saisir « Ab », puis des espaces ou accents. | Bouton désactivé ; message sur le format (3 à 24 caractères). | Auto | Majeur | À faire |
| ACC-05 | Pseudo déjà pris | Visiteur | Saisir un pseudo existant. | Message + suggestions ; création impossible (aussi côté serveur). | Auto | Majeur | À faire |
| ACC-06 | Création du compte | Visiteur | Choisir un pseudo libre et valider. | Accueil affiché, adhésion au canal du lien, notification de bienvenue. | Auto | Bloquant | À faire |
| ACC-07 | Second canal par lien | Membre | Ouvrir le lien d’un autre canal. | Ajout au canal sans nouveau compte ; message de confirmation. | Auto | Majeur | À faire |
| ACC-08 | Session conservée | Membre | Fermer puis rouvrir l’application (plusieurs fois, sur 3 jours). | Reste connecté sans ressaisie. | Manuel | Bloquant | À faire |
| ACC-09 | Rotation du lien | Modérateur | Révoquer et recréer le lien ; tester l’ancien. | Ancien lien refusé ; nouveau lien fonctionnel. | Auto | Bloquant | À faire |
| ACC-10 | Reconnexion (nouvel appareil) | Modérateur + membre | Le modérateur génère un lien de reconnexion ; ouverture sur un autre appareil. | Compte, projets et badges retrouvés ; l’ancien appareil ne voit plus le compte. | Auto | Bloquant | À faire |
| ACC-11 | Lien de reconnexion à usage unique | Membre | Réutiliser le lien de reconnexion ; attendre 7 jours. | Refus à la 2e utilisation et après expiration. | Auto | Bloquant | À faire |
| ACC-12 | Suppression du compte | Membre | Profil > Supprimer mon compte > confirmer. | Profil supprimé ; retour à l’écran d’invitation. | Manuel | Majeur | À faire |
| ACC-13 | Stockage navigateur bloqué | Visiteur | Navigation privée / données du site effacées. | L’application ne plante pas ; retour à l’écran d’invitation. | Manuel | Mineur | À faire |
| ACC-20 | Code de secours affiché à l’inscription | Nouveau membre | S’inscrire avec un mot de passe ; relever le code de secours affiché. | Code de 20 caractères affiché une seule fois, avec bouton Copier ; régénérable depuis Moi. | Manuel | Bloquant | À faire |
| ACC-21 | Mot de passe oublié (réinitialisation par le membre) | Membre avec code | Écran d’accueil > Mot de passe oublié ? : pseudo + code + nouveau mot de passe. | Connexion réussie avec le nouveau mot de passe ; nouveau code affiché ; ancien code et ancien mot de passe refusés. | Manuel | Bloquant | À faire |

## Sécurité

| ID | Scénario | Rôle | Étapes | Résultat attendu | Mode | Priorité | Statut |
|---|---|---|---|---|---|---|---|
| SEC-10 | Blocage anti-devinette du code de secours | Visiteur | Saisir 5 codes faux pour un même pseudo. | Blocage de 15 minutes (même avec le bon code) ; message « Trop d’essais ». | Auto | Majeur | À faire |

## Comptes

| ID | Scénario | Rôle | Étapes | Résultat attendu | Mode | Priorité | Statut |
|---|---|---|---|---|---|---|---|
| ACC-14 | Inscription avec mot de passe | Visiteur invité | Ouvrir un lien de canal ; choisir pseudo, pays et mot de passe (8 caractères min.) ; valider. | Compte créé ; mot de passe de moins de 8 caractères refusé avec un message clair. | Manuel | Bloquant | À faire |
| ACC-15 | Connexion sur un second appareil | Membre avec mot de passe | Sur un autre téléphone : « J’ai déjà un compte », pseudo + mot de passe. | Même profil, canaux, projets et badges ; les deux appareils fonctionnent en même temps. | Manuel | Bloquant | À faire |
| ACC-16 | Mauvais mot de passe | Membre | Se connecter avec un mauvais mot de passe. | Message « Pseudo ou mot de passe incorrect » ; aucune indication sur l’existence du pseudo. | Manuel | Majeur | À faire |
| ACC-17 | Ajout d’un mot de passe à un compte existant | Membre inscrit avant la mise à jour | Moi > Sécuriser mon compte > enregistrer un mot de passe. | Le profil est conservé ; connexion possible ensuite depuis un autre appareil. | Manuel | Bloquant | À faire |
| ACC-18 | Changement de mot de passe et déconnexion | Membre avec mot de passe | Moi > nouveau mot de passe ; puis « Se déconnecter de cet appareil ». | Nouveau mot de passe actif ; retour à l’écran d’invitation ; reconnexion possible. | Manuel | Majeur | À faire |
| ACC-19 | Mot de passe perdu | Modérateur + membre | Le modérateur génère un lien de reconnexion ; le membre l’ouvre puis ajoute un nouveau mot de passe depuis Moi. | Compte retrouvé ; ancien mot de passe et ancien appareil n’ont plus accès. | Manuel | Majeur | À faire |

## Rôles

| ID | Scénario | Rôle | Étapes | Résultat attendu | Mode | Priorité | Statut |
|---|---|---|---|---|---|---|---|
| ROL-01 | Nommer un modérateur | Admin | Profil > Administration > pseudo + canal + « Modérateur ». | Le membre voit l’onglet Modération de ce canal. | Auto | Bloquant | À faire |
| ROL-02 | Nommer un relais local | Admin | Même formulaire, case « Relais local ». | Badge « Relais » affiché sous le pseudo. | Auto | Majeur | À faire |
| ROL-03 | Nommer un référent entraide | Admin | Formulaire « Référent entraide ». | Le membre voit la file des demandes d’entraide. | Auto | Bloquant | À faire |
| ROL-04 | Membre simple | Membre | Parcourir tous les écrans. | Aucune section Modération ni Administration. | Auto | Bloquant | À faire |
| ROL-05 | Modérateur limité à son canal | Modérateur | Tenter d’agir sur un autre canal (annonce, lien, demandes). | Refusé (interface et serveur). | Auto | Bloquant | À faire |
| ROL-06 | Auto-promotion impossible | Membre | Tenter de s’attribuer un rôle ou un badge via la console navigateur. | Refus par la base (tests SQL R22 à R25, R45). | Auto | Bloquant | À faire |

## Canaux

| ID | Scénario | Rôle | Étapes | Résultat attendu | Mode | Priorité | Statut |
|---|---|---|---|---|---|---|---|
| CAN-01 | Liste et compteurs | Membre | Onglet Canaux. | 6 canaux ; nombre de membres correct. | Auto | Majeur | À faire |
| CAN-02 | Demande d’adhésion | Membre + modérateur | Demander à rejoindre un canal ; le modérateur accepte ou refuse. | Statut « en attente » puis membre (notification) ou refus. | Auto | Bloquant | À faire |
| CAN-03 | Contenu verrouillé | Membre | Ouvrir un canal non rejoint. | Projets et entraide du canal inaccessibles. | Auto | Bloquant | À faire |
| CAN-04 | Groupe WhatsApp du canal | Modérateur | Enregistrer le lien du groupe ; tester un lien invalide ; cliquer « Ouvrir le groupe WhatsApp ». | Lien invalide refusé ; le groupe s’ouvre. | Auto | Majeur | À faire |
| CAN-05 | Partage du lien d’invitation | Modérateur | Copier / Partager le lien. | Message WhatsApp prérempli avec le bon lien. | Manuel | Bloquant | À faire |
| CAN-06 | Annonce de canal | Modérateur | Publier une annonce dans son canal. | Visible des membres du canal uniquement. | Auto | Bloquant | À faire |
| CAN-07 | Annonce générale | Admin | Publier pour « Tous les canaux ». | Visible de tous les inscrits ; impossible pour un modérateur. | Auto | Bloquant | À faire |
| CAN-08 | Annonce échue | Modérateur | Publier avec une date « valable jusqu’à » passée. | Annonce masquée de l’accueil. | Manuel | Mineur | À faire |
| CAN-09 | Confirmation de lecture | Membre | Cliquer « J’ai lu » (deux fois). | Compteur +1 une seule fois ; statut « Lu ». | Auto | Majeur | À faire |
| CAN-10 | Partage d’une annonce | Membre | Partager une annonce par WhatsApp ; ouvrir le lien. | L’application s’ouvre sur l’accueil. | Manuel | Majeur | À faire |
| CAN-11 | À l’honneur | Membre | Onglet « À l’honneur » d’un canal ; désactiver l’option dans Profil. | Classement basé sur actions validées ; le membre ayant refusé disparaît. | Auto | Mineur | À faire |

## Projets

| ID | Scénario | Rôle | Étapes | Résultat attendu | Mode | Priorité | Statut |
|---|---|---|---|---|---|---|---|
| PRJ-01 | Créer un projet | Membre | Projets > Lancer un projet (titre, objectif, besoins, échéance). | Fiche créée, créateur dans l’équipe, visible du canal uniquement. | Auto | Bloquant | À faire |
| PRJ-02 | Fiche projet | Membre | Ouvrir un projet. | Avancement, besoins, jalons, tâches, commentaires, équipe affichés. | Auto | Bloquant | À faire |
| PRJ-03 | Rejoindre l’équipe | Membre | Cliquer « Rejoindre l’équipe ». | Apparaît dans l’équipe ; le propriétaire est notifié. | Auto | Majeur | À faire |
| PRJ-04 | Tâches | Membre | Prendre une tâche libre, la terminer ; tenter de terminer celle d’un autre. | Les deux premières réussissent ; la 3e est impossible (bouton absent, refus serveur). | Auto | Bloquant | À faire |
| PRJ-05 | Gestion du projet | Propriétaire / modérateur | Ajouter une tâche et un jalon, cocher un jalon, changer le statut. | Modifications enregistrées et visibles par tous. | Auto | Bloquant | À faire |
| PRJ-06 | Droits de gestion | Membre simple | Ouvrir un projet d’un autre. | Aucun outil « Gérer le projet ». | Auto | Bloquant | À faire |
| PRJ-07 | Commentaires courts | Membre | Publier 1 commentaire ; saisir 281 caractères. | Compteur 0/280 ; refus au-delà ; pas de fil de discussion. | Auto | Majeur | À faire |
| PRJ-08 | Notifications de suivi | Membre + propriétaire | Commenter un projet suivi à « Tout » puis à « Rien ». | Notification pour « Tout » ; aucune pour « Rien ». | Manuel | Majeur | À faire |
| PRJ-09 | Niveau de suivi | Membre | Choisir Tout / Jalons / Rien, recharger. | Choix conservé. | Manuel | Mineur | À faire |
| PRJ-10 | Lien projet | Membre / non-membre | Partager le lien d’un projet ; l’ouvrir avec un compte membre puis non membre. | Membre : fiche ouverte ; non-membre : accès refusé. | Manuel | Majeur | À faire |
| PRJ-11 | Recherche | Membre | Rechercher par mot (titre, besoin, canal). | Résultats filtrés en direct. | Auto | Mineur | À faire |
| PRJ-12 | Suggestions de compétences | Membre + propriétaire | Activer « Apparaître dans la recherche » ; ouvrir un projet dont un besoin correspond. | Profil suggéré seulement si activé ; « Proposer » enregistré (bouton devient « Proposé »). | Auto | Majeur | À faire |

## Entraide

| ID | Scénario | Rôle | Étapes | Résultat attendu | Mode | Priorité | Statut |
|---|---|---|---|---|---|---|---|
| ENT-01 | Créer une demande | Membre | Entraide > Demander de l’aide (domaine, pays, urgence, texte ≥ 10 caractères). | Demande enregistrée, statut « Ouverte ». | Auto | Bloquant | À faire |
| ENT-02 | Confidentialité | Membre simple | Consulter l’entraide avec un autre compte. | Demandes des autres invisibles ; visibles de l’auteur, du référent, du modérateur, de l’admin. | Auto | Bloquant | À faire |
| ENT-03 | Prise en charge | Référent | Cliquer « Prendre en charge ». | Statut « En cours » ; l’auteur est notifié. | Auto | Bloquant | À faire |
| ENT-04 | Réponse et clôture | Référent | Répondre puis clore. | Réponse lisible par l’auteur ; statut « Résolue » ; compteur d’entraide +1. | Auto | Bloquant | À faire |
| ENT-05 | Clôture par l’auteur | Membre | Clore sa propre demande en cours. | Statut « Résolue ». | Auto | Majeur | À faire |
| ENT-06 | Auto-prise en charge | Référent | Tenter de prendre sa propre demande. | Impossible. | Auto | Majeur | À faire |

## Badges

| ID | Scénario | Rôle | Étapes | Résultat attendu | Mode | Priorité | Statut |
|---|---|---|---|---|---|---|---|
| BDG-01 | Badge de profil | Membre + modérateur | Demander un badge ; le modérateur accorde ou refuse. | Badge affiché sous le pseudo après accord ; demande retirée après refus. | Auto | Majeur | À faire |
| BDG-02 | Badge non auto-attribuable | Membre | Tenter d’écrire dans badge_grants via la console. | Refus (test SQL R45). | Auto | Bloquant | À faire |
| BDG-03 | Badges d’engagement | Membre | Réaliser lecture, tâche terminée, projet, entraide résolue, proposition. | Niveaux et compteurs mis à jour ; seules les actions validées comptent. | Auto | Majeur | À faire |

## Profil

| ID | Scénario | Rôle | Étapes | Résultat attendu | Mode | Priorité | Statut |
|---|---|---|---|---|---|---|---|
| PRO-01 | Compétences | Membre | Saisir des compétences et enregistrer. | Enregistrées ; visibles des autres seulement si l’option est activée. | Auto | Majeur | À faire |
| PRO-02 | Confidentialité du profil | Membre | Vérifier ce que voit un autre membre (pseudo, pays, badges). | Aucun email ni téléphone (il n’y en a pas) ; compétences cachées par défaut. | Auto | Bloquant | À faire |

## Langues

| ID | Scénario | Rôle | Étapes | Résultat attendu | Mode | Priorité | Statut |
|---|---|---|---|---|---|---|---|
| LNG-01 | Bascule FR / AR | Membre | Basculer en arabe puis en français sur tous les écrans. | Textes traduits, direction RTL correcte, rien de tronqué. | Manuel | Majeur | À faire |
| LNG-02 | Thème clair / sombre | Membre | Basculer, recharger. | Choix conservé ; contrastes lisibles. | Manuel | Mineur | À faire |
| LNG-03 | Contenus en arabe | Modérateur | Publier une annonce et un projet rédigés en arabe. | Affichage RTL correct de leur texte. | Manuel | Majeur | À faire |

## Mobile

| ID | Scénario | Rôle | Étapes | Résultat attendu | Mode | Priorité | Statut |
|---|---|---|---|---|---|---|---|
| MOB-01 | Installation sur Android | Membre | Chrome Android > Installer l’application. | Icône Diasporact, ouverture plein écran. | Manuel | Bloquant | À faire |
| MOB-02 | Installation sur iPhone | Membre | Safari > Partager > Sur l’écran d’accueil. | Icône Diasporact, ouverture plein écran. | Manuel | Bloquant | À faire |
| MOB-03 | Petits écrans | Membre | Tester à 360 px de large et en paysage. | Aucun défilement horizontal ; boutons utilisables au pouce (≥ 44 px). | Manuel | Majeur | À faire |
| MOB-04 | Réseau lent (3G) | Membre | Limiter le réseau (3G lente) ; ouvrir l’accueil. | Chargement < 5 s ; messages d’attente clairs. | Manuel | Majeur | À faire |
| MOB-05 | Hors ligne | Membre | Couper le réseau ; ouvrir puis agir. | L’application s’ouvre ; message « Connexion impossible » ; aucune perte silencieuse. | Manuel | Majeur | À faire |
| MOB-06 | Mise à jour de l’application | Membre | Publier une nouvelle version ; rouvrir l’app installée. | La nouvelle version apparaît sans réinstallation. | Manuel | Majeur | À faire |
| MOB-07 | Accessibilité de base | Testeur | Navigation clavier, lecteur d’écran sur 3 écrans. | Éléments atteignables et étiquetés. | Manuel | Mineur | À faire |

## Sécurité

| ID | Scénario | Rôle | Étapes | Résultat attendu | Mode | Priorité | Statut |
|---|---|---|---|---|---|---|---|
| SEC-01 | Tests des règles de la base | Technique | Exécuter supabase/tests/rls_test.sh. | 74 réussis, 0 échec. | Auto | Bloquant | À faire |
| SEC-02 | Clés exposées | Technique | Inspecter le code envoyé au navigateur. | Seule la clé anon est présente. | Manuel | Bloquant | À faire |
| SEC-03 | Accès direct à l’API | Technique | Appeler l’API REST avec la clé anon sans session. | Aucune donnée renvoyée (hors canaux et ping). | Manuel | Bloquant | À faire |
| SEC-04 | Cloisonnement des comptes | Deux membres | Chacun tente de lire/modifier les données de l’autre via la console. | Refus systématique. | Auto | Bloquant | À faire |
| SEC-05 | Injection de code | Membre | Créer un projet dont le titre est <img src=x onerror=alert(1)>. | Affiché comme texte, aucun script exécuté. | Manuel | Bloquant | À faire |
| SEC-06 | Création massive de comptes | Technique | Vérifier les limites Supabase sur les connexions anonymes (par IP) ; activer le CAPTCHA si nécessaire. | Limites actives ; décision documentée. | Manuel | Majeur | À faire |
| SEC-07 | En-têtes HTTP | Technique | Contrôler les en-têtes du site (nosniff, X-Frame-Options, Referrer-Policy). | Présents. | Manuel | Mineur | À faire |
| SEC-08 | Données personnelles | Admin | Revue : données collectées (pseudo, pays, compétences) ; suppression de compte ; mention d’information aux membres. | Minimisation respectée ; information prête avant l’ouverture. | Manuel | Majeur | À faire |
| SEC-09 | Liens non devinables | Technique | Observer 10 liens d’invitation générés. | Codes aléatoires (10 caractères hexadécimaux) ; pas de séquence. | Manuel | Majeur | À faire |

## Continuité

| ID | Scénario | Rôle | Étapes | Résultat attendu | Mode | Priorité | Statut |
|---|---|---|---|---|---|---|---|
| SAU-01 | Contenu des sauvegardes | Admin | Ouvrir un export nocturne. | Toutes les tables, données cohérentes avec l’application. | Manuel | Bloquant | À faire |
| SAU-02 | Absence de pause | Admin | Ne pas utiliser l’application 8 jours (cron actif). | Projet Supabase toujours actif. | Manuel | Bloquant | À faire |
| SAU-03 | Plan payant | Direction | Décider avant l’ouverture : rester en gratuit (avec risques connus) ou passer au plan Pro (sauvegardes incluses). | Décision écrite. | Manuel | Majeur | À faire |
| SAU-04 | Conditions Vercel | Direction | Vérifier que l’usage est autorisé par le plan Vercel retenu (Hobby / Pro). | Décision écrite. | Manuel | Bloquant | À faire |

## Performance

| ID | Scénario | Rôle | Étapes | Résultat attendu | Mode | Priorité | Statut |
|---|---|---|---|---|---|---|---|
| PERF-01 | 200 comptes, 20 actifs | Équipe | Jeu d’essai 200 comptes ; 20 testeurs simultanés pendant 30 minutes. | Accueil < 3 s ; aucune erreur. | Manuel | Bloquant | À faire |
| PERF-02 | Volume de données | Technique | Mesurer la taille de la base après le jeu d’essai. | < 50 Mo (limite gratuite : 500 Mo). | Manuel | Mineur | À faire |
| PERF-03 | Volume de contenus | Technique | Générer 100 projets et 1 000 commentaires ; mesurer le chargement. | Chargement < 5 s ; sinon pagination à prévoir (V1.1). | Manuel | Majeur | À faire |

**Total : 98 cas** (53 bloquants, 36 majeurs, 9 mineurs).
