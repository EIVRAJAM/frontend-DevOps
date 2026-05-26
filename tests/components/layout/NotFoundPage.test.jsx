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

import NotFoundPage from '../../../src/pages/NotFoundPage';

describe('NotFoundPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders 404 heading', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    expect(screen.getByText('La página que buscas no existe.')).toBeInTheDocument();
  });

  it('renders Regresar button', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: 'Regresar' })).toBeInTheDocument();
  });

  it('clicks Regresar button calls navigate(-1)', async () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Regresar' }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
