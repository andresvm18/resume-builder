import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../shared/context/useAuth";

export default function ProtectedRoute() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Verificando sesión...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}