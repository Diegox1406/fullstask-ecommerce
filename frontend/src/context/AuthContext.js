import React, { createContext, useContext, useEffect, useState } from "react";
import { authLogin, authRegister } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user"));
        } catch {
            return null;
        }
    });
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    useEffect(() => {
        if (!token) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
        }
    }, [token]);

    const login = async (email, password) => {
        const data = await authLogin(email, password);
        if (!data.token) throw new Error("No se recibió token");
        localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        if (data.user) setUser(data.user);
        return data;
    };

    const register = async (name, email, password) => {
        return authRegister(name, email, password);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
