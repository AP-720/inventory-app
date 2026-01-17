require("dotenv").config();
const { Client } = require('pg')

const SQL = `
    INSERT INTO coffee_varieties (coffee_id , variety_id )
    VALUES 
    (1,5),
    (2,4),
    (2,6),
    (3,7),
    (3,8);

    INSERT INTO product_categories ( coffee_id ,category_id )
    VALUES 
    (1,1),
    (1,2),
    (1,3),
    (2,1),
    (2,2),
    (2,3),
    (3,2),
    (3,3);
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

