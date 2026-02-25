# Testing del proyecto 

## 1. Requisitos / Setup

- Vitest: se usa vitest como runner para correr los test del proyecto. Con esto podemos hacer pruebas, coger APIs de mocking, aserciones y soporta modos de watch y coverage. Para correr los test los ejecutamos con `vitest` (scripts en `package.json`) y la configuración se integra con `jsdom` para simular el DOM.
- Libreria de React Testing : es la biblioteca que se usa para testear componentes React desde la perspectiva del usuario. Con ello testeamos el comportamiento, la accesibilidad pero no tanto la implantacion interna. 
- jsdom: es el entorno que emula el DOM en Node, es necesario para renderizar componentes React en tests sin hacer uso de un navegador real. Vitest ejecuta el runner en un entorno similar a jsdom para poder usar `@testing-library/react`.
- `@testing-library/jest-dom`: aporta matchers adicionales (`toBeInTheDocument`, `toHaveStyle`, etc.). En este proyecto por ejemplo se importa en `src/tests/setupTests.js` con `import '@testing-library/jest-dom/vitest';`.
- `@testing-library/user-event`: simula interacciones que se acercan mas a las que un usuario real haria como click, tipeo, etc. Se utiliza en tests como `contextMenu.close.test.jsx` para acciones asíncronas y flujos de usuario.
- Ubicación de los tests: se crea especificamente una carpeta especifica para los test en `src/tests`. Para optimizar la organizacion ademas hay subcarpetas por dominio que organizan los tests por responsabilidad (API, Lógica, Interfaces). Esta separación facilita localizar tests relacionados con una capa concreta, permitiendo  el aislamiento entre responsabilidades.

---

## 2. Comandos disponibles

- `npm run test`: ejecuta la suite de tests una sola vez (usualmente mapea a `vitest run`).
- `npm run test:watch`: ejecuta Vitest en modo watch para desarrollo iterativo y aporta feeback inmediato
- `npm run test:coverage`: ejecuta los tests y genera reportes de cobertura (usa el collector configurado, aquí `@vitest/coverage-v8`).
Cómo ejecutar casos especificos:

En ocasiones se vuelve tedioso tener toda la informacion de todos los test corridos, en ese caso podemos correr los test de una carpeta determinada o de un archivo determinado:

- Ejecutar los test de 1 carpeta: `npm vitest run + ruta `: para ejecutar solo los test de determinada carpeta o un terminado test hacemos uso de se ruta relativa por ejemplo: 
```
npx vitest run src/tests/Logics/WorkspaceUtils/
```
- Ejecutar un archivo específico: lo usaremos cuando sabemos es test que esta fallando o queremos aislar la informacion recivida del test 

```
npx vitest src/tests/APIs/receiverApi/create/backendMessage.test.js
```

- Ejecutar por nombre o patrón:`-t` ejecutar tests que coincidan con el texto (útil para ejecutar una sola suite cuando varios tests están en un mismo archivo).

```
npx vitest -t "texto del test"
```

---

## 3. Cobertura (Coverage)

- Vitest analiza las métricas habituales:
  - `lines`: porcentaje de líneas de código ejecutadas por los tests, loque indica si el codigo fue recorrido por los test o no 
  - `branches`: cobertura de ramificaciones (if/else, ternarios) lo cual es importante en casos de logica condicional que nos sirve por ejemplo para cubrir los caminos true/false 
  - `functions`: porcentaje de funciones invocadas en tests, que ayuda a entender si las unidades funcionales fueron llamadas o no 
  - `statements`: similar a `lines`, cantidad de sentencias ejecutadas.

Cómo se genera la cobertura:
- Ejecutar `npx vitest --coverage` y revisar el reporte generado por `@vitest/coverage-v8`.

Qué hacer si baja la cobertura:
- Revisar qué módulo ha bajado y añadir tests que cubran los caminos no ejercitados.
- Regla de equipo: “No se acepta un PR si baja la cobertura del módulo afectado”. Asegurarse de añadir tests que cubran los casos faltantes.

---

## 4. Qué se está testeando en este proyecto

En `src/tests` los tests se organizan por carpetas (APIs, Logics e Interfaces):

### Tests de API (carpeta `APIs/`)
- Qué validan: manejo de respuestas y errores de las funciones que llaman al backend.
- Mocking: la mayoría mockea el módulo `@api/api` usando `vi.mock` o `vi.spyOn` para evitar requests reales.
- Gestión de respuestas: se prueban tanto respuestas exitosas (mockResolvedValue) como rechazos (mockRejectedValue / mockRejectedValueOnce) y la forma en que la función wrapper transforma o maneja esos errores.

Archivos y qué cubren (implementación real):
- `src/tests/APIs/receiverApi/create/backendMessage.test.js`:
  - Mock de `@api/api` (se redefine `post` con `vi.fn()`).
  - Test: `receiverApi.create lanza error con mensaje del backend`.
  - Comprueba que si `api.post` rechaza con `response.data.message`, la función `receiverApi.create` propaga ese mensaje como excepción.
  - Uso real de `vi.spyOn(console, 'error')` para silenciar logs en test.

