"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Clock, Clock3 } from "lucide-react";

export const completeBookingSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(60, "Full name is too long"),
  contactNumber: z
    .string()
    .regex(
      /^[9][6-9]\d{8}$/,
      "Enter a valid Nepali mobile number (e.g. 98XXXXXXXX)",
    ),
  email: z.string().email("Enter a valid email address"),
  pickupLocation: z.string().min(3, "Pickup location is required"),
  pickupTime: z.string().min(1, "Pickup time is required"),
  dropoffLocation: z.string().min(3, "Dropoff location is required"),
  message: z.string().max(500, "Message is too long").optional(),
});

export type CompleteBookingFormValues = z.infer<typeof completeBookingSchema>;

interface CompleteBookingFormProps {
  onSubmit: (values: CompleteBookingFormValues) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CompleteBookingFormValues>;
}

// Shared input className — no border, no outline, bg matches card
const inputCls =
  "border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none shadow-none bg-white rounded-xl h-11 text-[14px] font-poppins placeholder:text-[#7E7E7E] [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#000000]";

const textareaCls =
  "border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none shadow-none bg-white rounded-xl h-11 text-[14px] font-poppins placeholder:text-[#7E7E7E] resize-none [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#000000]";

export default function CompleteBookingForm({
  onSubmit,
  isSubmitting = false,
  defaultValues,
}: CompleteBookingFormProps) {
  const form = useForm<CompleteBookingFormValues>({
    resolver: zodResolver(completeBookingSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      email: "",
      pickupLocation: "",
      pickupTime: "",
      dropoffLocation: "",
      message: "",
      ...defaultValues,
    },
  });

  return (
    <div className="rounded-2xl bg-[#f5f5f5] p-6 font-poppins">
      <h2 className="text-[20px] font-bold text-black font-sora mb-5">
        Complete Your Booking Details
      </h2>

      <form id="complete-booking-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Full Name */}
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="fullName"
                  placeholder="Eg. John Doe"
                  aria-invalid={fieldState.invalid}
                  autoComplete="name"
                  className={inputCls}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Contact + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="contactNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contactNumber">
                    Contact Number <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="contactNumber"
                    placeholder="98XXXXXXXX"
                    inputMode="numeric"
                    maxLength={10}
                    aria-invalid={fieldState.invalid}
                    className={inputCls}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      field.onChange(val);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Eg. JohnDoe@gmail.com"
                    aria-invalid={fieldState.invalid}
                    autoComplete="email"
                    className={inputCls}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Pickup Location + Pickup Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="pickupLocation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="pickupLocation">
                    Pickup Location <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="pickupLocation"
                    placeholder="Enter pickup location"
                    aria-invalid={fieldState.invalid}
                    className={inputCls}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="pickupTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="pickupTime">Pickup Time</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="pickupTime"
                      placeholder="Eg. 11:00 AM"
                      aria-invalid={fieldState.invalid}
                      className={`${inputCls} pr-10`}
                    />
                    <Clock3 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Dropoff Location */}
          <Controller
            name="dropoffLocation"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="dropoffLocation">
                  Dropoff Location <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="dropoffLocation"
                  placeholder="Enter dropoff location"
                  aria-invalid={fieldState.invalid}
                  className={inputCls}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Message */}
          <Controller
            name="message"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <InputGroupTextarea
                  {...field}
                  id="message"
                  placeholder="Enter your inquiry message here"
                  rows={4}
                  aria-invalid={fieldState.invalid}
                  className={textareaCls}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <div className="mt-5">
        <Button
          type="submit"
          form="complete-booking-form"
          disabled={isSubmitting}
          className="bg-[#FEA800] hover:bg-[#e09700] text-black font-semibold font-poppins text-[14px] rounded-full px-8 py-3 h-auto transition-colors disabled:opacity-60"
        >
          {isSubmitting ? "Processing..." : "Continue to Payment"}
        </Button>
      </div>
    </div>
  );
}
