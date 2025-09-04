# Exercice 5 – Déploiement d’une application Python Flask avec Docker

## Objectif
Créer et lancer une application web simple avec Flask à l’aide de Docker.  
L’application doit afficher "Hello World!" lorsque l’on accède à la racine.

## Fichiers nécessaires
- `app.py` : code Python de l’application Flask  
- `requirements.txt` : liste des dépendances  
- `Dockerfile` : instructions pour construire l’image Docker  

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
