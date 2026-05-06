-- Script SQL para el esquema de base de datos de EnergySimulator
-- Generado basado en las entidades JPA de Spring Boot
-- Compatible con MySQL y PostgreSQL (con ajustes menores)

-- Tabla: usuario
CREATE TABLE usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: elemento_energia
CREATE TABLE elemento_energia (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(255) NOT NULL,
    element_type VARCHAR(255) NOT NULL,
    description TEXT,
    power_watt DOUBLE NOT NULL CHECK (power_watt >= 0),
    power_consumption DOUBLE CHECK (power_consumption >= 0),
    base_consumption DOUBLE CHECK (base_consumption >= 0),
    area DOUBLE CHECK (area >= 0),
    efficiency DOUBLE CHECK (efficiency BETWEEN 0 AND 1),
    image_url VARCHAR(500),
    brand VARCHAR(255)
);

-- Tabla: proyecto
CREATE TABLE proyecto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    season VARCHAR(255),
    latitude DOUBLE,
    longitude DOUBLE,
    timezone VARCHAR(255),
    tilt_angle DOUBLE,
    azimuth DOUBLE,
    duration_days INT NOT NULL CHECK (duration_days > 0),
    simulation_mode VARCHAR(255) NOT NULL,
    system_loss_percent DOUBLE NOT NULL CHECK (system_loss_percent BETWEEN 0 AND 100),
    energy_enough BOOLEAN,
    energy_needed FLOAT,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Tabla: nodo_proyecto
CREATE TABLE nodo_proyecto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    element_id BIGINT NOT NULL,
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    type VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 1,
    data TEXT,
    FOREIGN KEY (project_id) REFERENCES proyecto(id) ON DELETE CASCADE,
    FOREIGN KEY (element_id) REFERENCES elemento_energia(id) ON DELETE RESTRICT
);

-- Tabla: simulacion_run
CREATE TABLE simulacion_run (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    provider VARCHAR(255) NOT NULL DEFAULT 'open-meteo',
    latitude DOUBLE,
    longitude DOUBLE,
    timezone VARCHAR(255),
    duration_days INT,
    tilt_angle DOUBLE,
    azimuth DOUBLE,
    total_generation_kwh DOUBLE CHECK (total_generation_kwh >= 0),
    total_consumption_kwh DOUBLE CHECK (total_consumption_kwh >= 0),
    deficit_kwh DOUBLE CHECK (deficit_kwh >= 0),
    surplus_kwh DOUBLE CHECK (surplus_kwh >= 0),
    self_sufficiency_percent DOUBLE CHECK (self_sufficiency_percent BETWEEN 0 AND 100),
    energy_enough BOOLEAN,
    FOREIGN KEY (project_id) REFERENCES proyecto(id) ON DELETE CASCADE
);

-- Tabla: simulacion_punto
CREATE TABLE simulacion_punto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    simulation_run_id BIGINT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    generation_w DOUBLE NOT NULL CHECK (generation_w >= 0),
    consumption_w DOUBLE NOT NULL CHECK (consumption_w >= 0),
    balance_w DOUBLE NOT NULL,
    deficit_kwh DOUBLE CHECK (deficit_kwh >= 0),
    surplus_kwh DOUBLE CHECK (surplus_kwh >= 0),
    cloud_cover DOUBLE CHECK (cloud_cover >= 0),
    irradiance DOUBLE CHECK (irradiance >= 0),
    is_day BOOLEAN NOT NULL,
    FOREIGN KEY (simulation_run_id) REFERENCES simulacion_run(id) ON DELETE CASCADE
);

-- Índices recomendados para rendimiento
CREATE INDEX idx_proyecto_user_id ON proyecto(user_id);
CREATE INDEX idx_nodo_proyecto_project_id ON nodo_proyecto(project_id);
CREATE INDEX idx_nodo_proyecto_element_id ON nodo_proyecto(element_id);
CREATE INDEX idx_simulacion_run_project_id ON simulacion_run(project_id);
CREATE INDEX idx_simulacion_punto_simulation_run_id ON simulacion_punto(simulation_run_id);