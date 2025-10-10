import "dotenv/config";
import express from "express";
import cors from "cors";
import { buildResumeBuffer, type ResumeFormData } from "./resumeDoc";
import { safeFileName } from "./textSanitize";
import { polishTextWithAI } from "./aiPolish";

console.log("HF_API_KEY:", process.env.HF_API_KEY?.slice(0, 10) + "...");
const app = express();
app.use(cors({ origin: true }));  
app.use(express.json({ limit: "1mb" }));

app.post("/api/generate-resume", async (req, res) => {
  try { console.log("Incoming data:", req.body);
    const form = req.body as ResumeFormData;

    // Мінімальна валідація
    if (!form.fullName || !form.email || !form.phone || !form.city) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    // перевірка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    // перевірка телефону
    const phoneRegex = /^[0-9+()\-.\s]{7,20}$/;
    if (!phoneRegex.test(form.phone)) {
      return res.status(400).json({ error: "Invalid phone format." });
    }
    
    const rawUseAI = (req.body as any).useAI;
    const wantAI =
      rawUseAI === true ||
      rawUseAI === 1 ||
      (typeof rawUseAI === "string" && ["true", "1", "on", "yes"].includes(rawUseAI.toLowerCase()));

    const finalForm = { ...form };

    if (wantAI) {
      try {
        if (form.aboutYourself?.trim()) {
          finalForm.aboutYourself = await polishTextWithAI(form.aboutYourself);
          console.log("✅ AI used");
        }
      } catch (e) {
        console.warn("⚠️ AI failed — using original fields:", (e as Error).message);
      }
    }

    // якщо все ок — генеруємо DOCX
    const buffer = await buildResumeBuffer(finalForm);
    const filename = `${safeFileName(finalForm.fullName, "resume")}.docx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(200).send(buffer);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to generate resume" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`DOCX server running on http://localhost:${PORT}`);
});

app.get("/", (_req, res) => {
  res.send("DOCX API is running 🚀");
});
