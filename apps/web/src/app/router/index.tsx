import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../../modules/landing/pages/LandingPage";
import LoginPage from "../../modules/auth/pages/LoginPage";
import RegisterPage from "../../modules/auth/pages/RegisterPage";
import DashboardPage from "../../modules/dashboard/pages/DashboardPage";
import ResumeBuilderPage from "../../modules/resume-builder/pages/ResumeBuilderPage";
import ResumeGeneratePage from "../../modules/resume-builder/pages/ResumeGeneratePage";
import ResumeOptimizePage from "../../modules/resume-builder/pages/ResumeOptimizePage";
import ProtectedRoute from "../../shared/components/auth/ProtectedRoute";
import PublicOnlyRoute from "../../shared/components/auth/PublicOnlyRoute";
import AppErrorBoundary from "../../shared/components/error/AppErrorBoundary";
import ProfilePage from "../../modules/profile/pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/resume-builder",
        children: [
          {
            index: true,
            element: <ResumeBuilderPage />,
          },
          {
            path: ":id",
            element: <ResumeBuilderPage />,
          },
        ],
      },
      {
        path: "/resume/generate",
        element: <ResumeGeneratePage />,
      },
      {
        path: "/resume/optimize",
        element: <ResumeOptimizePage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />
      },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
    errorElement: <AppErrorBoundary />,
  },
]);