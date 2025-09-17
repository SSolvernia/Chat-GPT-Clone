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
    // Try to parse JSON like: { "text": "...", "emotion": "..." }
    if (content) {
      try {
        const start = content.indexOf('{');
        const end = content.lastIndexOf('}');
        const jsonSlice = start !== -1 && end !== -1 ? content.slice(start, end + 1) : content;
        const parsed = JSON.parse(jsonSlice);
        return {
          text: typeof parsed.text === 'string' ? parsed.text : String(parsed.text ?? ''),
          emotion: typeof parsed.emotion === 'string' ? parsed.emotion : undefined,
        };
      } catch (_) {
        // Fallback: return raw text
        return { text: content, emotion: undefined };
      }
    }
    return { text: "", emotion: undefined };
  } catch (error) {
    console.error(error);
    return { text: error?.message || "Ocurrió un error al generar la respuesta.", emotion: undefined };
  }
};
