import OpenAI from "openai";

// Cliente OpenAI (router Hugging Face) compatible con navegador
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.REACT_APP_HF_TOKEN || process.env.HF_TOKEN,
  dangerouslyAllowBrowser: true,
});

export const sendMsgToAI = async (msg) => {
  if (!client.apiKey) {
    console.warn(
      "REACT_APP_HF_TOKEN (o HF_TOKEN) no está definido en .env.local"
    );
    return "Falta configurar el token de Hugging Face.";
  }

  try {
    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/Llama-3.1-8B-Instruct:cerebras",
      messages: [
        { role: "user", content: msg },
      ],
      // Puedes ajustar hiperparámetros si el router lo soporta
      // extra_body: { temperature: 0.2, top_p: 0.95, max_tokens: 512 },
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
