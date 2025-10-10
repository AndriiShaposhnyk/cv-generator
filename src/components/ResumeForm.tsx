import { useResumeForm } from "./useResumeForm";

export default function ResumeForm() {
  const { form, generating, onChange, handleGenerate } = useResumeForm();

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
            placeholder="BA in Computer Science, 2024 - University X"
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
        </button>
      </div>
    </div>
  );
}

