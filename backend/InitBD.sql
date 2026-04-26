-- Run with: psql -U postgres -f InitBD.sql

CREATE USER "SimulatorUser"
	WITH PASSWORD 'SimulatorUserPassword123'
	NOSUPERUSER
	NOCREATEDB
	NOCREATEROLE;

CREATE DATABASE energysimulatordb OWNER "SimulatorUser";

REVOKE ALL ON DATABASE energysimulatordb FROM PUBLIC;
GRANT ALL PRIVILEGES ON DATABASE energysimulatordb TO "SimulatorUser";
