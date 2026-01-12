const { Router } = require("express");
const productsRouter = Router();
const productsController = require("../controllers/productsController");

productsRouter.get("/", productsController.getAllProducts);
productsRouter.get("/new", productsController.getNewProduct);
productsRouter.post("/new", productsController.postNewProduct);
productsRouter.get("/:id", productsController.getProductDetails);
productsRouter.get("/:id/edit", productsController.getProductEditForm);
productsRouter.post("/:id/update", productsController.postProductUpdate);
productsRouter.post("/:id/delete", productsController.postDeleteProduct);

module.exports = productsRouter;
