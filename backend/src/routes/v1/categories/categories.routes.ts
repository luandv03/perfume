import { Router } from "express";

const categoryRoutes: Router = Router();

import { CategoryControler } from "../../../controllers/categories/categories.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";

const categoryController = new CategoryControler();

//view categies
categoryRoutes.get("/category", categoryController.getAllCategories);

//get categories by id
categoryRoutes.get(
    "/category/views/:category_id",
    categoryController.getCategoryById
);

// create all categories
categoryRoutes.post(
    "/category/create",
    authMiddleware,
    categoryController.createCategory
);

//update categories by id
categoryRoutes.put(
    "/category/:category_id/update",
    authMiddleware,
    categoryController.updateCategoryById
);

//delete categories by id
categoryRoutes.delete(
    "/category/:category_id/delete",
    authMiddleware,
    categoryController.deleteCategoryById
);

export default categoryRoutes;
