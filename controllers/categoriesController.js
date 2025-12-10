const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

const lengthErr = "must be between 2 and 255 characters.";

const validateNewCategory = [
	body("new_category")
		.trim()
		.notEmpty()
		.withMessage("Category Name must not be empty.")
		.isLength({ min: 2, max: 255 })
		.withMessage(`Category name ${lengthErr}`),
];

async function getAllCategories(req, res) {
	try {
		const categories = await db.getAllCategories();

		res.render("categories", { title: "Categories", categories });
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
}

async function getNewCategory(req, res) {
	try {
		res.render("newCategory", { title: "New Category" });
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
}

// async function postNewCategory(req, res) {
// 	const newCategory = req.body.new_category;

// 	console.log(newCategory);

// 	try {
// 		// await db.postNewCategory(newCategory)
// 		res.redirect("/categories");
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500).send("Server error");
// 	}
// }

const postNewCategory = [
	validateNewCategory,
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const categories = await db.getAllCategories();

			return res.status(400).render("newCategory", {
				title: "New Category",
				categories,
				errors: errors.array(),
			});
		}

		const { new_category } = matchedData(req);

		try {
			await db.postNewCategory(new_category);
			// console.log(new_category);

			res.redirect("/categories");
		} catch (err) {
			console.error(err);
			res.status(500).send("Server error");
		}
	},
];

module.exports = {
	getAllCategories,
	getNewCategory,
	postNewCategory,
};
