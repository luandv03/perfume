import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./providers/AuthProvider/AuthProvider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <MantineProvider>
            <BrowserRouter>
                <AuthProvider>
                    <Notifications />
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </MantineProvider>
    </React.StrictMode>
);
