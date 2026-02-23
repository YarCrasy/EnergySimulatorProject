## Resumen
- Acceso de usuarios con CTA y panel visual de confianza.

## Que hace
- Autentica contra backend via `useAuth.login`.
- Si viene desde CTA del simulador, crea un proyecto base y navega al simulador.
- Redirige segun rol (admin -> administracion, usuario -> proyectos).

## Diseno UI
- Layout en dos columnas con panel de formulario y panel visual.
- Tarjetas con indicadores y lista de assurance.

## Dependencias
- `useAuth`, `createProject`.
- Imagen `@jpg/loginImg.jpg`.

## Archivos
- `Login.jsx`, `Login.css`.
