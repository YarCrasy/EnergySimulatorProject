# Testing del proyecto

## 1. Requisitos / Setup

- Vitest: se usa como test runner principal para ejecutar la suite, hacer mocking, aserciones y modos watch/coverage.
- React Testing Library: permite testear componentes desde la perspectiva del usuario.
- jsdom: entorno de navegador simulado para poder renderizar React en tests sin navegador real.
- `@testing-library/jest-dom`: añade matchers como `toBeInTheDocument` y `toHaveStyle`.
- `@testing-library/user-event`: simula interacciones más realistas que `fireEvent`.
- Ubicación: toda la suite está en `Web/src/tests`, separada por dominios (`APIs`, `Logics`, `Interfaces`).

`setupTests.js` actual:

```js
import '@testing-library/jest-dom/vitest';
```

---

## 2. Comandos disponibles

- `npm run test`: ejecuta la suite.
- `npm run test:watch`: ejecuta en modo watch.
- `npm run test:coverage`: genera cobertura.
- `npx vitest run src/tests/Logics/WorkspaceUtils/`: corre una carpeta concreta, WorkspaceUtils en este caso.
- `npx vitest run src/tests/APIs/receiverApi/create/backendMessage.test.js`: corre un archivo.
- `npx vitest -t "texto del test"`: filtra por nombre.

---

## 3. Cobertura (Coverage)

Métricas relevantes:

- `lines`: líneas ejecutadas.
- `branches`: caminos condicionales (`if/else`, ternarios).
- `functions`: funciones cubiertas.
- `statements`: sentencias ejecutadas.

Flujo recomendado:

- Ejecutar `npx vitest --coverage`.
- Revisar módulos con caída de cobertura y añadir casos de borde.

---

## 4. Estado actual del inventario de tests

Inventario detectado en `Web/src/tests`:

- Archivos de test (`*.test.*`): `17`
- Suites (`describe`): `17`
- Casos ejecutables (`it(...)`): `51`
- Casos pendientes (`it.todo(...)`): `8`

Distribución:

- APIs: `3` archivos
- Logics/Login: `3` archivos
- Logics/Security: `1` archivo
- Logics/WorkspaceUtils: `6` archivos
- Interfaces: `4` archivos

---

## 5. Qué se está testeando (detalle completo por archivo)

### 5.1 Tests de API (`src/tests/APIs`)

- `src/tests/APIs/receiverApi/create/backendMessage.test.js`
  - `receiverApi.create lanza error con mensaje del backend`
  - Mock de `@api/api` (`post`) y validación de propagación de `response.data.message`.

- `src/tests/APIs/projects/getAllProjects/fallbackEmpty.test.js`
  - `getAllProjects devuelve [] si falla la API`
  - Mock de `api.get` rechazado y validación de fallback a `[]`.

- `src/tests/APIs/projects/updateProjects/update.missingIdError.test.js`
  - `updateProject lanza error si falta id (undefined)`
  - `updateProject lanza error si falta id (null)`
  - `updateProject hace PUT y devuelve data cuando recibe id`
  - `updateProject relanza el error del API`
  - Cubre guard clause, happy path y propagación de error.

### 5.2 Tests de Lógica - Login (`src/tests/Logics/Login`)

- `src/tests/Logics/Login/authContext.behavior.test.jsx`
  - `inicia con loading false y user null cuando no hay sesión`
  - `hidrata usuario desde localStorage cuando la sesión es válida`
  - `descarta sesión corrupta en localStorage`
  - `login exitoso mapea admin=false a role user y persiste sesión`
  - `login exitoso mapea admin=true a role admin`
  - `login fallido usa el mensaje del backend cuando existe`
  - `login fallido usa mensaje genérico cuando backend no devuelve detalle`
  - `logout limpia usuario y remueve sesión persistida`

- `src/tests/Logics/Login/login.flow.test.jsx`
  - `redirige a administración cuando login devuelve rol admin`
  - `redirige a proyectos cuando login devuelve rol user`
  - `si viene de CTA del simulador crea proyecto y navega por id`
  - `si createProject no devuelve id navega a /simulator`
  - `si createProject falla muestra alerta y redirige al fallback por rol`
  - `si login falla muestra alerta con el mensaje y no redirige`
  - `bloquea doble submit mientras isSubmitting está activo`
  - `el botón "Crear cuenta" navega a /register`

- `src/tests/Logics/Login/jwt.auth.todo.test.js`
  - `guarda accessToken y refreshToken de forma segura al hacer login` (`todo`)
  - `inyecta Authorization: Bearer <token> en requests autenticados` (`todo`)
  - `valida expiración (exp) del JWT antes de usarlo` (`todo`)
  - `renueva accessToken automáticamente con refreshToken al expirar` (`todo`)
  - `hace logout automático cuando refresh token es inválido o expira` (`todo`)
  - `restaura sesión desde token válido al recargar la aplicación` (`todo`)
  - `rechaza tokens malformados o con firma inválida` (`todo`)
  - `limpia tokens y headers de auth al ejecutar logout` (`todo`)

### 5.3 Tests de Lógica - Security (`src/tests/Logics/Security`)

- `src/tests/Logics/Security/authContext.security.test.jsx`
  - `sanitiza payload con script al hidratar sesión desde localStorage`
  - `login exitoso sanitiza campos para evitar inyección de scripts`
  - `normaliza rol manipulado en localStorage para evitar escalación por role tampering`
  - `elimina prefijos javascript: y tags HTML al hidratar sesión`
  - `descarta sesión manipulada sin id y limpia persistencia`
  - `si backend responde login sin id no persiste sesión y falla de forma controlada`

