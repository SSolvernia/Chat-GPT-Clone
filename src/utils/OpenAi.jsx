import OpenAI from "openai";
import personas from '../personas';
// OpenAi client for huggingface
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.REACT_APP_HF_TOKEN || process.env.HF_TOKEN,
  dangerouslyAllowBrowser: true,
});

export const sendMsgToAI = async (msg, personaKey = 'dorothy') => {
  if (!client.apiKey) {
    console.warn(
      "REACT_APP_HF_TOKEN not configured"
    );
    return "Falta configurar el token de Hugging Face.";
  }

  try {
    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Llama-3.1-8B-Instruct:cerebras",
      messages: [
        { role: "system", content: personas?.[personaKey]?.content || "" },
        { role: "user", content: msg },
      ],
      temperature: 0.5,
      max_tokens: 400,
    });

    const message = chatCompletion?.choices?.[0]?.message;
    const content =
      typeof message?.content === "string"
        ? message.content
        : Array.isArray(message?.content)
        ? message.content.map((c) => (typeof c === "string" ? c : c?.text || "")).join("")
        : "";
    return content || "";
  } catch (error) {
    console.error(error);
    return error?.message || "Ocurrió un error al generar la respuesta.";
  }
};
