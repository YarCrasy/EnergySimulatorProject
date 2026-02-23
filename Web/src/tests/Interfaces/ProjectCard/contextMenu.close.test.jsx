import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ProjectCard from '@/components/projectCard/ProjectCard.jsx';

describe('ProjectCard.jsx', () => {
  it('cierra el menú contextual al hacer click fuera', () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectCard id={1} title="Demo" lastUpdated="hoy" />
      </MemoryRouter>,
    );

    const shell = container.querySelector('.project-card-shell');
    expect(shell).toBeTruthy();

    fireEvent.contextMenu(shell, { clientX: 10, clientY: 20 });
    expect(screen.getByText('Abrir')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Abrir')).not.toBeInTheDocument();
    expect(screen.queryByText('Eliminar')).not.toBeInTheDocument();
  });

  it('cierra el menú contextual al presionar Escape', () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectCard id={1} title="Demo" lastUpdated="hoy" />
      </MemoryRouter>,
    );

    const shell = container.querySelector('.project-card-shell');
    expect(shell).toBeTruthy();

    fireEvent.contextMenu(shell, { clientX: 10, clientY: 20 });
    expect(screen.getByText('Abrir')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Abrir')).not.toBeInTheDocument();
  });

  it('cierra el menú contextual al hacer scroll', () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectCard id={1} title="Demo" lastUpdated="hoy" />
      </MemoryRouter>,
    );

    const shell = container.querySelector('.project-card-shell');
    expect(shell).toBeTruthy();

    fireEvent.contextMenu(shell, { clientX: 10, clientY: 20 });
    expect(screen.getByText('Abrir')).toBeInTheDocument();

    fireEvent.scroll(window);
    expect(screen.queryByText('Abrir')).not.toBeInTheDocument();
  });
});
