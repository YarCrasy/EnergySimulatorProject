# Testing

Para una mejor lectura, tambien está creado un documento en el Google Drive del proyecto:
[Documentación de Testing](https://docs.google.com/document/d/1Sy74oTu3YtfXCcV8eZ4wlMOHkB7JcsmZ51l742gUkWM/edit?pli=1&tab=t.0#heading=h.i8167o4izlsf)

## 1. Requisitos / Setup

- `Node LTS` recomendado (18+).
- Instalar dependencias:

```bash
npm install
```

Donde se incluye el siguiente Stack de testing:
- `vitest` (runner/mocks/assertions).
- `@testing-library/react` (tests de UI desde perspectiva usuario).
- `@testing-library/user-event` (interacciones realistas).
- `jsdom` (entorno DOM para React).
- `@testing-library/jest-dom` (matchers extendidos).

Setup global:
- `src/tests/setupTests.js`: Añade matchers de Testing Library al expect de Vitest, por ejemplo toBeInTheDocument(), toHaveTextContent(), etc.
- vite.config.js: Se excluye archivos estáticos que no se testean (CSS, .md,...) para que coverage no los tenga en cuenta a la hora de verificar las coberturas innecesarias.

## Estructura y convención de archivos:
Los test se encuentran localizados en: 
- src/tests/APIs/
- src/tests/Logics/
- src/tests/Interfaces/
Como convección de nombre se usará el nombre descriptivo del test + .test.js
Como se observa, para facilitar el mantenimiento y la revisión y garantizar también la escalabilidad se mantiene una estructura de separación por capas claramente diferenciadas.

## 2. Comandos de testing

Scripts disponibles en `package.json`:
- `npm run test`
- `npm run test:watch`
- `npm run test:coverage`

Casos de uso:
- Correr toda la suite:

```bash
npm run test
```

- Modo watch: correr tests en modo watch (quedarse “escuchando” cambios) y re-ejecutar automáticamente los tests cuando editas archivos.

```bash
npm run test:watch
```

- Cobertura:ejecuta todos los tests y da un reporte de la cobertura de los tests en el proyecto

```bash
npm run test:coverage o npx vitest –coverage

```

- Un archivo específico:ejecuta todos los tests de un archivo concreto

```bash
npx vitest run src/tests/Logics/Login/login.flow.test.jsx
```

- Por nombre/patrón:ejecuta los tests que contiene ese texto en su it()


```bash
npx vitest -t "bloquea doble submit"
```

## 3. Cobertura

Métricas que se revisan:
- `lines`: nos indica las líneas de código cubiertas por pruebas, y en nuestro caso, todas las líneas han sido ejecutadas por al menos una prueba.

- `branches`: caminos condicionales (`if/else`, ternarios, nullish). Al principio nos indica que solo habia cubiertas un 58% de las branches pero tras hacer los ajustes la cobertura es del 100%
- `functions`: nos da información del porcentaje de funciones que han sido llamadas en las pruebas y en nuestro caso nos muestra que todas las funciones del código fueron probadas. 
- `statements`: sentencias ejecutadas.

Siempre cuando se detecte alguna función o línea de código sin cubrir, se creará más test para poderlo cubrir todo. 

Salida:
- Reporte en consola.
- Reporte HTML en `coverage/`.

Al ejecutar npm run test:coverage nos muestra la información del estado de cobertura de nuestros test:
Se testean 21 archivos diferentes y todos pasaron sin errores por su color verde
En estos 21 archivos, se pasaron 113 pruebas

Caso de códigos cubiertos:
Como se observa en el resultado del test, se cubren todas las ramas, líneas y funciones al 100%

## Proceso del desarrollo de los test:
Semana 1 (20-26 Enero)
- Creación de estructura de carpetas src/tests/
- Tests básicos de autenticación (5 tests)
- Cobertura inicial: 45% branches
Semana 2 (1-12 Febrero)  
- Añadidos casos de error en APIs (4/8 tests)
- Cobertura: 78% branches
Semana 3 (15-24 Febrero)
- Tests de seguridad (XSS, roles)
- Edge cases en workspace utils
- Cobertura final: 100% branches

## Reglas de equipo:
No se acepta un Pull Request si:
La cobertura de branches baja del 60% al inicio del proyecto, ahora 80% en módulos críticos:
   - `/src/hooks/auth` → debe mantener 100%
   - `/src/api` → mínimo 90%
   - `/src/utils/workspace` → mínimo 85%
Los mocks no se limpian (falta afterEach con restoreAllMocks)
Checklist previo al PR:
- Ejecutar `npm run test:coverage`
- Verificar que branches no baja
- Revisar que los tests son independientes
- Confirmar limpieza de mocks


## 4. Estructura y convención de archivos

Ubicación de tests:
- `src/tests/APIs/**`: 5 archivos de test
- `src/tests/Logics/**`: 11 archivos de test
- `src/tests/Interfaces/**`: 5 archivos de test

Convención de nombres:
- `*.test.js`

Organización:
- Un archivo por comportamiento o flujo relevante.
- Separación por capa (`APIs`, `Logics`, `Interfaces`) para facilitar mantenimiento, escalabilidad y revisión.

## 5. Qué se está testeando

- `Logics`: autenticación, seguridad, utilidades del simulador (`WorkspaceUtils`).
- `Datos/API`: wrappers de `projects` y `receiverApi` con éxito, fallback y errores.
- `Interfaces`: `Login`, `PrivateRoute`, `ProjectCard`, `FormReceiver`.

Cobertura funcional actual:
- Flujos normales.
- Errores de backend/red.
- Casos límite y raros (payload incompleto, estados inválidos, ramas defensivas).
- Validaciones complejas y sanitización.

## 6. Guía para escribir tests (AAA)

Como se mencionó en el apartado 1, habrá una carpeta expresamente para tests (src/tests/), donde se crearán 3 carpetas: APIs/, Logics/, Interfaces/
Aunque como requerimiento de entrega es que se estructure en 3 archivos solamente, para un proyecto real es más recomendable tener carpetas por cada componente/funcionalidad y crear un archivo por test.
Por lo que se intentará seguir esta regla para mantener una estructura más ordenada.
Por otra parte, se sigue por regla general las siguientes reglas:
Un comportamiento por it().
Nombre intencional en describe e it.
Expect específico (evitar aserciones ambiguas).
Evitar duplicación con helpers de render/submit.
Usar it.todo para tener un índice de test que quedan por hacer
Usar la siguiente plantilla para escribir los test/it:

Plantilla:

```js
it('describe comportamiento esperado', async () => {
  // Arrange
  // preparar datos, mocks y estado inicial

  // Act
  // ejecutar la acción o llamada

  // Assert
  // verificar resultado esperado
});
```

Ejemplo de implantacion: import api from '@api/api';
import { getAllProjects } from '@api/projects';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@api/api', () => ({
 default: {
   get: vi.fn(),
 },
}));

