import { useState } from "react";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";

export default function ResumeForm() {
  const [form, setForm] = useState({
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

  const clean = (s?: string) => (s ?? "").trim();
  const splitSkills = (raw: string) =>
  raw
    .split(/[\n,]/g)
    .map((s) => s.trim())
    .filter(Boolean);
    const safeFileName = (raw: string, fallback = "resume") =>
  (raw || fallback).replace(/[^\w\s\-]+/g, "").trim() || fallback; 
    const splitLines = (raw: string) => 
        raw.split(/\n/g).map(s => s.trim()).filter(Boolean);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const name = clean(form.fullName) 
      const city = clean(form.city);
      const email = clean(form.email).toLowerCase();
      const phone = clean(form.phone);
      const about = clean(form.aboutYourself);
      const interests = clean(form.interests);

      const skillsArr = splitSkills(form.skills);
      const expArr = splitLines(form.experience);
      const educationArr = splitLines(form.education);

      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: name, bold: true, size: 32 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun([city, email, phone].filter(Boolean).join(" • ")),
                ],
              }),
              new Paragraph({ alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "" })] }),

              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Education", bold: true, size: 26 })],
                spacing: { after: 200 },
              }),
              ...(educationArr.length
          ? educationArr.map(line =>
              new Paragraph({
                alignment: AlignmentType.CENTER,
                text: line,
                bullet: { level: 0 },
                spacing: { after: 120 },
              })
            )
          : [new Paragraph({ alignment: AlignmentType.CENTER, text: "-" })]),
              

              new Paragraph({ alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "" })] }),

              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Skills", bold: true })],
                spacing: { after: 200 },
              }), 
              ...(skillsArr.length
                ? skillsArr.map(
                    (skill) =>
                      new Paragraph({
                        text: skill,
                        bullet: { level: 0 },
                        spacing: { after: 100 },
                        alignment: AlignmentType.CENTER
                      })
                  )
                : [new Paragraph("-")]),

              new Paragraph({ alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "" })] }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Experience", bold: true })],
                spacing: { after: 200 },
              }),
              ...(expArr.length
                ? expArr.map(
                    (line) =>
                      new Paragraph({
                        text: line,
                        spacing: { after: 120 },
                      })
                  )
                : [new Paragraph("-")]),

              new Paragraph({ alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "" })] }),
              new Paragraph({ 
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "About Me", bold: true })],
                spacing: { after: 200 },
              }),
              new Paragraph({ text: about || "-" }),

              new Paragraph({ 
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "" })] }),

              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Interests", bold: true })],
                spacing: { after: 200 },
              }),
              new Paragraph({ text: interests || "-" }),
            ],
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${safeFileName(form.fullName)}.docx`);
    } catch (err) {
      console.error("Error generating docx:", err);
      alert("OPS, Error occured!");
    } finally {
      setGenerating(false);
    }
  };

  <button
    onClick={handleGenerate}
    disabled={generating}
    style={{
      padding: "10px 14px",
      borderRadius: 10,
      border: "1px solid #222",
      background: generating ? "#555" : "#111",
      color: "#fff",
      cursor: generating ? "not-allowed" : "pointer",
      fontWeight: 600,
    }}
  >
    {generating ? "Generating…" : "Generate .docx"}
  </button>;

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          width: "min(520px, 100%)",
          display: "grid",
          gap: 12,
          margin: "0 auto",
          justifyItems: "stretch",
        }}
      >
        <label>
          Full name*
          <input
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            placeholder="Jane Doe"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 6,
            }}
          />
        </label>
        <label>
          City*
          <input
            name="city"
            value={form.city}
            onChange={onChange}
            placeholder="Toronto, ON"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 6,
            }}
          />
        </label>
        <label>
          Email*
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="jane@example.com"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 6,
            }}
          />
        </label>
        <label>
          Phone
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="+1 555 000 1234"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 6,
            }}
          />
        </label>
        <label>
          Education
          <textarea
            name="education"
            value={form.education}
            onChange={onChange}
            rows={3}
            placeholder="BSc in Computer Science, 2024 - University X"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 6,
              resize: "vertical",
            }}
          />
        </label>
        <label>
          Skills* (comma-separated or multi-line)
          <textarea
            name="skills"
            value={form.skills}
            onChange={onChange}
            rows={3}
            placeholder="React, Node.js, SQL, Git"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 6,
              resize: "vertical",
            }}
          />
        </label>
        <label>
          Experience* (free text)
          <textarea
            name="experience"
            value={form.experience}
            onChange={onChange}
            rows={5}
            placeholder="Describe roles, responsibilities, achievements…"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 6,
              resize: "vertical",
            }}
          />
        </label>
        <label>
          About yourself
          <textarea
            name="aboutYourself"
            value={form.aboutYourself}
            onChange={onChange}
            rows={3}
            placeholder="Tell briefly about your professional background, motivation, or personal strengths."
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 6,
              resize: "vertical",
            }}
          />
        </label>
        <label>
          Interests
          <textarea
            name="interests"
            value={form.interests}
            onChange={onChange}
            rows={3}
            placeholder="Optional: hobbies, volunteering, sports, reading, etc."
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 6,
              resize: "vertical",
            }}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            name="useAI"
            checked={form.useAI}
            onChange={onChange}
          />
          Use AI
        </label>
        <button
          onClick={handleGenerate}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #222",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Generate .docx
        </button>
      </div>
    </div>
  );
}
