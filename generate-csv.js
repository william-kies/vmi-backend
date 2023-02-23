const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const NUMBER_OF_ROWS = 1000000;
const CSV_FILE_PATH = './data.csv';

function generateCSV() {
    // Génère un utilisateur aléatoire
    function generateUser() {
        const firstNames = ['Jean', 'François', 'Théo', 'Jack', 'Laurent', 'Nicolas'];
        const lastNames = ['Dupont', 'Martin', 'Bernard', 'Petit', 'Thomas'];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
        return(`${firstName} ${lastName}`);
    }
  
    // Génère une adresse e-mail en tenant compte d'un utilisateur générer aléatoirement
    function generateEmail(user) {
        const domains = ['gmail.com', 'hotmail.com', 'icloud.com'];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const userLower = user.toLowerCase().replace(' ', '.');
    
        return(`${userLower}@${domain}`);
    }
  
    // Crée le fichier CSV
    const writeStream = fs.createWriteStream(CSV_FILE_PATH);
    writeStream.write('uuid,nom,email\n'); // Ajoute la ligne d'en-tête
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
        const uuid = uuidv4();
        const user = generateUser();
        const email = generateEmail(user);
        const row = `${uuid},${user},${email}\n`;
    
        writeStream.write(row);
    }
  
    writeStream.end();
    console.log(`Fichier CSV généré avec succès : ${CSV_FILE_PATH}`);
}

generateCSV();