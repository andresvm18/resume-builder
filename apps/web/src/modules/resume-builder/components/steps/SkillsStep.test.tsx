import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SkillsStep from "./SkillsStep";
import { vi } from "vitest";

describe("SkillsStep", () => {
  it("renders existing skills", () => {
    render(
      <SkillsStep
        skills={["React", "Node.js"]}
        skillInput=""
        setSkillInput={vi.fn()}
        addSkill={vi.fn()}
        removeSkill={vi.fn()}
      />
    );

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  it("calls setSkillInput when typing", async () => {
    const user = userEvent.setup();
    const setSkillInput = vi.fn();

    render(
      <SkillsStep
        skills={[]}
        skillInput=""
        setSkillInput={setSkillInput}
        addSkill={vi.fn()}
        removeSkill={vi.fn()}
      />
    );

    await user.type(screen.getByPlaceholderText(/Escribe una habilidad/i), "React");

    expect(setSkillInput).toHaveBeenCalled();
  });

  it("calls addSkill when clicking add button", async () => {
    const user = userEvent.setup();
    const addSkill = vi.fn();

    render(
      <SkillsStep
        skills={[]}
        skillInput="React"
        setSkillInput={vi.fn()}
        addSkill={addSkill}
        removeSkill={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: /Agregar/i }));

    expect(addSkill).toHaveBeenCalledTimes(1);
  });

  it("calls addSkill when pressing Enter", async () => {
    const user = userEvent.setup();
    const addSkill = vi.fn();

    render(
      <SkillsStep
        skills={[]}
        skillInput="React"
        setSkillInput={vi.fn()}
        addSkill={addSkill}
        removeSkill={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/Escribe una habilidad/i);

    await user.click(input);
    await user.keyboard("{Enter}");

    expect(addSkill).toHaveBeenCalledTimes(1);
  });

  it("calls removeSkill when removing a skill", async () => {
    const user = userEvent.setup();
    const removeSkill = vi.fn();

    render(
      <SkillsStep
        skills={["React"]}
        skillInput=""
        setSkillInput={vi.fn()}
        addSkill={vi.fn()}
        removeSkill={removeSkill}
      />
    );

    await user.click(screen.getByRole("button", { name: "×" }));

    expect(removeSkill).toHaveBeenCalledWith(0);
  });
});