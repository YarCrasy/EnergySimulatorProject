-- Run with: psql -U postgres -f InitBD.sql

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

-- 4) Cambiar a la base de datos de la app
\connect energysimulatordb;

-- 5) Usuarios de aplicación (admin + prueba) si existe tabla users
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'users'
    ) THEN
        -- Admin
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

        -- Usuario de prueba
        INSERT INTO users (full_name, date_of_birth, email, password_hash, is_admin)
        SELECT
            'Usuario Prueba',
            DATE '1995-01-15',
            'prueba@energysimulator.com',
            'prueba123',
            FALSE
        WHERE NOT EXISTS (
            SELECT 1 FROM users WHERE LOWER(email) = LOWER('prueba@energysimulator.com')
        );
    END IF;
END $$;

-- 6) Elemento consumidor de prueba
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'elements')
       AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'consumer_elements')
       AND NOT EXISTS (
            SELECT 1
            FROM elements e
            JOIN consumer_elements c ON c.id = e.id
            WHERE LOWER(e.name) = LOWER('Consumo Hogar Demo')
       ) THEN

        WITH new_element AS (
            INSERT INTO elements (name, category, description, image_url, element_type)
            VALUES (
                'Consumo Hogar Demo',
                'consumer',
                'Consumidor residencial de ejemplo',
                'https://example.com/images/consumer-demo.png',
                'CONSUMER_ELEMENT'
            )
            RETURNING id
        )
        INSERT INTO consumer_elements (id, power_consumption, base_consumption, peak_consumption, profile_type)
        SELECT id, 1800.0, 900.0, 2400.0, 'RESIDENTIAL'
        FROM new_element;
    END IF;
END $$;

-- 7) Elemento generador de prueba
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'elements')
       AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'generator_elements')
       AND NOT EXISTS (
            SELECT 1
            FROM elements e
            JOIN generator_elements g ON g.id = e.id
            WHERE LOWER(e.name) = LOWER('Panel Solar Demo')
       ) THEN

        WITH new_element AS (
            INSERT INTO elements (name, category, description, image_url, element_type)
            VALUES (
                'Panel Solar Demo',
                'generator',
                'Generador fotovoltaico de ejemplo',
                'https://example.com/images/generator-demo.png',
                'GENERATOR_ELEMENT'
            )
            RETURNING id
        )
        INSERT INTO generator_elements (id, brand, area, efficiency, power_watt)
        SELECT id, 'DemoSolar', 12.0, 0.20, 3600.0
        FROM new_element;
    END IF;
END $$;

-- 8) Elemento de almacenamiento de prueba (batería)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'elements')
       AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'battery_elements')
       AND NOT EXISTS (
            SELECT 1
            FROM elements e
            JOIN battery_elements b ON b.id = e.id
            WHERE LOWER(e.name) = LOWER('Bateria Demo')
       ) THEN

        WITH new_element AS (
            INSERT INTO elements (name, category, description, image_url, element_type)
            VALUES (
                'Bateria Demo',
                'battery',
                'Sistema de almacenamiento de ejemplo',
                'https://example.com/images/battery-demo.png',
                'BATTERY_ELEMENT'
            )
            RETURNING id
        )
        INSERT INTO battery_elements (id, capacity, initial_charge, max_charge_power, max_discharge_power)
        SELECT id, 10000.0, 4000.0, 2500.0, 2500.0
        FROM new_element;
    END IF;
END $$;