describe('projects.js', () => {
 it('getAllProjects devuelve [] si falla la API', async () => {
   const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
   api.get.mockRejectedValueOnce(new Error('boom'));

   await expect(getAllProjects()).resolves.toEqual([]);

   consoleError.mockRestore();
 });
});

Reglas prácticas:
- Un comportamiento por `it`.
- Nombre intencional en `describe` e `it`.
- `expect` específico (evitar aserciones ambiguas).
- Evitar duplicación con helpers de render/submit.
- No dejar `it.todo` en entrega final.

## 7. Ejemplo real del proyecto

Archivo:
- `src/tests/Logics/Login/login.flow.test.jsx`

Caso:
- `bloquea doble submit mientras isSubmitting está activo`

AAA real:
- `Arrange`: mock de `login` pendiente y formulario completo.
- `Act`: submit inicial y segundo submit mientras carga.
- `Assert`: `login` se llama una vez; al resolver, navegación correcta y botón habilitado.

Valor:
- Evita requests duplicadas y regresiones de concurrencia en UI.

## 8. Mocks y aislamiento

Patrones usados:
- `vi.mock()` para módulos completos (`@api/api`, hooks, navegación).
- `vi.spyOn()` para funciones puntuales (`console.error`, `window.alert`, `window.confirm`).
- `mockResolvedValue` / `mockRejectedValue` para éxito/error.

