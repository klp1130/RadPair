import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import TextInput from "./TextInput";
import ProcessButton from "./ProcessButton";
import DisplayResult from "./DisplayResult";
import { expandMacroUsingGPT4 } from "../utils/openAIUtils";

const MacroProcessor = () => {
  // State for storking macros loaded from the CSV
  const [macros, setMacros] = useState([]);
  // State for user input text
  const [inputText, setInputText] = useState("");
  // State for discplaying the processed text
  const [processedText, setProcessedText] = useState("");
  // State for loading state
  const [loading, setLoading] = useState(false);

  // Function to process user input text,
  // replacing macros with predefined text or
  // dynamically expanding them using GPT-4
  const processText = async () => {
    setLoading(true);
    console.log("Starting text processing...");
    let tempText = inputText;

    try {
      const responseBody = await expandMacroUsingGPT4(tempText);
      const chatResponse = responseBody.modifiedText; 
      setProcessedText(chatResponse);
      setLoading(false);
    } catch (error) {
      console.error("Error processing text:", error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 h-screen">
      {/* Text input for user input */}
      <TextInput value={inputText} onChange={setInputText} />
      {/* ProcessButton component to trigger text processing */}
      <ProcessButton onClick={processText} loading={loading} />
      {/* DisplayResults to show processed text */}
      <DisplayResult chatResponse={processedText} />
    </div>
  );
};

export default MacroProcessor;
