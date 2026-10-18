---
name: correction
description: Méthode de correction de bugs du propriétaire. À utiliser pour toute correction, liste de bugs ou audit à corriger.
---
# correction

Un point à la fois, du plus grave au moins grave :
1. Trouver la vraie cause (pas le symptôme), patch ciblé.
2. Tester : un test automatique qui échouait avant, puis un test en vrai quand c'est possible (vraie requête HTTP/WebSocket, app sur émulateur, comptes de test supprimés à la fin).
3. Toute anomalie vue en route (test rouge, erreur 500, régression, texte faux) : corriger tout de suite et retester.
4. Passer au point suivant seulement quand tout est vert.
5. Rapport écrit au fil de l'eau dans `.projetmemory/audit-fix/` (une ligne par point : cause, fichiers, test).

Améliorations bienvenues, mais l'objectif et la logique produit ne changent pas sans accord.
