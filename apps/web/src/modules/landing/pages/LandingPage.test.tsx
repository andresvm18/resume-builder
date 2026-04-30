import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "./LandingPage";

describe("LandingPage", () => {
  it("renders the main landing content", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Crea currículums que pasan filtros/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Crear tu Currículum/i })
    ).toBeInTheDocument();
  });
});