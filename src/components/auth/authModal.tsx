"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useAuthModal } from "@/context/Authmodalcontext";

import LoginModal from "./login";

export default function AuthModal() {
  const { isOpen, closeModal } = useAuthModal();

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && closeModal()}
    >
      <DialogPrimitive.Portal>
        <LoginModal />
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
