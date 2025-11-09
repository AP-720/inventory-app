const db = require("../db/queries");

async function getAllProducts(req, res) {
	try {
		// const products = await db.getAllProducts();
		const products = [
			{
				id: 1,
				name: "La Esperanza",
				roaster_name: "Crank House Coffee",
				roaster_country: "UK",
				origin_region: "Huehuetenango",
				origin_country: "Guatemala",
				process: "Washed",
				variety: "Caturra, Bourbon, Catuai, Pache",
				tasting_notes: "Gooseberry, red apple, caramel",
				roast_style: "Light",
				roast_type: "Filter",
				price: 20,
			},
		];

		res.render("products", { title: "Products", products });
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
}

module.exports = {
	getAllProducts,
};
