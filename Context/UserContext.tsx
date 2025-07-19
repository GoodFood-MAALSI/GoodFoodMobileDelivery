import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserContextType {
  token: string | null;
  refreshToken: string | null;
  tokenExpires: number | null;
  user: any;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setTokenExpires: (tokenExpires: number | null) => void;
  setUser: (user: any) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [tokenExpires, setTokenExpires] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      const storedTokenExpires = await AsyncStorage.getItem('tokenExpires');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedRefreshToken && storedTokenExpires && storedUser) {
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setTokenExpires(Number(storedTokenExpires));
        setUser(JSON.parse(storedUser));
      }
    };
    loadUserFromStorage();
  }, []);

  const logout = async () => {
    setToken(null);
    setRefreshToken(null);
    setTokenExpires(null);
    setUser(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('tokenExpires');
    await AsyncStorage.removeItem('user');
    console.log("Logout success")
  };

  return (
    <UserContext.Provider
      value={{
        token,
        refreshToken,
        tokenExpires,
        user,
        setToken,
        setRefreshToken,
        setTokenExpires,
        setUser,
        isAuthenticated: !!token,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
