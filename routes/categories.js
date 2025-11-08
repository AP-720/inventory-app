const { Router } = require("express");
const categoriesRouter = Router();
const categoriesController = require("../controllers/categoriesController");

categoriesRouter.get("/", categoriesController.getAllCategories);

module.exports = categoriesRouter;
