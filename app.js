require("dotenv").config();
const express = require("express");
const app = express();
const path = require("node:path");
const indexRouter = require("./routes/index");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");

const PORT = 3000;

// Static files
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);

app.listen(PORT, (error) => {
	if (error) {
		throw error;
	}
	console.log(`Listening on port:${PORT}`);
});
