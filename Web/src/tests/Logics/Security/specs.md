## Resumen
- Pruebas de hardening de seguridad para la capa de autenticación.

## Cobertura
- Sanitización de payloads con `<script>` provenientes de `localStorage` y backend.
- Mitigación básica de role tampering (`role` inválido se normaliza a `user`).
- Limpieza de prefijos `javascript:` y tags HTML en sesión hidratada.
- Limpieza de sesiones manipuladas o incompletas (sin `id`).
- Verificación de rechazo controlado cuando el backend devuelve respuesta de login inválida.
