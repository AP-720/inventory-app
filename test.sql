-- Many-to-many junction table with composite primary key
-- This prevents duplicate relationships between coffees and categories
-- Example: Coffee #1 can be in Category #1 only once
CREATE TABLE product_categories (
    coffee_id INTEGER NOT NULL REFERENCES coffees(id),
    category_id  INTEGER NOT NULL REFERENCES categories(id),
    PRIMARY KEY (coffee_id, category_id) -- composite primary key
);

-- getProductById

SELECT coffees.id, coffees.name AS coffee_name, origins.country AS origin, roasters.name AS roaster_name, roasters.country AS roaster_country, price, producer, tasting_notes, processes.name AS process, roasts.style AS roast_style, roasts.type AS roast_type, ARRAY_AGG(DISTINCT varieties.name ORDER BY varieties.name ASC ) AS varieties, ARRAY_AGG(DISTINCT categories.category ORDER BY categories.category ASC ) AS categories
FROM coffees
JOIN roasters ON coffees.roaster_id=roasters.id
JOIN origins ON coffees.origin_id=origins.id
JOIN processes ON coffees.process_id=processes.id
JOIN roasts on coffees.roast_id=roasts.id
LEFT JOIN coffee_varieties
ON coffees.id=coffee_varieties.coffee_id
LEFT JOIN varieties 
ON coffee_varieties.variety_id=varieties.id
LEFT JOIN product_categories
ON coffees.id=product_categories.coffee_id
LEFT JOIN  categories
ON product_categories.category_id=categories.id
WHERE coffees.id=1
GROUP BY 
coffees.id,
coffees.name,
origins.country,
roasters.name,
roasters.country,
price, 
producer, 
tasting_notes,
processes.name,
roasts.style,
roasts.type;

-- addNewProduct

INSERT INTO origins (country)
VALUES ($1)
ON CONFLICT (country)
DO UPDATE SET country = EXCLUDED.country
RETURNING id AS origin_id;

INSERT INTO roasters (name, country)
VALUES ($1, $2)
ON CONFLICT (name)
DO UPDATE SET name = EXCLUDED.name
RETURNING id AS roaster_id;

INSERT INTO processes (name)
VALUES ($1)
ON CONFLICT (name)
DO UPDATE SET name = EXCLUDED.name
RETURNING id AS process_id;

SELECT id AS roast_id
FROM roasts
WHERE style=$1 AND type=$2;

-- Needs to loop over the varieties array when inserting to then return an array of the varieties for inserting into the many to many table. 
INSERT INTO varieties (name)
VALUES ($1)
ON CONFLICT (name)
DO UPDATE SET name = EXCLUDED.name
RETURNING id AS variety_id;

INSERT INTO coffees(coffee_name, origin_id, roaster_id, price, tasting_notes, process_id, roast_id)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id AS coffee_id;

INSERT INTO coffee_varieties (coffee_id, varieties_id)
SELECT * FROM UNNEST($1, $2)


-- Create roasts table

INSERT INTO roasts (style, type)
VALUES
('Light', 'Espresso'),
('Medium', 'Espresso'),
('Dark', 'Espresso'),
('Light', 'Omni'),
('Medium', 'Omni'),
('Dark', 'Omni');
