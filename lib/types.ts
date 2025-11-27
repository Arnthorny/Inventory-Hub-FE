export type UserRole = "admin" | "staff" | "intern" | "guest";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;

  first_name: string;
  last_name: string;
  phone: string;

  last_login: Date;
}

export interface Item {
  id: string;
  name: string;
  description: string | null;
  available?: number;
  total?: number;
  damaged?: number;
  in_use?: number;
  level: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Request {
  id: string;
  user_id?: string;
  guest_id?: string;
  request_text: string;
  status: "pending" | "approved" | "rejected" | "returned" | "unconfirmed";
  notes: string | null;
  due_date: string | null;
  created_at: Date;
  items?: Item[];
  updated_at: Date;
  reviewed_at?: Date;
  reviewed_by?: string;
  returned_at?: Date;
}

export interface RequestItem {
  id: string;
  request_id: string;
  item_id: string;
  quantity: number;
  returned_quantity: number | null;
  created_at: string;
}

export interface Guest {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface EmailLog {
  id: string;
  recipient_email: string;
  subject: string;
  sent_at: string;
  status: string;
}

export interface SignupFormData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: "intern" | "staff" | "admin";
  password: string;
  confirm_password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ResponseBase {
  success: boolean;
  message: string;
}

export interface SignInTokensRes extends ResponseBase {
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse extends SignInTokensRes {
  data: any;
}

export interface SignupResponse extends ResponseBase {
  data: any;
}

export interface CreateGuestRequest {
  type: "guest";
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  request_text: string;
}

interface ItemReq {
  item_id: string;
  quantity: number;
}

export interface CreateUserRequest {
  type: "user";
  request_text?: string;
  items: ItemReq[];
}

export interface AdminCreateGuestRequest {
  type: "admin";
  request_id: string;
  request_text?: string;
  items: ItemReq[];
}

export type CreateRequestBody =
  | CreateGuestRequest
  | CreateUserRequest
  | AdminCreateGuestRequest;

export interface DashboardStats {
  total_items: number;
  total_units: number | null;
  total_pending_requests: number;
  total_approved_requests: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: "success" | "error";
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  status: "success" | "error";
  error?: string;
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
}

// Items
export interface CreateItemRequest {
  name: string;
  description?: string;
  category?: string;
  available?: number;
  damaged?: number;
  in_use?: number;
}

export interface UpdateItemRequest {
  name?: string;
  description?: string;
  category?: string;
  available?: number;
  damaged?: number;
  in_use?: number;
}

// Requests
export interface CreateRequestItemRequest {
  item_id: string;
  quantity: number;
}

export interface CreateRequestRequest {
  items: CreateRequestItemRequest[];
  notes?: string;
}

export interface UpdateRequestRequest {
  status?: "pending" | "approved" | "rejected" | "returned";
  notes?: string;
}

export interface UpdateRequestItemRequest {
  returned_quantity?: number;
}
