import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted session
        const storedUser = localStorage.getItem("schedra-user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Mock API call simulation
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = { id: 1, name: "Demo User", email, role: "manager" };
                setUser(mockUser);
                localStorage.setItem("schedra-user", JSON.stringify(mockUser));
                resolve(mockUser);
            }, 1000);
        });
    };

    const signup = async (name, email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = { id: Date.now(), name, email, role: "manager" };
                setUser(mockUser);
                localStorage.setItem("schedra-user", JSON.stringify(mockUser));
                resolve(mockUser);
            }, 1000);
        });
    };

    const continueAsGuest = () => {
        const guestUser = { id: "guest", name: "Guest User", role: "guest", isGuest: true };
        setUser(guestUser);
        localStorage.setItem("schedra-user", JSON.stringify(guestUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("schedra-user");
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, continueAsGuest, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
