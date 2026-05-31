ALTER TABLE destinations
ADD COLUMN latitude DECIMAL(10,7) NULL,
ADD COLUMN longitude DECIMAL(10,7) NULL;

ALTER TABLE hebergements
ADD COLUMN latitude DECIMAL(10,7) NULL,
ADD COLUMN longitude DECIMAL(10,7) NULL;

UPDATE destinations SET latitude = -8.4095, longitude = 115.1889 WHERE id = 1;
UPDATE destinations SET latitude = 35.6762, longitude = 139.6503 WHERE id = 2;
UPDATE destinations SET latitude = 45.9237, longitude = 6.8694 WHERE id = 3;
UPDATE destinations SET latitude = 31.6295, longitude = -7.9811 WHERE id = 4;
UPDATE destinations SET latitude = 64.1466, longitude = -21.9426 WHERE id = 5;

UPDATE hebergements SET latitude = -8.7076, longitude = 115.1671 WHERE id = 1;
UPDATE hebergements SET latitude = -8.5069, longitude = 115.2625 WHERE id = 2;
UPDATE hebergements SET latitude = 35.6812, longitude = 139.7671 WHERE id = 3;
UPDATE hebergements SET latitude = 35.6595, longitude = 139.7005 WHERE id = 4;
UPDATE hebergements SET latitude = 45.9231, longitude = 6.8689 WHERE id = 5;
UPDATE hebergements SET latitude = 45.9357, longitude = 6.8872 WHERE id = 6;
UPDATE hebergements SET latitude = 31.6258, longitude = -7.9891 WHERE id = 7;
UPDATE hebergements SET latitude = 31.6173, longitude = -7.9818 WHERE id = 8;
UPDATE hebergements SET latitude = 64.1510, longitude = -21.9336 WHERE id = 9;
UPDATE hebergements SET latitude = 64.1432, longitude = -21.9147 WHERE id = 10;