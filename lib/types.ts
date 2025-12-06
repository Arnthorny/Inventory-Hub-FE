export type UserRole = "admin" | "staff" | "intern" | "guest";

export interface User {
  id: string;
  email: string;
  role: UserRole;

  first_name: string;
  last_name: string;
  phone: string;
  is_active: Boolean;

  created_at: Date;
  updated_at: Date;

  last_login: Date;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  quantity?: number;
  category: string;
  location?: string;
  level: UserRole;
  total?: number;
  available: number;
  damaged?: number;
  in_use?: number;
  created_at: Date;
  updated_at: Date;
}

export type RequestStatusUnion =
  | "pending"
  | "approved"
  | "rejected"
  | "returned"
  | "unconfirmed"
  | "overdue";
export interface Request {
  id: string;
  user_id?: string;
  guest_id?: string;
  reason: string;
  status: RequestStatusUnion;
  notes: string | null;
  due_date?: Date;
  created_at: Date;
  items?: Item[];
  updated_at?: Date;
  reviewed_at?: Date;
  reviewed_by?: string;
  returned_at?: Date;

  requester?: string;
  reviewer?: string;
  requester_role?: UserRole;
}

export interface CreateRequestItem extends Item {
  quantity: number;
}

export interface Guest {
  id: string;
  email: string;
  phone: string;

  first_name: string;
  last_name: string;
  created_at: Date;
  is_active: boolean;

  requests: Request[];
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
  role: Exclude<UserRole, "guest">;
  password: string;
  confirm_password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ApiResponseBase {
  success: boolean;
  message: string;
  errors?: object[];
}

export interface ApiResponse<T> extends ApiResponseBase {
  data: T;
}

export interface SignInTokensRes extends ApiResponseBase {
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse extends SignInTokensRes {
  data: User;
}

export interface CreateGuestRequest {
  type: "guest";
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  reason: string;
  due_date?: Date;
}

export interface ItemReq {
  item_id: string;
  quantity: number;
}

export interface CreateUserRequest {
  type: "user";
  target_user_id?: string;
  reason?: string;
  items: ItemReq[];
  due_date?: Date;
}

export interface AdminCreateGuestRequest {
  type: "admin";
  request_id: string;
  reason?: string;
  items: ItemReq[];
  due_date?: Date;
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

export interface PaginatedListBase<T> {
  results: T[];
  total: number;
  offset: number;
  limit: number;
  page: number;
}

export interface PaginatedListResponse<T> extends ApiResponseBase {
  data: PaginatedListBase<T>;
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
  description: string;
  category: string;
  level: UserRole;
  location: string;
  total: number;
  available: number;
  damaged: number;
  in_use: number;
}

export type UpdateItemRequest = Partial<CreateItemRequest>;

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

export interface ResetPasswordBody {
  token: string;
  new_password: string;
  confirm_new_password: string;
}

export interface InventoryItemAnalysis {
  name: string;
  description: string;
  category: string;
  level: "guest" | "intern" | "staff" | "admin";
  available: number;
}

export interface TaskData<T> {
  task_id: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILURE' | 'RETRY' | 'STARTED';
  result: T;
  info: Record<string, string>;
}
