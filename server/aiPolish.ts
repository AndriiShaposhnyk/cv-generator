// aiPolish.ts (тимчасовий тестовий варіант)
export async function polishTextWithAI(rawText: string): Promise<string> {
  const url = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-1.5B-Instruct";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      inputs: `Rewrite professionally:\n\n${rawText}`,
      parameters: { max_new_tokens: 200 },
    }),
  });

  const text = await res.text();
  console.log("[HF/fetch] status:", res.status);
  console.log("[HF/fetch] body:", text.slice(0, 300));

  if (res.ok) {
    try {
      const data = JSON.parse(text);
      const result = Array.isArray(data) ? data?.[0]?.generated_text : data?.generated_text;
      if (typeof result === "string" && result.trim()) return result.trim();
    } catch {}
  }
  throw new Error(`HF_fetch_${res.status}: ${text}`);
}



