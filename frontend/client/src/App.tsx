import { Routes, Route, useSearchParams } from "react-router-dom";

import LayoutApp from "./pages/layout.page";
import { Home } from "./components/Home/Home";
import { ProductDetail } from "./components/Product";
import { FilterProduct } from "./components/Filter";
import { Cart } from "./components/Cart/Cart";
import Customer from "./components/Customer/Customer.component";
import { OrderCustomer, OrderDetail } from "./components/Order";
import { Profile } from "./components/Profile/Proifle";
import { Checkout } from "./components/Checkout/Checkout";
import { Thankyou } from "./components/Thankyou/Thankyou";
import { SearchResult } from "./components/SearchResult/SearchResult";
import { PrivateRoute } from "./routes";
import { LoginGoogleSuccess, LoginAuth } from "./components/Login";
import { Register } from "./components/Register/Register";
import { ForgotPassword } from "./components/ForgotPassword/ForgotPassword";
import { TitlePageWrapper } from "./components/TitlePageWrapper/TitlePageWrapper";
import { About } from "./components/About/About";
import { Contact } from "./components/Contact/Contact";

function App() {
    const [searchParams] = useSearchParams();

    return (
        <>
            <Routes>
                <Route path="/" element={<LayoutApp />}>
                    <Route
                        path="/"
                        element={
                            <TitlePageWrapper title="Trang chủ | Perfume LDA">
                                <Home />
                            </TitlePageWrapper>
                        }
                    />
                    <Route
                        path="/about"
                        element={
                            <TitlePageWrapper title="Giới thiệu | Perfume LDA">
                                <About />
                            </TitlePageWrapper>
                        }
                    />
                    <Route
                        path="/contact"
                        element={
                            <TitlePageWrapper title="Liên hệ | Perfume LDA">
                                <Contact />
                            </TitlePageWrapper>
                        }
                    />
                    <Route
                        path="/product/:product_id/detail"
                        element={<ProductDetail />}
                    />
                    <Route
                        path="/product/:category_id/filter"
                        element={<FilterProduct />}
                    />
                    <Route
                        path="/cart"
                        element={
                            <TitlePageWrapper title="Giỏ hàng | Perfume LDA">
                                <Cart />
                            </TitlePageWrapper>
                        }
                    />
                    <Route
                        path="/customer"
                        element={
                            <PrivateRoute>
                                <Customer />
                            </PrivateRoute>
                        }
                    >
                        <Route
                            path="/customer"
                            element={
                                <TitlePageWrapper title="Trang khách hàng | Perfume LDA">
                                    <Profile />
                                </TitlePageWrapper>
                            }
                        />
                        <Route
                            path="/customer/orders"
                            element={
                                <TitlePageWrapper title="Trang đơn hàng | Perfume LDA">
                                    <OrderCustomer />
                                </TitlePageWrapper>
                            }
                        />
                        <Route
                            path="/customer/order/detail/:order_id"
                            element={<OrderDetail />}
                        />
                    </Route>
                    <Route
                        path="/checkout"
                        element={
                            <TitlePageWrapper title="Trang thanh toán | Perfume LDA">
                                <Checkout />
                            </TitlePageWrapper>
                        }
                    />
                    <Route
                        path="/checkout/thankyou/:order_id"
                        element={
                            <TitlePageWrapper title="Trang cảm ơn | Perfume LDA">
                                <Thankyou />
                            </TitlePageWrapper>
                        }
                    />
                    <Route
                        path="/search"
                        element={
                            <TitlePageWrapper
                                title={`${searchParams.get(
                                    "title"
                                )} | Perfume LDA`}
                            >
                                <SearchResult />
                            </TitlePageWrapper>
                        }
                    />
                </Route>

                <Route
                    path="/login"
                    element={
                        <TitlePageWrapper title="Đăng nhập | Perfume LDA">
                            <LoginAuth />
                        </TitlePageWrapper>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <TitlePageWrapper title="Đăng ký | Perfume LDA">
                            <Register />
                        </TitlePageWrapper>
                    }
                />
                <Route path="/login/success" element={<LoginGoogleSuccess />} />
                <Route
                    path="/forgot_password"
                    element={
                        <TitlePageWrapper title="Quên mật khẩu | Perfume LDA">
                            <ForgotPassword />
                        </TitlePageWrapper>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
