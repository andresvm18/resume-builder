import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../../modules/landing/pages/LandingPage";
import LoginPage from "../../modules/auth/pages/LoginPage";
import RegisterPage from "../../modules/auth/pages/RegisterPage";
import DashboardPage from "../../modules/dashboard/pages/DashboardPage";
import ResumeBuilderPage from "../../modules/resume-builder/pages/ResumeBuilderPage";
import ResumeGeneratePage from "../../modules/resume-builder/pages/ResumeGeneratePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/dashboard",
    element: <DashboardPage />
  },
  {
    path: "/resume-builder",
    element: <ResumeBuilderPage />
  },
  {
    path: "/resume/generate",
    element: <ResumeGeneratePage />,
  }
]);