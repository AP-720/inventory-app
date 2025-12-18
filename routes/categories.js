const { Router } = require("express");
const categoriesRouter = Router();
const categoriesController = require("../controllers/categoriesController");

categoriesRouter.get("/", categoriesController.getAllCategories);
categoriesRouter.get("/new", categoriesController.getNewCategory);
categoriesRouter.post("/new", categoriesController.postNewCategory);
categoriesRouter.get("/:id", categoriesController.getEditCategory);
categoriesRouter.post("/:id/update", categoriesController.postEditCategory);
categoriesRouter.post("/:id/delete", categoriesController.postDeleteCategory);

module.exports = categoriesRouter;
