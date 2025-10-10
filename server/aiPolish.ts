import { HfInference } from "@huggingface/inference";

const MODEL = process.env.HF_MODEL ?? "google/gemma-2-2b-it";

const HF_API_KEY = process.env.HF_API_KEY;
if (!HF_API_KEY) throw new Error("HF_API_KEY is missing");

const hf = new HfInference(HF_API_KEY);

/**
 * Полірує текст до CV-стилю англійською, використовуючи Hugging Face ChatCompletion API.
 * Повертає відредагований текст або прибраний оригінал як fallback.
 */
export async function polishTextWithAI(rawText: string): Promise<string> {
  try {
    const res = await hf.chatCompletion({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that rewrites user text into professional, concise CV-style English. " +
            "Keep meaning, fix grammar, improve clarity. Do NOT add new facts. Output ONLY the improved text.",
        },
        {
          role: "user",
          content: rawText,
        },
      ],
      max_tokens: 300,
      temperature: 0.3,
      top_p: 0.9,
      options: { wait_for_model: true, use_cache: true },
    });

    const text = res?.choices?.[0]?.message?.content?.toString().trim() ?? "";

    if (!text || norm(text) === norm(rawText)) {
      return cleanupFallback(rawText);
    }
    return text;
  } catch (err: any) {
    console.error(
      `[HF chat] model=${MODEL} | name=${err?.name ?? "Error"} | message=${err?.message ?? err} | status=${
        err?.status ?? "?"
      }`
    );

    // обробка типових статусів 
    if (err?.status === 401) throw new Error("HF 401: check HF_API_KEY");
    if (err?.status === 403)
      throw new Error("HF 403: accept model license on huggingface.co");
    if (err?.status === 404)
      throw new Error(`HF 404: Model not available (model=${MODEL})`);
    if (err?.status === 429) throw new Error("HF 429: rate limit exceeded");
    if (err?.status === 503)
      throw new Error("HF 503: model loading, please retry");

    return cleanupFallback(rawText);
  }
}

// ===== helpers =====

function cleanupFallback(text: string): string {
  // Прибираємо подвоєні пробіли і додаємо пробіл після крапки
  return text
    .replace(/\s{2,}/g, " ")
    .replace(/(\.)(\S)/g, "$1 $2")
    .trim();
}

function norm(s: string): string {
  return s.replace(/\s+/g, " ").trim().toLowerCase();
}







