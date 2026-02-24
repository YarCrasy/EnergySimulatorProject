import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ProjectCard from '@/components/projectCard/ProjectCard';

afterEach(() => vi.restoreAllMocks());

describe('ProjectCard - context menu closing behavior', () => {

  it('should close menu when clicking outside component', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <div>
          <ProjectCard project={{ id: 'p1', name: 'Project 1' }} />
          <button data-testid="outside-button">Outside</button>
        </div>
      </MemoryRouter>
    );

    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);

    expect(screen.getByTestId('menu')).toBeInTheDocument();

    await user.click(screen.getByTestId('outside-button'));

    expect(screen.queryByTestId('menu')).not.toBeInTheDocument();
  });

  it('should close menu when Escape key is pressed', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ProjectCard project={{ id: 'p2', name: 'Project 2' }} />
      </MemoryRouter>
    );

    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);

    expect(screen.getByTestId('menu')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(screen.queryByTestId('menu')).not.toBeInTheDocument();
  });

});