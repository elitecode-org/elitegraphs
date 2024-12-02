import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import createUserService from "../services/userService";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getToken, isSignedIn } = useAuth();
  const userService = createUserService({ getToken, isSignedIn });

  useEffect(() => {
    const loadUser = async () => {
      if (!isSignedIn) {
        setIsLoading(false);
        return;
      }

      try {
        // Small delay to ensure token is ready
        setTimeout(async () => {
          const userData = await userService.getUser();
          setUser(userData);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadUser();
  }, [isSignedIn]);

  const value = {
    user,
    isLoading,
    error,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
