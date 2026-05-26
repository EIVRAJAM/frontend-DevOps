import { describe, it, expect } from 'vitest';
import { solicitarReembolsoSchema } from '../../../src/features/reembolsos/types/reembolso.types';

function createFileList(files) {
  const fileList = {
    length: files.length,
    item: (index) => files[index] || null,
    [Symbol.iterator]: function* () { for (const f of files) yield f; },
  };
  files.forEach((f, i) => { fileList[i] = f; });
  Object.setPrototypeOf(fileList, FileList.prototype);
  return fileList;
}

function createValidFile() {
  return new File(['content'], 'cert.pdf', { type: 'application/pdf' });
}

describe('solicitarReembolsoSchema', () => {
  const validValues = {
    motivoSolicitud: 'No puedo asistir por razones personales urgentes',
    medioReembolso: 'NEQUI',
    titularCuenta: 'Juan Perez',
    documentoTitular: '123456789',
    correoContacto: 'juan@test.com',
    telefonoContacto: '3001234567',
  };

  it('validates valid NEQUI refund request', () => {
    const result = solicitarReembolsoSchema.safeParse(validValues);
    expect(result.success).toBe(true);
  });

  it('rejects short motivo (less than 10 chars)', () => {
    const result = solicitarReembolsoSchema.safeParse({ ...validValues, motivoSolicitud: 'Corto' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = solicitarReembolsoSchema.safeParse({ ...validValues, correoContacto: 'not-email' });
    expect(result.success).toBe(false);
  });

  it('validates CUENTA_BANCARIA with required fields', () => {
    const fileList = createFileList([createValidFile()]);
    const result = solicitarReembolsoSchema.safeParse({
      ...validValues,
      medioReembolso: 'CUENTA_BANCARIA',
      entidadFinanciera: 'Banco Test',
      tipoCuenta: 'AHORROS',
      numeroCuenta: '1234567890',
      certificadoCuenta: fileList,
    });
    expect(result.success).toBe(true);
  });

  it('rejects CUENTA_BANCARIA without entidadFinanciera', () => {
    const fileList = createFileList([createValidFile()]);
    const result = solicitarReembolsoSchema.safeParse({
      ...validValues,
      medioReembolso: 'CUENTA_BANCARIA',
      tipoCuenta: 'AHORROS',
      numeroCuenta: '1234567890',
      certificadoCuenta: fileList,
    });
    expect(result.success).toBe(false);
  });
});
