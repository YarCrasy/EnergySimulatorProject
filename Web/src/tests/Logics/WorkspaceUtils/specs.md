## Resumen
- Casos para helpers del workspace del simulador.

## Contenido
- `AttachBackendIdentifiers/bySignature.test.js`:
  - Match por signature, redondeo, invariantes y nodos sin match.
- `buildNodeSignature.test.js`:
  - Retorna `null` cuando falta `elementId`.
- `buildProjectPayload/skips.test.js`:
  - Cuenta `skippedNodes`/`skippedConnections` y valida payload final.
- `HydrateNodesFromCatalog/conditionalUpdate.test.js`:
  - Actualizacion condicional y no-mutacion cuando corresponde.
- `normalizeProject/fallbacks.test.js`:
  - Fallback de ids, posiciones y palette.
- `RoundCoord/normalizeValues.test.js`:
  - Redondeo a 2 decimales y fallback a `0`.
