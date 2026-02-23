## Resumen
- Dashboard de proyectos del usuario.

## Que hace
- Carga proyectos desde API.
- Calcula estadisticas (totales, balanceados, demanda).
- Crea proyecto base y navega al simulador.
- Elimina proyectos con confirmacion.

## Diseno UI
- Hero con CTA y estadisticas.
- Grid de `ProjectCard` o estado vacio.

## Dependencias
- `getAllProjects`, `createProject`, `deleteProject`.
- `ProjectCard` y placeholder `@svg/image.svg`.

## Archivos
- `Projects.jsx`, `Projects.css`.
