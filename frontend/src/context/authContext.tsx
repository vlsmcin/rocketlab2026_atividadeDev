import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import api from "../services/api";

type AuthUser = {
    id_user: string;
    username: string;
    role: string;
};

type AuthContextValue = {
    user: AuthUser | null;
    isLoadingSession: boolean;
    isAuthenticating: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loginError: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
};

type AuthLoginResponse = {
    access_token: string;
    token_type: string;
    user: AuthUser;
};

const AUTH_TOKEN_STORAGE_KEY = "auth_access_token";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoadingSession, setIsLoadingSession] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const clearSession = () => {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        setUser(null);
    };

    useEffect(() => {
        const accessToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
        if (!accessToken) {
            setIsLoadingSession(false);
            return;
        }

        api.get<AuthUser>("/auth/me")
            .then((response) => {
                setUser(response.data);
            })
            .catch(() => {
                clearSession();
            })
            .finally(() => {
                setIsLoadingSession(false);
            });
    }, []);

    const login = async (username: string, password: string) => {
        setIsAuthenticating(true);
        setLoginError(null);

        try {
            const response = await api.post<AuthLoginResponse>("/auth/login", { username, password });
            localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.data.access_token);
            setUser(response.data.user);
            return true;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const maybeDetail = error.response?.data as { detail?: string } | undefined;
                setLoginError(maybeDetail?.detail ?? "Nao foi possivel autenticar.");
            } else {
                setLoginError("Nao foi possivel autenticar.");
            }

            clearSession();
            return false;
        } finally {
            setIsAuthenticating(false);
        }
    };

    const logout = () => {
        clearSession();
        setLoginError(null);
    };

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isLoadingSession,
            isAuthenticating,
            isAuthenticated: user !== null,
            isAdmin: user?.role === "admin",
            loginError,
            login,
            logout,
        }),
        [user, isLoadingSession, isAuthenticating, loginError],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }

    return context;
}

export { AUTH_TOKEN_STORAGE_KEY, AuthProvider, useAuth };