## Resumen
- Pruebas del menu contextual de ProjectCard.

## Tests
- `contextMenu.test.jsx`: abre menu con click derecho y valida posicion.
- `contextMenu.close.test.jsx`:
  - Cierre por click fuera.
  - Cierre por tecla `Escape`.
  - Cierre al hacer scroll.
- `actions.behavior.test.jsx`:
  - acción de abrir simulador (callback o navegación),
  - acción eliminar (callback o confirmación por defecto),
  - botón accesible de menú con coordenadas,
  - comportamiento click sobre la card con menú abierto/cerrado.
