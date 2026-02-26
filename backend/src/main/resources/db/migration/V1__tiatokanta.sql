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


