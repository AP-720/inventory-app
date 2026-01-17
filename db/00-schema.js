require("dotenv").config();
const { Client } = require('pg');
const fs = require('fs');

const SQL = fs.readFileSync('./db/schema.sql', 'utf-8');

let dbUrl =
    process.env.NODE_ENV === "production"
        ? process.env.PROD_DB_URL
        : process.env.LOCAL_DB_URL;

async function main() {
    console.log("Creating schema...");
    const client = new Client({
        connectionString: dbUrl,
        ssl:
            process.env.NODE_ENV === "production"
                ? { rejectUnauthorized: false }
                : false,
    });
    try {
        await client.connect();
        await client.query(SQL);
        console.log("Schema created successfully");
    } catch (error) {
        console.log("Error:", error);
    } finally {
        await client.end();
    }
}

main();