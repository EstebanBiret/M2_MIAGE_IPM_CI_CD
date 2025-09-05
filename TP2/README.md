# TP2 : optimisation d'une application et de son dockerfile

## Objectif
Optimiser l’image Docker d’une application Node.js en appliquant de bonnes pratiques.

## Étape 0 : dockerfile et app inchangés
- Temps de build : 125 secondes.
  <img width="265" height="12" alt="image" src="https://github.com/user-attachments/assets/c5f9d484-3919-4265-a7d7-4eb2d520aed3" />
- Taille de l'image : 1.73GB.

  <img width="439" height="36" alt="image" src="https://github.com/user-attachments/assets/96964941-e930-4935-b5b6-73ad77fa55ba" />

Contenu initial du dockerfile : 
```dockerfile
FROM node:latest
WORKDIR /app
COPY node_modules ./node_modules
COPY . /app
RUN npm install
RUN apt-get update && apt-get install -y build-essential ca-certificates locales && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && locale-gen
EXPOSE 3000 4000 5000
ENV NODE_ENV=development
RUN npm run build
USER root
CMD ["node", "server.js"]
```

## Étape 1 : on utilise une version définie de node + création d'un fichier .dockerignore
- Temps de build : 139 secondes.
  <img width="287" height="16" alt="image" src="https://github.com/user-attachments/assets/51f8599e-1673-4c77-a0de-2102ab65f88e" />
  - Taille de l'image : 866MB.
 
  <img width="476" height="38" alt="image" src="https://github.com/user-attachments/assets/3b6a0a3e-0450-40cd-950c-a3a3426cc3f8" />

Le build est un peu plus long, mais la taille de l'image a été divisée par 2. On a ici utilisé une version de node définie, et créé un .dockerignore qui nous permet de ne pas copier les fichiers inutiles (node_modules, fichiers temporaires...).

Contenu de .dockerignore :
```gitignore
node_modules
npm-debug.log*
yarn.lock
.git
.gitignore
Dockerfile*
docker-compose.yml
*.md
```

Mise à jour du dockerfile :
```dockerfile
FROM node:18-slim
WORKDIR /app

COPY . /app

RUN npm install

RUN apt-get update && apt-get install -y build-essential ca-certificates locales && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && locale-gen

EXPOSE 3000 4000 5000
ENV NODE_ENV=development

RUN npm run build
USER root
CMD ["node", "server.js"]
```

## Étape 2 : on supprime les paquets apt inutiles
- Temps de build : 22 secondes.
  <img width="262" height="15" alt="image" src="https://github.com/user-attachments/assets/8d431845-fa56-4399-ac09-72d445001f72" />

- Taille de l'image : 306MB.

  <img width="442" height="36" alt="image" src="https://github.com/user-attachments/assets/c870993b-e146-411b-b80a-fe0f9ea39fec" />

On voit que le temps de build et la taille de l'image ont été drastiquement réduits. En effet, on a supprimé une ligne qui installait des paquets inutiles pour notre application.

Mise à jour du dockerfile :
```dockerfile
FROM node:18-slim
WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3000 4000 5000
ENV NODE_ENV=development

RUN npm run build
USER root
CMD ["node", "server.js"]
```

## Étape 3 : on supprime les ports inutilisés dans le dockerfile
- Temps de build : 15 secondes.
  <img width="255" height="14" alt="image" src="https://github.com/user-attachments/assets/35aa3888-af58-442b-9f71-d696298ee690" />

- Taille de l'image : toujours 306MB.

  <img width="444" height="37" alt="image" src="https://github.com/user-attachments/assets/6ad59490-2f6c-4b49-95e6-51a0d9a76bbc" />

Les ports 3000, 4000 et 5000 étaient exposés dans le dockerfile, alors que l'application n'écoutait que sur le port 3000, on a donc supprimé les autres ports du dockerfile pour gagner un petit peu de temps de build.

Mise à jour du dockerfile :
```dockerfile
FROM node:18-slim
WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3000
ENV NODE_ENV=development

RUN npm run build
USER root
CMD ["node", "server.js"]
```

## Étape 4 : utilisation du cache
- Temps de build : 3 secondes.
  <img width="248" height="18" alt="image" src="https://github.com/user-attachments/assets/7867fb6c-b7f7-48cd-ba00-ca95095df876" />

- Taille de l'image : 302MB.

  <img width="444" height="37" alt="image" src="https://github.com/user-attachments/assets/bca8ff6f-5745-4095-905f-5a508a2d3cdc" />

Ici, on copie uniquement les fichiers de dépendances pour tirer parti du cache, et ainsi éviter de réinstaller les dépendances à chaque changement de code.

Mise à jour du dockerfile :
```dockerfile
FROM node:18-slim
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
ENV NODE_ENV=development

RUN npm run build
USER root
CMD ["node", "server.js"]
```

## Étape 5 : changement de l'environnement et de l'user
Temps de build et taille de l'image inchangés, mais ce sont des bonnes pratiques (pas de devDependencies + sécurité).

Mise à jour du dockerfile :
```dockerfile
FROM node:18-slim
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
USER node

CMD ["node", "server.js"]
```

## Étape 6 : clean du code server.js 
Code optimisé, mais qui n'a pas de réel impact sur les performances.

## Comparaison

Au départ, le temps de build était d'environ **2 minutes**, et l'image faisait **1.73GB**. 

Après plusieurs modifications dans le dockerfile et l'ajout d'un fichier .dockerignore, le temps de build est d'environ **3 secondes**, et l'image fait **302MB**.

dockerfile initial : 
```dockerfile
FROM node:latest
WORKDIR /app
COPY node_modules ./node_modules
COPY . /app
RUN npm install
RUN apt-get update && apt-get install -y build-essential ca-certificates locales && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && locale-gen
EXPOSE 3000 4000 5000
ENV NODE_ENV=development
RUN npm run build
USER root
CMD ["node", "server.js"]
```

dockerfile optimisé : 
```dockerfile
FROM node:18-slim
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
USER node

CMD ["node", "server.js"]
```
