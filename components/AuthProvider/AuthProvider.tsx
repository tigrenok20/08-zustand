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

  const { data: user, isError } = useQuery({
    queryKey: ["check-get-me"],
    queryFn: async () => {
      await checkSession();

      return getMe();
    },
  });

  useEffect(() => {
    if (user) {
      setUser(user);
    }

    if (isError) {
      clearIsAuthenticated();
    }
  }, [user, isError, setUser, clearIsAuthenticated]);

  if (!user) {
    return <Loader />;
  }

  return <>{children}</>;
}
