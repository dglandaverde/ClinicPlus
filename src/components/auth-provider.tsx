"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { clearSession, readSession, writeSession, type AuthUser } from "@/lib/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isReady: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // localStorage is only readable on the client, so the session is
    // hydrated after mount to keep the first render matching the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(readSession());
    setIsReady(true);
  }, []);

  const login = useCallback((next: AuthUser) => {
    writeSession(next);
    setUser(next);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
