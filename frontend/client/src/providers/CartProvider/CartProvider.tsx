import { createContext, useEffect, useReducer, ReactNode } from "react";
import { reducer } from "../../reducers/cartReducer";

interface CartItem {
    product_id: number;
    title: string;
    price: number;
    brand: string;
    volume: number;
    discount: number;
    quantity: number;
    number_add_item: number;
}

const getLocalCart = (): CartItem[] => {
    const newCartData = JSON.parse(localStorage.getItem("cart") as string);

    if (!newCartData) {
        return [];
    } else {
        return newCartData;
    }
};

const initialState = {
    cart: getLocalCart(),
};

export const CartContext = createContext();

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const addToCart = (cartItem: CartItem) => {
        dispatch({ type: "ADD_TO_CART", payload: cartItem });
    };

    const removeItem = (product_id: number) => {
        dispatch({ type: "REMOVE_ITEM", payload: { product_id } });
    };

    const upQuantityItem = (product_id: number) => {
        dispatch({ type: "UP_QUANTITY_ITEM", payload: { product_id } });
    };

    const downQuantityItem = (product_id: number) => {
        dispatch({ type: "DOWN_QUANTITY_ITEM", payload: { product_id } });
    };

    const updateQuantityItem = (product_id: number, quantity: number) => {
        dispatch({
            type: "UPDATE_QUANTITY_ITEM",
            payload: { product_id, quantity },
        });
    };

    // const handleGetCartByUser = async () => {
    //     const res = await
    // };

    useEffect(() => {
        // check not authenticated
        localStorage.setItem("cart", JSON.stringify(state.cart));
    }, [state.cart]);

    return (
        <CartContext.Provider
            value={{
                ...state,
                addToCart,
                removeItem,
                upQuantityItem,
                downQuantityItem,
                updateQuantityItem,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
