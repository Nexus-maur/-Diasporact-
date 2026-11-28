import sys,os,collections
sys.path.insert(0,os.path.dirname(__file__))
from recette_cases import CASES
out=['# Cahier de recette — AfriKafo V1','',
'Objectif : décider de la mise en production sur la base de preuves. Chaque cas est rejoué **sur l’environnement réel** (Supabase + Vercel), même quand il est déjà couvert par un test automatique.','',
'- **Auto** : déjà couvert par les tests automatiques (`supabase/tests/rls_test.sh`, `tests/smoke6.js`) ; à rejouer à la main sur l’environnement réel.',
'- **Manuel** : à exécuter par une personne.',
'- **Priorité** : Bloquant (pas de mise en production s’il échoue) · Majeur · Mineur.','',
'## Critères de décision (Go / No-Go)','',
'1. 100 % des cas **Bloquants** réussis.',
'2. Au moins 95 % des cas **Majeurs** réussis ; les échecs restants ont une solution de contournement écrite.',
'3. Aucun défaut de sécurité ouvert (famille SEC).',
'4. Test sur au moins 3 appareils : un Android, un iPhone, un ordinateur.',
'5. Pilote de 7 jours avec 20 testeurs actifs sans incident bloquant.',
'6. Décisions SAU-03 (plan Supabase) et SAU-04 (conditions Vercel) écrites.','',
'## Limites connues de la V1','',
'- Pas d’IA : résumé de discussion, traduction, assistant d’entraide arrivent en V1.1.',
'- Notifications dans l’application uniquement (pas de notification push du téléphone).',
'- L’application charge toutes les données visibles à chaque ouverture : à surveiller au-delà de quelques centaines de projets (PERF-03).',
'- Les référents d’entraide ne sont pas spécialisés par domaine : un référent voit toutes les demandes.',
'- Un compte est rattaché à un appareil ; le changement d’appareil passe par un lien de reconnexion fourni par un modérateur.','']
cur=None
for c in CASES:
    if c[1]!=cur:
        cur=c[1]; out+=['',f'## {cur}','','| ID | Scénario | Rôle | Étapes | Résultat attendu | Mode | Priorité | Statut |','|---|---|---|---|---|---|---|---|']
    out.append('| '+' | '.join([c[0],c[2],c[3],c[4],c[5],c[6],c[7],'À faire'])+' |')
cnt=collections.Counter(c[7] for c in CASES)
out+=['',f'**Total : {len(CASES)} cas** ({cnt["Bloquant"]} bloquants, {cnt["Majeur"]} majeurs, {cnt["Mineur"]} mineurs).','']
open(os.path.join(os.path.dirname(__file__),'RECETTE.md'),'w',encoding='utf-8').write('\n'.join(out))
print(len(CASES))
