const express = require("express");
const router = express.Router();
const productModule = require("../modules/productModule");
const auth = require("../modules/authModule");

router.get("/get", productModule.getProducts);

router.put("/update/:id", auth.authenticateUser, productModule.updateProducts);

router.post("/create", auth.authenticateUser, productModule.createProducts);

router.delete("/delete/:id", auth.authenticateUser, productModule.deleteProducts);

module.exports = router;
