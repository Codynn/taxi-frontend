"use client";

import { useState } from "react";
import { LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

async function changePasswordApi(payload: ChangePasswordPayload) {
  const { data } = await api.put("/user/me/password", payload);
  return data;
}

function PasswordInput({
  name,
  value,
  onChange,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full h-11 pl-4 pr-20 border border-gray-300 rounded-xl text-[14px] font-poppins text-black bg-white focus:outline-none focus:border-[#FEA800] focus:ring-1 focus:ring-[#FEA800]/30 transition placeholder:text-gray-400"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="text-gray-400 hover:text-gray-600 transition"
          tabIndex={-1}
        >
          {show ? <LuEyeOff size={16} /> : <LuEye size={16} />}
        </button>
        <LuLock size={15} className="text-gray-300 pointer-events-none" />
      </div>
    </div>
  );
}

export default function ChangePasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: changePasswordApi,
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to change password.";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.currentPassword) {
      toast.error("Enter your current password.");
      return;
    }

    if (form.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    if (form.newPassword === form.currentPassword) {
      toast.error("New password must differ from the current one.");
      return;
    }

    changePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-black font-poppins">
          Current Password
        </label>
        <PasswordInput
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          placeholder="Enter current password"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-black font-poppins">
          New Password
        </label>
        <PasswordInput
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="Min. 8 characters"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-black font-poppins">
          Confirm New Password
        </label>
        <PasswordInput
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter new password"
        />
      </div>

      <div className="mt-1">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#FEA800] hover:bg-[#e09700] text-black font-semibold font-poppins text-[14px] px-8 py-2.5 rounded-full transition-colors disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Change Password"}
        </button>
      </div>
    </form>
  );
}
