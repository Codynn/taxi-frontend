"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, CheckCircle2, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/lib/validations/forgotpassword.schema";

import { useAuthModal } from "@/context/Authmodalcontext";
import { useForgotPassword } from "@/hooks/useForgotpassword";

type Step = "email" | "sent";

interface Props {
  onClose: () => void;
}

export default function ForgotPasswordModal({ onClose }: Props) {
  const { switchView } = useAuthModal();
  const [step, setStep] = useState<Step>("email");
  const [sentEmail, setSentEmail] = useState("");

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { mutate: requestReset, isPending } = useForgotPassword(() => {
    setSentEmail(form.getValues("email"));
    setStep("sent");
  });

  function onSubmit({ email }: ForgotPasswordSchema) {
    requestReset(email);
  }

  function goToLogin() {
    switchView("login");
  }

  return (
    <>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

      <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[900px] rounded-2xl overflow-hidden shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        <div className="flex min-h-[480px]">
          <div className="hidden md:flex flex-col items-start justify-between w-[45%] bg-[#F0F4FF] p-6">
            <Image
              src="/logo/logo.svg"
              alt="Daju Bhai Pharmacy"
              width={200}
              height={200}
              className="h-20 w-auto"
            />
            <div className="flex-1 flex items-center justify-center w-full py-4">
              <Image
                src="ride/jeep.svg"
                alt="taxi"
                width={340}
                height={320}
                className="w-full max-w-[320px] object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col flex-1 px-6 md:px-8 py-6 md:py-8 bg-white relative">
            <div className="flex items-center justify-between mb-5 md:mb-0">
              <Image
                src="/logo/logo.svg"
                alt="Daju Bhai Pharmacy"
                width={140}
                height={120}
                className="h-20 w-auto md:hidden"
              />
              <DialogPrimitive.Close
                onClick={onClose}
                className="ml-auto md:absolute md:top-4 md:right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors focus:outline-none"
              >
                <X size={18} />
              </DialogPrimitive.Close>
            </div>

            {/* ── Step: email ── */}
            {step === "email" && (
              <>
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => switchView("login")}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#FEA800] transition-colors mb-4"
                  >
                    <ArrowLeft size={14} /> Back to login
                  </button>
                  <h2 className="text-[26px] font-bold text-gray-900 leading-tight">
                    Forgot your password?
                  </h2>
                  <p className="text-[14px] text-gray-500 mt-1 leading-relaxed">
                    Enter the email linked to your account. We&apos;ll send you
                    a temporary password to log in and set a new one.
                  </p>
                </div>

                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-5 flex-1"
                >
                  <FieldGroup>
                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="forgot-email">
                            Email Address
                          </FieldLabel>
                          <div className="relative">
                            <Input
                              {...field}
                              id="forgot-email"
                              type="email"
                              placeholder="you@example.com"
                              className="pr-10 rounded-xl border-gray-200 bg-gray-50 focus-visible:ring-[#FEA800] focus-visible:border-[#FEA800] h-11"
                            />
                            <Mail
                              size={16}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-11 rounded-xl bg-[#FEA800] hover:bg-[#FEA801] text-white font-semibold text-[14px] transition-colors disabled:opacity-60"
                  >
                    {isPending ? "Sending…" : "Send Temporary Password"}
                  </Button>

                  <p className="text-center text-[13px] text-gray-500 mt-auto pt-2">
                    Remembered it?{" "}
                    <button
                      type="button"
                      onClick={() => switchView("login")}
                      className="text-[#FEA800] font-semibold hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              </>
            )}

            {/* ── Step: sent confirmation ── */}
            {step === "sent" && (
              <div className="flex flex-col items-center justify-center flex-1 gap-5 text-center px-2">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 size={36} className="text-green-500" />
                </div>

                <div>
                  <h2 className="text-[22px] font-bold text-gray-900 mb-2">
                    Check your inbox!
                  </h2>
                  <p className="text-[14px] text-gray-500 leading-relaxed max-w-[340px]">
                    A temporary password has been sent to{" "}
                    <span className="font-semibold text-gray-800">
                      {sentEmail}
                    </span>
                    . Use it to log in, then go to{" "}
                    <span className="font-semibold text-[#FEA800]">
                      My Profile → Change Password
                    </span>{" "}
                    to set a new secure password immediately.
                  </p>
                </div>

                <div className="w-full max-w-sm bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-left">
                  <p className="text-xs text-amber-700 font-semibold mb-1">
                    ⚠️ Security notice
                  </p>
                  <p className="text-xs text-amber-600 leading-relaxed">
                    The temporary password expires in{" "}
                    <strong>15 minutes</strong>. You will be asked to change it
                    immediately after logging in.
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={goToLogin}
                  className="w-full max-w-sm h-11 rounded-xl bg-[#FEA800] hover:bg-[#FEA801] text-white font-semibold text-[14px]"
                >
                  Login with Temporary Password
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    form.reset();
                    setStep("email");
                  }}
                  className="text-[13px] text-gray-400 hover:text-[#FEA800] transition-colors"
                >
                  Didn&apos;t receive the email? Try again
                </button>
              </div>
            )}
          </div>
        </div>
      </DialogPrimitive.Content>
    </>
  );
}
