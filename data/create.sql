CREATE TABLE region (
    pruid INT PRIMARY KEY,
    code VARCHAR,
    name VARCHAR,
    hide BOOLEAN DEFAULT FALSE
);

INSERT INTO region(pruid, code, name, hide)
VALUES
    (1, 'CA', 'Canada', false),
    (48, 'AB', 'Alberta', false),
    (59, 'BC', 'British Columbia', false),
    (35, 'ON', 'Ontario', false),
    (47, 'SK', 'Saskatchewan', false),
    (46, 'MB', 'Manitoba', false),
    (13, 'NB', 'New Brunswick', false),
    (10, 'NL', 'Newfoundland and Labrador', false),
    (61, 'NT', 'Northwest Territories', false),
    (12, 'NS', 'Nova Scotia', false),
    (62, 'NV', 'Nunavut', true),
    (11, 'PE', 'Prince Edward Island', false),
    (99, 'RT', 'Repatriated Travellers', true),
    (24, 'QC', 'Quebec', false),
    (60, 'YT', 'Yukon', false);

CREATE TABLE region_data (
    pruid INT REFERENCES region(pruid),
    date date,
    numtoday INT,
    numdeaths INT,
    numrecover INT,
    numprob INT,
    numconf INT,
    numtotal INT,
    numtested INT,
    PRIMARY KEY (pruid, date)
);