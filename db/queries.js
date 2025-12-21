const pool = require("./pool");

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
            tasting_notes,
            processes.name,
            roasts.style,
            roasts.type
        `
	);

	return rows;
}

async function getProductById(query) {
	const { rows } = await pool.query(
		`
        SELECT 
            coffees.id, 
            coffees.name AS coffee_name, 
            origins.country AS origin, 
            roasters.name AS roaster_name, 
            roasters.country AS roaster_country, 
            price, 
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
	const { rows } = await pool.query(
		"SELECT DISTINCT * FROM roasters ORDER BY name;"
	);
	return rows;
}

async function getAllOrigins() {
	const { rows } = await pool.query(
		"SELECT DISTINCT * FROM origins ORDER BY country;"
	);
	return rows;
}

async function getAllProcesses() {
	const { rows } = await pool.query(
		"SELECT DISTINCT * FROM processes ORDER BY name;"
	);
	return rows;
}

async function getAllVarieties() {
	const { rows } = await pool.query(
		"SELECT DISTINCT * FROM varieties ORDER BY name;"
	);
	return rows;
}

async function getAllRoastsStyles() {
	const { rows } = await pool.query("SELECT DISTINCT style FROM roasts;");
	return rows;
}

async function getAllRoastsTypes() {
	const { rows } = await pool.query("SELECT DISTINCT type FROM roasts;");
	return rows;
}

async function getAllCategories() {
	const { rows } = await pool.query(
		"SELECT DISTINCT category FROM categories ORDER BY category;"
	);
	return rows;
}

async function postNewProduct(newProduct) {
	const {
		coffee_name,
		origin,
		roaster_name,
		roaster_country,
		price,
		tasting_notes,
		process,
		roast_style,
		roast_type,
		varieties,
	} = newProduct;

	// Using a client from the pool means that uses same connection throughout, all queries use same connection, Atomicity: All operations succeed or all fail. So use when related operations that must succeed together.
	const client = await pool.connect();

	try {
		// Use a transaction, when all the batch updates must succeed. Without BEGIN, each SQL statement would auto-commit immediately, making partial updates possible if errors occur mid-operation.
		await client.query("BEGIN");

		// Upsert varieties and collect ids
		const varietyIdArray = [];
		const upsertVarietySQL = `
            INSERT INTO varieties (name)
            VALUES ($1)
            ON CONFLICT (name)
            DO UPDATE SET name = EXCLUDED.name
            RETURNING id AS variety_id;
        `;

		for (const varietyName of varieties) {
			try {
				const result = await client.query(upsertVarietySQL, [varietyName]);

				varietyIdArray.push(result.rows[0].variety_id);
			} catch (err) {
				console.error("Error during variety upsert:", err);
			}
		}

		// Individual upserts
		const originResult = await client.query(
			`
                INSERT INTO origins (country)
                VALUES ($1)
                ON CONFLICT (country)
                DO UPDATE SET country = EXCLUDED.country
                RETURNING id AS origin_id;
            `,
			[origin]
		);
		const originId = originResult.rows[0].origin_id;

		const roastersResult = await client.query(
			`
                INSERT INTO roasters (name, country)
                VALUES ($1, $2)
                ON CONFLICT (name)
                DO UPDATE SET name = EXCLUDED.name
                RETURNING id AS roaster_id;
            `,
			[roaster_name, roaster_country]
		);
		const roasterId = roastersResult.rows[0].roaster_id;

		const processResult = await client.query(
			`
                INSERT INTO processes (name)
                VALUES ($1)
                ON CONFLICT (name)
                DO UPDATE SET name = EXCLUDED.name
                RETURNING id AS process_id;
            `,
			[process]
		);
		const processId = processResult.rows[0].process_id;

		// Select roast_id (must exist in roasts table)
		const roastResult = await client.query(
			`
                SELECT id AS roast_id
                FROM roasts
                WHERE style = $1 AND type = $2;
            `,
			[roast_style, roast_type]
		);
		if (!roastResult.rows[0]) throw new Error("Selected roast not found");
		const roastId = roastResult.rows[0].roast_id;

		// Main Insert to coffees table and return coffee_id
		const coffeeResult = await client.query(
			`
                INSERT INTO coffees(name, origin_id, roaster_id, price, tasting_notes, process_id, roast_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id AS coffee_id;
            `,
			[
				coffee_name,
				originId,
				roasterId,
				price,
				tasting_notes,
				processId,
				roastId,
			]
		);

		const coffeeId = coffeeResult.rows[0].coffee_id;

		// If there are varieties, batch insert them into the join table
		if (varietyIdArray.length > 0) {
			// Create an array the same length as the varietyIdArray and fill it all with the coffeeId so can be used with UNNEST
			const coffeeIdArray = Array(varietyIdArray.length).fill(coffeeId);
			await client.query(
				`
        INSERT INTO coffee_varieties (coffee_id, variety_id)
        SELECT * FROM UNNEST($1::int[], $2::int[]) AS t(coffee_id, variety_id);
        `,
				[coffeeIdArray, varietyIdArray]
			);
		}

		await client.query("COMMIT");
		console.log("postNewProduct Coffee Id:", coffeeId);

		return coffeeId;
	} catch (err) {
		// If it fails doesn't commit the partial data.
		await client.query("ROLLBACK");
		console.error("postNewProduct error:", err);
		throw err;
	} finally {
		client.release();
	}
}

