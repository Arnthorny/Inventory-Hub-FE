import type {
  SignupFormData,
  LoginFormData,
  ApiResponse,
  SignInTokensRes,
  User,
  LoginResponse,
  ApiResponseBase,
  ResetPasswordBody,
} from "@/lib/types";
import { ApiError } from "@/lib/errors";
import { cookies, headers } from "next/headers";
import { cache } from "react";

const API_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:7001/api/v1";

export const authService = {
  async login(credentials: LoginFormData): Promise<LoginResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const json = await res.json();
    if (res.ok) return json;

    let errMsg: string = json.errors || json.message || "Signin Failed";
    if (Array.isArray(errMsg)) {
      errMsg = errMsg.map((e: any) => e.msg).join(", ");
    }

    throw new ApiError(errMsg, res.status);
  },

  async signUp(body: SignupFormData): Promise<ApiResponse<User>> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (res.ok) return json;

    let errMsg = json.errors || json.message || "Signup Failed";
    if (Array.isArray(errMsg)) {
      errMsg = errMsg.map((e: any) => e.msg).join(", ");
    }
    throw new ApiError(errMsg, res.status);
  },

  async refreshTokens(token: string): Promise<SignInTokensRes> {
    const res = await fetch(`${API_URL}/auth/tokens/refresh`, {
      method: "POST",
      headers: { "x-refresh-token": token },
    });

    const data = await res.json();
    if (res.ok) return data;

    let errMsg = data.errors || data.message || "Token Refresh Failed";
    if (Array.isArray(errMsg)) {
      errMsg = errMsg.map((e: any) => e.msg).join(", ");
    }
    throw new ApiError(errMsg, res.status);
  },

  async getAccessToken(): Promise<string | undefined> {
    const cookieStore = await cookies();

    const tokenFromCookie = cookieStore.get("access_token")?.value;
    if (tokenFromCookie) return tokenFromCookie;

    const headersList = await headers();
    return headersList.get("x-access-token") || undefined;
  },

  getUser: cache(async (): Promise<User> => {
    const token = await authService.getAccessToken();

    const res = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
        cache: "no-store",
      },
    });

    const json = await res.json();

    if (res.ok) return json.data;

    let errMsg: string = json.errors || json.message || "Signin Failed";

    if (Array.isArray(errMsg)) {
      errMsg = errMsg.map((e: any) => e.msg).join(", ");
    }

    throw new ApiError(errMsg, res.status);
  }),

  async logout(): Promise<ApiResponseBase> {
    const token = await this.getAccessToken();
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) return data;

    let errMsg = data.errors || data.message || "Signup Failed";
    if (Array.isArray(errMsg)) {
      errMsg = errMsg.map((e: any) => e.msg).join(", ");
    }
    throw new ApiError(errMsg, res.status);
  },

  async forgotPassword(email: string): Promise<ApiResponseBase> {
    const res = await fetch(`${API_URL}/auth/passwords/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) return data;

    let errMsg = data.errors || data.message || "Forgot Password failed";
    if (Array.isArray(errMsg)) {
      errMsg = errMsg.map((e: any) => e.msg).join(", ");
    }
    throw new ApiError(errMsg, res.status);
  },

  async resetPassword(body: ResetPasswordBody): Promise<ApiResponseBase> {
    const res = await fetch(`${API_URL}/auth/passwords/set-new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) return data;

    let errMsg = data.errors || data.message || "Reset Password failed";
    if (Array.isArray(errMsg)) {
      errMsg = errMsg.map((e: any) => e.msg).join(", ");
    }
    throw new ApiError(errMsg, res.status);
  },
};
