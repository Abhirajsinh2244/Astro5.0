// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('ledger_token');
    setIsAuthenticated(!!token);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('ledger_token', token);
    setIsAuthenticated(true);
    window.location.href = '/dashboard';
  };

  const logout = () => {
    localStorage.removeItem('ledger_token');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return { isAuthenticated, login, logout };
}