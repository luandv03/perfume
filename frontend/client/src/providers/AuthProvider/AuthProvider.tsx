import {
    createContext,
    useState,
    useEffect,
    Dispatch,
    SetStateAction,
} from "react";
import { authService } from "../../services/auth.service";
import { Profile } from "../../components/Profile/Proifle";

export interface Profile {
    customer_id: number;
    email: string;
    fullname: string;
    address: string;
    phone_number: string;
    dob: string;
}

interface ContextValue {
    profile: Profile;
    setProfile: Dispatch<SetStateAction<Profile>>;
}

export const AuthContext = createContext<ContextValue>({
    profile: {
        customer_id: 0,
        email: "",
        fullname: "",
        address: "",
        phone_number: "",
        dob: "",
    },
    setProfile: () => {
        console.log();
    },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<Profile>({
        customer_id: 0,
        email: "",
        fullname: "",
        address: "",
        phone_number: "",
        dob: "",
    });

    const handleGetProfile = async () => {
        const data = await authService.getProfile();

        if (!data.data.customer_id) {
            return localStorage.setItem("isAuthenticated", "false");
        }

        localStorage.setItem("isAuthenticated", "true");

        setProfile(data.data);
    };

    useEffect(() => {
        handleGetProfile();
    }, []);

    return (
        <AuthContext.Provider value={{ profile, setProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
