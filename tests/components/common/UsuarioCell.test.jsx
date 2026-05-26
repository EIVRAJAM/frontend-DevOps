import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const mockGetByIdOrganizador = vi.fn();

vi.mock('../../../src/features/usuarios/services/usuario.service', () => ({
  usuarioService: {
    getByIdOrganizador: (id) => mockGetByIdOrganizador(id),
  },
}));

import UsuarioCell from '../../../src/components/common/UsuarioCell';

describe('UsuarioCell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner initially', () => {
    mockGetByIdOrganizador.mockReturnValue(new Promise(() => {}));
    render(<UsuarioCell userId={1} />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders user name and email on successful load', async () => {
    mockGetByIdOrganizador.mockResolvedValue({
      nombres: 'Juan',
      apellidos: 'Perez',
      correo: 'juan@test.com',
    });
    render(<UsuarioCell userId={1} />);
    await waitFor(() => {
      expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    });
    expect(screen.getByText('juan@test.com')).toBeInTheDocument();
  });

  it('renders fallback "#userId" on error', async () => {
    mockGetByIdOrganizador.mockRejectedValue(new Error('Not found'));
    render(<UsuarioCell userId={42} />);
    await waitFor(() => {
      expect(screen.getByText('#42')).toBeInTheDocument();
    });
  });

  it('renders fallback when response is null', async () => {
    mockGetByIdOrganizador.mockResolvedValue(null);
    render(<UsuarioCell userId={7} />);
    await waitFor(() => {
      expect(screen.getByText('#7')).toBeInTheDocument();
    });
  });

  it('refetches when userId changes', async () => {
    mockGetByIdOrganizador.mockResolvedValue({
      nombres: 'Maria',
      apellidos: 'Gomez',
      correo: 'maria@test.com',
    });
    const { rerender } = render(<UsuarioCell userId={1} />);
    await waitFor(() => {
      expect(screen.getByText('Maria Gomez')).toBeInTheDocument();
    });
    mockGetByIdOrganizador.mockResolvedValue({
      nombres: 'Carlos',
      apellidos: 'Lopez',
      correo: 'carlos@test.com',
    });
    rerender(<UsuarioCell userId={2} />);
    await waitFor(() => {
      expect(screen.getByText('Carlos Lopez')).toBeInTheDocument();
    });
    expect(mockGetByIdOrganizador).toHaveBeenCalledTimes(2);
  });
});
