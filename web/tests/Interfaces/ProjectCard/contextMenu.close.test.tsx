import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ProjectCard from "@/components/projectCard/ProjectCard";

function renderCard() {
  return render(
    <MemoryRouter>
      <ProjectCard id={1} title="Demo" lastUpdated="hoy" />
    </MemoryRouter>,
  );
}

describe("tests/Interfaces/ProjectCard/contextMenu.close", () => {
  it("cierra el menu contextual al hacer click fuera", () => {
    // Arrange
    const { container } = renderCard();
    const shell = container.querySelector(".project-card-shell");

    // Act
    fireEvent.contextMenu(shell!, { clientX: 10, clientY: 20 });
    fireEvent.mouseDown(document.body);

    // Assert
    expect(screen.queryByText("Abrir")).not.toBeInTheDocument();
    expect(screen.queryByText("Eliminar")).not.toBeInTheDocument();
  });

  it("cierra el menu contextual al presionar Escape", () => {
    // Arrange
    const { container } = renderCard();
    const shell = container.querySelector(".project-card-shell");

    // Act
    fireEvent.contextMenu(shell!, { clientX: 10, clientY: 20 });
    fireEvent.keyDown(document, { key: "Escape" });

    // Assert
    expect(screen.queryByText("Abrir")).not.toBeInTheDocument();
  });

  it("cierra el menu contextual al hacer scroll", () => {
    // Arrange
    const { container } = renderCard();
    const shell = container.querySelector(".project-card-shell");

    // Act
    fireEvent.contextMenu(shell!, { clientX: 10, clientY: 20 });
    fireEvent.scroll(window);

    // Assert
    expect(screen.queryByText("Abrir")).not.toBeInTheDocument();
  });

  it("mantiene el menu abierto al hacer click dentro del contenedor", () => {
    // Arrange
    const { container } = renderCard();
    const shell = container.querySelector(".project-card-shell");

    // Act
    fireEvent.contextMenu(shell!, { clientX: 10, clientY: 20 });
    fireEvent.mouseDown(shell!);

    // Assert
    expect(screen.getByText("Abrir")).toBeInTheDocument();
  });

  it("ignora teclas distintas de Escape y mantiene menu abierto", () => {
    // Arrange
    const { container } = renderCard();
    const shell = container.querySelector(".project-card-shell");

    // Act
    fireEvent.contextMenu(shell!, { clientX: 10, clientY: 20 });
    fireEvent.keyDown(document, { key: "Enter" });

    // Assert
    expect(screen.getByText("Abrir")).toBeInTheDocument();
  });
});
