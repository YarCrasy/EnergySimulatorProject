## Resumen
- Guardia de rutas para contenido privado.

## Que hace
- Espera a que `useAuth` termine de cargar.
- Si no hay usuario, redirige a `/login`.
- Si hay `role` y no coincide, redirige a `/`.

## Props
- `children`: contenido protegido.
- `role` (opcional): rol requerido.
