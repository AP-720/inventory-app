const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

const lengthErr = "must be between 2 and 255 characters.";

const validateNewCategory = [
	body("category")
		.trim()
		.notEmpty()
		.withMessage("Category Name must not be empty.")
		.isLength({ min: 2, max: 255 })
		.withMessage(`Category Name ${lengthErr}`),
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

		const { category } = matchedData(req);

		try {
			await db.postNewCategory(category);
			res.redirect("/categories");
		} catch (err) {
			console.error(err);
			res.status(500).send("Server error");
		}
	},
];

async function getEditCategory(req, res) {
	const categoryId = Number(req.params.id);

	try {
		// Remember to deconstruct the result to be able to access them as objects.
		const [category] = await db.getCategoryById(categoryId);

		if (!category) {
			res.status(404).send("Product not found");
			return;
		}

		res.render("categoryDetails", { title: "Edit Category", category });
	} catch (err) {
		console.error("Error loading category edit form:", err);
		res.status(500).send("Server error");
	}
}

const postEditCategory = [
	validateNewCategory,
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const categoryId = Number(req.params.id);

			const category = await db.getCategoryById(categoryId);

			return res.status(400).render("categoryDetails", {
				title: "Edit Category",
				category,
				errors: errors.array(),
			});
		}

		const categoryId = Number(req.params.id);
		const { category } = matchedData(req);
		console.log("postEditCategory:", categoryId, category);

		try {
			await db.updateCategory(categoryId, category);
			res.redirect("/categories");
		} catch (err) {
			console.error(err);
			res.status(500).send("Server error");
		}
	},
];

async function postDeleteCategory(req, res) {
	const categoryId = Number(req.params.id);

	try {
		await db.deleteCategory(categoryId);
		res.redirect("/categories");
	} catch (err) {
		console.error("Error deleting category:", err);
		res.status(500).send("Server error during deletion. ");
	}
}

module.exports = {
	getAllCategories,
	getNewCategory,
	postNewCategory,
	getEditCategory,
	postEditCategory,
	postDeleteCategory,
};
