"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { AUTH_MODAL_VISITED_KEY } from "@/constants/features/auth.constants";

export type AuthModalView =
  | "login"
  | "register"
  | "forgot-password"
  | "login-from-forgot";

interface AuthModalContextType {
  isOpen: boolean;
  view: AuthModalView;
  openModal: (view?: AuthModalView) => void;
  closeModal: () => void;
  switchView: (view: AuthModalView) => void;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthModalView>("login");

  useEffect(() => {
    const hasVisited = localStorage.getItem(AUTH_MODAL_VISITED_KEY);
    if (!hasVisited) {
      setIsOpen(true);
      setView("login");
      localStorage.setItem(AUTH_MODAL_VISITED_KEY, "true");
    }
  }, []);

  const openModal = useCallback((v: AuthModalView = "login") => {
    setView(v);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsOpen(false), []);
  const switchView = useCallback((v: AuthModalView) => setView(v), []);

  return (
    <AuthModalContext.Provider
      value={{ isOpen, view, openModal, closeModal, switchView }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx)
    throw new Error("useAuthModal must be used inside AuthModalProvider");
  return ctx;
}
