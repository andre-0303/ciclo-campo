import { createContext } from "react";

export type AuthContextValue = {
  loading: boolean;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextValue>({
  loading: true,
  isAuthenticated: false,
});
