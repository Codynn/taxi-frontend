"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useAuthModal } from "@/context/Authmodalcontext";

import RegisterModal from "./register";
import LoginModal from "./login";
import ForgotPasswordModal from "./Forgotpasswordmodal";

export default function AuthModal() {
  const { isOpen, view, closeModal } = useAuthModal();

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && closeModal()}
    >
      <DialogPrimitive.Portal>
        {view === "login" && <LoginModal />}
        {view === "register" && <RegisterModal />}
        {view === "forgot-password" && (
          <ForgotPasswordModal onClose={closeModal} />
        )}
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
