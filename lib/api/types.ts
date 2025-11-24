export interface ApiResponse<T> {
  data?: T
  error?: string
  status: "success" | "error"
}

export interface ApiListResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  status: "success" | "error"
  error?: string
}

// Auth
export interface LoginRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  email: string
  password: string
}

// Items
export interface CreateItemRequest {
  name: string
  description?: string
  category?: string
  available?: number
  damaged?: number
  in_use?: number
}

export interface UpdateItemRequest {
  name?: string
  description?: string
  category?: string
  available?: number
  damaged?: number
  in_use?: number
}

// Requests
export interface CreateRequestItemRequest {
  item_id: string
  quantity: number
}

export interface CreateRequestRequest {
  items: CreateRequestItemRequest[]
  notes?: string
}

export interface UpdateRequestRequest {
  status?: "pending" | "approved" | "rejected" | "returned"
  notes?: string
}

export interface UpdateRequestItemRequest {
  returned_quantity?: number
}
