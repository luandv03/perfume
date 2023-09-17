import { Routes, Route } from "react-router-dom";
import LayoutApp from "./pages/layout.page";
import { Home } from "./components/Home/Home";
import { ProductDetail } from "./components/Product";
import { FilterProduct } from "./components/FilterProduct/FilterProduct";
import { Cart } from "./components/Cart/Cart";
import Customer from "./components/Customer/Customer.component";
import { OrderCustomer, OrderDetail } from "./components/Order";
import { Profile } from "./components/Profile/Proifle";
import { Checkout } from "./components/Checkout/Checkout";
import { Thankyou } from "./components/Thankyou/Thankyou";
import { SearchResult } from "./components/SearchResult/SearchResult";
import { PrivateRoute } from "./routes";
import { LoginGoogleSuccess, LoginAuth } from "./components/Login";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LayoutApp />}>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/product/:product_id/detail"
                        element={<ProductDetail />}
                    />
                    <Route
                        path="/product/:category_id/filter"
                        element={<FilterProduct />}
                    />
                    <Route path="/cart" element={<Cart />} />
                    <Route
                        path="/customer"
                        element={
                            <PrivateRoute>
                                <Customer />
                            </PrivateRoute>
                        }
                    >
                        <Route path="/customer" element={<Profile />} />
                        <Route
                            path="/customer/orders"
                            element={<OrderCustomer />}
                        />
                        <Route
                            path="/customer/order/detail/:order_id"
                            element={<OrderDetail />}
                        />
                    </Route>
                    <Route path="/checkout" element={<Checkout />} />
                    <Route
                        path="/checkout/thankyou/:order_id"
                        element={<Thankyou />}
                    />
                    <Route path="/search" element={<SearchResult />} />
                </Route>

                <Route path="/login" element={<LoginAuth />} />
                <Route path="/login/success" element={<LoginGoogleSuccess />} />
            </Routes>
        </>
    );
}

export default App;
