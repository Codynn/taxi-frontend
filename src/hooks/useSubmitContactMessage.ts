import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  submitContactMessage,
  CreateContactMessagePayload,
} from "@/lib/api/contact-message.api";

export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: (payload: CreateContactMessagePayload) =>
      submitContactMessage(payload),
    onSuccess: () => {
      toast.success("Message sent!", {
        description: "We'll get back to you soon.",
      });
    },
    onError: () => {
      toast.error("Failed to send message", {
        description: "Please try again later.",
      });
    },
  });
}
