-- Run with: psql -U postgres -f InitBD.sql

CREATE USER "SimulatorUser"
	WITH PASSWORD 'SimulatorUserPassword123'
	NOSUPERUSER
	NOCREATEDB
	NOCREATEROLE;

CREATE DATABASE energysimulatordb OWNER "SimulatorUser";

REVOKE ALL ON DATABASE energysimulatordb FROM PUBLIC;
GRANT ALL PRIVILEGES ON DATABASE energysimulatordb TO "SimulatorUser";


-- Cambiar a la base de datos de la app para insertar datos de aplicación
\connect energysimulatordb;

-- Usuario admin de la aplicación (no del motor DB)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'users'
    ) THEN
        INSERT INTO users (full_name, date_of_birth, email, password_hash, is_admin)
        SELECT
            'Admin Energy Simulator',
            NULL,
            'admin@energysimulator.com',
            'admin123',
            TRUE
        WHERE NOT EXISTS (
            SELECT 1 FROM users WHERE LOWER(email) = LOWER('admin@energysimulator.com')
        );
    END IF;
END $$;
