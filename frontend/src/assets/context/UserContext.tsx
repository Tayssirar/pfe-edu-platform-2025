import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { fetchUserInfo } from "../../api/auth"; // Import the API function to fetch user info

export interface Avatar {
  id: string;
  name: string;
  profile: string;
  welcome: string;
  cheerful: string;
  sad: string;
}

interface User {
  id: string;
  role: string;
  name: string;
  avatar: Avatar;
  [key: string]: any; // Add any additional fields as needed
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUserData: () => Promise<void>; // Function to refresh user data
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Function to fetch user data from the server
  const fetchUserData = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      try {
        const updatedUser = await fetchUserInfo(storedUser.id, storedUser.role); // Fetch updated user info
        setUser({ ...storedUser, ...updatedUser }); // Merge stored and fetched data
        localStorage.setItem("user", JSON.stringify({ ...storedUser, ...updatedUser }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
        localStorage.removeItem("user");
      }
    }
  };

  // Refresh user data manually
  const refreshUserData = async () => {
    await fetchUserData();
  };

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};