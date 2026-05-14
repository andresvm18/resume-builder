export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
  },

  RESUME: {
    GENERATE: "/resume",
    GET_ALL: "/resume",
    GET_BY_ID: (id: string) => `/resume/${id}`,
    DOWNLOAD: (id: string) => `/resume/${id}/download`,
    UPDATE: (id: string) => `/resume/${id}`,
    DELETE: (id: string) => `/resume/${id}`,
    DUPLICATE: (id: string) => `/resume/${id}/duplicate`,
  },

  AI: {
    OPTIMIZE_SUMMARY: "/ai/optimize-summary",
    RECOMMENDATIONS: "/ai/recommendations",
    OPTIMIZE_RESUME: "/ai/optimize-resume",
    FINAL_ATS_ANALYSIS: "/ai/final-ats-analysis",
  },

  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
    GENERATE_FROM_PROFILE: "/profile/generate-resume",
  },

  HEALTH: "/health",
} as const;