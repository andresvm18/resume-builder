import * as Sentry from "@sentry/react";
import { env } from "./env";

export function initializeSentry() {
  if (!env.SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.MODE,
    tracesSampleRate: env.isProduction ? 0.05 : 1.0,
  });
}