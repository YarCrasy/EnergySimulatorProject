## Resumen
- Pruebas de comportamiento para `PrivateRoute`.

## Estado
- `redirectUnautenticated.test.jsx` cubre:
  - Redirección a `/login` sin sesión.
  - Renderizado de contenido privado con usuario autenticado.
  - Redirección a `/` cuando el rol requerido no coincide.
  - Renderizado con rol requerido válido.
  - Estado `loading` (no renderiza ni redirige mientras carga).
