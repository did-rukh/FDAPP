
import { createContext, useState } from "react";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));

const login = (token, role) => {

  setToken(token);
  setRole(role);
  localStorage.setItem("token", token);
   localStorage.setItem("role", role);
};
  const logout = () => {

   localStorage.removeItem("token");
   localStorage.removeItem("role");
   setToken(null);
 setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


