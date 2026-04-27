import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ProjectCard from '@/components/projectCard/ProjectCard';

describe('ProjectCard.jsx', () => {
  it('abre menú con contextmenu y renderiza opciones', () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectCard id={1} title="Demo" lastUpdated="hoy" />
      </MemoryRouter>,
    );

    const shell = container.querySelector('.project-card-shell');
    expect(shell).toBeTruthy();

    fireEvent.contextMenu(shell, { clientX: 123, clientY: 456 });

    expect(screen.getByText('Abrir')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();

    const menu = screen.getByText('Abrir').closest('ul');
    expect(menu).toBeTruthy();
    expect(menu).toHaveStyle({ top: '456px', left: '123px' });
  });
});
