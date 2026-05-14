function requireEnv(
  value: string | undefined,
  name: string
) {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value;
}

const MODE =
  import.meta.env.MODE || "development";

const isProduction =
  MODE === "production";

const isDevelopment =
  MODE === "development";

export const env = {
  MODE,

  isProduction,

  isDevelopment,

  API_URL: requireEnv(
    import.meta.env.VITE_API_URL,
    "VITE_API_URL"
  ),
};