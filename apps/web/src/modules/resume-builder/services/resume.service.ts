export async function fetchUserResumes() {
  const token = localStorage.getItem("auth_token");

  const response = await fetch("http://localhost:8080/api/resume", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching resumes");
  }

  return response.json();
}

export async function downloadResumeById(resumeId: string) {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(
    `http://localhost:8080/api/resume/${resumeId}/download`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error downloading resume");
  }

  return response.blob();
}