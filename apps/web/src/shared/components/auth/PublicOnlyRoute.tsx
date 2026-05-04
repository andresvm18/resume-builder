import { Navigate, Outlet } from "react-router-dom";
import { getAuthToken } from "../../../modules/auth/services/auth.service";

export default function PublicOnlyRoute() {
  const token = getAuthToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}