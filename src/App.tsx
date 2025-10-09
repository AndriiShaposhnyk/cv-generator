import ResumeForm from "./components/ResumeForm";

export default function App() {
  return (
    <div
      style={{
        inset: 0,
        display: "grid",
        placeItems: "center",
        backgroundColor: "#f9f9f9",
        fontFamily: "Inter, system-ui, Arial",
      }}
    >
      <div
        style={{
          width: "min(600px, 100%)",
          maxWidth: 600,
          background: "#fff",
          borderRadius: 12,
          padding: "2rem",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Resume Builder
        </h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem" }}>
          Fill out the form below to generate your resume.
        </p>
        <ResumeForm />
      </div>
    </div>
  );
}

