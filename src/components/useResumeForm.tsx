import { useState } from "react";
import { saveAs } from "file-saver";
import type { ResumeFormData } from "./resume.types";
import { generateResumeDoc } from "./generateResumeDoc";
import { safeFileName } from "./textSanitize";

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
      const blob = await generateResumeDoc(form);
      saveAs(blob, `${safeFileName(form.fullName)}.docx`);
    } catch (err) {
      console.error("Error generating docx:", err);
      alert("OPS, Error occured!");
    } finally {
      setGenerating(false);
    }
  };

  return { form, setForm, generating, onChange, handleGenerate };
}
