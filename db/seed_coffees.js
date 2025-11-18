require("dotenv").config();
const { Client } = require('pg')

const SQL = `
    INSERT INTO coffees (name, roaster_id, origin_id, process_id, price, producer, tasting_notes, roast_id)
    VALUES 
   ('Jairo Arcila', 1, 1, 1, 12.99, 'Jairo Arcila', 'Apricot, Marzipan, Soft Spice', 1),
   ('Mahiga AA', 2, 2, 1, 11.50, 'Mahiga', 'Blackberry, Apple, Dried Fruit', 1),
   ('Ethiopia Demelesh Guji Anaerobic Natural', 3, 3, 2, 14.50, 'Guji', 'Raspberry, Nasturtium, Concord Grape', 1);
`

let dbUrl =
    process.env.NODE_ENV === "production"
        ? process.env.PROD_DB_URL
        : process.env.LOCAL_DB_URL;

async function main() {
    console.log("seeding...");
    const client = new Client({
        connectionString: dbUrl,
        // If dbUrl is a local, non-SSL connection, set ssl to false
        ssl:
            process.env.NODE_ENV === "production"
                ? { rejectUnauthorized: false }
                : false,
    });
    try {
        await client.connect();
        await client.query(SQL);
    } catch (error) {
        console.log("Error:", error);
    } finally {
        await client.end();
        console.log("done");
    }
}

main();