async function updateProduct(productData, productId) {
	const {
		coffee_name,
		origin,
		roaster_name,
		roaster_country,
		price,
		tasting_notes,
		process,
		roast_style,
		roast_type,
		varieties,
		categories,
	} = productData;

	// Using a client from the pool means that uses same connection throughout, all queries use same connection, Atomicity: All operations succeed or all fail. So use when related operations that must succeed together.
	const client = await pool.connect();

	try {
		// Use a transaction, when all the batch updates must succeed. Without BEGIN, each SQL statement would auto-commit immediately, making partial updates possible if errors occur mid-operation.
		await client.query("BEGIN");

		// Upsert varieties and collect ids
		const varietyIdArray = [];
		const upsertVarietySQL = `
            INSERT INTO varieties (name)
            VALUES ($1)
            ON CONFLICT (name)
            DO UPDATE SET name = EXCLUDED.name
            RETURNING id AS variety_id;
        `;

		for (const varietyName of varieties) {
			try {
				const result = await client.query(upsertVarietySQL, [varietyName]);

				varietyIdArray.push(result.rows[0].variety_id);
			} catch (err) {
				console.error("Error during variety upsert:", err);
			}
		}

		// Upsert categories and collect ids
		const categoriesIdArray = [];
		const upsertCategoriesSQL = `
            INSERT INTO categories (category)
            VALUES ($1)
            ON CONFLICT (category)
            DO UPDATE SET category = EXCLUDED.category
            RETURNING id AS category_id;
        `;

		for (const category of categories) {
			try {
				const result = await client.query(upsertCategoriesSQL, [category]);

				categoriesIdArray.push(result.rows[0].category_id);
			} catch (err) {
				console.error("Error during category upsert:", err);
			}
		}

		// Individual upserts
		const originResult = await client.query(
			`
                INSERT INTO origins (country)
                VALUES ($1)
                ON CONFLICT (country)
                DO UPDATE SET country = EXCLUDED.country
                RETURNING id AS origin_id;
            `,
			[origin]
		);
		const originId = originResult.rows[0].origin_id;

		const roastersResult = await client.query(
			`
                INSERT INTO roasters (name, country)
                VALUES ($1, $2)
                ON CONFLICT (name)
                DO UPDATE SET name = EXCLUDED.name
                RETURNING id AS roaster_id;
            `,
			[roaster_name, roaster_country]
		);
		const roasterId = roastersResult.rows[0].roaster_id;

		const processResult = await client.query(
			`
                INSERT INTO processes (name)
                VALUES ($1)
                ON CONFLICT (name)
                DO UPDATE SET name = EXCLUDED.name
                RETURNING id AS process_id;
            `,
			[process]
		);
		const processId = processResult.rows[0].process_id;

		// Select roast_id (must exist in roasts table)
		const roastResult = await client.query(
			`
                SELECT id AS roast_id
                FROM roasts
                WHERE style = $1 AND type = $2;
            `,
			[roast_style, roast_type]
		);
		if (!roastResult.rows[0]) throw new Error("Selected roast not found");
		const roastId = roastResult.rows[0].roast_id;

		// Main update to coffees table and return coffee_id
		const coffeeResult = await client.query(
			`
                UPDATE coffees
				SET name = $1, origin_id = $2, roaster_id = $3, price = $4, tasting_notes = $5, process_id = $6, roast_id = $7
				WHERE id = $8
                RETURNING id AS coffee_id;
            `,
			[
				coffee_name,
				originId,
				roasterId,
				price,
				tasting_notes,
				processId,
				roastId,
				productId,
			]
		);

		const coffeeId = coffeeResult.rows[0].coffee_id;

		// Delete old variety links before inserting new ones, otherwise old varieties stick around even if the user removed them.
		await client.query(
			`
			DELETE FROM coffee_varieties 
			WHERE coffee_id = $1
			`,
			[coffeeId]
		);

		// If there are varieties, batch insert them into the join table
		if (varietyIdArray.length > 0) {
			// Create an array the same length as the varietyIdArray and fill it all with the coffeeId so can be used with UNNEST
			const coffeeIdArray = Array(varietyIdArray.length).fill(coffeeId);
			await client.query(
				`
        INSERT INTO coffee_varieties (coffee_id, variety_id)
        SELECT * FROM UNNEST($1::int[], $2::int[]) AS t(coffee_id, variety_id);
        `,
				[coffeeIdArray, varietyIdArray]
			);
		}

		// Delete old category links before inserting new ones, otherwise old categories stick around even if the user removed them.
		await client.query(
			`
			DELETE FROM product_categories 
			WHERE coffee_id = $1
			`,
			[coffeeId]
		);

		// If there are categories, batch insert them into the join table
		if (categoriesIdArray.length > 0) {
			// Create an array the same length as the categoriesIdArray and fill it all with the coffeeId so can be used with UNNEST
			const coffeeIdArray = Array(categoriesIdArray.length).fill(coffeeId);
			await client.query(
				`
        INSERT INTO product_categories (coffee_id, category_id )
        SELECT * FROM UNNEST($1::int[], $2::int[]) AS t(coffee_id, category_id );
        `,
				[coffeeIdArray, categoriesIdArray]
			);
		}

		await client.query("COMMIT");

		return coffeeId;
	} catch (err) {
		// If it fails doesn't commit the partial data.
		await client.query("ROLLBACK");
		console.error("updateProduct error:", err);
		throw err;
	} finally {
		client.release();
	}
}

