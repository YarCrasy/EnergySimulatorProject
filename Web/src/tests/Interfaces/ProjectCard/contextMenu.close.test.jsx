import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProjectCard from '@/components/ProjectCard/ProjectCard';

afterEach(() => vi.restoreAllMocks());

describe('ProjectCard - context menu closing behavior', () => {
  it('should close menu when clicking outside component', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <ProjectCard project={{ id: 'p1', name: 'Project 1' }} />
        <button data-testid="outside-button">Outside</button>
      </div>
    );

    // Abrir el menú
    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);

    // Verificar que el menú está abierto
    const menu = screen.getByTestId('menu'); // Asegúrate que ProjectCard tenga data-testid="menu"
    expect(menu).toBeInTheDocument();

    // Click fuera
    await user.click(screen.getByTestId('outside-button'));

    // El menú debería cerrarse
    expect(screen.queryByTestId('menu')).not.toBeInTheDocument();
  });

  it('should close menu when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<ProjectCard project={{ id: 'p2', name: 'Project 2' }} />);
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);

    const menu = screen.getByTestId('menu');
    expect(menu).toBeInTheDocument();

    // Presionar Escape
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(screen.queryByTestId('menu')).not.toBeInTheDocument();
  });
});
