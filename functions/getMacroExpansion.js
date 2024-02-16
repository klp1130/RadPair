const functions = require("firebase-functions");
const OpenAI = require("openai");
const cors = require("cors")({ origin: true });
const fs = require("fs");
const { parse } = require("csv-parse/sync");
const path = require("path");

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: functions.config().openai.key,
});

// Load and parse the CSV data
const csvFilePath = path.join(__dirname, "data", "macros.csv");
const csvData = fs.readFileSync(csvFilePath, "utf8");
const macros = parse(csvData, {
  columns: true,
  skip_empty_lines: true,
});

// Convert macros to a searchable format
const macroMap = new Map(
  macros.map((record) => [
    record["Macro Phrase"].toLowerCase(),
    record["Macro Text"],
  ])
);

exports.getMacroExpansion = functions.https.onRequest(
  async (request, response) => {
    cors(request, response, async () => {
      if (request.method !== "POST") {
        return response.status(405).send("Method Not Allowed");
      }

      const { text } = request.body;
      if (!text) {
        return response.status(400).send("Bad Request: Missing text input");
      }

      // Prepare the system message with macro data
      const systemMessage = {
        role: "system",
          content: `Please input the radiology transcript. Macros will be expanded based on predefined definitions. Available macros include: ${Array.from(macroMap.keys()).join(", ")}.`,

      };

      // const userMessage = {
      //   role: "user",
      //   content: text,
      // };

      try {
        // Check for trigger words to activate macros
        const triggerWords = ["insert", "input"]; // Add other trigger words as needed
        let modifiedText = text;

      // New logic to check for trigger word followed by a macro
    triggerWords.forEach((triggerWord) => {
      macroMap.forEach((macroText, macroPhrase) => {
        // Look for a pattern where a trigger word is directly followed by a macro phrase
        const regexPattern = new RegExp(`\\b${triggerWord}\\s+${macroPhrase}\\b`, "gi");
        if (regexPattern.test(text)) {
          triggerDetected = true;
          // Replace only when the macro directly follows a trigger word
          modifiedText = modifiedText.replace(regexPattern, macroText);
        }
      });
    });

        // If no trigger word is detected, keep the original text
        if (!triggerDetected) {
          modifiedText = text;
        }
        // Function calling begins here
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [systemMessage, { role: "user", content: modifiedText }],
        });

        // Process the response to remove extra information if a trigger word is detected
        if (triggerDetected) {
          modifiedText = completion.choices[0].message.content.replace(
            /(.*?)(insert|input)(.*?)/i,
            "$1"
          );
        } else {
          modifiedText = text;
        }

        response.json({
          originalText: text,
          modifiedText: modifiedText.trim(),
        });
      } catch (error) {
        console.error("Error processing request:", error);
        response.status(500).send("Error processing request");
      }
    });
  }
);