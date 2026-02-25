## Resumen
- Pruebas de comportamiento de `PrivateRoute`.

## Tests
- `redirectUnautenticated.test.jsx`:
  - Redirige a `/login` cuando no hay usuario autenticado.
  - Renderiza contenido protegido cuando hay usuario.
  - Redirige a `/` cuando el rol requerido no coincide.
  - No renderiza `children` mientras `loading` es `true`.
