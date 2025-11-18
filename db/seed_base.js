require("dotenv").config();
const { Client } = require('pg')

const SQL = `
    INSERT INTO roasters (name, country)
    VALUES 
    ('Full Court Press', 'UK'),
    ('Plot', 'UK'),
    ('Skylark', 'UK');

    INSERT INTO origins (country)
    VALUES
    ('Colombia'),
    ('Kenya'),
    ('Ethiopia');

    INSERT INTO processes (name)
    VALUES
    ('Washed'),
    ('Anaerobic Natural'),
    ('Honey'),
    ('Natural');

    INSERT INTO roasts (style, type)
    VALUES 
    ('Light', 'Filter'),
    ('Medium', 'Filter'),
    ('Dark', 'Filter');

    INSERT INTO varieties (name) 
    VALUES
    ('Bourbon'),
    ('Geisha'),
    ('Catuai'),
    ('SL28'),
    ('Caturra'),
    ('SL34'),
    ('74112'),
    ('74158');

    INSERT INTO categories (category)
    VALUES
    ('Washed'),
    ('Filter'),
    ('UK Roaster');
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

