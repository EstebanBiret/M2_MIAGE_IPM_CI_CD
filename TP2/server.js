const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

//route prinicipale
app.get('/', (req, res) => {
    res.send('Hello world — serveur magnifiquement optimisé et fonctionnel');
});

//route pour les fichiers colossaux
app.get('/big', (req, res) => {
    const filePath = path.join(__dirname, 'maybe-big-file.txt');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    stream.on('error', () => res.status(404).send('Fichier introuvable'));
    stream.on('data', chunk => res.write(chunk.replace(/\n/g, '<br/>')));
    stream.on('end', () => res.end());
});

//middleware d’erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Erreur serveur');
});

//démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});