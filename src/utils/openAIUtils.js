// File: /src/utils/openAIUtils.js
export async function expandMacroUsingGPT4(inputText) {
  // URL of your Firebase Cloud Function
  const functionUrl = 'https://us-central1-radpair-216f9.cloudfunctions.net/getMacroExpansion';

  try {
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputText }),
    });

      // Log the raw response
      const responseBodyText = await response.text();
      console.log('Raw response:', responseBodyText);
  
      if (!response.ok) {
        throw new Error(`Failed to get a response: ${response.status}`);
      }
  
      let responseBody;
      try {
        responseBody = JSON.parse(responseBodyText); // Parse response as JSON
      } catch (error) {
        console.error("Error parsing response as JSON:", error);
        throw new Error(`Failed to parse response as JSON: ${error.message}`);
      }
  
      return responseBody; // Return the entire response body
    } catch (error) {
      console.error("Error during macro processing:", error);
      // Handle the error accordingly in your app
      throw error;
    }
  }