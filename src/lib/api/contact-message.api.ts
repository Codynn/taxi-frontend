import { api } from "../axios";

export interface CreateContactMessagePayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

export async function submitContactMessage(
  payload: CreateContactMessagePayload,
): Promise<void> {
  await api.post("/contact-message/submit", payload);
}
