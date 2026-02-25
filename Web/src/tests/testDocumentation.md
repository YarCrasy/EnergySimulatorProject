# Testing

Para una mejor lectura, tambien está creado un documento en el Google Drive del proyecto:
[Documentación de Testing](https://docs.google.com/document/d/1Sy74oTu3YtfXCcV8eZ4wlMOHkB7JcsmZ51l742gUkWM/edit?pli=1&tab=t.0#heading=h.i8167o4izlsf)

## 1. Requisitos / Setup

- `Node LTS` recomendado (18+).
- Instalar dependencias:

```bash
npm install
```

Stack de testing:
- `vitest` (runner/mocks/assertions).
- `@testing-library/react` (tests de UI desde perspectiva usuario).
- `@testing-library/user-event` (interacciones realistas).
- `jsdom` (entorno DOM para React).
- `@testing-library/jest-dom` (matchers extendidos).

Setup global:
- `src/tests/setupTests.js`.

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

- Modo watch:

```bash
npm run test:watch
```

- Cobertura:

```bash
npm run test:coverage
```

- Un archivo específico:

```bash
npx vitest run src/tests/Logics/Login/login.flow.test.jsx
```

- Por nombre/patrón:

```bash
npx vitest -t "bloquea doble submit"
```

## 3. Cobertura

Métricas que se revisan:
- `lines`: líneas ejecutadas.
- `branches`: caminos condicionales (`if/else`, ternarios, nullish).
- `functions`: funciones invocadas.
- `statements`: sentencias ejecutadas.

Salida:
- Reporte en consola.
- Reporte HTML en `coverage/`.

Regla de equipo:
- No se aprueba PR si baja cobertura del módulo tocado sin justificación técnica y plan de recuperación.

Configuración para evitar ruido:
- Se excluyen archivos no ejecutables (`css`, `assets`, `md`, `src/tests`).

## 4. Estructura y convención de archivos

Ubicación de tests:
- `src/tests/APIs/**`
- `src/tests/Logics/**`
- `src/tests/Interfaces/**`

Convención de nombres:
- `*.test.js`
- `*.test.jsx`

Organización:
- Un archivo por comportamiento o flujo relevante (sin tests de relleno).
- Separación por capa (`APIs`, `Logics`, `Interfaces`) para facilitar mantenimiento y revisión.

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

Aislamiento:
- `afterEach(() => vi.restoreAllMocks())`.
- `vi.clearAllMocks()` cuando aplica.
- Limpieza de `localStorage` en tests de autenticación.
- Sin dependencias de red real ni estado compartido entre pruebas.

## 9. Checklist de criterios

- Cantidad y tipo: se supera el mínimo con equilibrio entre lógica, API/datos e interfaz.
- Relevancia: se cubren flujos críticos, errores y casos límite.
- Calidad técnica/AAA: bloques `Arrange/Act/Assert` explícitos y nombres intencionales.
- Uso de Vitest: ejecución continua con `test`, `test:watch` y `test:coverage`.
- Colaboración y mocks: aislamiento consistente y estilo homogéneo en toda la suite.

## 10. Troubleshooting

1. `ReferenceError: fetch is not defined`
- Solución: mockear capa API o agregar polyfill en `setupTests.js`.

2. Fallos en `jsdom` (queries no encuentran elementos)
- Solución: preferir `getByRole`/`findBy*` y esperar asincronía con `waitFor`.

3. Falsos positivos en tests async
- Solución: usar `await` en `userEvent` y en promesas antes de asertar.

4. Mocks contaminan otros tests
- Solución: restaurar/limpiar mocks en `afterEach` y evitar estado global mutable.
