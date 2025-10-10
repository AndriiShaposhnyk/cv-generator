import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { clean, splitSkills, splitLines } from "./textSanitize";

export type ResumeFormData = {
  fullName: string;
  email: string;
  city: string;
  phone: string;
  education: string;
  skills: string;
  experience: string;
  aboutYourself: string;
  interests: string;
  useAI: boolean;
};

export async function buildResumeBuffer(form: ResumeFormData): Promise<Buffer> {
  const name = clean(form.fullName);
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
            children: [new TextRun([city, email, phone].filter(Boolean).join(" • "))],
          }),
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "" })] }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Education", bold: true, size: 26 })],
            spacing: { after: 200 },
          }),
          ...(educationArr.length
            ? educationArr.map(
                (line) =>
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    text: line,
                    bullet: { level: 0 },
                    spacing: { after: 120 },
                  })
              )
            : [new Paragraph({ alignment: AlignmentType.CENTER, text: "-" })]),

          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "" })] }),

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
                    alignment: AlignmentType.CENTER,
                  })
              )
            : [new Paragraph("-")]),

          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "" })] }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Experience", bold: true })],
            spacing: { after: 200 },
          }),
          ...(expArr.length
            ? expArr.map((line) => new Paragraph({ text: line, spacing: { after: 120 } }))
            : [new Paragraph("-")]),

          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "" })] }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "About Me", bold: true })],
            spacing: { after: 200 },
          }),
          new Paragraph({ text: about || "-" }),

          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "" })] }),
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
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
