import { Routes, Route } from "react-router-dom";
// import { TableSelection } from "./components/Table";
import Order from "./components/Order/Order.component";
import { OrderList } from "./components/Order/OrderList.Component.tsx";
import { OrderDetail } from "./components/Order/OrderDetail.component.tsx";
import Dashboard from "./components/Dashboard/Dashboard.component";
import LayoutApp from "./pages/layout.page";
import { ProductDetail } from "./components/Product/ProductDetail.component";
import { ProductList } from "./components/Product/ProductList.component";
import Product from "./components/Product/Product.component";
import { ProductFeedback } from "./components/Product/ProductFeedback.component";
import { ProductCreate } from "./components/Product/ProductCreate.component";
import { ProductDes } from "./components/Product/ProductDes.component";
import { ProductImage } from "./components/Product/ProductImage.component";
import { ProductView } from "./components/Product/ProductView.component";
import Customer from "./components/Customer/Customer.component";
import { CustomerList } from "./components/Customer/CustomerList.component";
import { CustomerDetail } from "./components/Customer/CustomerDetail.component.tsx";
import { CategoryList } from "./components/Category/CategoryList.component";
import { CategoryCreate } from "./components/Category/CategoryCreate.component";
import Category from "./components/Category/Category.component";
import { Login } from "./components/Login/Login.tsx";

function App() {
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
                </Route>
                <Route path="login" element={<Login />} />
            </Routes>
        </>
    );
}

export default App;
