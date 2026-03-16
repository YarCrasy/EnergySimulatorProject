## Resumen
- Pruebas para el modulo `projects.js`.

## Contenido
- `getAllProjects/`: fallback a array vacio cuando falla API.
- `crud.behavior.test.js`:
  - `getAllProjects` (success + data no-array),
  - `getProjectById` (success + error),
  - `createProject` (payload por defecto + error),
  - `deleteProject` (success + error).
- `updateProjects/`:
  - validaciones de `id` faltante (undefined/null),
  - request `PUT` exitoso,
  - relanzado de error del API.
