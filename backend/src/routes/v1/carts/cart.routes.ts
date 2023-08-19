import { Router } from "express";

import { CartController } from "../../../controllers/carts/cart.controller";
const cartRoutes = Router();
const cartController = new CartController();

// add cart item into cart list
cartRoutes.post("/cart/add_cart_item", cartController.addCartItemIntoCart);
