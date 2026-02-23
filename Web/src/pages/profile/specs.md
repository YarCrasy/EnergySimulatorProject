## Resumen
- Edicion del perfil del usuario autenticado.

## Que hace
- Carga datos desde `/users/{id}` con `api`.
- Reusa `RegisterForm` en modo edicion.
- Ofrece callbacks de exito y cancelacion.

## Dependencias
- `useAuth`, `api`.
- `RegisterForm` (el path actual apunta a `pages/register/RegisterForm`, revisar si corresponde).

## Archivos
- `Profile.jsx`.
