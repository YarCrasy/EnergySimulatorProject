# Manual de despliegue del proyecto EnergySimulator

Este manual documenta el despliegue según la configuración actual del código en el repositorio.
Incluye: backend Spring Boot, frontend React/Vite y aplicación Android nativa.

---

## 1. Backend

### 1.1 Requisitos previos

- Java 25 (JDK 25)
- Gradle Wrapper incluido en `backend/gradlew`
- PostgreSQL
- Git

### 1.2 Configuración de la base de datos

El backend está configurado para usar PostgreSQL en `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/energysimulatordb
spring.datasource.username=SimulatorUser
spring.datasource.password=SimulatorUserPassword123
spring.datasource.driver-class-name=org.postgresql.Driver
```

Asegúrate de crear la base de datos y el usuario antes de arrancar la app:

```bash
psql -U postgres
CREATE DATABASE energysimulatordb;
CREATE USER "SimulatorUser" WITH PASSWORD 'SimulatorUserPassword123';
GRANT ALL PRIVILEGES ON DATABASE energysimulatordb TO "SimulatorUser";
```

### 1.3 Variables de configuración importantes

En `backend/src/main/resources/application.properties`:

- `app.jwt.secret=change-this-secret-key-before-production`
- `spring.jpa.show-sql=true`
- `spring.jpa.hibernate.ddl-auto=update`
- `spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect`
- `debug=true`
- `server.error.whitelabel.enabled=false`

> En producción es recomendable cambiar `app.jwt.secret` por una clave segura y evitar `ddl-auto=update`.

### 1.4 Ejecutar en local

Desde el directorio `backend/`:

```bash
cd /Users/nicolaityc/Desktop/EnergySimulatorProject/backend
./gradlew bootRun
```

La aplicación arranca en:

- `http://localhost:8080`

### 1.5 Generar un JAR desplegable

```bash
cd /Users/nicolaityc/Desktop/EnergySimulatorProject/backend
./gradlew bootJar
```

El artefacto se genera en:

- `backend/build/libs/backend-0.0.1-SNAPSHOT.jar`

### 1.6 Despliegue en un servidor

1. Copia el JAR al servidor.
2. Configura variables de entorno o un `application.properties` de producción.
3. Arranca con:

```bash
java -jar backend/build/libs/backend-0.0.1-SNAPSHOT.jar
```

Para producción, reemplaza las propiedades sensibles mediante variables de entorno o un `application.properties` externo.

### 1.7 Notas de producción

- Cambia `spring.jpa.hibernate.ddl-auto` a `none` o `validate`.
- Configura `app.jwt.secret` con un valor seguro.
- Asegura el servidor con HTTPS / reverse proxy.
- Ajusta el dialecto si cambias de base de datos.

---

## 2. Frontend web

### 2.1 Requisitos previos

- Node.js 18+
- npm 9+
- Navegador moderno (Chrome, Firefox, Edge, Safari)

### 2.2 Dependencias y scripts

`web/package.json` define:

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run test`

### 2.3 Configuración de la API

El frontend usa `web/src/api/api.ts` para resolver la URL del backend:

```ts
const defaultBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "https://dam.yarcrasy.com/api" : "http://localhost:8080/api");
```

Para cambiar la URL de backend localmente, crea un archivo `.env` en `web/` con:

```dotenv
VITE_API_URL=http://localhost:8080/api
```

### 2.4 Ejecutar en desarrollo

```bash
cd /Users/nicolaityc/Desktop/EnergySimulatorProject/web
npm install
npm run dev
```

El servidor Vite se expone en:

- `http://localhost:5173`

### 2.5 Generar build de producción

```bash
cd /Users/nicolaityc/Desktop/EnergySimulatorProject/web
npm install
npm run build
```

Los archivos estáticos quedan en:

- `web/dist/`

### 2.6 Servir la build de producción

Puedes usar cualquier servidor estático. Por ejemplo:

