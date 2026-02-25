## Resumen
- Pruebas de lógica de autenticación y flujo de inicio de sesión.

## Cobertura
- `authContext.behavior.test.jsx`:
  - Hidratación de sesión desde `localStorage`.
  - `login` exitoso (roles `user`/`admin`), persistencia y manejo de errores.
  - `logout` y limpieza de sesión.
- `login.flow.test.jsx`:
  - Redirección por rol tras login.
  - Flujo `redirectToSimulator` con `createProject` (ok/error/fallback).
  - Prevención de doble submit y navegación a registro.
- `jwt.auth.todo.test.js`:
  - Contrato actual de sesión en `AuthProvider` (persistencia, errores de login, mapeo de roles y logout idempotente).
