import { useState } from "react";
import type { ResumeFormData } from "./resume.types";

const safeFileName = (raw: string, fallback = "resume") =>
  (raw || fallback).replace(/[^\w\s\-]+/g, "").trim() || fallback;

const DEFAULT_FORM: ResumeFormData = {
  fullName: "",
  email: "",
  city: "",
  phone: "",
  education: "",
  skills: "",
  experience: "",
  aboutYourself: "",
  interests: "",
  useAI: true,
};

export function useResumeForm(initial?: Partial<ResumeFormData>) {
  const [form, setForm] = useState<ResumeFormData>({
    ...DEFAULT_FORM,
    ...initial,
  });
  const [generating, setGenerating] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as any;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);

      const res = await fetch("http://localhost:4000/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        let msg = "Validation failed";
        try {
        const payload = await res.json();
        msg = payload?.error || msg;
      } catch {}
      alert(msg);
      return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const filename = `${safeFileName(form.fullName)}.docx`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generating docx:", err);
      alert("OPS, Error occured!");
    } finally {
      setGenerating(false);
    }
  };

  return { form, setForm, generating, onChange, handleGenerate };
}
