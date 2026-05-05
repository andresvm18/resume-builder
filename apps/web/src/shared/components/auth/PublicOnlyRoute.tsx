import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../shared/context/useAuth";

export default function PublicOnlyRoute() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}