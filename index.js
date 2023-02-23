const express = require('express');
const generateCSV = require('./generate-csv');
const csv = require('csv-parser');
const fs = require('fs');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.get('/test', (req, res) => {
    res.json({ success: true });
    generateCSV;
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test-vmi',
    multipleStatements: true, // active l'option multipleStatements
});

// Lecture du fichier pour accéder à la requête
fs.readFile('./csv-data.sql', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
    }

    // Créer la table si elle n'existe pas déjà
    connection.query(data, (err, results, fields) => {
        if (err) {
            console.error(err);
        }

        console.log(results);
    });
});

// Importer les données du fichier CSV dans la table MySQL
app.get('/import-csv', (req, res) => {
    const csvData = [];
  
    fs.createReadStream('./data.csv')
    .pipe(csv({ separator: ',' }))
    .on('data', (data) => {
        csvData.push(data);
    })
    .on('end', () => {
        const chunkSize = 1000; // Taille des paquets à envoyer
        const query = 'INSERT INTO csv_data (uuid, nom, email) VALUES ?';
        const values = csvData.map((data) => [data.uuid, data.nom, data.email]);
        let index = 0;
    
        function sendNextChunk() {
            const chunk = values.slice(index, index + chunkSize);
            index += chunkSize;
    
            if (chunk.length > 0) {
            connection.query(query, [chunk], (err, result) => {
                if (err) throw err;
                sendNextChunk();
            });
            } else {
            res.send(`${csvData.length} Importation réussie`);
            console.log(`${csvData.length} Importation réussie`);
            }
        }
    
        // Utilisation des promesses pour permettre l'exécution parallèle des routes /import-csv & /test
        Promise.all([generateCSV, new Promise((resolve, reject) => {
            sendNextChunk();
            resolve();
        })]).then(() => {
            console.log('Toute les requêtes sont terminées !');
        }).catch((err) => {
            console.error(err);
        });
    });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});