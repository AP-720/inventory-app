const db = require("../db/queries");

async function getAllProducts(req, res) {
	try {
		const products = await db.getAllProducts();

		res.render("products", { title: "Products", products });
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
}

async function getProductEditForm(req, res) {
	const productId = Number(req.params.id);

	try {
		
		const [product, roasters, origins, processes, varieties, roastsStyles, roastsType]  = await Promise.all([
			db.getProductById(productId), 
			db.getAllRoasters(), 
			db.getAllOrigins(), 
			db.getAllProcesses(),
			db.getAllVarieties(), 
			db.getAllRoastsStyles(),
			db.getAllRoastsTypes(),
		])

		console.log(product);
		
		if (!product) {
			res.status(404).send("Product not found");
			return;
		}

		res.render("productDetails", { title: "Product Details", product, roasters, origins, processes, varieties , roastsStyles, roastsType });
	} catch (err) {
		console.error("Error loading product edit form:", err);
		res.status(500).send("Server error");
	}
}

async function postProductEditForm(req, res) {
	// const product = await db.getProduceById(req.params.id)
	console.log(req.params.id);
	console.log(req.body);
	
	res.redirect("/products")
}

module.exports = {
	getAllProducts,
	getProductEditForm,
	postProductEditForm,
};
