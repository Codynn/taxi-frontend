"use client";
import { useFCM } from "@/hooks/useFCM";

interface FCMProviderProps {
  children: React.ReactNode;
}

export default function FCMProvider({ children }: FCMProviderProps) {
  useFCM();
  return <>{children}</>;
}
