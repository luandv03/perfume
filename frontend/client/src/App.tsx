import { Routes, Route, useSearchParams, useLocation } from "react-router-dom";
import { useEffect } from "react";

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
import { ResetPassword } from "./components/ResetPassword/ResetPassword";
import { TitlePageWrapper } from "./components/TitlePageWrapper/TitlePageWrapper";
import { About } from "./components/About/About";
import { Contact } from "./components/Contact/Contact";
import { ErrorPage } from "./components/ErrorPage";
import { PaymentEnd } from "./components/Payment";

function App() {
    const [searchParams] = useSearchParams();
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <Routes>
                <Route path="/" element={<LayoutApp />}>
                    <Route
                        path="/"
                        element={
                            <TitlePageWrapper title="Home | Perfume LDA">
                                <Home />
                            </TitlePageWrapper>
                        }
                    />
                    <Route
                        path="/about"
                        element={
                            <TitlePageWrapper title="About | Perfume LDA">
                                <About />
                            </TitlePageWrapper>
                        }
                    />
                    <Route
                        path="/contact"
                        element={
                            <TitlePageWrapper title="Contact | Perfume LDA">
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
                            <TitlePageWrapper title="Cart | Perfume LDA">
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
                                <TitlePageWrapper title="Customer | Perfume LDA">
                                    <Profile />
                                </TitlePageWrapper>
                            }
                        />
                        <Route
                            path="/customer/reset_password"
                            element={
                                <TitlePageWrapper title="Reset password | Perfume LDA">
                                    <ResetPassword />
                                </TitlePageWrapper>
                            }
                        />
                        <Route
                            path="/customer/order"
                            element={
                                <TitlePageWrapper title="Order | Perfume LDA">
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
                            <TitlePageWrapper title="Check out | Perfume LDA">
                                <Checkout />
                            </TitlePageWrapper>
                        }
                    />
                    <Route
                        path="/checkout/thankyou/:order_id"
                        element={
                            <TitlePageWrapper title="Thank you | Perfume LDA">
                                <Thankyou />
                            </TitlePageWrapper>
                        }
                    />

                    <Route path="/payment_end" element={<PaymentEnd />} />

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
                        <TitlePageWrapper title="SignIn | Perfume LDA">
                            <LoginAuth />
                        </TitlePageWrapper>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <TitlePageWrapper title="SignUp | Perfume LDA">
                            <Register />
                        </TitlePageWrapper>
                    }
                />
                <Route path="/login/success" element={<LoginGoogleSuccess />} />
                <Route
                    path="/forgot_password"
                    element={
                        <TitlePageWrapper title="Forgot password | Perfume LDA">
                            <ForgotPassword />
                        </TitlePageWrapper>
                    }
                />

                <Route path="/*" element={<ErrorPage />} />
            </Routes>
        </>
    );
}

export default App;
