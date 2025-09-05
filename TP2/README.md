# TP2 : optimisation d'une application et de son dockerfile

## Objectif
Optimiser l’image Docker d’une application Node.js en appliquant de bonnes pratiques.

## Étape 0 : dockerfile et app inchangés
- Temps de build : 125 secondes.
  <img width="265" height="12" alt="image" src="https://github.com/user-attachments/assets/c5f9d484-3919-4265-a7d7-4eb2d520aed3" />
- Taille de l'image : 1.73GB.

  <img width="439" height="36" alt="image" src="https://github.com/user-attachments/assets/96964941-e930-4935-b5b6-73ad77fa55ba" />

## Étape 1 : on utilise une version définie de node + création d'un fichier .dockerignore
- Temps de build : 139 secondes.
  <img width="287" height="16" alt="image" src="https://github.com/user-attachments/assets/51f8599e-1673-4c77-a0de-2102ab65f88e" />
  - Taille de l'image : 866MB.
 
  <img width="476" height="38" alt="image" src="https://github.com/user-attachments/assets/3b6a0a3e-0450-40cd-950c-a3a3426cc3f8" />

Le build est un peu plus long, mais la taille de l'image a été divisée par 2. On a ici utilisé une version de node définie, et créé un .dockerignore qui nous permet de ne pas copier les fichiers inutiles (node_modules, fichiers temporaires...).

## Étape 2 : on supprime les paquets apt inutiles
- Temps de build : 22 secondes.
  <img width="262" height="15" alt="image" src="https://github.com/user-attachments/assets/8d431845-fa56-4399-ac09-72d445001f72" />

- Taille de l'image : 306MB.

  <img width="442" height="36" alt="image" src="https://github.com/user-attachments/assets/c870993b-e146-411b-b80a-fe0f9ea39fec" />

On voit que le temps de build et la taille de l'image ont été drastiquement réduits. En effet, on a supprimé une ligne qui installait des paquets inutiles pour notre application.

## Étape 3 : on supprime les ports inutilisés dans le dockerfile
- Temps de build : 15 secondes.
  <img width="255" height="14" alt="image" src="https://github.com/user-attachments/assets/35aa3888-af58-442b-9f71-d696298ee690" />

- Taille de l'image : toujours 306MB.

  <img width="444" height="37" alt="image" src="https://github.com/user-attachments/assets/6ad59490-2f6c-4b49-95e6-51a0d9a76bbc" />

Les ports 3000, 4000 et 5000 étaient exposés dans le dockerfile, alors que l'application n'écoutait que sur le port 3000, on a donc supprimé les autres ports du dockerfile pour gagner un petit peu de temps de build.







  
