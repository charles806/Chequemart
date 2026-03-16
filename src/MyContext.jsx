import { createContext, useState, useMemo, useCallback } from "react";

export const MyContext = createContext();

const MyContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const login = useCallback((userData, token) => {
    setUser(userData);
    setAccessToken(token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
  }, []);

  const openAlertBox = useCallback((type, message) => {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }, []);

  const value = useMemo(() => ({
    user,
    accessToken,
    login,
    logout,
    openAlertBox,
  }), [user, accessToken, login, logout, openAlertBox]);

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export default MyContextProvider;