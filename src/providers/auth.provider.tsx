import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import axiosBase from '../config/axios';
import { ALGORITHM_STORAGE_KEY } from '@/types';

interface Props {
    children?: ReactNode
}

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    checkMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const isAuthenticated = !!user;

    // Функция для установки токена в заголовки axios
    const setAuthToken = (token: string | null) => {
        if (token) {
            axiosBase.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axiosBase.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    };

    // Метод авторизации
    const login = async (username: string, password: string): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await axiosBase.post('/auth/login', {
                grant_type: 'password',
                username,
                password
            }, {
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded',
                    "Accept": 'application/json',
                }
            });

            const { access_token } = response.data;

            setAuthToken(access_token);

            const responseUser = await axiosBase.get('/auth/me');
            setUser(responseUser.data);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Метод выхода из аккаунта
    const logout = (): void => {
        setUser(null);
        setAuthToken(null);
        window.localStorage.removeItem('session');
        window.localStorage.removeItem(ALGORITHM_STORAGE_KEY);
        axiosBase.defaults.headers.common['x-session-id'] = undefined;
        delete axiosBase.defaults.headers.common['x-session-id'];
    };

    // Метод проверки текущего пользователя
    const checkMe = async (): Promise<void> => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsLoading(false);
                return;
            }

            setAuthToken(token);

            const response = await axiosBase.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            console.error('Check me error:', error);
            // Если токен невалидный, очищаем данные
            setAuthToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Проверяем авторизацию
    useEffect(() => {
        checkMe();
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkMe
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Хук для использования контекста
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;