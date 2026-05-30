import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
});

export async function explainCode(code: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: code,
    config: {
      systemInstruction: `
You are an expert software engineer.

When given code:
- Explain what it does.
- Explain the execution flow.
- Identify bugs and edge cases.
- Suggest improvements.
- Keep explanations concise and beginner-friendly.
- Format the response using Markdown.
- keep it simple and short
- max output should contains 1000 words
      `,
    },
  });
 console.log(response)
  return response.text || '';
}