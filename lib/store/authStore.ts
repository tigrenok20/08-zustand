import { User } from "@/types/user";
import { create } from "zustand";

type AuthStore = {
  user?: User;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  user: undefined,
  isAuthenticated: false,
  setUser: (user: User) => set(() => ({ user, isAuthenticated: true })),
  clearIsAuthenticated: () =>
    set(() => ({ user: undefined, isAuthenticated: false })),
}));
