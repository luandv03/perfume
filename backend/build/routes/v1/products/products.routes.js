"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var products_controller_1 = require("../../../controllers/products/products.controller");
var auth_middleware_1 = require("../../../middlewares/auth.middleware");
var productRoutes = (0, express_1.Router)();
var productController = new products_controller_1.ProductController();
//list product in admin page
productRoutes.get("/product/view", productController.listProducts);
// get product by category
productRoutes.get("/product/category/:category_id/view", productController.getProductByCateId);
// get all brand
productRoutes.get("/brand/view", productController.getAllBrand);
// get product photo by product id
productRoutes.get("/product/:product_id/product_photo/view", productController.getProductPhotoById);
//get product by product_id
productRoutes.get("/product/:product_id/view", productController.getProductById);
//get product by search name
productRoutes.get("/product/search", productController.getProductByTitle);
// get products by filter: ?brand=["A","B","C"]&price=[1,2,3]
// brand=["Dior"]&price=[[0, 5000000], [5000000,0]]&page=1&limit=10
productRoutes.post("/product/view/filter", productController.getProductByFilter);
// create product
productRoutes.post("/product/create", auth_middleware_1.authMiddleware, productController.createProduct);
// delete product by product_id
// update product by product_id
productRoutes.patch("/product/update", auth_middleware_1.authMiddleware, productController.updateProductById);
exports.default = productRoutes;
