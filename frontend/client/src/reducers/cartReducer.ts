interface CartItem {
    product_id: number;
    title: string;
    price: number;
    discount: number;
    quantity: number;
    volume: number;
    number_add_item: number;
    brand: string;
}

type ItemType = {
    type: "ADD_TO_CART";
    payload: CartItem;
};

type RestType = {
    type: "REMOVE_ITEM" | "UP_QUANTITY_ITEM" | "DOWN_QUANTITY_ITEM";
    payload: { product_id: number };
};

type UpdateType = {
    type: "UPDATE_QUANTITY_ITEM";
    payload: { product_id: number; quantity?: number };
};

type ActionType = ItemType | RestType | UpdateType;

interface Cart {
    cart: CartItem[];
    total_tmp_cost: number;
}

// 1. đã có sản phẩm đó trong cart rồi => tăng số lượng lên 1
// 2. chưa có => tạo

export const reducer = (state: Cart, action: ActionType) => {
    switch (action.type) {
        case "ADD_TO_CART": {
            const exist = state.cart.find(
                (item: CartItem) =>
                    item.product_id === action.payload.product_id
            );

            if (exist) {
                return {
                    cart: state.cart.map((item: CartItem) =>
                        item.product_id === action.payload.product_id
                            ? {
                                  product_id: item.product_id,
                                  title: item.title,
                                  discount: item.discount,
                                  brand: item.brand,
                                  volume: item.volume,
                                  price: item.price,
                                  quantity:
                                      item.quantity +
                                      action.payload.number_add_item,
                              }
                            : item
                    ),
                };
            } else
                return {
                    cart: [...state.cart, { ...action.payload, quantity: 1 }],
                };
        }
        case "UP_QUANTITY_ITEM":
            return {
                cart: state.cart.map((item: CartItem) =>
                    item.product_id === action.payload.product_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            };
        case "DOWN_QUANTITY_ITEM":
            return {
                cart: state.cart.map((item: CartItem) =>
                    item.product_id === action.payload.product_id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                ),
            };
        case "UPDATE_QUANTITY_ITEM":
            return {
                cart: state.cart.map((item: CartItem) =>
                    item.product_id === action.payload.product_id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };

        case "REMOVE_ITEM": {
            const cartList = state.cart.filter(
                (item: CartItem) =>
                    item.product_id !== action.payload.product_id
            );

            console.log(cartList);

            return {
                cart: cartList,
            };
        }
        default:
            return state;
    }
};
