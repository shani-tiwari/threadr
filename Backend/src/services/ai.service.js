const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
    config: {
      temperature: 0.7,
      systemInstruction:
        "You are a helpful asistant, who gives precise and short answers",
    },
  });
  return response.text;
}

module.exports = {
  generateResponse,
};