### 5.4 Tests de Lógica - WorkspaceUtils (`src/tests/Logics/WorkspaceUtils`)

- `src/tests/Logics/WorkspaceUtils/buildNodeSignature.test.js`
  - `buildNodeSignature devuelve null sin elementId`

- `src/tests/Logics/WorkspaceUtils/buildProjectPayload/skips.test.js`
  - `buildProjectPayload cuenta skippedNodes/skippedConnections`
  - Valida payload final, redondeo y filtrado de nodos/conexiones inválidos.

- `src/tests/Logics/WorkspaceUtils/AttachBackendIdentifiers/bySignature.test.js`
  - `assigns backendId to nodes matching catalog by signature`
  - `assigns backendId when signature matches with rounded coordinates`
  - `attachBackendIdentifiers mantiene la referencia original si apiNodes está vacío`
  - `attachBackendIdentifiers no altera nodos sin firma válida o sin match`

- `src/tests/Logics/WorkspaceUtils/RoundCoord/normalizeValues.test.js`
  - `rounds numbers to 2 decimals`
  - `converts and rounds numeric strings`
  - `falls back to 0 for invalid values`

- `src/tests/Logics/WorkspaceUtils/HydrateNodesFromCatalog/conditionalUpdate.test.js`
  - `does not mutate when node already matches catalog`
  - `updates label/type/wattage/meta when catalog match exists`
  - `supports plain Map catalogs`
  - `returns same array when catalog is invalid`

- `src/tests/Logics/WorkspaceUtils/normalizeProject/fallbacks.test.js`
  - `normalizeProject crea nodos con palette y posiciones fallback`
  - Usa `vi.spyOn(Math, 'random')` para resultados deterministas.

### 5.5 Tests de Interfaces (`src/tests/Interfaces`)

- `src/tests/Interfaces/FormReceiver/submitNumbersKeepsId.test.jsx`
  - `envía powerConsumption/x/y como number y respeta id al editar`

- `src/tests/Interfaces/PrivateRoute/redirectUnautenticated.test.jsx`
  - `redirige a /login si no hay usuario autenticado`
  - `renderiza el contenido privado cuando hay usuario autenticado`
  - `redirige a / cuando el rol requerido no coincide`
  - `no renderiza children mientras loading es true`

- `src/tests/Interfaces/ProjectCard/contextMenu.test.jsx`
  - `abre menú con contextmenu y renderiza opciones`
  - Valida aparición de opciones y posición (`top/left`).

- `src/tests/Interfaces/ProjectCard/contextMenu.close.test.jsx`
  - `cierra el menú contextual al hacer click fuera`
  - `cierra el menú contextual al presionar Escape`
  - `cierra el menú contextual al hacer scroll`

---

## 6. Seguridad: cobertura anti inyección de scripts

Actualmente la cobertura de seguridad de autenticación está centralizada en `src/tests/Logics/Security/authContext.security.test.jsx` y contempla:

- Sanitización de `<script>` al hidratar sesión desde `localStorage`.
- Sanitización de `<script>` al recibir datos de login desde backend.
- Mitigación de role tampering (`role` inválido se normaliza a `user`).
- Limpieza de prefijos `javascript:` y tags HTML en campos de usuario.
- Rechazo de sesiones manipuladas sin `id`.
- Rechazo controlado de respuesta de login inválida sin persistir sesión.

Objetivo:

- Evitar persistir o propagar payloads con `<script>...</script>` en `name/email`.

---

## 7. Guía para escribir tests en este proyecto

Patrón AAA:

```js
describe('Módulo o componente', () => {
  it('describe el comportamiento esperado', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

Buenas prácticas observadas:

- Priorizar queries accesibles (`getByRole`, `findByText`).
- Mockear red (`@api/api`) para evitar requests reales.
- Restaurar mocks con `vi.restoreAllMocks()` en `afterEach`.
- Silenciar `console.error` solo cuando sea necesario y restaurarlo.
- Usar `waitFor`/`findBy*` para flujos asíncronos.

---

## 8. Mocks y aislamiento

Patrones usados en el repo:

- `vi.mock(modulePath, factory)` para módulos completos.
- `vi.spyOn(obj, 'method')` para observación puntual.
- `mockResolvedValue`, `mockRejectedValue`, `mockRejectedValueOnce`.
- Limpieza por caso con `afterEach`.

Dependencias mockeadas habitualmente:

- `@api/api` para capa HTTP.
- `@/hooks/auth` para estados de autenticación.
- `react-router-dom` (`useNavigate`, `useLocation`) para rutas.

---

## 9. Troubleshooting

- `spawn EPERM` al correr Vitest en entornos restringidos:
  - Correr tests con permisos fuera del sandbox.

- Errores de entorno DOM (jsdom):
  - Preferir aserciones observables.
  - Mockear/polyfillear APIs faltantes cuando aplique.

- Flakiness async:
  - Usar `await` con `waitFor`, `findBy*` y promesas.

- Matchers de jest-dom ausentes:
  - Verificar import en `src/tests/setupTests.js`.

- Fugas de estado entre tests:
  - Restaurar spies/mocks y limpiar `localStorage` en `afterEach`.
