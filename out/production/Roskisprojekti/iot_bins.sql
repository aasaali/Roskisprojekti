-- Luodaan tietokanta
CREATE DATABASE IF NOT EXISTS iot_bins;
USE iot_bins;

-- Säiliöt
CREATE TABLE site (
site_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
location VARCHAR(200) NOT NULL
);

-- Mittausdata
CREATE TABLE measurement (
measurement_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
site_id BIGINT NOT NULL,
fill_percent DECIMAL(5, 2) NOT NULL,
measured_at DATETIME NOT NULL,
FOREIGN KEY (site_id) REFERENCES site(site_id),
CHECK (fill_percent BETWEEN 0 AND 100)
);

-- Hälytykset
CREATE TABLE alert (
alert_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
site_id BIGINT NOT NULL,
alert_type ENUM('VAROITUS', 'HÄLYTYS') NOT NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
state ENUM('AVOIN', 'KUITATTU', 'SULJETTU') NOT NULL DEFAULT 'AVOIN',
closed_at DATETIME NULL,
FOREIGN KEY (site_id) REFERENCES site(site_id)
);

-- Tehtävät
CREATE TABLE task (
task_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
alert_id BIGINT NOT NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
status ENUM('AVOIN', 'KESKEN', 'VALMIS') NOT NULL DEFAULT 'AVOIN',
done_at DATETIME NULL,
FOREIGN KEY (alert_id) REFERENCES alert(alert_id));


-- Testailuja
INSERT INTO site (name, location) VALUES
('Kohde 1', 'Katu 1'),
('Kohde 2', 'Katu 2'),
('Kohde 3', 'Katu 3'),
('Kohde 4', 'Katu 4'),
('Kohde 5', 'Katu 5');

INSERT INTO measurement (site_id, fill_percent, measured_at) VALUES
(1, 32.5, NOW() - INTERVAL 60 MINUTE),
(1, 34.0, NOW() - INTERVAL 30 MINUTE),
(1, 36.2, NOW());

INSERT INTO measurement (site_id, fill_percent, measured_at) VALUES
(2, 72.0, NOW() - INTERVAL 40 MINUTE),
(2, 79.5, NOW() - INTERVAL 20 MINUTE),
(2, 82.3, NOW());

INSERT INTO measurement (site_id, fill_percent, measured_at) VALUES
(3, 85.0, NOW() - INTERVAL 45 MINUTE),
(3, 91.2, NOW() - INTERVAL 10 MINUTE);