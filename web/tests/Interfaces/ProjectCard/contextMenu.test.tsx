import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ProjectCard from "@/components/projectCard/ProjectCard";

describe("tests/Interfaces/ProjectCard/contextMenu", () => {
  it("abre menu con click derecho y renderiza opciones", () => {
    // Arrange
    const { container } = render(
      <MemoryRouter>
        <ProjectCard id={1} title="Demo" lastUpdated="hoy" />
      </MemoryRouter>,
    );
    const shell = container.querySelector(".project-card-shell");

    // Act
    fireEvent.contextMenu(shell!, { clientX: 123, clientY: 456 });

    // Assert
    expect(screen.getByText("Abrir")).toBeInTheDocument();
    expect(screen.getByText("Eliminar")).toBeInTheDocument();
    expect(screen.getByRole("menu")).toHaveStyle({ top: "456px", left: "123px" });
  });
});
