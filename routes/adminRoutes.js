
const express = require("express");
const AdminController = require("../controller/AdminController");
const CategoryController = require("../controller/CategoryController");
const ProductController = require("../controller/ProductController");
const ProductItemController = require("../controller/ProductItemController");
const AreaController = require("../controller/AreaController");
const router = express.Router();

module.exports = router;

router.post("/v1/admin/create-admin", AdminController.createAdmin);
router.post("/v1/admin/login", AdminController.login);

router.post("/v1/admin/categories/create-category", CategoryController.createCategory);
router.get("/v1/admin/categories/get-category", CategoryController.getCategory);

//get product
router.post("/v1/admin/product/create-product", ProductController.createProduct);
router.get("/v1/admin/product/get-product", ProductController.getProduct);


//get areas
router.post("/v1/admin/area/create-area",AreaController.createArea );
router.get("/v1/admin/area/get-area", AreaController.getArea);

//get product items
router.post("/v1/admin/product/create-product-item", ProductItemController.createProductItem);
router.get("/v1/admin/product/get-product-item", ProductItemController.getProductItem);


module.exports = router;