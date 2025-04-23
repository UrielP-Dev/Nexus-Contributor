import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const updateUser = (newUserData) => {
    console.log("Actualizando contexto de usuario con:", newUserData);
    setUser(newUserData);
    setUserData(newUserData);
  };

  const clearUser = () => {
    setUser(null);
  };

  const value = {
    user,
    userData,
    updateUser,
    clearUser,
  };

  console.log("Estado actual del contexto:", value);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
}
