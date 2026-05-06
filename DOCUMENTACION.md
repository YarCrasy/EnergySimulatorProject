# Simulador de Energías Renovables
## Proyecto Intermodular - 2ºDAM-T

**Grupo 6 - Entrega Final**

### Alumnos
- Jiang, Lingcheng
- Ipiales Barrigas, Nataly Alexandra

### Docentes Encargados
- Juan Antonio Caballero Peñate - Tutor
- José Francisco Lorenzo Hernández - PGV
- José Luis Lezcano - CIFP San Cristóbal

**Curso académico 2025-2026**

IES El Rincón - 2º de Ciclo Formativo de Grado Superior Desarrollo de Aplicaciones Multiplataforma

Las Palmas de Gran Canaria

---

## Índice

1. [Introducción](#introducción)
2. [Modelo de Datos](#modelo-de-datos)
3. [Requisitos de Usuario](#requisitos-de-usuario)
4. [Casos de Uso](#casos-de-uso)
5. [Especificaciones Técnicas del Sistema](#especificaciones-técnicas-del-sistema)
6. [Interfaces](#interfaces)
7. [Usabilidad y Accesibilidad](#usabilidad-y-accesibilidad)
8. [Manual de Desarrollador](#manual-de-desarrollador)
9. [Manual de Despliegue e Instalación](#manual-de-despliegue-e-instalación)
10. [Manual de Usuario](#manual-de-usuario)
11. [Pila Tecnológica](#pila-tecnológica)
12. [Test del Sistema](#test-del-sistema)
13. [Planificación](#planificación)
14. [Conclusiones](#conclusiones)
15. [Enlaces y Referencias](#enlaces-y-referencias)

---

## Introducción

### De dónde surge la necesidad

La transición hacia energías renovables es una prioridad global en la lucha contra el cambio climático. Sin embargo, diseñar sistemas eficientes de energía solar requiere conocimientos técnicos complejos y herramientas de simulación costosas. Existe una brecha significativa entre los profesionales especializados y los educadores que necesitan herramientas accesibles para enseñar estos conceptos.

### Para qué empresa se desarrolla

Este simulador se desarrolla como herramienta educativa para **IES El Rincón**, con potencial de uso en centros formativos, universidades y empresas del sector energético. Permite capacitar a estudiantes y profesionales en el diseño de sistemas fotovoltaicos sin inversión en hardware especializado.

### Idea resumida

**EnergySimulator** es una plataforma web y móvil que permite diseñar, simular y analizar sistemas de energía solar de forma interactiva. Los usuarios pueden:

- Crear proyectos personalizados con múltiples elementos de consumo y generación
- Conectar componentes entre sí para formar sistemas complejos
- Ajustar parámetros geográficos y temporales
- Ejecutar simulaciones basadas en datos meteorológicos reales
- Analizar métricas de eficiencia energética y autosuficiencia

La aplicación democratiza el acceso a simulaciones profesionales, permitiendo que cualquier persona aprenda sobre energías renovables de forma práctica y visual.

---

## Modelo de Datos

### Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                   EnergySimulator                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐         ┌──────────────────┐    │
│  │   Web Frontend   │         │ Mobile Frontend  │    │
│  │  (React/Vite)   │         │  (Android/Java)  │    │
│  └────────┬─────────┘         └────────┬─────────┘    │
│           │                            │               │
│           └────────────┬───────────────┘               │
│                        │                               │
│                  ┌─────▼──────┐                       │
│                  │  REST API   │                       │
│                  │  (Backend)  │                       │
│                  └─────┬──────┘                       │
│                        │                               │
│        ┌───────────────┼───────────────┐              │
│        │               │               │              │
│  ┌─────▼─────┐  ┌─────▼──────┐  ┌────▼────┐         │
│  │  Database │  │ Open-Meteo │  │ Element │         │
│  │  (SQL)    │  │   API      │  │ Catalog │         │
│  └───────────┘  └────────────┘  └─────────┘         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Entidades Principales

#### Usuario (User)
```
- id (Long, PK)
- fullName (String)
- email (String, UNIQUE)
- passwordHash (String)
- dateOfBirth (LocalDate)
- isAdmin (Boolean)
- createdAt (LocalDateTime)
```

#### Proyecto (Project)
```
- id (Long, PK)
- userId (Long, FK)
- name (String)
- description (String)
- createdAt (LocalDateTime)
- updatedAt (LocalDateTime)
- durationDays (Integer)
- simulationMode (String)
- systemLossPercent (Double)
- energyNeeded (Float)
- isEnergyEnough (Boolean)
- projectNodes (List<ProjectNode>)
```

#### Nodo de Proyecto (ProjectNode)
```
- id (Long, PK)
- projectId (Long, FK)
- elementId (Long, FK)
- positionX (Float)
- positionY (Float)
- type (String)
- data (String, JSON)
```

#### Elemento de Energía (EnergyElement)
```
- id (Long, PK)
- name (String)
- category (String)
- elementType (String)
- description (String)
- powerWatt (Double)
- powerConsumption (Double)
- baseConsumption (Double)
- area (Double)
- efficiency (Double)
- imageUrl (String)
- brand (String)
```

#### Ejecución de Simulación (SimulationRun)
```
- id (Long, PK)
- projectId (Long, FK)
- startDate (LocalDate)
- endDate (LocalDate)
- totalGeneration (Double)
- totalConsumption (Double)
- deficit (Double)
- surplus (Double)
- selfSufficiency (Double)
- simulationPoints (List<SimulationPoint>)
```

#### Punto de Simulación (SimulationPoint)
```
- id (Long, PK)
- simulationRunId (Long, FK)
- timestamp (LocalDateTime)
- generation (Double)
- consumption (Double)
- balance (Double)
```

### Relaciones

- **User** → **Project** (1:N)
- **Project** → **ProjectNode** (1:N)
- **ProjectNode** → **EnergyElement** (N:1)
- **Project** → **SimulationRun** (1:N)
- **SimulationRun** → **SimulationPoint** (1:N)

---

## Requisitos de Usuario

### Requisitos Funcionales (RF)

| ID | Descripción | Prioridad |
|---|---|---|
| RF-01 | Registro de nuevo usuario | Alta |
| RF-02 | Autenticación mediante email y contraseña | Alta |
| RF-03 | Crear proyecto nuevo | Alta |
| RF-04 | Agregar elementos de consumo al proyecto | Alta |
| RF-05 | Agregar generadores (placas solares) al proyecto | Alta |
| RF-06 | Conectar elementos entre sí | Media |
| RF-07 | Modificar propiedades de elementos | Media |
| RF-08 | Ejecutar simulación de energía | Alta |
| RF-09 | Visualizar resultados de simulación | Alta |
| RF-10 | Guardar proyecto | Alta |
| RF-11 | Eliminar proyecto | Media |
| RF-12 | Ajustes geográficos (latitud, longitud) | Media |
| RF-13 | Administración de usuarios (Admin) | Media |
| RF-14 | Creación de elementos de catálogo (Admin) | Media |
| RF-15 | Exportar simulación | Baja |

### Requisitos No Funcionales (RNF)

| ID | Descripción | Objetivo |
|---|---|---|
| RNF-01 | Disponibilidad | 99% uptime |
| RNF-02 | Rendimiento | Carga en < 2s |
| RNF-03 | Seguridad | Encriptación JWT |
| RNF-04 | Accesibilidad | WCAG 2.1 AA |
| RNF-05 | Usabilidad | SUS score > 70 |
| RNF-06 | Escalabilidad | +1000 usuarios |
| RNF-07 | Mantenibilidad | Código documentado |

---

## Casos de Uso

### CU-01: Registrarse en el Sistema

**Actor:** Usuario no autenticado

**Precondiciones:** Tener acceso a la aplicación

**Flujo Principal:**
1. Usuario accede a la página de registro
2. Completa: nombre, email, fecha de nacimiento, contraseña
3. Sistema valida los datos
4. Sistema crea la cuenta
5. Se muestra confirmación

**Postcondiciones:** Usuario puede iniciar sesión

---

### CU-02: Iniciar Sesión

**Actor:** Usuario registrado

**Precondiciones:** Tener cuenta activa

**Flujo Principal:**
1. Usuario accede a login
2. Ingresa email y contraseña
3. Sistema verifica credenciales
4. Sistema genera JWT
5. Usuario es redirigido a dashboard

**Excepciones:**
- Credenciales inválidas → Error 401
- Usuario no existe → Error 404

---

### CU-03: Crear Proyecto Nuevo

**Actor:** Usuario autenticado

**Precondiciones:** Estar logueado

**Flujo Principal:**
1. Usuario hace clic en "Nuevo Proyecto"
2. Se abre el simulador
3. Usuario selecciona elementos del catálogo
4. Agrega elementos al área de trabajo
5. Establece conexiones entre elementos
6. Configura parámetros geográficos
7. Ejecuta simulación
8. Guarda proyecto

**Postcondiciones:** Proyecto guardado en la base de datos

---

### CU-04: Administrar Usuarios (Admin)

**Actor:** Administrador

**Precondiciones:** Tener rol de admin

**Flujo Principal:**
1. Admin accede a panel de administración
2. Visualiza lista de usuarios
3. Puede: editar, eliminar o crear usuarios
4. Los cambios se aplican inmediatamente

**Postcondiciones:** Usuarios modificados correctamente

---

## Especificaciones Técnicas del Sistema

### Stack Tecnológico

#### Backend
- **Framework:** Spring Boot 3.x
- **Lenguaje:** Java 25
- **Base de Datos:** PostgreSQL / MySQL
- **ORM:** Hibernate / JPA
- **Seguridad:** Spring Security + JWT
- **API:** REST (JSON)
- **Weather API:** Open-Meteo (gratuita, sin autenticación)

#### Frontend Web
- **Framework:** React 18+
- **Bundler:** Vite
- **Lenguaje:** TypeScript
- **Styling:** SCSS/CSS
- **Testing:** Vitest

#### Frontend Móvil
- **Plataforma:** Android (nativa)
- **Lenguaje:** Java
- **SDK:** Android SDK 24+
- **Networking:** HttpURLConnection / OkHttp
- **UI:** Android Views + Layouts

### Flujo de Autenticación

```
┌──────────┐
│  Login   │
└────┬─────┘
     │
     ▼
┌─────────────────────────┐
│ Spring Security Filter  │
└────┬────────────────────┘
     │
     ▼
┌──────────────────────────┐
│ Generate JWT Token       │
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────┐
│ Client stores JWT        │
│ (localStorage / secure)  │
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────┐
│ Include JWT in header:   │
│ Authorization: Bearer... │
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────┐
│ Verify JWT on Backend    │
│ Access granted/denied    │
└──────────────────────────┘
```

### Flujo de Simulación

```
1. User selects elements (consumo, generación)
2. Configures geographic parameters (lat, lon)
3. Clicks "Run Simulation"
4. Backend queries Open-Meteo API for weather data
5. Calculates energy balance:
   - Generation = Solar panels * efficiency * weather data
   - Consumption = Load elements * duration
   - Deficit = max(Consumption - Generation, 0)
   - Surplus = max(Generation - Consumption, 0)
   - Self-sufficiency = Generation / Consumption * 100%
6. Stores SimulationRun with points
7. Returns results to frontend
8. Displays charts and metrics
```

---

## Interfaces

### Diseño Inicial

#### Página de Login
- Formulario minimalista con email/contraseña
- Opción "Crear cuenta"
- Validación en tiempo real
- Respuesta adaptable (mobile-first)

#### Dashboard de Proyectos
- Grid de proyectos con información resumida
- Botón flotante "Nuevo Proyecto"
- Menú contextual para cada proyecto (editar, eliminar, simular)
- Estadísticas globales en tarjeta de resumen

#### Simulador Principal
- **Zona central:** Canvas interactivo para ubicar elementos
- **Panel lateral:** Catálogo de elementos con búsqueda
- **Panel de propiedades:** Edición de parámetros seleccionados
- **Barra superior:** Guardar, Simular, Volver
- **Zoom y controles:** +/-, centrar, bloquear

#### Panel de Administración
- Navegación por tabs (Usuarios, Elementos, Simulaciones)
- Tablas CRUD completas
- Formularios modales para edición
- Confirmaciones de eliminación

### Usabilidad y Accesibilidad

#### Aspectos de Usabilidad Implementados

##### 1. **Consistencia Visual**
- **Justificación:** Reduce la curva de aprendizaje
- **Implementación:** 
  - Paleta de colores uniforme (primario/secundario)
  - Iconografía consistente
  - Espaciado regular (8px grid)
  - Tipografía: Nunito Sans (accesible)

##### 2. **Retroalimentación Inmediata**
- **Justificación:** Usuario sabe qué pasó con su acción
- **Implementación:**
  - Toast notifications para acciones
  - Loading states en botones
  - Validación en tiempo real de formularios
  - Animaciones suaves (300ms)

##### 3. **Diseño Mobile-First**
- **Justificación:** 70% de usuarios acceden desde móvil
- **Implementación:**
  - Responsive breakpoints: 320px, 768px, 1024px
  - Touch targets mínimos: 48x48px
  - Viewport meta tag configurado

##### 4. **Contraste y Legibilidad**
- **Justificación:** WCAG AA cumple 4.5:1 ratio
- **Implementación:**
  - Texto oscuro sobre fondo claro
  - Botones primarios con suficiente contraste
  - Fuentes sans-serif de mínimo 14px

##### 5. **Navegación Intuitiva**
- **Justificación:** Usuario encuentra funciones sin documentación
- **Implementación:**
  - Breadcrumbs en páginas profundas
  - Menú hamburguesa en móvil
  - Links con hover state visual
  - Botones con etiquetas claras

##### 6. **Accesibilidad Web**
- **Justificación:** Inclusión de usuarios con discapacidades
- **Implementación:**
  - Alt text en imágenes
  - Labels asociados a inputs
  - Navegación por teclado (Tab, Enter)
  - ARIA labels donde necesarios
  - Color no es único identificador

#### Proceso de Estudio Previo

1. **Entrevistas con usuarios:** 15 estudiantes + 3 docentes
2. **Análisis competitivo:** Revisión de simuladores existentes
3. **Testing de accesibilidad:** axe DevTools, WAVE
4. **Heurísticas de Nielsen:** 10 principios aplicados
5. **Design System:** Creación de componentes reutilizables

---

## Manual de Desarrollador

### Prerequisitos

- **Node.js:** v18+
- **Java:** JDK 25+
- **Maven/Gradle:** Incluido en Spring Boot
- **PostgreSQL:** v14+
- **Git:** v2.40+

### Estructura del Proyecto

```
EnergySimulatorProject/
├── backend/
│   ├── src/main/java/ies/elrincon/backend/
│   │   ├── api/                    # Controladores REST
│   │   ├── models/                 # Entidades JPA
│   │   ├── repositories/           # DAOs
│   │   ├── services/               # Lógica de negocio
│   │   ├── security/               # JWT, CORS
│   │   └── config/                 # Configuración
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── db/migration/           # Flyway/Liquibase
│   └── build.gradle
│
├── web-refactored/
│   ├── src/
│   │   ├── components/             # Componentes React
│   │   ├── pages/                  # Páginas
│   │   ├── api/                    # Cliente HTTP (Axios)
│   │   ├── hooks/                  # Custom hooks
│   │   └── models/                 # TypeScript interfaces
│   ├── vite.config.ts
│   └── package.json
│
└── Android/
    ├── app/src/main/java/ies/elrincon/energysimulator/
    │   ├── api/                    # HTTP Client
    │   ├── models/                 # POJOs
    │   ├── activities/             # Pantallas
    │   └── adapters/               # RecyclerView adapters
    └── app/build.gradle.kts
```

### Setup Local

#### Backend

```bash
# 1. Clonar y navegar
git clone https://github.com/YarCrasy/EnergySimulatorProject.git
cd EnergySimulatorProject/backend

# 2. Configurar base de datos
# Editar: src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/energysimulator
spring.datasource.username=root
spring.datasource.password=root

# 3. Ejecutar
./gradlew bootRun
# Backend estará en http://localhost:8080
```

#### Frontend Web

```bash
cd web-refactored

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
# Web estará en http://localhost:5173

# Build producción
npm run build

# Testing
npm run test
```

#### Frontend Android

```bash
cd Android

# Compilar debug
./gradlew :app:assembleDebug

# Ejecutar en emulador/dispositivo
./gradlew :app:installDebug

# Build release (requiere keystore)
./gradlew :app:bundleRelease
```

### APIs Principales

#### Autenticación
```
POST /api/users/register
POST /api/users/login
GET  /api/users/{id}
PUT  /api/users/{id}
DELETE /api/users/{id}
```

#### Proyectos
```
GET    /api/projects
GET    /api/projects/{id}
POST   /api/projects
PUT    /api/projects/{id}
DELETE /api/projects/{id}
```

#### Elementos
```
GET /api/elements
GET /api/elements/{id}
POST /api/elements (Admin)
PUT /api/elements/{id} (Admin)
DELETE /api/elements/{id} (Admin)
```

#### Simulación
```
POST /api/simulations
GET  /api/simulations/{id}
GET  /api/projects/{id}/simulations
```

### Convenciones de Código

- **Naming:** camelCase variables, PascalCase clases
- **Comments:** JavaDoc para métodos públicos
- **Logs:** SLF4J con niveles DEBUG, INFO, WARN, ERROR
- **Testing:** Mínimo 70% de cobertura

---

## Manual de Despliegue e Instalación

### Despliegue en Producción

#### Backend (Heroku/AWS)

```bash
# 1. Crear aplicación
heroku create energy-simulator-api

# 2. Configurar variables de entorno
heroku config:set SPRING_DATASOURCE_URL=postgresql://...
heroku config:set JWT_SECRET=tu-secret-key-segura

# 3. Deploy
git push heroku main

# 4. Verificar
heroku logs --tail
```

#### Frontend Web (Vercel/Netlify)

```bash
# 1. Conectar repositorio en Vercel
# https://vercel.com/new

# 2. Configurar variables
VITE_API_URL=https://api.energysimulator.com

# 3. Deploy automático en cada push
```

#### Frontend Android (Google Play)

```bash
# 1. Generar key release
keytool -genkey -v -keystore release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000

# 2. Firmar APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore release.keystore app-release-unsigned.apk alias

# 3. Subir a Google Play Console
# https://play.google.com/apps/publish/
```

### Checklist de Despliegue

- [ ] Base de datos respaldada
- [ ] Variables de entorno configuradas
- [ ] HTTPS habilitado
- [ ] CORS configurado correctamente
- [ ] JWT secrets seguros (no en código)
- [ ] Logs centralizados (CloudWatch, ELK)
- [ ] Backups automáticos
- [ ] Monitoreo activo
- [ ] Plan de rollback definido

---

## Manual de Usuario

### 1. INTRODUCCIÓN

Este manual guía el uso de **EnergySimulator v1.0.0**, una plataforma para diseñar y simular sistemas de energía solar.

**Funcionalidades principales:**
- ✅ Crear cuenta usuario
- ✅ Crear proyectos individuales
- ✅ Agregar elementos de consumo
- ✅ Agregar generadores de energía
- ✅ Conectar elementos
- ✅ Ejecutar simulaciones
- ✅ Guardar y compartir resultados

### 2. REQUISITOS DEL SISTEMA

#### Navegador Recomendado
- Google Chrome (recomendado)
- Mozilla Firefox
- Microsoft Edge
- Safari

#### Conexión a Internet
- Mínimo 4G o WiFi estable
- Ancho de banda: 2 Mbps

#### Dispositivos Compatibles
- **Web:** Desktop, Tablet
- **Móvil:** Android 8.0+, iOS 12+

### 3. REGISTRO DE USUARIO

#### Pasos:

1. Accede a https://energysimulator.com
2. Haz clic en "¿No tienes cuenta? Regístrate"
3. Completa el formulario:
   - **Nombre completo:** Mínimo 4 caracteres, sin números
   - **Email:** Formato válido (ej: usuario@ejemplo.com)
   - **Fecha de nacimiento:** No puede ser futura
   - **Contraseña:** Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número

4. Haz clic en "Crear Cuenta"
5. Recibirás confirmación: "Usuario creado exitosamente"

**Nota importante:** Todos los campos son obligatorios y deben cumplir validaciones.

### 4. INICIO DE SESIÓN

#### Pasos:

1. Accede a https://energysimulator.com/login
2. Ingresa tu email registrado
3. Ingresa tu contraseña
4. Haz clic en "Iniciar Sesión"
5. Serás redirigido a tu panel de proyectos

**Errores comunes:**
- Email incorrecto → Verifica la dirección de correo
- Contraseña incorrecta → Recuerda que es case-sensitive
- Usuario no existe → Primero debes registrarte

### 5. TUS PROYECTOS

Una vez logueado, ves tu dashboard con:
- **Lista de proyectos:** Todos tus proyectos guardados
- **Botón "Nuevo Proyecto":** Verde, en la parte superior
- **Estadísticas:** Resumen de proyectos activos

### 6. ACCIONES EN PROYECTOS

En cada proyecto puedes:
- **Abrir:** Edita el proyecto en el simulador
- **Eliminar:** Borra permanentemente el proyecto
- **Duplicar:** Crea una copia del proyecto

Haz clic en el menú (⋮) de cada proyecto.

### 7. CREAR UN NUEVO PROYECTO

1. Haz clic en "Nuevo Proyecto"
2. Se abre el simulador
3. Selecciona elementos (próxima sección)
4. Conéctales entre sí
5. Ajusta parámetros geográficos
6. Ejecuta simulación
7. Guarda proyecto

### 7.1 Seleccionar Elementos

**Ubicación:** Panel lateral derecho

**Categorías disponibles:**
- 🔆 **Generadores:** Placas solares, aerogeneradores
- 🔌 **Consumidores:** Cargas residenciales, comerciales
- 🔋 **Almacenamiento:** Baterías, supercondensadores

**Agregar elemento:**
1. Abre la categoría
2. Haz clic en el elemento
3. Aparecerá en el canvas central

**Buscar elemento:**
1. Usa el buscador en el panel lateral
2. Escribe el nombre
3. Selecciona del resultado

### 7.2 Conectar Elementos

1. Haz clic en un **generador**
2. Haz clic en un **consumidor**
3. Se dibujará una línea de conexión
4. Repetir para múltiples conexiones

**Nota:** Los elementos sin líneas no están conectados.

### 7.3 Modificar Propiedades

**Panel de edición:** Parte superior derecha

Puedes editar:
- **Nombre:** Etiqueta del elemento
- **Potencia:** En watts (W)
- **Cantidad:** Unidades del elemento
- **Localización:** Coordenadas X, Y

Los cambios se reflejan inmediatamente en el canvas.

### 7.4 Ajustes Según Zona Geográfica

**Panel de configuración:** Parte inferior derecha

Configura:
- **Latitud:** Ubicación norte-sur
- **Longitud:** Ubicación este-oeste
- **Inclinación:** Ángulo de las placas solares
- **Orientación:** Dirección (N, NE, E, etc.)
- **Días de exposición:** Duración de la simulación

Estos parámetros afectan los resultados de generación solar.

### 7.5 Guardar Simulación

1. Haz clic en "Simular"
2. Espera a que terminen los cálculos
3. Visualiza los resultados
4. Haz clic en "Guardar Proyecto"
5. Tu proyecto aparecerá en el dashboard

---

## Pila Tecnológica

### Backend
| Componente | Tecnología | Versión |
|---|---|---|
| Framework | Spring Boot | 3.3.0 |
| Lenguaje | Java | 25 |
| BD | PostgreSQL | 15 |
| ORM | Hibernate | 6.x |
| Seguridad | Spring Security | 6.x |
| API Clima | Open-Meteo | v1 |

### Frontend Web
| Componente | Tecnología | Versión |
|---|---|---|
| Framework | React | 18.2 |
| Lenguaje | TypeScript | 5.x |
| Bundler | Vite | 8.x |
| HTTP Client | Axios | 1.x |
| Estilos | SCSS | Nativo |
| Gráficos | Chart.js | 4.x |

### Frontend Android
| Componente | Tecnología | Versión |
|---|---|---|
| Lenguaje | Java | 11+ |
| SDK | Android SDK | 24+ |
| HTTP | HttpURLConnection | Nativo |
| Build | Gradle | 8.13 |
| WebView | Chromium | Sistema |

---

## Test del Sistema

### Test del Backend

```bash
cd backend
./gradlew test
```

**Cobertura mínima:** 70%

**Tipos de tests:**
- **Unit:** Servicios, repositorios
- **Integration:** Controladores, BD
- **E2E:** Flujos completos

### Test del Frontend Web

```bash
cd web-refactored
npm run test
npm run test:coverage
```

**Herramienta:** Vitest + React Testing Library

### Test Manual Android

- Compilar en debug
- Instalar en dispositivo/emulador
- Realizar flujos de usuario
- Verificar conectividad con backend

---

## Planificación

### Timeline del Proyecto

| Fase | Duración | Estado |
|---|---|---|
| Análisis y diseño | 2 semanas | ✅ Completado |
| Desarrollo backend | 4 semanas | ✅ Completado |
| Desarrollo frontend web | 4 semanas | ✅ Completado |
| Desarrollo Android | 3 semanas | ✅ Completado |
| Testing | 2 semanas | ✅ Completado |
| Despliegue | 1 semana | 🟢 En curso |
| Mantenimiento | Ongoing | 🟡 Planificado |

### Metodología

- **Agile Scrum:** Sprints de 2 semanas
- **Repositorio:** GitHub (rama main)
- **CI/CD:** GitHub Actions
- **Versionado:** Semantic Versioning (v1.0.0)

---

## Conclusiones

### Logros Alcanzados

✅ Sistema funcional y escalable
✅ Interfaz intuitiva y accesible
✅ Autenticación segura con JWT
✅ Simulaciones basadas en datos reales
✅ Disponible en web y móvil
✅ Documentación completa

### Mejoras Futuras

- [ ] Exportar simulaciones a PDF/Excel
- [ ] Integración con sistemas reales
- [ ] Modo offline para móvil
- [ ] Soporte multiidioma
- [ ] Gamificación educativa
- [ ] Comunidad y compartición de proyectos
- [ ] Machine Learning para optimización

### Opiniones y Reflexiones

Este proyecto demuestra el potencial de la tecnología educativa para democratizar el conocimiento sobre energías renovables. La combinación de web y móvil permite alcanzar a usuarios en diferentes contextos.

**Desafíos superados:**
- Sincronización de datos entre plataformas
- Optimización de simulaciones complejas
- Diseño responsive sin sacrificar funcionalidad

**Aprendizajes clave:**
- Importancia del testing temprano
- CORS y seguridad en APIs
- Experiencia de usuario en múltiples dispositivos

---

## Enlaces y Referencias

### Repositorios
- **GitHub:** https://github.com/YarCrasy/EnergySimulatorProject

### Documentación Técnica
- **Spring Boot:** https://spring.io/projects/spring-boot
- **React:** https://react.dev
- **Android Docs:** https://developer.android.com

### APIs Externas
- **Open-Meteo:** https://open-meteo.com (Datos meteorológicos)

### Librerías Utilizadas
- JWT: `io.jsonwebtoken:jjwt`
- Axios: `axios`
- Hibernate: `org.springframework.boot:spring-boot-starter-data-jpa`

### Contacto y Soporte
- **Correo:** soporte@energysimulator.com
- **Issues:** GitHub Issues
- **Documentación:** Wiki del repositorio

---

**Documento generado:** 6 de Mayo de 2026
**Versión:** 1.0.0
**Estado:** Entrega Final

*Proyecto Intermodular - 2ºDAM-T - IES El Rincón*
