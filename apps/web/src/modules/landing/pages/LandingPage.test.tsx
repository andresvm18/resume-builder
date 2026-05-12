import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../../shared/context/AuthProvider";
import * as authService from "../../../modules/auth/services/auth.service";
import { vi } from "vitest";
import { ThemeProvider } from "../../../shared/context/ThemeProvider";
import LandingPage from "./LandingPage";

function renderLanding(initialRoute = "/") {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<h1>Login Page</h1>} />
            <Route path="/register" element={<h1>Register Page</h1>} />
            <Route path="/resume-builder" element={<h1>Resume Builder</h1>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

describe("LandingPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the main landing content", () => {
    renderLanding();

    expect(
      screen.getByText(/Construye un currículum profesional en minutos\./i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Plataforma de Currículums Optimizados para ATS/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Crear tu Currículum/i })
    ).toBeInTheDocument();
  });

  it("navigates to login when creating resume without token", async () => {
    const user = userEvent.setup();
    renderLanding();

    await user.click(
      screen.getByRole("button", { name: /Crear tu Currículum/i })
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("navigates to resume builder when creating resume with token", async () => {
    localStorage.setItem("auth_token", "valid-token");

    vi.spyOn(authService, "getCurrentUser").mockResolvedValue({
      user: {
        id: "1",
        name: "Test User",
        email: "test@test.com",
      },
    });

    renderLanding();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", { name: /crear tu currículum/i })
    );

    expect(await screen.findByText("Resume Builder")).toBeInTheDocument();
  });

  it("navigates to register from CTA without token", async () => {
    const user = userEvent.setup();
    renderLanding();

    await user.click(screen.getByRole("button", { name: /Comenzar/i }));

    expect(screen.getByText("Register Page")).toBeInTheDocument();
  });
});