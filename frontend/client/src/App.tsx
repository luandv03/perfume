import { Routes, Route } from "react-router-dom";
import LayoutApp from "./pages/layout.page";
import { Home } from "./components/Home/Home";
import { ProductDetail } from "./components/ProductDetail/ProductDetail";
import { FilterProduct } from "./components/FilterProduct/FilterProduct";
import { Cart } from "./components/Cart/Cart";
import Customer from "./components/Customer/Customer.component";
import { OrderCustomer } from "./components/OrderCustomer/OrderCustomer";
import { Profile } from "./components/Profile/Proifle";
import { Checkout } from "./components/Checkout/Checkout";
import { LoginAuth } from "./components/Login/Login";
import { SearchResult } from "./components/SearchResult/SearchResult";
import { PrivateRoute } from "./routes";

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
                    </Route>
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/search" element={<SearchResult />} />
                </Route>

                <Route path="/login" element={<LoginAuth />} />
            </Routes>
        </>
    );
}

export default App;
