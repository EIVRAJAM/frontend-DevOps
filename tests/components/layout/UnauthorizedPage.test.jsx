import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import UnauthorizedPage from '../../../src/pages/UnauthorizedPage';

describe('UnauthorizedPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders access denied heading', () => {
    render(
      <MemoryRouter>
        <UnauthorizedPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
  });

  it('renders explanation message', () => {
    render(
      <MemoryRouter>
        <UnauthorizedPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/No tienes los permisos necesarios/)).toBeInTheDocument();
  });

  it('renders Volver al Inicio button', () => {
    render(
      <MemoryRouter>
        <UnauthorizedPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: 'Volver al Inicio' })).toBeInTheDocument();
  });

  it('clicks button calls navigate to /login', async () => {
    render(
      <MemoryRouter>
        <UnauthorizedPage />
      </MemoryRouter>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Volver al Inicio' }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders AlertCircle icon area', () => {
    render(
      <MemoryRouter>
        <UnauthorizedPage />
      </MemoryRouter>
    );
    const iconContainer = document.querySelector('.text-red-500');
    expect(iconContainer).toBeInTheDocument();
  });
});
