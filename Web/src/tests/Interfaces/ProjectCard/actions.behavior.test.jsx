import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const { navigateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

import ProjectCard from '@/components/projectCard/ProjectCard.jsx';

const renderCard = (props = {}) => render(
  <MemoryRouter>
    <ProjectCard id={42} title="Demo" lastUpdated="hoy" {...props} />
  </MemoryRouter>,
);

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.useRealTimers();
  navigateMock.mockReset();
});

describe('ProjectCard.jsx - action behavior', () => {
  it('botón de menú accesible abre contexto con coordenadas del botón', () => {
    // Arrange
    renderCard();
    const menuButton = screen.getByRole('button', { name: 'menu' });
    vi.spyOn(menuButton, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      right: 321,
      bottom: 654,
      toJSON: () => ({}),
    });

    // Act
    fireEvent.click(menuButton);

    // Assert
    const menu = screen.getByRole('menu');
    expect(menu).toHaveStyle({ top: '654px', left: '321px' });
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
  });

  it('sin onOpen, el botón "Abrir simulador" navega por id', () => {
    // Arrange
    renderCard();

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Abrir simulador' }));

    // Assert
    expect(navigateMock).toHaveBeenCalledWith('/simulator/42');
  });

  it('con onOpen, el botón "Abrir simulador" delega en callback', () => {
    // Arrange
    const onOpen = vi.fn();
    renderCard({ onOpen });

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Abrir simulador' }));

    // Assert
    expect(onOpen).toHaveBeenCalledWith(42);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('con onDelete, opción "Eliminar" delega en callback', () => {
    // Arrange
    const onDelete = vi.fn();
    const { container } = renderCard({ onDelete });
    const shell = container.querySelector('.project-card-shell');
    expect(shell).toBeTruthy();

    // Act
    fireEvent.contextMenu(shell, { clientX: 10, clientY: 20 });
    fireEvent.click(screen.getByText('Eliminar'));

    // Assert
    expect(onDelete).toHaveBeenCalledWith(42);
  });

  it('sin onDelete, confirma eliminación y registra log', () => {
    // Arrange
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { container } = renderCard();
    const shell = container.querySelector('.project-card-shell');
    expect(shell).toBeTruthy();

    // Act
    fireEvent.contextMenu(shell, { clientX: 10, clientY: 20 });
    fireEvent.click(screen.getByText('Eliminar'));

    // Assert
    expect(confirmSpy).toHaveBeenCalledWith('¿Eliminar el proyecto? Esta acción no se puede deshacer.');
    expect(logSpy).toHaveBeenCalledWith('Eliminar proyecto:', 42);
  });

  it('si el menú está abierto, click sobre la card solo cierra menú y no ejecuta onOpen', () => {
    // Arrange
    const onOpen = vi.fn();
    const { container } = renderCard({ onOpen });
    const shell = container.querySelector('.project-card-shell');
    expect(shell).toBeTruthy();
    fireEvent.contextMenu(shell, { clientX: 10, clientY: 20 });
    expect(screen.getByRole('menu')).toBeInTheDocument();
    const link = container.querySelector('.project-card');
    expect(link).toBeTruthy();

    // Act
    fireEvent.click(link);

    // Assert
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('click sobre la card llama onOpen cuando el menú no está abierto', () => {
    // Arrange
    const onOpen = vi.fn();
    const { container } = renderCard({ onOpen });
    const link = container.querySelector('.project-card');
    expect(link).toBeTruthy();

    // Act
    fireEvent.click(link);

    // Assert
    expect(onOpen).toHaveBeenCalledWith(42);
  });

  it('touchend limpia timeout pendiente sin abrir menú', () => {
    // Arrange
    vi.useFakeTimers();
    const { container } = renderCard();
    const shell = container.querySelector('.project-card-shell');
    expect(shell).toBeTruthy();

    // Act
    fireEvent.touchStart(shell, { touches: [{ clientX: 10, clientY: 20 }] });
    fireEvent.touchEnd(shell);

    // Assert
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('ignora touchstart con más de un touch y no abre menú', () => {
    // Arrange
    vi.useFakeTimers();
    const { container } = renderCard();
    const shell = container.querySelector('.project-card-shell');
    expect(shell).toBeTruthy();

    // Act
    fireEvent.touchStart(shell, {
      touches: [{ clientX: 1, clientY: 2 }, { clientX: 3, clientY: 4 }],
    });
    act(() => {
      vi.advanceTimersByTime(700);
    });

    // Assert
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('long press abre menú y touchend hace preventDefault', () => {
    // Arrange
    vi.useFakeTimers();
    const { container } = renderCard();
    const shell = container.querySelector('.project-card-shell');
    expect(shell).toBeTruthy();

    // Act
    fireEvent.touchStart(shell, { touches: [{ clientX: 120, clientY: 240 }] });
    act(() => {
      vi.advanceTimersByTime(601);
    });
    const touchEndEvent = new Event('touchend', { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(touchEndEvent, 'preventDefault');
    fireEvent(shell, touchEndEvent);

    // Assert
    expect(screen.getByRole('menu')).toHaveStyle({ top: '240px', left: '120px' });
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('touchmove y touchcancel cancelan long press antes de abrir menú', () => {
    // Arrange
    vi.useFakeTimers();
    const { container } = renderCard();
    const shell = container.querySelector('.project-card-shell');
    expect(shell).toBeTruthy();

    // Act
    fireEvent.touchStart(shell, { touches: [{ clientX: 30, clientY: 40 }] });
    fireEvent.touchMove(shell);
    act(() => {
      vi.advanceTimersByTime(700);
    });

    fireEvent.touchStart(shell, { touches: [{ clientX: 55, clientY: 65 }] });
    fireEvent.touchCancel(shell);
    act(() => {
      vi.advanceTimersByTime(700);
    });

    // Assert
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('touchend sin longPress iniciado no dispara preventDefault', () => {
    // Arrange
    const { container } = renderCard();
    const shell = container.querySelector('.project-card-shell');
    expect(shell).toBeTruthy();
    const touchEndEvent = new Event('touchend', { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(touchEndEvent, 'preventDefault');

    // Act
    fireEvent(shell, touchEndEvent);

    // Assert
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('sin onDelete y confirm=false no registra log', () => {
    // Arrange
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { container } = renderCard();
    const shell = container.querySelector('.project-card-shell');
    expect(shell).toBeTruthy();

    // Act
    fireEvent.contextMenu(shell, { clientX: 10, clientY: 20 });
    fireEvent.click(screen.getByText('Eliminar'));

    // Assert
    expect(confirmSpy).toHaveBeenCalledWith('¿Eliminar el proyecto? Esta acción no se puede deshacer.');
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('renderiza imagen y texto "Sin registro" cuando falta lastUpdated', () => {
    // Arrange
    renderCard({ imageUrl: 'https://example.com/test.png', lastUpdated: undefined });

    // Assert
    expect(screen.getByRole('img', { name: 'Demo' })).toBeInTheDocument();
    expect(screen.getByText('Sin registro')).toBeInTheDocument();
  });
});
