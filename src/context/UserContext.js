import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  const updateUser = (data) => {
    setUserId(data?.id || null);
    setUserData(data || null);
  };

  const clearUser = () => {
    setUserId(null);
    setUserData(null);
  };

  return (
    <UserContext.Provider value={{ userId, userData, updateUser, clearUser }}>
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