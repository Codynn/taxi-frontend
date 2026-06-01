import { api } from "../axios";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  photo: string | null;
  gender: string | null;
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

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  photo?: string;
  gender?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Endpoints

export async function customerSignup(
  payload: SignupPayload,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/auth/customer/signup",
    payload,
  );
  return data;
}

export async function customerLogin(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/auth/customer/login",
    payload,
  );
  return data;
}
