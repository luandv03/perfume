import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import LayoutApp from "./pages/layout.page";
import Dashboard from "./components/Dashboard/Dashboard.component";
import { Order, OrderList, OrderDetail } from "./components/Order";
import {
    Product,
    ProductFeedback,
    ProductCreate,
    ProductDes,
    ProductImage,
    ProductView,
    ProductList,
    ProductDetail,
} from "./components/Product";
import { Customer, CustomerList, CustomerDetail } from "./components/Customer";
import { Category, CategoryList, CategoryCreate } from "./components/Category";
import { Login } from "./components/Login/Login.tsx";
import { PrivateRoute } from "./routes/PrivateRoute.route.tsx";
import { Account } from "./components/Account";

function App() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <Routes>
                <Route path="/" element={<LayoutApp />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/category" element={<Category />}>
                        <Route path="/category" element={<CategoryList />} />
                        <Route
                            path="/category/create"
                            element={<CategoryCreate />}
                        />
                    </Route>

                    <Route path="/product" element={<Product />}>
                        <Route path="/product" element={<ProductList />} />
                        <Route
                            path="/product/:product_id"
                            element={<ProductView />}
                        >
                            <Route
                                path="/product/:product_id"
                                element={<ProductImage />}
                            />
                            <Route
                                path="/product/:product_id/detail"
                                element={<ProductDetail />}
                            />
                            <Route
                                path="/product/:product_id/description"
                                element={<ProductDes />}
                            />
                            <Route
                                path="/product/:product_id/feedback"
                                element={<ProductFeedback />}
                            />
                        </Route>
                        <Route
                            path="/product/create"
                            element={<ProductCreate />}
                        />
                    </Route>
                    <Route path="/order" element={<Order />}>
                        <Route path="/order/:status" element={<OrderList />} />
                        <Route
                            path="/order/detail/:order_id"
                            element={<OrderDetail />}
                        />
                    </Route>
                    <Route path="/customer" element={<Customer />}>
                        <Route
                            path="/customer/:type"
                            element={<CustomerList />}
                        ></Route>
                        <Route
                            path="/customer/detail/:customer_id"
                            element={<CustomerDetail />}
                        ></Route>
                    </Route>

                    <Route
                        path="/account"
                        element={
                            <PrivateRoute>
                                <Account />
                            </PrivateRoute>
                        }
                    />
                </Route>
                <Route path="login" element={<Login />} />
            </Routes>
        </>
    );
}

export default App;
