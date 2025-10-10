import "dotenv/config";

(async () => {
  const url = "https://api-inference.huggingface.co/models/google/gemma-2-2b-it";
  const key = process.env.HF_API_KEY;
  console.log("HF key prefix:", key?.slice(0,5));
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inputs: "Hello HF", options: { wait_for_model: true } }),
  });
  console.log("Status:", r.status, r.statusText);
  console.log("X-Error-Message:", r.headers.get("X-Error-Message"));
  console.log("Body head:", (await r.text()).slice(0,200));
})();
