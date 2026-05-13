-- Run with: psql -U postgres -f InitBD.sql
-- Se ejecuta automáticamente al iniciar el contenedor PostgreSQL
-- (montado en /docker-entrypoint-initdb.d/)
--
-- Crea el rol y la base de datos si no existen.
-- Los datos de demostración se insertan por separado
-- mediante InsertDemoData.sql (ejecutado tras arrancar el backend).

-- 1) Crear rol de la app si no existe
SELECT 'CREATE ROLE "SimulatorUser" LOGIN PASSWORD ''SimulatorUserPassword123'' NOSUPERUSER NOCREATEDB NOCREATEROLE'
WHERE NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'SimulatorUser'
)\gexec

-- 2) Crear base de datos si no existe
SELECT 'CREATE DATABASE energysimulatordb OWNER "SimulatorUser"'
WHERE NOT EXISTS (
    SELECT 1 FROM pg_database WHERE datname = 'energysimulatordb'
)\gexec

-- 3) Permisos de base de datos
REVOKE ALL ON DATABASE energysimulatordb FROM PUBLIC;
GRANT ALL PRIVILEGES ON DATABASE energysimulatordb TO "SimulatorUser";
