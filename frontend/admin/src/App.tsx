import { Routes, Route } from "react-router-dom";
// import { TableSelection } from "./components/Table";
import Order from "./components/Order/Order.component";
import Dashboard from "./components/Dashboard/Dashboard.component";
import LayoutApp from "./pages/layout.page";
import { ProductDetail } from "./components/Product/ProductDetail.component";
import { ProductList } from "./components/Product/ProductList.component";
import Post from "./components/Post/Post.component";
import Product from "./components/Product/Product.component";
import { ProductFeedback } from "./components/Product/ProductFeedback.component";
import { ProductCreate } from "./components/Product/ProductCreate.component";
import { ProductDes } from "./components/Product/ProductDes.component";
import { ProductImage } from "./components/Product/ProductImage.component";
import { ProductView } from "./components/Product/ProductView.component";
import Customer from "./components/Customer/Customer.component";
import { CustomerList } from "./components/Customer/CustomerList.component";
import { CategoryList } from "./components/Category/CategoryList.component";
import { CategoryCreate } from "./components/Category/CategoryCreate.component";
import Category from "./components/Category/Category.component";

function App() {
    const data = [
        {
            product_id: "200",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GEi8ov-n2sxU_8KvipBQ34AAlCe9xIhskwo-dhQ&s",
            title: "Nuoc hoa Michelin",
            brand: "Gucci",
            year_publish: 2019,
            volume: 100,
            price: 2000000,
            discount: 10,
            quantity: 20,
        },
        {
            product_id: "201",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GEi8ov-n2sxU_8KvipBQ34AAlCe9xIhskwo-dhQ&s",
            title: "Nuoc hoa Michelin",
            brand: "Gucci",
            year_publish: 2019,
            volume: 100,
            price: 2000000,
            discount: 10,
            quantity: 20,
        },
        {
            product_id: "202",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GEi8ov-n2sxU_8KvipBQ34AAlCe9xIhskwo-dhQ&s",
            title: "Nuoc hoa Michelin ",
            brand: "Gucci",
            year_publish: 2019,
            volume: 100,
            price: 2000000,
            discount: 10,
            quantity: 20,
        },
        {
            product_id: "203",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GEi8ov-n2sxU_8KvipBQ34AAlCe9xIhskwo-dhQ&s",
            title: "Nuoc hoa Michelin ",
            brand: "Gucci",
            year_publish: 2019,
            volume: 100,
            price: 2000000,
            discount: 10,
            quantity: 20,
        },
        {
            product_id: "204",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GEi8ov-n2sxU_8KvipBQ34AAlCe9xIhskwo-dhQ&s",
            title: "Nuoc hoa Michelin ",
            brand: "Gucci",
            year_publish: 2019,
            volume: 100,
            price: 2000000,
            discount: 10,
            quantity: 20,
        },
        {
            product_id: "205",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GEi8ov-n2sxU_8KvipBQ34AAlCe9xIhskwo-dhQ&s",
            title: "Nuoc hoa Michelin ",
            brand: "Gucci",
            year_publish: 2019,
            volume: 100,
            price: 2000000,
            discount: 10,
            quantity: 20,
        },
        {
            product_id: "206",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GEi8ov-n2sxU_8KvipBQ34AAlCe9xIhskwo-dhQ&s",
            title: "Nuoc hoa Michelin ",
            brand: "Gucci",
            year_publish: 2019,
            volume: 100,
            price: 2000000,
            discount: 10,
            quantity: 20,
        },
        {
            product_id: "207",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GEi8ov-n2sxU_8KvipBQ34AAlCe9xIhskwo-dhQ&s",
            title: "Nuoc hoa Michelin ",
            brand: "Gucci",
            year_publish: 2019,
            volume: 100,
            price: 2000000,
            discount: 10,
            quantity: 20,
        },
        {
            product_id: "208",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_GEi8ov-n2sxU_8KvipBQ34AAlCe9xIhskwo-dhQ&s",
            title: "Nuoc hoa Michelin ",
            brand: "Gucci",
            year_publish: 2019,
            volume: 100,
            price: 2000000,
            discount: 10,
            quantity: 20,
        },
    ];

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
                        <Route
                            path="/product"
                            element={<ProductList data={data} />}
                        />
                        <Route
                            path="/product/:product_id"
                            element={<ProductView />}
                        >
                            <Route
                                path="/product/:product_id/image"
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
                    <Route path="order" element={<Order />} />
                    <Route path="post" element={<Post />}></Route>
                    <Route path="/customer" element={<Customer />}>
                        <Route
                            path="/customer"
                            element={<CustomerList />}
                        ></Route>
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
