const db = require("../db/queries");

async function getAllProducts(req, res) {
	try {
		// const products = await db.getAllProducts();

		res.render("products", { title: "Products" });
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
}

module.exports = {
	getAllProducts,
};
