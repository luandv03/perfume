import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { Notifications } from "@mantine/notifications";

import { CartProvider } from "./providers/CartProvider/CartProvider.tsx";

import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <MantineProvider>
            <BrowserRouter>
                <CartProvider>
                    <App />
                    <Notifications />
                </CartProvider>
            </BrowserRouter>
        </MantineProvider>
    </React.StrictMode>
);
