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