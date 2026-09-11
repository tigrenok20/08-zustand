"use client";

import { checkSession, getMe } from "@/lib/api/clientApi";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((store) => store.setUser);
  const clearIsAuthenticated = useAuthStore(
    (store) => store.clearIsAuthenticated,
  );

  const { data: user, isLoading } = useQuery({
    queryKey: ["check-get-me"],
    queryFn: async () => {
      if ((await checkSession()).success) {
        return getMe();
      }

      return null;
    },
  });

  useEffect(() => {
    if (user) {
      setUser(user);
    } else if (isLoading) {
      clearIsAuthenticated();
    }
  }, [user, isLoading, setUser, clearIsAuthenticated]);

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  return <>{children}</>;
}
