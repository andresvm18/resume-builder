type ResumePreviewProps = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  languages: { id: number; name: string; level: string }[];
  experiences: { id: number; title: string; location: string; description: string }[];
  education: { id: number; institution: string; degree: string }[];
  projects: { id: number; name: string; technologies: string; description: string; link: string }[];
};

export default function ResumePreview({
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
}: ResumePreviewProps) {
  const hasData = fullName || email || skills.length > 0 || languages.length > 0 || projects.length > 0;

  if (!hasData) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <div className="text-center text-gray-400">
          <p className="text-lg">Your resume preview will appear here</p>
          <p className="mt-2 text-sm">Start filling the form to see the magic ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      <h2 className="text-3xl font-bold">
        {fullName || "Your Name"}
      </h2>

      <p className="mt-2 text-gray-600">
        {email || "email@example.com"} | {phone || "+000 000 000"} |{" "}
        {location || "Your Location"}
      </p>

      <section className="mt-8">
        <h3 className="border-b pb-2 text-xl font-semibold">
          Professional Summary
        </h3>
        <p className="mt-3 text-gray-700">
          {summary || "Your professional summary will appear here."}
        </p>
      </section>

      <section className="mt-8">
        <h3 className="border-b pb-2 text-xl font-semibold">Experience</h3>

        {experiences.length > 0 && experiences.some(exp => exp.title || exp.location || exp.description) ? (
          experiences.map((exp) => (
            (exp.title || exp.location || exp.description) && (
              <div key={exp.id} className="mt-4">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold">{exp.title || "Job Title"}</h4>
                  {exp.location && (
                    <span className="text-sm text-gray-500">{exp.location}</span>
                  )}
                </div>
                <p className="mt-2 text-gray-700">
                  {exp.description || "Experience details"}
                </p>
              </div>
            )
          ))
        ) : (
          <p className="mt-3 text-gray-500">
            Your experience will appear here.
          </p>
        )}
      </section>

      <section className="mt-8">
        <h3 className="border-b pb-2 text-xl font-semibold">Projects</h3>

        {projects.length > 0 && projects.some(proj => proj.name || proj.description) ? (
          projects.map((proj) => (
            (proj.name || proj.description) && (
              <div key={proj.id} className="mt-4">
                <div className="flex justify-between items-baseline flex-wrap gap-2">
                  <h4 className="font-bold">{proj.name || "Project Name"}</h4>
                  {proj.technologies && (
                    <span className="text-sm text-gray-500">{proj.technologies}</span>
                  )}
                </div>
                <p className="mt-2 text-gray-700">
                  {proj.description || "Project description"}
                </p>
                {proj.link && (
                  <a 
                    href={proj.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                  >
                    View Project →
                  </a>
                )}
              </div>
            )
          ))
        ) : (
          <p className="mt-3 text-gray-500">
            Your projects will appear here.
          </p>
        )}
      </section>

      <section className="mt-8">
        <h3 className="border-b pb-2 text-xl font-semibold">Education</h3>

        {education.length > 0 && education.some(edu => edu.institution || edu.degree) ? (
          education.map((edu) => (
            (edu.institution || edu.degree) && (
              <div key={edu.id} className="mt-4">
                <h4 className="font-bold">
                  {edu.institution || "Institution"}
                </h4>
                <p className="text-gray-700">
                  {edu.degree || "Degree"}
                </p>
              </div>
            )
          ))
        ) : (
          <p className="mt-3 text-gray-500">
            Your education will appear here.
          </p>
        )}
      </section>

      <section className="mt-8">
        <h3 className="border-b pb-2 text-xl font-semibold">Skills</h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill, i) => (
              <span
                key={i}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-500">Your skills will appear here.</p>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h3 className="border-b pb-2 text-xl font-semibold">Languages</h3>

        <div className="mt-3 space-y-2">
          {languages.length > 0 && languages.some(lang => lang.name) ? (
            languages.map((lang) => (
              lang.name && (
                <div key={lang.id} className="flex justify-between items-center">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-gray-600">{lang.level}</span>
                </div>
              )
            ))
          ) : (
            <p className="text-gray-500">Your languages will appear here.</p>
          )}
        </div>
      </section>
    </div>
  );
}