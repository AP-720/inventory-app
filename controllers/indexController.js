const db = require("../db/queries");

async function getIndex(req, res) {
	try {
		const categories = await db.getProductsByCategory();

		res.render("index", {
			title: "Coffee Inventory",
			categories,
		});
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
}

module.exports = { getIndex };
