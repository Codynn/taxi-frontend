"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Phone } from "lucide-react";
import {
  contactFormSchema,
  ContactFormValues,
} from "@/lib/validations/contact.schema";
import { useSubmitContactMessage } from "@/hooks/useSubmitContactMessage";
import { useAuthStore } from "@/store/useAuthStore";

const inputWrapperCls =
  "relative flex items-center rounded-xl border-none outline-none bg-[#F5F5F5] px-4 transition-colors duration-200";
const inputCls =
  "w-full bg-transparent border-0 shadow-none py-2.5 px-0 pr-8 text-gray-800 placeholder-gray-400 outline-none focus-visible:ring-0 text-[14px] font-poppins";
const iconCls = "absolute right-0 w-6 h-6 pr-2 text-black pointer-events-none";
const errorCls = "text-red-500 text-xs mt-1 font-poppins";
const labelCls = "block text-[16px] text-black font-poppins mb-1";

export default function InquiryForm() {
  const { mutate, isPending } = useSubmitContactMessage();
  const { user, _hasHydrated } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  useEffect(() => {
    if (!_hasHydrated || !user) return;

    if (user.name) setValue("fullName", user.name);
    if (user.email) setValue("email", user.email);
    if (user.phoneNumber) setValue("phone", user.phoneNumber);
  }, [_hasHydrated, user, setValue]);

  const onSubmit = (data: ContactFormValues) => {
    mutate(
      {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phone ?? "",
        message: data.message ?? "",
      },
      {
        onSuccess: () => reset(),
      },
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-[#808080]/50 p-6 sm:p-8">
      <h3 className="font-poppins font-bold text-black text-[28px] mb-6">
        Send Us a Message
      </h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
        noValidate
      >
        {/* Full Name */}
        <div>
          <label className={labelCls}>Full Name</label>
          <div className={inputWrapperCls}>
            <input
              {...register("fullName")}
              type="text"
              placeholder="Enter your full name"
              className={inputCls}
            />
            <User className={iconCls} strokeWidth={1.5} />
          </div>
          {errors.fullName && (
            <p className={errorCls}>{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className={labelCls}>Email</label>
          <div className={inputWrapperCls}>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className={inputCls}
            />
            <Mail className={iconCls} strokeWidth={1.5} />
          </div>
          {errors.email && <p className={errorCls}>{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className={labelCls}>Phone Number</label>
          <div className={inputWrapperCls}>
            <input
              {...register("phone")}
              type="tel"
              placeholder="Enter your number"
              className={inputCls}
            />
            <Phone className={iconCls} strokeWidth={1.5} />
          </div>
          {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
        </div>

        {/* Message */}
        <div>
          <label className={labelCls}>Message</label>
          <div className={`${inputWrapperCls} items-start`}>
            <textarea
              {...register("message")}
              placeholder="Enter your message"
              rows={4}
              className={`${inputCls} resize-none pr-0`}
            />
          </div>
          {errors.message && (
            <p className={errorCls}>{errors.message.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 bg-[#FEA800] hover:bg-[#e09700] text-black font-poppins font-medium text-[16px] py-3.5 rounded-full transition-colors duration-200 disabled:opacity-60 cursor-pointer"
        >
          {isPending ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
