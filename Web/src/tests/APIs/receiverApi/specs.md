## Resumen
- Pruebas de `receiverApi` para CRUD y manejo de errores.

## Contenido
- `create/`: verifica propagacion de mensaje del backend.
- `crud.behavior.test.js`:
  - `getAll` (success + fallback de error),
  - `create` (success + error con mensaje backend),
  - `update` (success + fallback de error),
  - `delete` (success + error con mensaje backend).
