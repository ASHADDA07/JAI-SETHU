import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// 1. Updated User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'public' | 'lawyer' | 'student' | 'admin' | 'founder';
  avatar?: string;
  // Optional fields for specific roles
  barLicenseNo?: string; 
  university?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  updateAvatar: (url: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load User from Session Storage on startup
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Helper to update User state & Session Storage simultaneously
  const setUser = (userData: User | null) => {
    setUserState(userData);
    if (userData) {
      sessionStorage.setItem('user', JSON.stringify(userData));
    } else {
      sessionStorage.removeItem('user');
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  const updateAvatar = (url: string) => {
    if (user) {
        const updatedUser = { ...user, avatar: url };
        setUser(updatedUser);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, logout, updateAvatar }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}