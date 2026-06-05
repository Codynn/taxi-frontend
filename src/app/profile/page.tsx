"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { LuUser, LuMail, LuPhone } from "react-icons/lu";
import { useMutation } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/axios";
import { toast } from "sonner";

interface UpdateProfilePayload {
  name?: string;
  phoneNumber?: string;
}

async function updateProfileApi(payload: UpdateProfilePayload) {
  const { data } = await api.put("/user/me", payload);
  return data;
}

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phoneNumber: user?.phoneNumber ?? "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "phoneNumber") {
      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
      setForm((p) => ({ ...p, phoneNumber: val }));
      return;
    }
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => {
      console.log("Sending payload:", payload); // ← add this
      return updateProfileApi(payload);
    },
    onSuccess: (data) => {
      console.log("Response:", data); // ← add this
      if (token) {
        const updatedUser = { ...user, ...(data?.data ?? {}) };
        setAuth(updatedUser, token);
      }
      toast.success("Profile updated successfully!");
    },
    onError: (error: unknown) => {
      console.error("Error:", error); // ← add this
      const message =
        error instanceof Error ? error.message : "Failed to update profile.";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    if (form.phoneNumber && !/^[9][6-9]\d{8}$/.test(form.phoneNumber)) {
      toast.error("Enter a valid Nepali mobile number (e.g. 98XXXXXXXX).");
      return;
    }

    const nameUnchanged = form.name === (user?.name ?? "");
    const phoneUnchanged = form.phoneNumber === (user?.phoneNumber ?? "");

    if (nameUnchanged && phoneUnchanged) {
      toast.info("No changes to save.");
      return;
    }

    updateProfile({
      name: form.name,
      phoneNumber: form.phoneNumber || undefined,
    });
  };

  const handleDeleteAccount = () => {
    // TODO: confirm + call delete API
    console.log("Delete account");
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 md:px-6">
          <div className="relative mb-3">
            <Image
              src="/about/rectangle.svg"
              alt=""
              width={310}
              height={150}
              className="absolute -top-1 -left-32 z-0 block"
              aria-hidden
            />

            <h1 className="relative z-10 text-[42px] font-semibold font-sora leading-tight text-black">
              Profile
            </h1>
          </div>

          <p className="mb-8 text-[15px] text-gray-600 font-poppins">
            View and Update your profile details.
          </p>

          {/* ── Form ── */}
          <form
            onSubmit={handleSubmit}
            className="max-w-xl flex flex-col gap-5"
          >
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-black font-poppins">
                Full Name
              </label>
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full h-11 pl-4 pr-10 border border-gray-300 rounded-xl text-[14px] font-poppins text-black bg-white focus:outline-none focus:border-[#FEA800] focus:ring-1 focus:ring-[#FEA800]/30 transition placeholder:text-gray-400"
                />
                <LuUser
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Email — read only */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-black font-poppins">
                Email
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  readOnly
                  className="w-full h-11 pl-4 pr-10 border border-gray-200 rounded-xl text-[14px] font-poppins text-gray-400 bg-gray-100 cursor-not-allowed focus:outline-none"
                />
                <LuMail
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-black font-poppins">
                Phone Number
              </label>
              <div className="relative">
                <input
                  name="phoneNumber"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="98XXXXXXXX"
                  inputMode="numeric"
                  maxLength={10}
                  className="w-full h-11 pl-4 pr-10 border border-gray-300 rounded-xl text-[14px] font-poppins text-black bg-white focus:outline-none focus:border-[#FEA800] focus:ring-1 focus:ring-[#FEA800]/30 transition placeholder:text-gray-400"
                />
                <LuPhone
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4 mt-1">
              <button
                type="submit"
                disabled={isPending}
                className="bg-[#FEA800] hover:bg-[#e09700] text-black font-semibold font-poppins text-[14px] px-8 py-2.5 rounded-full transition-colors disabled:opacity-60"
              >
                {isPending ? "Saving…" : "Update Profile"}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold font-poppins text-[14px] px-8 py-2.5 rounded-full transition-colors"
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
