import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAuthToken,
  logoutUser,
  getCurrentUser,
} from "../../../modules/auth/services/auth.service";

export default function ProtectedRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      const token = getAuthToken();

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch {
        logoutUser();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

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