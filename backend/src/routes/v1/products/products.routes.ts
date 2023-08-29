import { Router } from "express";
import { ProductController } from "../../../controllers/products/products.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";

const productRoutes: Router = Router();
const productController: ProductController = new ProductController();

//list product in admin page
productRoutes.get("/product/view", productController.listProducts);

// get product by category
productRoutes.get(
    "/product/category/:category_id/view",
    productController.getProductByCateId
);

// get all brand
productRoutes.get("/brand/view", productController.getAllBrand);

// get product photo by product id
productRoutes.get(
    "/product/:product_id/product_photo/view",
    productController.getProductPhotoById
);

//get product by product_id
productRoutes.get(
    "/product/:product_id/view",
    productController.getProductById
);

//get product by search name
productRoutes.get("/product/search", productController.getProductByTitle);

// get products by filter: ?brand=["A","B","C"]&price=[1,2,3]
productRoutes.get("/product/view/filter", productController.getProductByFilter);

// create product

// delete product by product_id

// update product by product_id
// o day ta se sua toi da cac thuoc tinh

export default productRoutes;
