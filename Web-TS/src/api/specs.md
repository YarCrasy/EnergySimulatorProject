## Resumen
- Capa de acceso a API REST para proyectos, elementos y receivers.

## Contenido
- `api.js`: instancia axios con baseURL y interceptor.
- `projects.js`: CRUD de proyectos.
- `elements.js`: catalogo de elementos, con fallback local.
- `receiverApi.js`: CRUD de receivers con manejo de errores.

## Notas
- `api.js` resuelve `baseURL` por prioridad:
  1. `import.meta.env.VITE_API_URL` (override).
  2. `https://damt-project.yarcrasy.com/api` en `production`.
  3. `http://localhost:8080/api` en `development`.