- `src/tests/APIs/projects/getAllProjects/fallbackEmpty.test.js`:
  - Mock de `api.get` que rechaza y se espera que `getAllProjects()` resuelva a `[]`.

- `src/tests/APIs/projects/updateProjects/update.missingIdError.test.js`:
  - Comprueba validaciones de `updateProject`: lanza error si falta `id`, y cuando `id` existe mockea `api.put` y verifica la llamada y el resultado.


### Tests de Lógica (carpeta `Logics/`)
- Qué validan: funciones puras y utilidades del workspace — transformaciones, normalizaciones y cálculos.
- Casos: validaciones, transformaciones de datos y casos límite.

Archivos y qué cubren (implementación real):
- `buildNodeSignature.test.js`:
  - `buildNodeSignature` devuelve `null` si `elementId` es `undefined`.

- `AttachBackendIdentifiers/bySignature.test.js`:
  - `attachBackendIdentifiers` asigna `backendId` a nodos UI que coincidan con nodos API por `element.id` y posición.
  - Verifica nodos con coincidencia y nodos sin coincidencia quedan sin `backendId`.

- `normalizeProject/fallbacks.test.js`:
  - `normalizeProject` aplica palette, posiciones fallback y genera ids prefijados (`node-...`).
  - Usa `vi.spyOn(Math, 'random')` para controlar valores aleatorios en el test.

- `HydrateNodesFromCatalog/conditionalUpdate.test.js`:
  - `hydrateNodesFromCatalog` actualiza propiedades cuando hay match en el catálogo y retorna inalterado si el catálogo es `null`.

- `RoundCoord/normalizeValues.test.js`:
  - `roundCoord` redondea a 2 decimales, maneja `null` y strings numéricos.

- `buildProjectPayload/skips.test.js`:
  - `buildProjectPayload` calcula `skippedNodes` y `skippedConnections`, normaliza posiciones a 2 decimales y arma `payload` final con nodos/conexiones transformados.


### Tests de Interfaces (carpeta `Interfaces/`)
- Qué validan: renderizado de componentes, interacción del usuario, apertura/cierre de menús, redirecciones y envío de formularios.

Archivos y qué cubren (implementación real):
- `Interfaces/ProjectCard/contextMenu.test.jsx`:
  - Test que abre el menú vía `fireEvent.contextMenu` en el `shell` del componente y verifica que las opciones `Abrir` y `Eliminar` estén presentes y que el `ul` con el menú tenga estilos de posición adecuados (top/left) basados en `clientX/clientY`.

- `Interfaces/ProjectCard/contextMenu.close.test.jsx`:
  - Tests que usan `user-event` para abrir el menú y después cierres: clic fuera del componente y pulsación de `Escape`. Verifica aparición y desaparición del elemento con `data-testid="menu"`.

- `Interfaces/PrivateRoute/redirectUnautenticated.test.jsx`:
  - Mock del hook `useAuth` para devolver `user: null` y `loading: false`.
  - Verifica que `PrivateRoute` redirige a `/login` (renderiza el texto `LOGIN PAGE`).

- `Interfaces/FormReceiver/submitNumbersKeepsId.test.jsx`:
  - Renderiza `FormReceiver` con `receiverToEdit` y simula cambios en campos (textbox y `spinbutton`).
  - Verifica que `onSave` se llama con valores numéricos convertidos y que el `id` original se mantiene.


## 5. Guía para escribir tests en este proyecto

Patrón AAA (Arrange – Act – Assert) adaptado a React:

```js
describe("Nombre del componente o función", () => {
  it("describe comportamiento esperado", async () => {
    // Arrange
    // Preparar datos, mocks o render

    // Act
    // Ejecutar acción (userEvent, fireEvent, llamada a la función)

    // Assert
    // Verificar resultado (toBeInTheDocument, toEqual, toHaveBeenCalledWith)
  });
});
```

Buenas prácticas observadas en el proyecto:
- Preferir `@testing-library/react` y buscar elementos por roles o texto (`getByRole`, `getByText`) para acercarse al comportamiento del usuario.
- Usar `user-event` para interacciones que impliquen asincronía o comportamiento realista.
- Mockear módulos de red (`@api/api`) con `vi.mock` o `vi.spyOn` para evitar requests reales.
- Restaurar mocks después de cada test con `vi.restoreAllMocks()` o `afterEach(() => vi.restoreAllMocks())`.
- Silenciar logs en tests cuando sea necesario (`vi.spyOn(console, 'error').mockImplementation(() => {})`) y restaurarlos después.

---

## 6. Ejemplo real del proyecto

Test seleccionado: `Interfaces/ProjectCard/contextMenu.test.jsx` (representativo de tests de UI que ejercitan render e interacción con el DOM).

