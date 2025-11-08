const { Router } = require("express");
const productsRouter = Router();
const productsController = require("../controllers/productsController");

productsRouter.get("/", productsController.getAllProducts);

module.exports = productsRouter;
