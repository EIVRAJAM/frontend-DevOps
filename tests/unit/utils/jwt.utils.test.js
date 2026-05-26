import { describe, it, expect } from 'vitest';
import { extractRoles, extractSubject } from '../../../src/utils/jwt.utils';
import { jwtDecode } from 'jwt-decode';

vi.mock('jwt-decode');

const makeToken = (payload) => {
  const parts = [btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })), btoa(JSON.stringify(payload)), 'mock-signature'];
  return parts.join('.');
};

describe('extractRoles', () => {
  it('returns empty array for empty token', () => {
    expect(extractRoles('')).toEqual([]);
    expect(extractRoles(null)).toEqual([]);
    expect(extractRoles(undefined)).toEqual([]);
  });

  it('returns empty array when JWT decode throws', () => {
    jwtDecode.mockImplementation(() => { throw new Error('Invalid token'); });
    expect(extractRoles('invalid-token')).toEqual([]);
  });

  it('extracts roles from authorities as string array', () => {
    jwtDecode.mockReturnValue({ authorities: ['ROLE_ADMIN', 'ROLE_USER'] });
    expect(extractRoles('token')).toEqual(['ROLE_ADMIN', 'ROLE_USER']);
  });

  it('extracts roles from authorities as array of objects', () => {
    jwtDecode.mockReturnValue({
      authorities: [{ authority: 'ROLE_ADMIN' }, { authority: 'ROLE_USER' }],
    });
    expect(extractRoles('token')).toEqual(['ROLE_ADMIN', 'ROLE_USER']);
  });

  it('extracts roles from comma-separated scope string', () => {
    jwtDecode.mockReturnValue({ scope: 'ROLE_ADMIN,ROLE_USER,ROLE_ORGANIZER' });
    expect(extractRoles('token')).toEqual(['ROLE_ADMIN', 'ROLE_USER', 'ROLE_ORGANIZER']);
  });

  it('extracts roles from roles claim as array of objects', () => {
    jwtDecode.mockReturnValue({
      roles: [{ authority: 'ROLE_ADMIN' }],
    });
    expect(extractRoles('token')).toEqual(['ROLE_ADMIN']);
  });

  it('returns empty array when no roles claim exists', () => {
    jwtDecode.mockReturnValue({ sub: 'test@test.com' });
    expect(extractRoles('token')).toEqual([]);
  });

  it('returns empty array when roles claim is empty object', () => {
    jwtDecode.mockReturnValue({ authorities: null });
    expect(extractRoles('token')).toEqual([]);
  });

  it('trims whitespace from comma-separated values', () => {
    jwtDecode.mockReturnValue({ scope: ' ROLE_ADMIN , ROLE_USER ' });
    expect(extractRoles('token')).toEqual(['ROLE_ADMIN', 'ROLE_USER']);
  });

  it('filters out empty strings from comma-separated values', () => {
    jwtDecode.mockReturnValue({ scope: 'ROLE_ADMIN,' });
    expect(extractRoles('token')).toEqual(['ROLE_ADMIN']);
  });

  it('filters non-object entries in authority array', () => {
    jwtDecode.mockReturnValue({
      authorities: [{ authority: 'ROLE_ADMIN' }, null, 'bad-string'],
    });
    expect(extractRoles('token')).toEqual(['ROLE_ADMIN']);
  });
});

describe('extractSubject', () => {
  it('returns fallback for empty token', () => {
    expect(extractSubject('')).toBe('Usuario OAuth');
  });

  it('returns fallback when JWT decode throws', () => {
    jwtDecode.mockImplementation(() => { throw new Error('Invalid'); });
    expect(extractSubject('invalid')).toBe('Usuario OAuth');
  });

  it('returns email when present', () => {
    jwtDecode.mockReturnValue({ email: 'user@test.com', sub: 'uuid' });
    expect(extractSubject('token')).toBe('user@test.com');
  });

  it('returns name when email is absent', () => {
    jwtDecode.mockReturnValue({ name: 'John Doe', sub: 'uuid' });
    expect(extractSubject('token')).toBe('John Doe');
  });

  it('returns username when email and name are absent', () => {
    jwtDecode.mockReturnValue({ username: 'johndoe', sub: 'uuid' });
    expect(extractSubject('token')).toBe('johndoe');
  });

  it('returns sub when it is not a UUID', () => {
    jwtDecode.mockReturnValue({ sub: 'johndoe@test.com' });
    expect(extractSubject('token')).toBe('johndoe@test.com');
  });

  it('returns fallback when sub is a UUID and no other claims', () => {
    jwtDecode.mockReturnValue({ sub: '550e8400-e29b-41d4-a716-446655440000' });
    expect(extractSubject('token')).toBe('Usuario OAuth');
  });

  it('prioritizes email over sub when both present', () => {
    jwtDecode.mockReturnValue({ email: 'user@test.com', sub: 'johndoe' });
    expect(extractSubject('token')).toBe('user@test.com');
  });
});
