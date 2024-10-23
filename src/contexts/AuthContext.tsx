import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, AuthContextType } from '../types/index';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    // This is a stub. In a real application, you'd verify credentials and fetch user data
    if (email === 'admin@example.com' && password === 'password') {
      setUser({ email, role: 'Administrator' });
      return true;
    } else if (email === 'radiologist@example.com' && password === 'password') {
      setUser({ email, role: 'Radiologist' });
      return true;
    } else if (email === 'physician@example.com' && password === 'password') {
      setUser({ email, role: 'Physician' });
      return true;
    } else if (email === 'user@example.com' && password === 'password') {
      setUser({ email, role: 'Non-Specialist' });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};