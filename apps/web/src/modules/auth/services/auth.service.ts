import { apiRequest } from "../../../shared/services/apiClient";

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser(email: string, password: string) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUser() {
  return apiRequest<{ user: AuthResponse["user"] }>("/auth/me");
}

export function saveAuthSession(data: AuthResponse) {
  localStorage.setItem("auth_token", data.token);
  localStorage.setItem("auth_user", JSON.stringify(data.user));
  window.dispatchEvent(new Event("auth-change"));
}

export function getAuthToken() {
  return localStorage.getItem("auth_token");
}

export function getAuthUser(): AuthResponse["user"] | null {
  const user = localStorage.getItem("auth_user");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    localStorage.removeItem("auth_user");
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  window.dispatchEvent(new Event("auth-change"));
}