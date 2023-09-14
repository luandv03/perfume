import { useEffect } from "react";

export const LoginGoogleSuccess = () => {
    useEffect(() => {
        setTimeout(() => {
            window.close();
        }, 300);
    }, []);

    return <div>This is login success page</div>;
};
