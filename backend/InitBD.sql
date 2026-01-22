--init the database with a user to access the application
CREATE DATABASE IF NOT EXISTS energysimulatordb;

CREATE USER IF NOT EXISTS 'SimulatorUser'@'%' IDENTIFIED BY 'SimulatorUserPassword123';
GRANT ALL PRIVILEGES ON energysimulatordb.* TO 'SimulatorUser'@'%';
FLUSH PRIVILEGES;
