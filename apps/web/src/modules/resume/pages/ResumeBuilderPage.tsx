import { useRef, useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Header from "../../../shared/components/layout/Header";
import ResumePreview from "../components/ResumePreview";

type Experience = {
  id: number;
  title: string;
  location: string;
  description: string;
};

type Education = {
  id: number;
  institution: string;
  degree: string;
};

type Language = {
  id: number;
  name: string;
  level: "Basic" | "Intermediate" | "Advanced" | "Native" | "Fluent";
};

type Project = {
  id: number;
  name: string;
  technologies: string;
  description: string;
  link: string;
};

export default function ResumeBuilderPage() {
  const resumeRef = useRef<HTMLDivElement>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [summary, setSummary] = useState("");

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [languages, setLanguages] = useState<Language[]>([
    { id: Date.now(), name: "", level: "Basic" }
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([
    { id: 1, title: "", location: "", description: "" },
  ]);

  const [education, setEducation] = useState<Education[]>([
    { id: 1, institution: "", degree: "" },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: "", technologies: "", description: "", link: "" },
  ]);

  const [isExporting, setIsExporting] = useState(false);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("resume-data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFullName(data.fullName || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setLocation(data.location || "");
        setSummary(data.summary || "");
        setSkills(data.skills || []);
        setLanguages(data.languages || [{ id: Date.now(), name: "", level: "Basic" }]);
        setExperiences(data.experiences || [{ id: 1, title: "", location: "", description: "" }]);
        setEducation(data.education || [{ id: 1, institution: "", degree: "" }]);
        setProjects(data.projects || [{ id: 1, name: "", technologies: "", description: "", link: "" }]);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    const dataToSave = {
      fullName,
      email,
      phone,
      location,
      summary,
      skills,
      languages,
      experiences,
      education,
      projects,
    };
    localStorage.setItem("resume-data", JSON.stringify(dataToSave));
  }, [fullName, email, phone, location, summary, skills, languages, experiences, education, projects]);

  const addSkill = () => {
    if (skillInput.trim()) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addLanguage = () => {
    setLanguages([
      ...languages,
      { id: Date.now(), name: "", level: "Basic" },
    ]);
  };

  const updateLanguage = (id: number, field: keyof Language, value: string) => {
    setLanguages(
      languages.map((lang) =>
        lang.id === id ? { ...lang, [field]: value as any } : lang
      )
    );
  };

  const removeLanguage = (id: number) => {
    setLanguages(languages.filter((lang) => lang.id !== id));
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { id: Date.now(), title: "", location: "", description: "" },
    ]);
  };

  const updateExperience = (
    id: number,
    field: keyof Experience,
    value: string
  ) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const removeExperience = (id: number) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { id: Date.now(), institution: "", degree: "" },
    ]);
  };

  const updateEducation = (
    id: number,
    field: keyof Education,
    value: string
  ) => {
    setEducation(
      education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const removeEducation = (id: number) => {
    setEducation(education.filter((edu) => edu.id !== id));
  };

  const addProject = () => {
    setProjects([
      ...projects,
      { id: Date.now(), name: "", technologies: "", description: "", link: "" },
    ]);
  };

  const updateProject = (
    id: number,
    field: keyof Project,
    value: string
  ) => {
    setProjects(
      projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    );
  };

  const removeProject = (id: number) => {
    setProjects(projects.filter((proj) => proj.id !== id));
  };

  const handleExportPDF = async () => {
    if (!resumeRef.current) return;
    
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 10;
      const contentWidth = pdfWidth - margin * 2;

      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = margin;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight - margin * 2;

      while (heightLeft > 0) {
        position = margin - (imgHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight - margin * 2;
      }

      pdf.save("resume.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const loadSampleData = () => {
    setFullName("John Doe");
    setEmail("john.doe@example.com");
    setPhone("+1 234 567 890");
    setLocation("New York, USA");
    setSummary("Experienced software developer with 5+ years of experience in web development.");
    setSkills(["React", "TypeScript", "Node.js", "Python", "SQL"]);
    setLanguages([
      { id: Date.now(), name: "English", level: "Native" },
      { id: Date.now() + 1, name: "Spanish", level: "Advanced" },
    ]);
    setExperiences([
      { id: 1, title: "Frontend Developer", location: "Tech Company, New York", description: "Developed responsive web applications using React and TypeScript." },
    ]);
    setEducation([
      { id: 1, institution: "University of Technology", degree: "Bachelor of Science in Computer Science" },
    ]);
    setProjects([
      { id: 1, name: "E-commerce Platform", technologies: "React, Node.js, MongoDB", description: "Developed a full-stack e-commerce platform with payment integration.", link: "https://github.com/johndoe/ecommerce" },
      { id: 2, name: "Task Management App", technologies: "TypeScript, Next.js, Tailwind", description: "Created a task management application with real-time updates.", link: "https://github.com/johndoe/task-app" },
    ]);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-2">
        {/* FORM */}
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              Resume Builder
            </h2>
            <p className="mt-2 text-gray-600">
              Build your ATS-friendly resume in minutes.
            </p>
            <button
              onClick={loadSampleData}
              type="button"
              className="mt-4 rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
            >
              Load Sample Data
            </button>
          </div>

          {/* Personal Info */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold">
              Personal Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="rounded-2xl border border-gray-300 px-4 py-3"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="rounded-2xl border border-gray-300 px-4 py-3"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="rounded-2xl border border-gray-300 px-4 py-3"
              />

              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="rounded-2xl border border-gray-300 px-4 py-3"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold">
              Professional Summary
            </h3>

            <textarea
              rows={5}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write your professional summary..."
              className="w-full rounded-2xl border border-gray-300 px-4 py-3"
            />
          </div>

          {/* Skills */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold">Skills</h3>

            <div className="flex gap-3">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill"
                className="flex-1 rounded-2xl border border-gray-300 px-4 py-3"
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <button
                onClick={addSkill}
                type="button"
                className="rounded-2xl bg-black px-5 py-3 text-white"
              >
                Add
              </button>
            </div>

            {/* Display skills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
                  {skill}
                  <button
                    onClick={() => removeSkill(index)}
                    type="button"
                    className="text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold">Languages</h3>

            {languages.map((lang) => (
              <div key={lang.id} className="mb-4 flex items-center gap-3">
                <input
                  placeholder="Language (e.g., English, Spanish)"
                  value={lang.name}
                  onChange={(e) =>
                    updateLanguage(lang.id, "name", e.target.value)
                  }
                  className="flex-1 rounded-2xl border border-gray-300 px-4 py-3"
                />

                <select
                  value={lang.level}
                  onChange={(e) =>
                    updateLanguage(lang.id, "level", e.target.value)
                  }
                  className="rounded-2xl border border-gray-300 px-4 py-3"
                >
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Native">Native</option>
                </select>

                <button
                  onClick={() => removeLanguage(lang.id)}
                  type="button"
                  className="rounded-2xl border border-red-300 px-4 py-3 text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              onClick={addLanguage}
              type="button"
              className="rounded-2xl border px-4 py-2"
            >
              + Add Language
            </button>
          </div>

          {/* Experience */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold">Experience</h3>

            {experiences.map((exp) => (
              <div key={exp.id} className="mb-6 space-y-3">
                <div className="flex gap-3">
                  <input
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={(e) =>
                      updateExperience(exp.id, "title", e.target.value)
                    }
                    className="flex-1 rounded-2xl border border-gray-300 px-4 py-3"
                  />
                  <button
                    onClick={() => removeExperience(exp.id)}
                    type="button"
                    className="rounded-2xl border border-red-300 px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>

                <input
                  placeholder="Company / Location"
                  value={exp.location}
                  onChange={(e) =>
                    updateExperience(exp.id, "location", e.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3"
                />

                <textarea
                  rows={3}
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) =>
                    updateExperience(exp.id, "description", e.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3"
                />
              </div>
            ))}

            <button
              onClick={addExperience}
              type="button"
              className="rounded-2xl border px-4 py-2"
            >
              + Add Experience
            </button>
          </div>

          {/* Projects */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold">Projects</h3>

            {projects.map((proj) => (
              <div key={proj.id} className="mb-6 space-y-3">
                <div className="flex gap-3">
                  <input
                    placeholder="Project Name"
                    value={proj.name}
                    onChange={(e) =>
                      updateProject(proj.id, "name", e.target.value)
                    }
                    className="flex-1 rounded-2xl border border-gray-300 px-4 py-3"
                  />
                  <button
                    onClick={() => removeProject(proj.id)}
                    type="button"
                    className="rounded-2xl border border-red-300 px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>

                <input
                  placeholder="Technologies Used (e.g., React, Node.js, MongoDB)"
                  value={proj.technologies}
                  onChange={(e) =>
                    updateProject(proj.id, "technologies", e.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3"
                />

                <textarea
                  rows={3}
                  placeholder="Project Description"
                  value={proj.description}
                  onChange={(e) =>
                    updateProject(proj.id, "description", e.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3"
                />

                <input
                  placeholder="Project Link (GitHub, Live Demo, etc.)"
                  value={proj.link}
                  onChange={(e) =>
                    updateProject(proj.id, "link", e.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3"
                />
              </div>
            ))}

            <button
              onClick={addProject}
              type="button"
              className="rounded-2xl border px-4 py-2"
            >
              + Add Project
            </button>
          </div>

          {/* Education */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold">Education</h3>

            {education.map((edu) => (
              <div key={edu.id} className="mb-6 space-y-3">
                <div className="flex gap-3">
                  <input
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(edu.id, "institution", e.target.value)
                    }
                    className="flex-1 rounded-2xl border border-gray-300 px-4 py-3"
                  />
                  <button
                    onClick={() => removeEducation(edu.id)}
                    type="button"
                    className="rounded-2xl border border-red-300 px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>

                <input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(edu.id, "degree", e.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3"
                />
              </div>
            ))}

            <button
              onClick={addEducation}
              type="button"
              className="rounded-2xl border px-4 py-2"
            >
              + Add Education
            </button>
          </div>

          {/* Export */}
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="w-full rounded-2xl bg-black px-6 py-4 text-lg font-semibold text-white disabled:opacity-50"
          >
            {isExporting ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>

        {/* PREVIEW */}
        <div ref={resumeRef}
          className="mx-auto w-[794px] min-h-[1123px] bg-white p-12 shadow-lg">
          <ResumePreview
            fullName={fullName}
            email={email}
            phone={phone}
            location={location}
            summary={summary}
            skills={skills}
            languages={languages}
            experiences={experiences}
            education={education}
            projects={projects}
          />
        </div>
      </section>
    </main>
  );
}