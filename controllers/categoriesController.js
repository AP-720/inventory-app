const db = require("../db/queries");

async function getAllCategories(req, res) {
	try {
		const categories = await db.getAllCategories();

		res.render("categories", { title: "Categories", categories });
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
}

module.exports = {
	getAllCategories,
};
