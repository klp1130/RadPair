// uploadCSVtoFirestore.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

exports.uploadCSVToFirestore = functions.https.onRequest(async (request, response) => {
  const results = [];
  const filePath = path.join(__dirname, './data/macros.csv'); // Adjust path as necessary

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve())
      .on('error', (error) => reject(error));
  });

  const collectionRef = admin.firestore().collection('macros');
  try {
    for (const row of results) {
      await collectionRef.add({
        macroPhrase: row['Macro Phrase'],
        macroText: row['Macro Text'],
      });
    }
    response.send('Upload complete');
  } catch (error) {
    console.error('Error adding document: ', error);
    response.status(500).send('Error uploading data');
  }
});