// As there is ON DELETE CASCADE constraint it doesn't need to be a transaction. The delete is completely safe and atomic by itself, unlike the update above for example.
async function deleteProduct(productId) {
	await pool.query(`DELETE FROM coffees WHERE id = $1;`, [productId]);
}

// Categories Queries

async function getAllCategories() {
	const { rows } = await pool.query(
		"SELECT DISTINCT * FROM categories ORDER BY category;"
	);
	return rows;
}

async function postNewCategory(newCategory) {
	const client = await pool.connect();

	try {
		await client.query("BEGIN");

		await client.query(
			`
			INSERT INTO categories (category)
			VALUES ($1)
			ON CONFLICT (category)
            DO UPDATE SET category = EXCLUDED.category
            RETURNING id AS category_id;
			`,
			[newCategory]
		);

		await client.query("COMMIT");
	} catch (err) {
		await client.query("ROLLBACK");
		console.error("postNewCategory:", err);
		throw err;
	} finally {
		client.release();
	}
}

async function getCategoryById(categoryId) {
	const { rows } = await pool.query(
		`
		SELECT * FROM categories WHERE id = $1;
		`,
		[categoryId]
	);
	return rows;
}

async function updateCategory(categoryId, category) {
	try {
		await pool.query(
			`
			UPDATE categories
			SET category = $1
			WHERE id = $2
			RETURNING id as categories_id;
			`,
			[category, categoryId]
		);
	} catch (err) {
		console.error("updateCategory:", err);
		throw err;
	}
}

async function deleteCategory(categoryId) {
	await pool.query("DELETE FROM categories WHERE id = $1;", [categoryId]);
}
module.exports = {
	getAllProducts,
	getProductById,
	getAllRoasters,
	getAllOrigins,
	getAllProcesses,
	getAllVarieties,
	getAllRoastsStyles,
	getAllRoastsTypes,
	getAllCategories,
	postNewProduct,
	updateProduct,
	deleteProduct,
	getAllCategories,
	postNewCategory,
	getCategoryById,
	updateCategory,
	deleteCategory,
};
