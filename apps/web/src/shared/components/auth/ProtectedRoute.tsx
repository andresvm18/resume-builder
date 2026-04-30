import { Navigate, Outlet } from "react-router-dom";
import { getAuthToken } from "../../../modules/auth/services/auth.service";

export default function ProtectedRoute() {
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}