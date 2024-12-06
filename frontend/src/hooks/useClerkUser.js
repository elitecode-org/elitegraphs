import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import createUserService from "../services/userService";

/**
 * @deprecated
 */
export const useClerkUser = () => {
  const { user, isLoaded } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const userService = createUserService({ getToken, isSignedIn });

  useEffect(() => {
    const createDatabaseUser = async () => {
      if (user && isLoaded) {
        try {
          await userService.createUser({
            email: user.primaryEmailAddress?.emailAddress || "",
            name: user.fullName || undefined,
            clerkId: user.id,
            username: user.username || undefined,
          });
          localStorage.setItem("clerkId", user.id);
        } catch (error) {
          // If error is due to user already existing, we can ignore it
          if (
            error instanceof Error &&
            error.message.includes("already exists")
          ) {
            console.log("User already exists in database");
            return;
          }
          console.error("Error creating database user:", error);
        }
      }
    };

    createDatabaseUser();
    localStorage.setItem("dbUserCreated", "true");
  }, [user, isLoaded, userService]);

  return { user, isLoaded };
};
