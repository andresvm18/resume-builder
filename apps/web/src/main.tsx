import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./shared/context/AuthProvider";
import { ThemeProvider } from "./shared/context/ThemeProvider";
import { ToastProvider } from "./shared/context/ToastProvider";

import { router } from "./app/router";

import "./shared/styles/variables.css";
import "./shared/styles/animations.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);