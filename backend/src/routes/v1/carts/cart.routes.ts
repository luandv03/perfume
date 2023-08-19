import { Router } from "express";

import { CartController } from "../../../controllers/carts/cart.controller";
const cartRoutes = Router();
const cartController = new CartController();

// add cart item into cart list
cartRoutes.post("/cart/add_cart_item", cartController.addCartItemIntoCart);

// update cart item
cartRoutes.patch("/cart/update_cart_item", cartController.updateCartItem);

//remove cart item
cartRoutes.delete(
    "/cart/:cart_id/product/:product_id/delete",
    cartController.removeCartItem
);
