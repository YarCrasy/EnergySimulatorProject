## Resumen
- Agrupa las pantallas principales del sitio y la app autenticada.
- Las rutas se definen en App.jsx y se combinan con `PrivateRoute` para proteger `/projects`, `/simulator` y `/administration/*`.

## Contenido
- `home/`, `about/`, `locations/`, `legals/`: marketing y contenido publico.
- `login/`, `register/`: acceso y alta de usuarios.
- `projects/`: dashboard de proyectos autenticados.
- `simulator/`: workspace de diagrama y catalogo de elementos.
- `administration/`: paneles admin para usuarios y receivers.
- `profile/`: edicion de perfil del usuario.
- `not-found/`: fallback 404.

## Diseno UI
- Estetica neon / tech con gradientes, tarjetas de vidrio y bordes suaves.
- Variables globales de color viven en `App.css`.

## Dependencias clave
- `react-router-dom` para rutas y navegacion.
- Componentes compartidos de `src/components`.
