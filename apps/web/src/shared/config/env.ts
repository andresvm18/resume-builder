function requireEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const MODE = import.meta.env.MODE || "development";

const isProduction = MODE === "production";
const isDevelopment = MODE === "development";
const isTest = MODE === "test";

function getApiUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (isProduction) {
    return requireEnv(import.meta.env.VITE_API_URL, "VITE_API_URL");
  }

  return "http://localhost:8080/api";
}

export const env = {
  MODE,
  isProduction,
  isDevelopment,
  isTest,
  API_URL: getApiUrl(),
};