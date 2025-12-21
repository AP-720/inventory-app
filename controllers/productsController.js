const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

// Using matches with the regex rather than .alpha as its too strict and doesn't allow spaces, hyphens and apostrophes.
const alphaSpace = /^[\p{L}\s'-]+$/u; // letters, spaces, hyphens, apostrophes

const alphaErr = "must only contain letters, spaces, hyphens, or apostrophes.";
const lengthErr = "must be between 2 and 255 characters.";

const validateNewProduct = [
	body("coffee_name")
		.trim()
		.notEmpty()
		.withMessage(`Coffee name can not be empty.`)
		.matches(alphaSpace)
		.withMessage(`Coffee name ${alphaErr}`)
		.isLength({ min: 2, max: 255 })
		.withMessage(`Coffee name ${lengthErr}`),
	body("roaster_name")
		.trim()
		.notEmpty()
		.withMessage(`Roaster name can not be empty.`)
		.isLength({ min: 2, max: 255 })
		.withMessage(`Roaster name ${lengthErr}`),
	body("roaster_country")
		.trim()
		.notEmpty()
		.withMessage(`Roaster country can not be empty.`)
		.matches(alphaSpace)
		.withMessage(`Roaster country ${alphaErr}`)
		.isLength({ min: 2, max: 48 })
		.withMessage(`Roaster country must be between 1 and 48 characters.`),
	body("origin")
		.trim()
		.notEmpty()
		.withMessage(`Origin can not be empty.`)
		.matches(alphaSpace)
		.withMessage(`Origin ${alphaErr}`)
		.isLength({ min: 2, max: 255 })
		.withMessage(`Origin country ${lengthErr}`),
	body("process")
		.trim()
		.notEmpty()
		.withMessage(`Process can not be empty.`)
		.isLength({ min: 2, max: 255 })
		.withMessage(`Process ${lengthErr}`),
	body("tasting_notes")
		.trim()
		.notEmpty()
		.withMessage(`Tasting notes can not be empty.`)
		.isLength({ min: 2, max: 255 })
		.withMessage(`Tasting notes ${lengthErr}`),
	body("price")
		// Use isFloat as it allows decimals, unlike isInt().
		.isFloat({ min: 1 })
		.withMessage("Price must be greater than 0.")
		.notEmpty()
		.withMessage(`Price can not be empty.`),
];

async function getAllProducts(req, res) {
	try {
		const products = await db.getAllProducts();

		res.render("products", { title: "Products", products });
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
}

async function getNewProduct(req, res) {
	try {
		const [varieties, roastsStyles, roastsType] = await Promise.all([
			db.getAllVarieties(),
			db.getAllRoastsStyles(),
			db.getAllRoastsTypes(),
		]);

		res.render("newProduct", {
			title: "New Product",
			varieties,
			roastsStyles,
			roastsType,
		});
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
}

const postNewProduct = [
	validateNewProduct,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const options = await loadProductFormOptions(db);

			return res.status(400).render("newProduct", {
				title: "New Product",
				...options,
				errors: errors.array(),
			});
		}

		const {
			coffee_name,
			roaster_name,
			roaster_country,
			origin,
			process,
			tasting_notes,
			price,
		} = matchedData(req);

		const roast_style = req.body.roast_style;
		const roast_type = req.body.roast_type;
		// Standardize the multiple checkboxes input. So that it is always an array because when a single option is selected a string is returned. This was causing a bug where the string was then being split and single letters were then variety options.
		const varieties = Array.isArray(req.body.varieties)
			? req.body.varieties
			: [req.body.varieties];

		const newProduct = {
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
		};

		try {
			await db.postNewProduct(newProduct);
			res.redirect("/products");
		} catch (err) {
			console.error(err);
			res.status(500).send("Server error");
		}
	},
];

async function getProductEditForm(req, res) {
	const productId = Number(req.params.id);

	try {
		const [product, options] = await Promise.all([
			db.getProductById(productId),
			loadProductFormOptions(db),
		]);

		if (!product) {
			res.status(404).send("Product not found");
			return;
		}

		console.log("getProductEditForm:", product);

		res.render("productDetails", {
			title: "Edit Product",
			product,
			...options,
		});
	} catch (err) {
		console.error("Error loading product edit form:", err);
		res.status(500).send("Server error");
	}
}

const postProductUpdate = [
	validateNewProduct,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const productId = Number(req.params.id);

			// Need to fetch this again if there is an error to pass to view.
			const [product, options] = await Promise.all([
				db.getProductById(productId),
				loadProductFormOptions(db),
			]);

			return res.status(400).render("productDetails", {
				title: "Edit Product",
				product,
				...options,
				errors: errors.array(),
			});
		}

		const productId = Number(req.params.id);

		const {
			coffee_name,
			roaster_name,
			roaster_country,
			origin,
			process,
			tasting_notes,
			price,
		} = matchedData(req);

		const roast_style = req.body.roast_style;
		const roast_type = req.body.roast_type;
		const varieties = Array.isArray(req.body.varieties)
			? req.body.varieties
			: [req.body.varieties];
		// If not checkboxes are submitted in a form then req.body.categories would be undefined. 
		// The first check makes sure req.body.categories exists. If it does it then handles a single value vs an array. If it is a single value it put it into a an array as that is the format needed in the query. 
		// If req.body.categories doesn't exist then a empty array is returned rather than undefined. 
		const categories = req.body.categories
			? Array.isArray(req.body.categories)
				? req.body.categories
				: [req.body.categories]
			: [];

		const updatedProduct = {
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
		};

		try {
			await db.updateProduct(updatedProduct, productId);
			res.redirect("/products");
		} catch (err) {
			console.error(err);
			res.status(500).send("Server error");
		}
	},
];

async function postDeleteProduct(req, res) {
	const productId = Number(req.params.id);

	try {
		await db.deleteProduct(productId);
		res.redirect("/products");
	} catch (err) {
		console.error("Error deleting product:", err);
		res.status(500).send("Server error during deletion.");
	}
}

// Helpers

async function loadProductFormOptions(db) {
	try {
		const [
			roasters,
			origins,
			processes,
			varieties,
			roastsStyles,
			roastsType,
			categories,
		] = await Promise.all([
			db.getAllRoasters(),
			db.getAllOrigins(),
			db.getAllProcesses(),
			db.getAllVarieties(),
			db.getAllRoastsStyles(),
			db.getAllRoastsTypes(),
			db.getAllCategories(),
		]);

		return {
			roasters,
			origins,
			processes,
			varieties,
			roastsStyles,
			roastsType,
			categories,
		};
	} catch (err) {
		console.error("Error loading product form options:", err);
		res.status(500).send("Server error");
	}
}

module.exports = {
	getAllProducts,
	getNewProduct,
	postNewProduct,
	getProductEditForm,
	postProductUpdate,
	postDeleteProduct,
};
