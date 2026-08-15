import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/authApi";

import { logoutUser } from "../api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const logout = async () => {
        try {
            await logoutUser();
            setUser(null);
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const response = await getCurrentUser();

                setUser(response.data.data);

            } catch (error) {

                setUser(null);

            } finally {

                setLoading(false);

            }

        };

        fetchUser();

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                isAuthenticated: !!user,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;