import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { QueryWrapper } from '../../setup/queryWrapper.jsx';

const mockNavigate = vi.fn();
const mockSetCredentials = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../src/app/store/auth.store', () => ({
  useAuthStore: (selector) => {
    const state = {
      token: null,
      user: null,
      isAuthenticated: false,
      setCredentials: mockSetCredentials,
      clearCredentials: vi.fn(),
    };
    if (typeof selector === 'function') {
      return selector(state);
    }
    return state;
  },
}));

vi.mock('../../../src/features/auth/services/auth.service', () => ({
  authService: {
    login: (credentials) => mockLogin(credentials),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

import LoginForm from '../../../src/features/auth/components/LoginForm';

const renderLoginForm = () => {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <QueryWrapper>
        <LoginForm />
      </QueryWrapper>
    </MemoryRouter>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockResolvedValue({ token: 'mock-token', username: 'admin' });
  });

  it('renders email/username field', () => {
    renderLoginForm();
    expect(screen.getByPlaceholderText('tu@correo.com o username')).toBeInTheDocument();
  });

  it('renders password field', () => {
    renderLoginForm();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderLoginForm();
    expect(screen.getByRole('button', { name: /Iniciar Sesión/ })).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    renderLoginForm();
    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
  });

  it('renders unlock account link', () => {
    renderLoginForm();
    expect(screen.getByText('¿Cuenta bloqueada?')).toBeInTheDocument();
  });

  it('shows validation errors for empty fields on submit', async () => {
    renderLoginForm();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Iniciar Sesión/ }));
    await waitFor(() => {
      expect(screen.getByText('El correo o username es obligatorio')).toBeInTheDocument();
      expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument();
    });
  });

  it('submits valid credentials and redirects', async () => {
    renderLoginForm();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('tu@correo.com o username'), 'admin');
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
    await user.click(screen.getByRole('button', { name: /Iniciar Sesión/ }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        usernameOrEmail: 'admin',
        password: 'password123',
      });
      expect(mockSetCredentials).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message when login fails', async () => {
    const errorResponse = {
      response: { data: { message: 'Credenciales invalidas' } },
      isAxiosError: true,
    };
    mockLogin.mockRejectedValue(errorResponse);

    renderLoginForm();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('tu@correo.com o username'), 'fail@test.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'password');
    await user.click(screen.getByRole('button', { name: /Iniciar Sesión/ }));

    await waitFor(() => {
      expect(screen.getByText('Credenciales invalidas')).toBeInTheDocument();
    });
  });

  it('disables submit button while loading', async () => {
    mockLogin.mockImplementation(() => new Promise(() => {}));
    renderLoginForm();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('tu@correo.com o username'), 'admin');
    await user.type(screen.getByPlaceholderText('••••••••'), 'password');
    const button = screen.getByRole('button', { name: /Iniciar Sesión/ });
    await user.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  it('renders OAuth provider buttons', () => {
    renderLoginForm();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });
});