```bash
cd /Users/nicolaityc/Desktop/EnergySimulatorProject/web
npm run preview
```

O copiar `dist/` a un servidor Nginx/Apache.

### 2.7 Notas de despliegue

- El frontend está diseñado como SPA con Vite.
- Usa alias definidos en `web/vite.config.ts` para rutas internas.
- En producción, si no se define `VITE_API_URL`, usa `https://dam.yarcrasy.com/api`.

---

## 3. Android

### 3.1 Requisitos previos

- Android Studio (recomendado)
- Android SDK instalado y configurado
- JDK 25
- Gradle Wrapper incluido en `Android/gradlew`

### 3.2 Configuración de red real en el código

El archivo `Android/app/build.gradle.kts` define URLs específicas:

- Para `debug`:
  - `BACKEND_BASE_URL = "http://IP_DEL_EQUIPO:8080/api/"`
  - `WEB_BASE_URL = "http://IP_DEL_EQUIPO:5173"`
- Para `release`:
  - `BACKEND_BASE_URL = "https://dam.yarcrasy.com/api/"`
  - `WEB_BASE_URL = "https://dam.yarcrasy.com"`

Esto significa que el APK de debug espera el backend y la web accesibles en la red local. `IP_DEL_EQUIPO` debe sustituirse por la IP del ordenador que ejecuta Spring Boot y Vite; no es una URL estable de despliegue.

### 3.3 Ejecutar en emulador o dispositivo

Desde el directorio `Android/`:

```bash
cd /Users/nicolaityc/Desktop/EnergySimulatorProject/Android
./gradlew :app:assembleDebug
./gradlew :app:installDebug
```

También puedes abrir el proyecto con Android Studio y ejecutar la app.

### 3.4 Generar APK/Bundle de release

```bash
cd /Users/nicolaityc/Desktop/EnergySimulatorProject/Android
./gradlew :app:bundleRelease
```

El AAB generado se coloca en:

- `Android/app/build/outputs/bundle/release/app-release.aab`

Si quieres un APK:

```bash
./gradlew :app:assembleRelease
```

El APK queda en:

- `Android/app/build/outputs/apk/release/app-release.apk`

### 3.5 Notas de configuración

- `Android/local.properties` define el SDK local: `sdk.dir=/Users/nicolaityc/Library/Android/sdk`.
- El proyecto usa `compileSdk 36`, `minSdk 26`, `targetSdk 34`.
- El namespace es `ies.elrincon.energysimulator`.

### 3.6 Despliegue en Google Play

Para publicar debes:

1. Generar un keystore propio.
2. Ajustar `signingConfigs` si necesitas firmar con tu clave.
3. Subir `app-release.aab` a Google Play Console.

Por ahora el `build.gradle.kts` no incluye un `signingConfig` de release, así que la firma debe hacerse manual o agregarse al build script.

---

## 4. Recomendaciones generales

- En producción, separa las configuraciones de desarrollo y producción.
- No uses `spring.jpa.hibernate.ddl-auto=update` en el backend al desplegar en un entorno con datos.
- Cambia `app.jwt.secret` por una clave segura.
- Verifica que el backend, frontend y Android usen la misma URL base de API.
- Asegúrate de servir el frontend en HTTPS si el backend está en HTTPS.

---

## 5. Resumen de comandos

### Backend
```bash
./gradlew bootRun
./gradlew bootJar
```

### Frontend web
```bash
npm install
npm run dev
npm run build
```

### Android
```bash
./gradlew :app:assembleDebug
./gradlew :app:installDebug
./gradlew :app:bundleRelease
```

---

## 6. Archivos clave

- `backend/src/main/resources/application.properties`
- `backend/build.gradle`
- `web/package.json`
- `web/vite.config.ts`
- `web/src/api/api.ts`
- `Android/app/build.gradle.kts`
- `Android/local.properties`
