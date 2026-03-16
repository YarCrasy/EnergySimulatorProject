## Resumen
- Formulario reutilizable para alta/edicion de usuarios.

## Que hace
- Maneja estado y validacion con `useRegisterForm`.
- Cambia comportamiento segun rol admin y modo edicion.
- Redirige a proyectos despues de crear (cuando no es admin).

## Diseno UI
- Inputs con focus glow y botones pill.

## Props
- `editingUser`, `onSuccess`, `onCancel`.