Código real (extracto):

```jsx
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ProjectCard from '@/components/projectCard/ProjectCard.jsx';

describe('ProjectCard.jsx', () => {
  it('abre menú con contextmenu y renderiza opciones', () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectCard id={1} title="Demo" lastUpdated="hoy" />
      </MemoryRouter>,
    );

    const shell = container.querySelector('.project-card-shell');
    expect(shell).toBeTruthy();

    fireEvent.contextMenu(shell, { clientX: 123, clientY: 456 });

    expect(screen.getByText('Abrir')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();

    const menu = screen.getByText('Abrir').closest('ul');
    expect(menu).toBeTruthy();
    expect(menu).toHaveStyle({ top: '456px', left: '123px' });
  });
});
```

Qué valida:
- Que el componente renderice su `shell` base.
- Que al disparar `contextmenu` con coordenadas, aparezca un menú con opciones `Abrir` y `Eliminar`.
- Que la posición del menú dependa de `clientX` / `clientY` (estilos `top` y `left`).

Arrange / Act / Assert:
- Arrange: renderizado del `ProjectCard` dentro de un `MemoryRouter`.
- Act: `fireEvent.contextMenu(shell, { clientX, clientY })`.
- Assert: comprobaciones `getByText`, `toBeInTheDocument` y `toHaveStyle`.

Por qué es importante:
- Verifica interacción de usuario natural (click derecho/context menu) y la correcta respuesta de UI, incluyendo posicionamiento (UX). Detecta regresiones sobre comportamiento de menús contextuales.

---

## 7. Mocks y aislamiento

Patrones observados en los tests reales:
- `vi.mock(modulePath, ...)`: sustituye implementaciones de módulos completos, por ejemplo `vi.mock('@api/api', () => ({ default: { post: vi.fn() } }));`.
- `vi.spyOn(object, 'method')`: es usado para espiar o sustituir funciones concretas (ej.: `vi.spyOn(api, 'put').mockResolvedValue(...)`).
- `mockResolvedValue` / `mockRejectedValue` / `mockRejectedValueOnce`: para simular respuestas exitosas o errores en llamadas de red.
- `afterEach(() => vi.restoreAllMocks())`: restauración de mocks entre tests (aislamiento).
- `vi.restoreAllMocks()` y `console` spies: cuando se interceptan logs se restauran con `mockRestore()`.

Cómo se mockean dependencias externas:
- Módulos de API se mockean por completo para asegurar que no haya requests reales y se pueda controlar la respuesta (errores y datos).
- Hooks (por ejemplo `useAuth`) se mockean con `vi.mock` para forzar estados de autenticación durante tests de rutas privadas.

Por qué es importante el aislamiento:
- Evita efectos laterales (requests reales, modificación de `Math.random`, listeners globales).
- Permite reproducibilidad: cada test debe poder ejecutarse de forma independiente y prever su comportamiento usando mocks.

Si en alguna sección no se usan mocks: en los tests de lógica (funciones puras) no se usan mocks externos salvo espiar `Math.random` para determinismo.

---

## 8. Troubleshooting

Problemas comunes y soluciones concretas para este stack:

- ReferenceError: fetch is not defined
  - Causa: código o tests usan `fetch` en Node sin polyfill.
  - Solución: instalar y configurar un polyfill (`whatwg-fetch`) o usar `globalThis.fetch = require('node-fetch')` en `src/tests/setupTests.js`. Alternativamente mockear las funciones de red (`vi.mock('@api/api', ...)`) como ya es práctica en este repo.

- Problemas con jsdom (elementos no encontrados / estilos no aplicados)
  - Causa: diferencias entre entorno real y jsdom (CSS no aplicado, APIs del navegador no implementadas).
  - Solución: limitar las aserciones a comportamientos observables (texto, atributos, estilos inline). Para APIs faltantes (IntersectionObserver, ResizeObserver) añadir polyfills o mocks en `setupTests.js`.

- Tests async sin await (falsos positivos/falsos negativos)
  - Causa: no esperar resoluciones asíncronas (user-event o promesas internas).
  - Solución: usar `await` con `userEvent` (`const user = userEvent.setup(); await user.click(...)`) y/o usar `findBy*` en vez de `getBy*` cuando se espera aparición asíncrona.

- `jest-dom` no configurado (matchers no disponibles)
  - Causa: no importar `@testing-library/jest-dom/vitest` en setup.
  - Solución: revisar `src/tests/setupTests.js` — en este repo ya contiene `import '@testing-library/jest-dom/vitest';`.

- Estado compartido entre tests
  - Causa: objetos mutados o listeners globales sin limpiar (por ejemplo `Math.random` mockeado, spies de `console` no restaurados).
  - Solución: en `afterEach` restaurar mocks (`vi.restoreAllMocks()`), y evitar mutaciones globales; cuando se mockee `Math.random`, restaurar con `mockRestore()`.

