## Resumen
- Hooks y contexto de autenticacion y layout responsivo.

## Contenido
- `auth.js`: expone `AuthContext` y hook `useAuth`.
- `AuthContext.jsx`: provider con login/logout y persistencia localStorage.
- `usePortraitOrientation.jsx`: detecta orientacion portrait.

## Notas
- `AuthProvider` guarda `auth:user` en localStorage.
- `usePortraitOrientation` se usa para mostrar `ForceOrientation`.
