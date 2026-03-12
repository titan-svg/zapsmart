'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'supervisor' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleHierarchy: Record<UserRole, number> = {
  admin: 3,
  supervisor: 2,
  agent: 1,
};

// Mock user for demo
const mockUser: User = {
  id: '1',
  name: 'Carlos Silva',
  email: 'carlos@empresa.com.br',
  role: 'admin',
  company: 'TechFlow Solutions',
  phone: '+55 11 99999-0000',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('zapsmart_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email && password) {
      const loggedUser = { ...mockUser, email };
      setUser(loggedUser);
      localStorage.setItem('zapsmart_user', JSON.stringify(loggedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zapsmart_user');
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
