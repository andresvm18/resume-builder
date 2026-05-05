import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getAuthToken,
  getAuthUser,
  getCurrentUser,
  logoutUser,
  saveAuthSession,
  type AuthResponse,
} from "../../modules/auth/services/auth.service";
import { AuthContext, type AuthContextValue } from "./AuthContext";

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthResponse["user"] | null>(getAuthUser());
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    const token = getAuthToken();

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await getCurrentUser();
      setUser(response.user);
    } catch {
      logoutUser();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (data: AuthResponse) => {
    saveAuthSession(data);
    setUser(data.user);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  useEffect(() => {
    let isMounted = true;

    const validateInitialSession = async () => {
      const token = getAuthToken();

      if (!token) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await getCurrentUser();

        if (isMounted) {
          setUser(response.user);
        }
      } catch {
        logoutUser();

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const handleAuthChange = () => {
      queueMicrotask(() => {
        setUser(getAuthUser());
      });
    };

    window.addEventListener("auth-change", handleAuthChange);

    void validateInitialSession();

    return () => {
      isMounted = false;
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      refreshSession,
      login,
      logout,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}