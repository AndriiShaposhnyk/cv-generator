// aiPolish.ts
const MODEL = process.env.HF_MODEL || "google/gemma-2-2b-it";
const HF_URL = `https://api-inference.huggingface.co/models/${MODEL}`;

export async function polishTextWithAI(rawText: string): Promise<string> {
  const key = process.env.HF_API_KEY;
  if (!key) throw new Error("HF_API_KEY is missing");

  const prompt =
`### Instruction:
Rewrite the following text in a professional, concise CV-style English.
- Keep meaning, fix grammar, improve clarity.
- Do NOT add new facts.
- Output ONLY the improved text.

### Input:
${rawText}

### Output:
`;

  const res = await fetch(HF_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "cv-generator/1.0 (+node-fetch)",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.3,
        top_p: 0.9,
        repetition_penalty: 1.05,
        return_full_text: false,
      },
      options: { wait_for_model: true, use_cache: true },
    }),
  });

  const body = await res.text();
  const xMsg = res.headers.get("X-Error-Message") || "";
  const xCode = res.headers.get("X-Error-Code") || "";

  console.log("[HF] url:", HF_URL);
  console.log("[HF] model:", MODEL);
  console.log("[HF] status:", res.status, res.statusText, "| x-code:", xCode, "| x-msg:", xMsg);
  console.log("[HF] body head:", body.slice(0, 200));

  if (!res.ok) {
    const reason = xMsg || body.slice(0, 400) || res.statusText;

    if (res.status === 404) {
      throw new Error(`HF 404: ${reason || "Model not public/unsupported by public Inference API"} (model=${MODEL})`);
    }
    if (res.status === 401) throw new Error("HF 401: check HF_API_KEY");
    if (res.status === 403) throw new Error("HF 403: accept model license");
    if (res.status === 429) throw new Error("HF 429: rate limit");
    if (res.status === 503) throw new Error("HF 503: model loading, retry");

    throw new Error(`HF ${res.status}: ${reason}`);
  }

  let data: any;
  try { data = JSON.parse(body); } catch { data = body; }

  let out =
    (Array.isArray(data) && (data[0]?.generated_text ?? data[0]?.text)) ||
    data?.generated_text ||
    data?.text ||
    (typeof data === "string" ? data : "");

  out = String(out)
    .replace(/^###\s*Output:\s*/i, "")
    .replace(/^###\s*Instruction:.*?###\s*Input:\s*/is, "")
    .trim();

  if (!out || out.replace(/\s+/g, " ") === rawText.replace(/\s+/g, " ")) {
    const cleaned = rawText.replace(/\s{2,}/g, " ").replace(/(\.)(\S)/g, "$1 $2").trim();
    return cleaned;
  }
  return out;
}