## Aterrizado por tipo de prueba:
- APIs: se mockea el cliente HTTP para validar payloads, rutas y manejo de errores sin red real.
- Logics: se mockean dependencias externas (API, router, contexto) para testear solo la decisión de negocio.
- Interfaces: se mockean side-effects (navegación, alertas, confirmaciones) y se verifica lo que ve/hace el usuario.

Ejemplo de mock en API:
vi.mock('@api/api', () => ({
 default: {
   get: vi.fn(),
 },
}));
describe('projects.js', () => {
 it('getAllProjects devuelve [] si falla la API', async () => {
   const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
   api.get.mockRejectedValueOnce(new Error('boom'));
   await expect(getAllProjects()).resolves.toEqual([]);
   consoleError.mockRestore();
 });
});

## Cuándo usar cada patrón:
- Preferir vi.mock() cuando se quiera reemplazar todo el contrato de un módulo.
- Preferir vi.spyOn() cuando se quiera conservar la implementación original o inspeccionar llamadas puntuales.
- Usar mockImplementation() para casos complejos (transformaciones, callbacks, tiempos).
- Usar mockResolvedValueOnce() / mockRejectedValueOnce() para flujos multietapa en un mismo test.

Aislamiento:
- `afterEach(() => vi.restoreAllMocks())`.
- `vi.clearAllMocks()` cuando aplica.
- Limpieza de `localStorage` en tests de autenticación.
- Sin dependencias de red real ni estado compartido entre pruebas.

## Prácticas recomendadas de aislamiento:
- Reiniciar estado mutable compartido (localStorage, sessionStorage, timers, variables globales) en beforeEach/afterEach.
- Evitar declarar mocks con estado acumulado fuera de describe si pueden contaminar otros archivos.
- No depender del orden de ejecución de tests: cada it debe poder correr de forma independiente.
- Mantener un único origen de verdad para render (renderWithProviders) y setup de contexto.


## 9. Troubleshooting

## Guia rápido para hacer Debugging
- Confirmar si el test falla solo o también dentro de la suite completa.
- Revisar si falta limpiar mocks, storage o timers.
- Verificar que todas las interacciones async tengan await.
- Reemplazar queries frágiles por queries semánticas (role/name).
- Asegurar que no haya red real ni efectos globales no controlados.
- ReferenceError: fetch is not defined

## Errores típicos y soluciones
1. `ReferenceError: fetch is not defined`
- Solución: mockear capa API o agregar polyfill en `setupTests.js`.
- Diagnóstico:
El test está invocando fetch directo en entorno jsdom/node.
O un wrapper HTTP no está siendo mockeado y cae al fetch real.
Recomendación:
Si el proyecto ya usa cliente API (@api/api), mockear ese cliente y no fetch global.
Si necesitas fetch directo, definirlo en setupTests.js de forma controlada.


2. Fallos en `jsdom` (queries no encuentran elementos)
- Solución: preferir `getByRole`/`findBy*` y esperar asincronía con `waitFor`.
- Causas típicas:
El elemento aún no renderizó (estado async pendiente).
Selector frágil (getByText ambiguo, clases CSS, estructura interna).
El componente depende de providers no montados en el test.
Recomendación:
Usar findByRole para apariciones async.
Envolver aserciones async en waitFor.
Verificar accesibilidad (role, name) y usar helpers de render con providers.


3. Falsos positivos en tests async
- Solución: usar `await` en `userEvent` y en promesas antes de asertar.
- Causas típicas:
Falta await en user.click, user.type, submit o navegación.
Aserciones ejecutadas antes de que termine el estado/interacción.
Recomendación:
Instanciar const user = userEvent.setup() y await en todas las interacciones.
Esperar efectos secundarios (await waitFor(...)) antes de validar llamadas.
Evitar mezclar timers falsos con lógica asincronas sin control explícito.


4. Mocks contaminan otros tests
- Solución: restaurar/limpiar mocks en `afterEach` y evitar estado global mutable.
- Señales:
Un test pasa solo si corre aislado.
Un contador de llamadas viene "arrastrado" de pruebas anteriores.
Recomendación:
vi.restoreAllMocks() al final de cada test para limpiar
vi.clearAllMocks() si reutilizás funciones mockeadas entre escenarios.
Evitar mutar objetos compartidos; clonar fixtures por test.

