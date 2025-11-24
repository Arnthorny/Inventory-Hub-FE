"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"
import { MoreHorizontal } from "lucide-react"

interface UserTableProps {
  users: User[]
  onRoleChange?: (userId: string, newRole: string) => Promise<void>
  onDelete?: (userId: string) => Promise<void>
}

const roles = ["admin", "staff", "intern", "guest"]

export function UserTable({ users, onRoleChange, onDelete }: UserTableProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell>
                  <p className="font-medium text-sm">{user.email}</p>
                </TableCell>
                <TableCell>
                  <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium">
                    {user.role}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {roles.map((role) => (
                        <DropdownMenuItem
                          key={role}
                          onClick={() => onRoleChange?.(user.id, role)}
                          className={user.role === role ? "bg-muted" : ""}
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete?.(user.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
