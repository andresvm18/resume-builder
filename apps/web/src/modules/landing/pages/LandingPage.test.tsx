import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";

function renderLanding(initialRoute = "/") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<h1>Login Page</h1>} />
        <Route path="/register" element={<h1>Register Page</h1>} />
        <Route path="/resume-builder" element={<h1>Resume Builder</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("LandingPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the main landing content", () => {
    renderLanding();

    expect(
      screen.getByText(/Crea currículums que pasan filtros/i)
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
    localStorage.setItem("auth_token", "fake-token");

    const user = userEvent.setup();
    renderLanding();

    await user.click(
      screen.getByRole("button", { name: /Crear tu Currículum/i })
    );

    expect(screen.getByText("Resume Builder")).toBeInTheDocument();
  });

  it("navigates to register from CTA without token", async () => {
    const user = userEvent.setup();
    renderLanding();

    await user.click(screen.getByRole("button", { name: /Comenzar/i }));

    expect(screen.getByText("Register Page")).toBeInTheDocument();
  });
});