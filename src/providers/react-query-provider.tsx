"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { AuthModalProvider } from "@/context/Authmodalcontext";
import { queryClient } from "@/lib/reactQueryClient";


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthModalProvider>

        {children}
      </AuthModalProvider>
    </QueryClientProvider>
  );
}