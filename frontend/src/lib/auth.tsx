import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { apiFetch } from './api-client';

interface User {
  id: string | number;
  nombre: string;
  rol: 'admin' | 'operador';
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isValidating: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getCookie = (name: string) => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
};

const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
};

const removeCookie = (name: string) => {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax${secure}`;
};


export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from cookies if they exist
  const [token, setToken] = useState<string | null>(() => getCookie('auth_token') || null);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = getCookie('auth_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isValidating, setIsValidating] = useState<boolean>(!!getCookie('auth_token'));

  // Sync token with api-client for requests
  useEffect(() => {
    if (!token) { setIsValidating(false); return; }

    apiFetch<{ id: string | number; nombre: string; rol: 'admin' | 'operador' }>(
      '/api/auth/me',
      {},
      token
    ).then(() => setIsValidating(false))
      .catch(() => {
        setToken(null);
        setUser(null);
        removeCookie('auth_token');
        removeCookie('auth_user');
        setIsValidating(false);
      });
  }, []);

  useEffect(() => {
    if (user) {
      setCookie('auth_user', JSON.stringify(user));
    } else {
      removeCookie('auth_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      setCookie('auth_token', token);
    } else {
      removeCookie('auth_token');
    }
  }, [token]);

  const login = useCallback(async (username: string, password: string) => {
    const data = await apiFetch<{ token: string; nombre: string; rol: 'admin' | 'operador'; id?: number }>(
      '/api/auth/login',
      { method: 'POST', body: JSON.stringify({ username, password }) }
    );
    setToken(data.token);
    setUser({
      id: data.id ?? 0,
      nombre: data.nombre,
      rol: data.rol,
    });
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsValidating(false);
    removeCookie('auth_token');
    removeCookie('auth_user');
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: !!token,
    isValidating,
    login,
    logout,
  }), [token, user, isValidating, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

