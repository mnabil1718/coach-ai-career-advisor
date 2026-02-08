"use client";

import { JwtPayload } from "@supabase/supabase-js";

import { createContext, useContext } from "react";

export type AuthContextType = {
  user: JwtPayload;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: JwtPayload;
}) => {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthContextProvider");
  }

  return context;
};
