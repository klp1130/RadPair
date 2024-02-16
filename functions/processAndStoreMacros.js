const functions = require("firebase-functions");
const admin = require("firebase-admin");
const OpenAI = require("openai");
const fs = require("fs");
const { parse } = require("csv-parse/sync");

exports.processAndStoreMacros = functions
  .runWith({
    timeoutSeconds: 540, // Maximum timeout
  })
  .https.onRequest(async (request, response) => {
    if (request.method !== "POST") {
      return response.status(405).send("Method Not Allowed");
    }

    const openaiApiKey = functions.config().openai.key; // Ensure your API key is correctly configured in Firebase config
    const openaiClient = new OpenAI({ apiKey: openaiApiKey });

    try {
      const macrosSnapshot = await admin.firestore().collection("macros").get(); // Access Firestore collection

      if (macrosSnapshot.empty) {
        console.log("No macros found in Firestore.");
        return response.send("No macros found to process.");
      }

      const updates = macrosSnapshot.docs.map((doc) => {
        const macro = doc.data();
        // console.log("Macro Phrase:", macro.macroPhrase); 
        // Generate embedding for each macro phrase
        return getEmbeddingForText(openaiClient, macro.macroPhrase) // Corrected field access
          .then((embedding) => {
            return doc.ref.update({ embedding }); // Update the Firestore document with the generated embedding
          });
      });

      await Promise.all(updates); // Wait for all Firestore document updates to complete

      response.send(
        `Generated and updated embeddings for ${updates.length} macros.`
      );
    } catch (error) {
      console.error("Error generating embeddings for Firestore macros:", error);
      response.status(500).send("Internal Server Error");
    }
  });

async function getEmbeddingForText(openaiClient, text) {
  // console.log("Generating embedding for text:", text);
  const response = await openaiClient.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding; // Return the embedding vector
}
