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
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cookie helpers
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax; Secure`;
};

const getCookie = (name: string) => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure`;
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

  // Sync token with api-client for requests
  useEffect(() => {
    if (!token) return;

    apiFetch<{ id: string | number; nombre: string; rol: 'admin' | 'operador' }>(
      '/api/auth/me',
      {},
      token
    ).catch(() => {
      // El token no es válido → limpiar sesión
      setToken(null);
      setUser(null);
      removeCookie('auth_token');
      removeCookie('auth_user');
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
    const data = await apiFetch<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    removeCookie('auth_token');
    removeCookie('auth_user');
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
  }), [token, user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

