"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cart_controller_1 = require("../../../controllers/carts/cart.controller");
var user_auth_middleware_1 = require("../../../middlewares/user-auth.middleware");
var cartRoutes = (0, express_1.Router)();
var cartController = new cart_controller_1.CartController();
// add cart item into cart list
cartRoutes.post("/cart/add_cart_item", user_auth_middleware_1.userAuthMiddleware, cartController.addCartItemIntoCart);
// update cart item
cartRoutes.patch("/cart/update_cart_item", user_auth_middleware_1.userAuthMiddleware, cartController.updateCartItem);
//remove cart item
cartRoutes.delete("/cart/product/:product_id/delete", user_auth_middleware_1.userAuthMiddleware, cartController.removeCartItem);
// get cart list by customer id
cartRoutes.get("/cart/customer", user_auth_middleware_1.userAuthMiddleware, cartController.getCartListByCustomerId);
exports.default = cartRoutes;
