DROP TABLE IF EXISTS Markers;
CREATE TABLE Markers (
    "id" SERIAL PRIMARY KEY,
    "lat" decimal NOT NULL,
    "lng" decimal NOT NULL,
    "name" text NOT NULL,
    "message" text NOT NULL    
);