## Resumen
- Capa de acceso a API REST para proyectos, elementos y receivers.

## Contenido
- `api.js`: instancia axios con baseURL y interceptor.
- `projects.js`: CRUD de proyectos.
- `elements.js`: catalogo de elementos, con fallback local.
- `receiverApi.js`: CRUD de receivers con manejo de errores.

## Notas
- `DEFAULT_BASE_URL` usa `https://damt-project.yarcrasy.com/api` en build (production) y `http://localhost:8080/api` en desarrollo.
