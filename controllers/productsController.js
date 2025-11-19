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
		const product = await db.getProductById(productId);
		console.log(product);
		

		// const [product, roasters, origins, processes, roasts]  = await Promise.all([
		// 	db.getProductById(productId), 
		// 	db.getAllRoasters(), 
		// 	db.getAllOrigins(), 
		// 	db.getAllProcesses(), 
		// 	db.getAllRoasts(),
		// ])

		// const product = [
		// 	{
		// 		id: 1,
		// 		name: "La Esperanza",
		// 		roaster_name: "Crank House Coffee",
		// 		roaster_country: "UK",
		// 		origin_country: "Guatemala",
		// 		process: "Washed",
		// 		variety: "Caturra, Bourbon, Catuai, Pache",
		// 		tasting_notes: "Gooseberry, red apple, caramel",
		// 		roast_style: "Light",
		// 		roast_type: "Filter",
		// 		price: 20,
		// 	},
		// ];

		const roasters = [
			"Formative", "Crank House Coffee", "Full Court Press",
		]

		const origins = [
			"Ethiopia", "Kenya", "Tanzania", "Rwanda", "Burundi", "Uganda", "Brazil", "Colombia", "Peru","Guatemala",
		]

		const processes = [
			"Washed", "Natural", "Honey", "Anaerobic", "Carbonic Maceration"
		]

		const roasts = {
			style: ["Light", "Medium", "Dark"],
			type: ["Filter", "Espresso", "Omni"]
		}

		if (!product) {
			res.status(404).send("Product not found");
			return;
		}

		res.render("productDetails", { title: "Product Details", product, roasters, origins, processes, roasts });
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
