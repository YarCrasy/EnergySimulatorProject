import { describe, it } from 'vitest';

describe('Auth JWT (pendiente de implementación)', () => {
  it.todo('guarda accessToken y refreshToken de forma segura al hacer login');
  it.todo('inyecta Authorization: Bearer <token> en requests autenticados');
  it.todo('valida expiración (exp) del JWT antes de usarlo');
  it.todo('renueva accessToken automáticamente con refreshToken al expirar');
  it.todo('hace logout automático cuando refresh token es inválido o expira');
  it.todo('restaura sesión desde token válido al recargar la aplicación');
  it.todo('rechaza tokens malformados o con firma inválida');
  it.todo('limpia tokens y headers de auth al ejecutar logout');
});
