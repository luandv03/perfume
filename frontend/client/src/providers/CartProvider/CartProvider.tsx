import React, {
    useState,
    createContext,
    useEffect,
    useContext,
    ReactNode,
} from "react";

import { getItemLocalStorage } from "../../helpers/handleLocalStorage.helper";
import { cartService } from "../../services/cart.service";
import { AuthContext } from "../AuthProvider/AuthProvider";

interface CartItem {
    product_id: number;
    title: string;
    price: number;
    brand: string;
    volume: number;
    discount: number;
    quantity: number;
}

interface CartContextType {
    cartUser: CartItem[] | [];
    setCartUser: React.Dispatch<React.SetStateAction<CartItem[]> | []>;
    addCartItem: (product: CartItem) => void;
    removeCartItem: (product: CartItem) => void;
}

export const CartContext = createContext<CartContextType>({
    cartUser: [],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setCartUser: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    addCartItem: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    removeCartItem: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartUser, setCartUser] = useState<CartItem[] | []>(
        getItemLocalStorage("cart") ? getItemLocalStorage("cart") : []
    );

    const { profile } = useContext(AuthContext);

    const addCartItem = async (product: CartItem) => {
        if (getItemLocalStorage("isAuthenticated")) {
            const res = await cartService.addCartItem(
                product.product_id,
                product.quantity
            );

            if (res.statusCode === 200) {
                setCartUser((prev: CartItem[]) => {
                    const exist = prev.find(
                        (item: CartItem) =>
                            item.product_id === res.data.product_id
                    );

                    if (exist) {
                        return prev.map((item: CartItem) =>
                            item.product_id === res.data.product_id
                                ? {
                                      ...item,
                                      quantity: res.data.quantity,
                                  }
                                : item
                        );
                    } else {
                        return [
                            ...prev,
                            { ...product, quantity: res.data.quantity },
                        ];
                    }
                });
            }
        } else {
            setCartUser((prev: CartItem[]) => {
                const exist = prev.find(
                    (item: CartItem) => item.product_id === product.product_id
                );

                if (exist) {
                    const cart = prev.map((item: CartItem) =>
                        item.product_id === product.product_id
                            ? {
                                  ...item,
                                  quantity: item.quantity + product.quantity,
                              }
                            : item
                    );

                    localStorage.setItem("cart", JSON.stringify(cart));

                    return cart;
                } else {
                    const cart = [...prev, { ...product, quantity: 1 }];

                    localStorage.setItem("cart", JSON.stringify(cart));

                    return cart;
                }
            });
        }
    };

    const removeCartItem = async (product: CartItem) => {
        if (getItemLocalStorage("isAuthenticated")) {
            const res = await cartService.deleteCartItem(product.product_id);

            if (res.statusCode === 200) {
                setCartUser((prev: CartItem[]) => {
                    return prev.filter(
                        (item: CartItem) =>
                            item.product_id !== res.data.product_id
                    );
                });
            }
        } else {
            setCartUser((prev: CartItem[]) => {
                const cart = prev.filter(
                    (item: CartItem) => item.product_id !== product.product_id
                );

                localStorage.setItem("cart", JSON.stringify(cart));

                return cart;
            });
        }
    };

    const handleGetCartByUser = async () => {
        const res = await cartService.getCartList();

        if (res.statusCode === 200) return setCartUser(res.data.cart_list);
    };

    useEffect(() => {
        if (getItemLocalStorage("isAuthenticated")) handleGetCartByUser();
        else localStorage.setItem("cart", JSON.stringify(cartUser));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile]);

    return (
        <CartContext.Provider
            value={{
                cartUser,
                setCartUser,
                addCartItem,
                removeCartItem,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
