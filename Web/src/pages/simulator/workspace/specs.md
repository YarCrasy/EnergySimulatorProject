## Resumen
- Workspace del simulador: toolbar + canvas + persistencia.

## Que hace
- Carga proyecto por id y normaliza nodos/conexiones.
- Permite crear, mover, duplicar y borrar nodos.
- Gestiona conexiones, zoom y export a JSON.
- Guarda cambios en backend con reintentos y mensajes de estado.

## Componentes
- `DiagramWorkspace.jsx`: estado y logica principal.
- `diagramToolbar/DiagramToolbar.jsx`: controles y estadisticas.
- `diagramCanvas/DiagramCanvas.jsx`: lienzo con drag, zoom y conexiones.

## Utilidades
- `WorkspaceUtils.js`: normalizacion, serializacion y payloads API.

## Diseno UI
- Toolbar en tarjetas con botones compactos.
- Lienzo con grilla y nodos tipo card.
