require("dotenv").config();
const { Pool } = require("pg");

let dbUrl =
	process.env.NODE_ENV === "production"
		? process.env.PROD_DB_URL
		: process.env.LOCAL_DB_URL;

module.exports = new Pool({
	connectionString: dbUrl,
	ssl:
		process.env.NODE_ENV === "production"
			? { rejectUnauthorized: false }
			: false,
});