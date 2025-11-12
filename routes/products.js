const { Router } = require("express");
const productsRouter = Router();
const productsController = require("../controllers/productsController");

productsRouter.get("/", productsController.getAllProducts);
productsRouter.get("/:id", productsController.getProductEditForm)
productsRouter.post('/:id/update', productsController.postProductEditForm)

module.exports = productsRouter;
