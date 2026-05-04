# Documentación de cambios en web-refactored

## Resumen de los cambios realizados

Se han aplicado ajustes en el frontend `web-refactored` para conectar correctamente con el backend Spring Boot y soportar la autenticación JWT.

### Archivos modificados
- `src/api/api.ts`
- `src/auth/AuthProvider.tsx`

### Qué se ha hecho

1. `src/api/api.ts`
   - Se ajustó el cliente Axios para apuntar a la URL de la API en desarrollo: `http://localhost:8080/api`.
   - Se añadió la propiedad `withCredentials: false` en la configuración de Axios.
   - Se mantuvo el interceptor de petición que añade `Authorization: Bearer <token>` cuando existe un token en `localStorage`.

2. `src/auth/AuthProvider.tsx`
   - Se mantiene la lógica de login para almacenar el token y el usuario en `localStorage`.
   - Se comprueba la validez de la respuesta de la API y se estructura el usuario de forma segura antes de guardarlo.

## Implicaciones de seguridad

### Autenticación JWT
- El token JWT se debe enviar en todas las llamadas que requieran autorización.
- `web-refactored/src/api/api.ts` añade el header `Authorization: Bearer <token>` automáticamente cuando el token existe en `localStorage`.
- Esto asegura que los endpoints protegidos del backend reciban el token y puedan autenticar al usuario.

### Almacenamiento del token
- El token y los datos del usuario se guardan en `localStorage`.
- Esta estrategia es útil para persistencia entre recargas, pero tiene los siguientes riesgos:
  - `localStorage` es vulnerable a XSS si la aplicación no controla correctamente la inyección de scripts.
  - Es importante que la aplicación tenga buenas prácticas de sanitización y validación de entradas.

### CORS y desarrollo local
- El backend debe permitir solicitudes desde el origen del frontend para que las peticiones no sean bloqueadas por el navegador.
- En `web-refactored` el cliente usa `http://localhost:8080/api` en modo desarrollo, por lo que el backend debe aceptar origenes locales.
- El uso de `withCredentials: false` evita envíos involuntarios de cookies en las solicitudes de Axios.

### Buenas prácticas recomendadas
- Mantener el `app.jwt.secret` seguro en el backend y cambiarlo antes de producción.
- Considerar usar `sessionStorage` o cookies seguras con `HttpOnly` si se quiere elevar la seguridad frente a XSS.
- Revisar la configuración de CORS en el backend para permitir únicamente los orígenes necesarios.

## Estado actual

- La carpeta `web-refactored` ahora incluye documentación dedicada en `documentation/changes-and-security.md`.
- Estos cambios explican cómo se ha conectado el frontend con el backend y cuáles son las consideraciones de seguridad principales.
