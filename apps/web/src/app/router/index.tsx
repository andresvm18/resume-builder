import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../../modules/landing/pages/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
]);