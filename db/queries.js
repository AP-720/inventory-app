const pool = require('./pool')

async function getAllProducts() {
    const { rows } = await pool.query(
        `
        SELECT 
            coffees.id, 
            coffees.name AS coffee_name, 
            origins.country AS origin, 
            roasters.name AS roaster_name, 
            roasters.country AS roaster_country, 
            price, 
            producer, 
            tasting_notes, 
            processes.name AS process, 
            roasts.style AS roast_style, 
            roasts.type AS roast_type, 
            ARRAY_AGG(DISTINCT varieties.name ORDER BY varieties.name ASC) AS varieties,
            ARRAY_AGG(DISTINCT categories.category ORDER BY categories.category ASC) AS categories
        FROM coffees
        JOIN roasters ON coffees.roaster_id = roasters.id
        JOIN origins ON coffees.origin_id = origins.id
        JOIN processes ON coffees.process_id = processes.id
        JOIN roasts ON coffees.roast_id = roasts.id
        LEFT JOIN coffee_varieties ON coffees.id = coffee_varieties.coffee_id
        LEFT JOIN varieties ON coffee_varieties.variety_id = varieties.id
        LEFT JOIN product_categories ON coffees.id = product_categories.coffee_id
        LEFT JOIN categories ON product_categories.category_id = categories.id
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
            roasts.type
        `
    );

    return rows;

    }

async function getProductById(query) {
    const  { rows }  = await pool.query(
        `
        SELECT 
            coffees.id, 
            coffees.name AS coffee_name, 
            origins.country AS origin, 
            roasters.name AS roaster_name, 
            roasters.country AS roaster_country, 
            price, 
            producer, 
            tasting_notes, 
            processes.name AS process, 
            roasts.style AS roast_style, 
            roasts.type AS roast_type, 
            ARRAY_AGG(DISTINCT varieties.name ORDER BY varieties.name ASC) AS varieties,
            ARRAY_AGG(DISTINCT categories.category ORDER BY categories.category ASC) AS categories
        FROM coffees
        JOIN roasters ON coffees.roaster_id = roasters.id
        JOIN origins ON coffees.origin_id = origins.id
        JOIN processes ON coffees.process_id = processes.id
        JOIN roasts ON coffees.roast_id = roasts.id
        LEFT JOIN coffee_varieties ON coffees.id = coffee_varieties.coffee_id
        LEFT JOIN varieties ON coffee_varieties.variety_id = varieties.id
        LEFT JOIN product_categories ON coffees.id = product_categories.coffee_id
        LEFT JOIN categories ON product_categories.category_id = categories.id
        WHERE coffees.id = $1
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
            roasts.type
        `,
        [query]
    );

    return rows[0];
}

async function getAllRoasters() {
    const { rows } = await pool.query('SELECT DISTINCT * FROM roasters ORDER BY name;')
    return rows;
}

async function getAllOrigins() {
    const { rows } = await pool.query('SELECT DISTINCT * FROM origins ORDER BY country;')
    return rows;
}

async function getAllProcesses() {
    const { rows } = await pool.query('SELECT DISTINCT * FROM processes ORDER BY name;')
    return rows;
}

async function getAllVarieties() {
    const { rows } = await pool.query('SELECT DISTINCT * FROM varieties ORDER BY name;')
    return rows;
}

async function getAllRoastsStyles() {
    const { rows } = await pool.query('SELECT DISTINCT style FROM roasts;')
    return rows;
}

async function getAllRoastsTypes() {
    const { rows } = await pool.query('SELECT DISTINCT type FROM roasts;')
    return rows;
}



module.exports = {
    getAllProducts,
    getProductById,
    getAllRoasters,
    getAllOrigins,
    getAllProcesses,
    getAllVarieties,
    getAllRoastsStyles,
    getAllRoastsTypes
    }