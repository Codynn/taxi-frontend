"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TREK_DESTINATIONS } from "@/constants/features/contact.constants";

/* ── Shared underline-only input style ─────────────────────────────────── */
const inputCls = [
  "w-full bg-transparent border-0 border-b border-gray-300 rounded-none shadow-none",
  "py-2 px-0 text-gray-800 placeholder-gray-400 outline-none",
  "focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#22784E]",
  "transition-colors duration-200 text-sm font-montserrat",
].join(" ");

export default function InquiryForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    destination: "",
    travelDate: "",
    travelers: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Form heading */}
      <h3 className="font-sora font-bold text-[#22784E] text-lg sm:text-xl m-0">
        Send an Inquiry
      </h3>

      {/* Full Name */}
      <div className="flex flex-col gap-1">
        <Label className="text-gray-700 text-xs font-semibold font-montserrat">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          className={inputCls}
          required
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <Label className="text-gray-700 text-xs font-semibold font-montserrat">
          Email
        </Label>
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className={inputCls}
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1">
        <Label className="text-gray-700 text-xs font-semibold font-montserrat">
          Phone / WhatsApp <span className="text-red-500">*</span>
        </Label>
        <Input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          className={inputCls}
          required
        />
      </div>

      {/* Destination */}
      <div className="flex flex-col gap-1">
        <Label className="text-gray-700 text-xs font-semibold font-montserrat">
          Interested Trek / Destination <span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={(val) =>
            setForm((prev) => ({ ...prev, destination: val as string }))
          }
        >
          <SelectTrigger
            className="w-full bg-transparent border-0 border-b border-gray-300 rounded-none
              shadow-none px-0 py-2 h-auto text-sm font-montserrat text-gray-500
              focus:ring-0 focus:ring-offset-0 focus:border-[#22784E] transition-colors duration-200"
          >
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {TREK_DESTINATIONS.map((d) => (
              <SelectItem
                key={d}
                value={d}
                className="font-montserrat text-sm cursor-pointer"
              >
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Travel Date */}
      <div className="flex flex-col gap-1">
        <Label className="text-gray-700 text-xs font-semibold font-montserrat">
          Preferred Travel Date <span className="text-red-500">*</span>
        </Label>
        <Input
          type="date"
          name="travelDate"
          value={form.travelDate}
          onChange={handleChange}
          className={inputCls}
          required
        />
      </div>

      {/* Travelers */}
      <div className="flex flex-col gap-1">
        <Label className="text-gray-700 text-xs font-semibold font-montserrat">
          Number of Travelers <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          name="travelers"
          value={form.travelers}
          onChange={handleChange}
          placeholder="Enter number of travelers"
          min={1}
          className={inputCls}
          required
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1">
        <Label className="text-gray-700 text-xs font-semibold font-montserrat">
          Message
        </Label>
        <Textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Enter your message"
          rows={3}
          className={[inputCls, "resize-none"].join(" ")}
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        className={[
          "group relative overflow-hidden mt-2 self-start",
          "inline-flex items-center gap-3",
          "bg-[#22784E] text-white border-0",
          "rounded-full pl-5 pr-2 py-2 h-auto",
          "font-sora font-semibold text-sm tracking-wide",
          "transition-all duration-300 cursor-pointer shadow-none",
        ].join(" ")}
      >
        {/* Curved fill on hover */}
        <span
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <span
            className={[
              "absolute left-1/2 top-full -translate-x-1/2",
              "w-[220%] h-[600%] rounded-[50%] bg-white",
              "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "group-hover:-translate-y-[20%]",
            ].join(" ")}
          />
        </span>

        <span className="relative z-10 transition-colors duration-300 text-white group-hover:text-[#22784E]">
          Send Message
        </span>

        <span className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 group-hover:bg-[#22784E] transition-colors duration-300 flex-shrink-0">
          <ArrowRight
            className="w-4 h-4 text-[#22784E] group-hover:text-white transition-colors duration-300 group-hover:translate-x-0.5"
            strokeWidth={2.5}
          />
        </span>
      </Button>
    </div>
  );
}
