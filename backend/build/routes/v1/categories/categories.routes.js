"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var categoryRoutes = (0, express_1.Router)();
var categories_controller_1 = require("../../../controllers/categories/categories.controller");
var categoryController = new categories_controller_1.CategoryControler();
//view categies
categoryRoutes.get("/category", categoryController.getAllCategories);
//get categories by id
categoryRoutes.get("/category/views/:category_id", categoryController.getCategoryById);
// create all categories
categoryRoutes.post("/category/create", 
// authMiddleware,
categoryController.createCategory);
//update categories by id
categoryRoutes.put("/category/:category_id/update", 
// authMiddleware,
categoryController.updateCategoryById);
//delete categories by id
categoryRoutes.delete("/category/:category_id/delete", 
// authMiddleware,
categoryController.deleteCategoryById);
exports.default = categoryRoutes;
