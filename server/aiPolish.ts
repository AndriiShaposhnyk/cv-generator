
export async function polishTextWithAI(rawText: string): Promise<string> {
  const HF_URL = "https://api-inference.huggingface.co/models/google/gemma-2-2b-it";

  if (!process.env.HF_API_KEY) {
    throw new Error("HF_API_KEY is missing. Please set it in your .env file.");
  }

  const res = await fetch(HF_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      inputs: `Rewrite this text in a professional tone, keeping meaning and improving grammar:\n\n${rawText}`,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
      },
      options: {
        wait_for_model: true, 
        use_cache: true,
      },
    }),
  });

  const text = await res.text();

  console.log("[HF/fetch] status:", res.status);
  console.log("[HF/fetch] preview:", text.slice(0, 300));

  if (!res.ok) {
    if (res.status === 401) throw new Error("HF 401 Unauthorized: check your HF_API_KEY");
    if (res.status === 403) throw new Error("HF 403 Forbidden: model requires accepting license");
    if (res.status === 404) throw new Error("HF 404: Model not found or not public");
    if (res.status === 429) throw new Error("HF 429: Too many requests, please slow down");
    if (res.status === 503) throw new Error("HF 503: Model is loading, try again shortly");

    throw new Error(`HF error ${res.status}: ${text.slice(0, 200)}`);
  }

  try {
    const data = JSON.parse(text);
    const result =
      Array.isArray(data)
        ? data[0]?.generated_text
        : data?.generated_text || data?.text;

    if (typeof result === "string" && result.trim()) {
      return result.replace(/^Rewrite this text.*?:\s*/i, "").trim();
    }
  } catch (err) {
    console.error("HF parse error:", err);
  }

  throw new Error(`HF returned unexpected output: ${text.slice(0, 300)}`);
}




