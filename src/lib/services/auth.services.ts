import { api } from "@/lib/axios";
import type { RegisterSchema } from "@/lib/validations/auth.schema";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  photo?: string;
  phoneNumber?: string;
  gender?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
}

export const authService = {
  customerSignup: async (
    dto: Omit<RegisterSchema, "rememberMe">,
  ): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/customer/signup", dto);
    return data;
  },
};
