import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import ProtectedRoute from "./ProtectedRoute";
import * as authService from "../../../modules/auth/services/auth.service";
import { AuthProvider } from "../../context/AuthProvider";

function renderWithAuthProvider(initialRoute = "/dashboard") {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<h1>Dashboard</h1>} />
          </Route>
          <Route path="/login" element={<h1>Login</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("redirects to login when no token", async () => {
    renderWithAuthProvider();

    await waitFor(() => {
      expect(screen.getByText("Login")).toBeInTheDocument();
    });
  });

  it("renders protected content when token is valid", async () => {
    localStorage.setItem("auth_token", "valid-token");

    vi.spyOn(authService, "getCurrentUser").mockResolvedValue({
      user: {
        id: "1",
        name: "Test",
        email: "test@test.com",
      },
    });

    renderWithAuthProvider();

    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
  });

  it("logs out and redirects when token is invalid", async () => {
    localStorage.setItem("auth_token", "invalid-token");

    vi.spyOn(authService, "getCurrentUser").mockRejectedValue(
      new Error("Invalid")
    );

    renderWithAuthProvider();

    await waitFor(() => {
      expect(screen.getByText("Login")).toBeInTheDocument();
    });
  });
});