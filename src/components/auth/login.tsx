"use client";

import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, X } from "lucide-react";
import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { loginSchema, type LoginSchema } from "@/lib/validations/auth.schema";
import { AUTH_STRINGS } from "@/constants/features/auth.constants";
import { useAuthModal } from "@/context/Authmodalcontext";
import { useLogin } from "@/hooks/useAuthMutations";

export default function LoginModal() {
  const { closeModal, switchView } = useAuthModal();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const { mutate: loginMutate, isPending } = useLogin({
    onSuccess: () => {
      closeModal();
      form.reset();
    },
  });

  const handleGoogleLogin = () => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const redirectTo = `${baseUrl}/oauth/google`;
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    window.location.href = `${apiBase}/auth/initiate-google-auth?role=CUSTOMER&redirectTo=${encodeURIComponent(redirectTo)}`;
  };

  function onSubmit(values: LoginSchema) {
    loginMutate({
      payload: { email: values.email, password: values.password },
      remember: values.rememberMe,
    });
  }

  return (
    <>
      <DialogPrimitive.Overlay className="fixed inset-0   data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

      <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[860px] rounded-2xl overflow-hidden shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        <div className="flex min-h-[540px]">
          {/* Left — full image */}
          <div className="hidden md:block w-[45%] shrink-0 relative">
            <Image
              src="/home/family2.png"
              alt="Happy family in taxi"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Right — form */}
          <div className="flex flex-col flex-1 px-6 md:px-8 py-6 md:py-8 bg-white relative">
            <DialogPrimitive.Close
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-[#FE4830]  transition-colors focus:outline-none"
            >
              <X size={24} />
            </DialogPrimitive.Close>

            <div className="mb-6 mt-2">
              <Image
                src="/logo/logo.svg"
                alt="Popular Rides"
                width={120}
                height={40}
                className="mb-4"
              />
              <h2 className="text-[22px] font-bold font-poppins text-[#000000] leading-tight">
                Welcome Back
              </h2>
              <p className="text-[13px] font-poppins text-[#000000] mt-1">
                Login to continue to your account.
              </p>
            </div>

            <form
              id="login-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2 flex-1"
            >
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="login-email">Email</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          id="login-email"
                          type="email"
                          placeholder="Enter your Email"
                          aria-invalid={fieldState.invalid}
                          className="pr-10 rounded-lg border-none bg-[#F5F5F5] focus-visible:ring-[#FEA800] focus-visible:border-[#FEA800] h-10 text-sm outline-none"
                        />
                        <Mail
                          size={15}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#000000] pointer-events-none"
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="login-password">Password</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          aria-invalid={fieldState.invalid}
                          className="pr-10 rounded-lg border-none bg-[#F5F5F5] focus-visible:ring-[#FEA800] focus-visible:border-[#FEA800] h-10 text-sm outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#000000] hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <div className="flex items-center justify-between">
                <Controller
                  name="rememberMe"
                  control={form.control}
                  render={({ field }) => (
                    <Field
                      orientation="horizontal"
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id="login-remember"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-[#000000] data-[state=checked]:bg-[#FEA800] data-[state=checked]:border-[#FEA800]"
                      />
                      <FieldLabel
                        htmlFor="login-remember"
                        className="text-[16px] font-poppins text-[#000000] cursor-pointer"
                      >
                        Remember me
                      </FieldLabel>
                    </Field>
                  )}
                />
                <button
                  type="button"
                  onClick={() => switchView("forgot-password")}
                  className="text-[16px] text-[#000000] font-poppins hover:text-[#FFB119] transition-colors whitespace-nowrap"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                form="login-form"
                disabled={isPending}
                className="w-full h-10 rounded-full bg-[#FEA800] hover:bg-[#e09600] text-black font-semibold text-[14px] transition-colors disabled:opacity-60"
              >
                {isPending ? "Signing in…" : "Login"}
              </Button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[11px] text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-10 rounded-full border-2 border-[#FFB119] text-gray-700 font-medium text-[13px] flex items-center gap-2.5 hover:bg-gray-50 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                Login with Google
              </Button>

              <p className="text-center text-[16px] font-poppins text-[#000000] mt-auto pt-1">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchView("register")}
                  className="text-[#FEA800] font-semibold hover:underline"
                >
                  Register
                </button>
              </p>
            </form>
          </div>
        </div>
      </DialogPrimitive.Content>
    </>
  );
}
