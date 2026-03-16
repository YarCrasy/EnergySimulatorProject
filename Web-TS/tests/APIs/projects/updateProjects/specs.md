## Resumen
- Validaciones para `updateProject`.

## Tests
- `update.missingIdError.test.js`:
  - Lanza error cuando falta `id` (`undefined` y `null`).
  - No invoca `api.put` cuando falta `id`.
  - Invoca `api.put` con ruta y payload correctos cuando hay `id`.
  - Retorna `data` en caso exitoso.
  - Relanza errores de API en caso de fallo.
