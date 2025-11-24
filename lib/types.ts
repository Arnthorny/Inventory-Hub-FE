export type UserRole = "admin" | "staff" | "intern" | "guest"

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Item {
  id: string
  name: string
  description: string | null
  category: string | null
  available: number
  damaged: number
  in_use: number
  level: UserRole // new field for access level
  created_at: string
  updated_at: string
}

export interface Request {
  id: string
  user_id: string
  status: "pending" | "approved" | "rejected" | "returned"
  notes: string | null
  due_date: string | null
  created_at: string
  updated_at: string
}

export interface RequestItem {
  id: string
  request_id: string
  item_id: string
  quantity: number
  returned_quantity: number | null
  created_at: string
}

export interface Guest {
  id: string
  email: string
  name: string | null
  created_at: string
  expires_at: string | null
}

export interface EmailLog {
  id: string
  recipient_email: string
  subject: string
  sent_at: string
  status: string
}
