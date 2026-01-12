const db = require("../db/queries");

async function getIndex(req, res) {
	try {
		// const products = await db.getAllProducts();
		const categories = await db.getProductsByCategory();

		console.log(categories);
		

		res.render("index", {
			title: "Coffee Inventory",
			// products,
			categories,
		});
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
}

module.exports = { getIndex };
