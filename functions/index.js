const { uploadCSVToFirestore } = require('./uploadCSVtoFirestore');
const { getMacroExpansion } = require('./getMacroExpansion');
const { processAndStoreMacros} = require('./processAndStoreMacros');
const admin = require('firebase-admin');

admin.initializeApp()
const fs = require('fs');
const csv = require('csv-parser'); // or use papaparse

;


exports.uploadCSVToFirestore = uploadCSVToFirestore;
exports.getMacroExpansion = getMacroExpansion;
exports.processAndStoreMacros = processAndStoreMacros;

