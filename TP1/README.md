# Exercice 5 – Déploiement d’une application Python Flask avec Docker

## Objectif
Créer et lancer une application web simple avec Flask à l’aide de Docker.  
L’application doit afficher "Hello World!" lorsque l’on accède à la racine.

## Fichiers nécessaires
- `app.py` : code Python de l’application Flask  
- `requirements.txt` : liste des dépendances  
- `Dockerfile` : instructions pour construire l’image

## Code de l’application

### app.py
```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
```

## Fichier de dépendances

### requirements.txt
```txt
flask
```

## Dockerfile
```dockerfile

FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt requirements.txt
COPY app.py app.py

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["python", "app.py"]
```

## Déploiement

On build l'image de notre application, pour ensuite lancer le conteneur

```bash
docker build -t flask-hello .
docker run -p 5000:5000 flask-hello
```

Lorsque l'on se connecte sur http://localhost:5000/, on peut voir que l'application fonctionne bien :

<img width="380" height="83" alt="image" src="https://github.com/user-attachments/assets/01faa13d-7f36-4de0-83f2-0e466756dec1" />

# Exercice 6 – Utilisation de Docker Compose

## Objectif
Déployer une application Flask connectée à une base MongoDB à l’aide de Docker Compose.  
L’application doit afficher "Hello World!" et vérifier que la connexion à la base fonctionne.

## Fichiers nécessaires
- `app.py` : code Python de l’application Flask avec connexion MongoDB  
- `requirements.txt` : liste des dépendances  
- `Dockerfile` : instructions pour construire l’image
- `docker-compose.yml` : description des services (app + MongoDB)  

## Code de l’application

### app.py
```python
from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)

#connect to MongoDB
client = MongoClient("mongodb://mongo:27017/")
db = client["testdb"]
collection = db["messages"]

@app.route('/')
def hello_world():

    #add a message to the database and count total messages (increment at each launch)
    collection.insert_one({"message": "Hello World!"})
    count = collection.count_documents({})
    return f"Hello World! (nombre de messages en base: {count})"

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
```

## Fichier de dépendances

### requirements.txt
```txt
flask
pymongo
```

## Dockerfile (il reste inchangé par rapport à l'exercice précédent)

## docker-compose.yml
```yaml
version: "3.9"
services:
  web:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - mongo
  mongo:
    image: mongo:6.0
    container_name: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```
## Déploiement

On construit et on lance les contenurs :

```bash
docker compose up --build
```

Lorsque l'on se connecte sur http://localhost:5000/, on peut voir que l'application fonctionne bien, à chaque rafraichissement un hello world est ajouté à la BD locale :

<img width="366" height="76" alt="image" src="https://github.com/user-attachments/assets/a8251c96-5eeb-4a11-811c-9fb1868a7654" />
