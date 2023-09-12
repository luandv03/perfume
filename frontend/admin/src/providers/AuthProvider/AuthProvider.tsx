import {
    createContext,
    useState,
    useEffect,
    Dispatch,
    SetStateAction,
} from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";

export interface Profile {
    admin_id: number;
    username: string;
    role: string;
}

interface ContextValue {
    profile: Profile;
    setProfile: Dispatch<SetStateAction<Profile>>;
}

export const AuthContext = createContext<ContextValue>({
    profile: {
        admin_id: 0,
        role: "",
        username: "",
    },
    setProfile: () => {
        console.log();
    },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<Profile>({
        admin_id: 0,
        username: "",
        role: "",
    });

    const navigate = useNavigate();

    const handleGetProfile = async () => {
        const data = await authService.getProfile();

        console.log(data);

        if (data.statusCode !== 200) {
            navigate("/login");
            return localStorage.setItem("isAuthenticated", "false");
        }

        localStorage.setItem("isAuthenticated", "true");

        setProfile(data.data);
    };

    useEffect(() => {
        handleGetProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.pathname]);

    return (
        <AuthContext.Provider value={{ profile, setProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
