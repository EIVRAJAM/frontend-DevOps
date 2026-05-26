import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const mockTieneAsignaciones = vi.fn();

vi.mock('../../../src/features/eventos/services/evento.service', () => ({
  eventoService: {
    tieneAsignacionesStaff: () => mockTieneAsignaciones(),
  },
}));

import { useStaffAssignments } from '../../../src/hooks/useStaffAssignments';

describe('useStaffAssignments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns false initially', () => {
    mockTieneAsignaciones.mockResolvedValue(true);
    const { result } = renderHook(() => useStaffAssignments());
    expect(result.current).toBe(false);
  });

  it('resolves to true when service returns true', async () => {
    mockTieneAsignaciones.mockResolvedValue(true);
    const { result } = renderHook(() => useStaffAssignments());
    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('resolves to false when service returns false', async () => {
    mockTieneAsignaciones.mockResolvedValue(false);
    const { result } = renderHook(() => useStaffAssignments());
    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('falls back to false on error', async () => {
    mockTieneAsignaciones.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useStaffAssignments());
    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('only calls service once on mount', async () => {
    mockTieneAsignaciones.mockResolvedValue(true);
    renderHook(() => useStaffAssignments());
    expect(mockTieneAsignaciones).toHaveBeenCalledTimes(1);
  });
});
