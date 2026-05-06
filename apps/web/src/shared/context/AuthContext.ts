import { createContext } from "react";
import type { AuthResponse } from "../../modules/auth/services/auth.service";

export type AuthContextValue = {
  user: AuthResponse["user"] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
  login: (data: AuthResponse) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);