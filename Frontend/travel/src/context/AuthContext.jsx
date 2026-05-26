import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../lib/api';
import LoginWelcomePopup from '../components/ui/LoginWelcomePopup';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loginPopup, setLoginPopup] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({
                        id: decoded.user_id,
                        username: decoded.username,
                        role: decoded.role
                    });
                }
            } catch (err) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await api.post('/auth/login/', { username, password });
        const { access, refresh } = response.data;
        localStorage.setItem('token', access);
        localStorage.setItem('refresh', refresh);

        const decoded = jwtDecode(access);
        const userData = {
            id: decoded.user_id,
            username: decoded.username,
            role: decoded.role
        };
        setUser(userData);
        setLoginPopup(userData);
        return userData;
    };

    const register = async (userData) => {
        await api.post('/auth/register/', userData);
        return login(userData.username, userData.password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, setLoginPopup }}>
            {children}
            {loginPopup && (
                <LoginWelcomePopup
                    user={loginPopup}
                    onClose={() => setLoginPopup(null)}
                />
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
