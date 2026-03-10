import { createContext, useState } from "react";

export const MyContext = createContext();

const MyContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const login = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
  };

  const openAlertBox = (type, message) => {
    // wire this up to your alert/snackbar UI
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  const value = {
    user,
    accessToken,
    login,
    logout,
    openAlertBox,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export default MyContextProvider;