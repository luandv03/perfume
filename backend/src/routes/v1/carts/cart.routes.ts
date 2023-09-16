import { Router } from "express";

import { CartController } from "../../../controllers/carts/cart.controller";
import { userAuthMiddleware } from "../../../middlewares/user-auth.middleware";
const cartRoutes = Router();
const cartController = new CartController();

// add cart item into cart list
cartRoutes.post(
    "/cart/add_cart_item",
    userAuthMiddleware,
    cartController.addCartItemIntoCart
);

// update cart item
cartRoutes.patch(
    "/cart/update_cart_item",
    userAuthMiddleware,
    cartController.updateCartItem
);

//remove cart item
cartRoutes.delete(
    "/cart/product/:product_id/delete",
    userAuthMiddleware,
    cartController.removeCartItem
);

// get cart list by customer id
cartRoutes.get(
    "/cart/customer",
    userAuthMiddleware,
    cartController.getCartListByCustomerId
);

export default cartRoutes;
