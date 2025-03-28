"use client"

import { useEffect, useState, useCallback } from "react"
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, MoreHorizontal, Plus, Search} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { ConfirmationModal } from "@/components/modals/ConfirmationModal"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ApiResponse, PaginationData, UserType } from "@/types"
import { TableSkeleton } from "@/components/skeletons/TableSkeleton"

// Define types for our API response


export type SortField = "name" | "email"
export type SortDirection = "asc" | "desc"


export default function UsersPage() {
  // Search state
  const [searchTerm, setSearchTerm] = useState("")

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  // Debounced search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10) // Fixed to match API's default

  // Sorting states
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // API data states
  const [users, setUsers] = useState<UserType[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch users from API with server-side pagination
  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Build the API URL with query parameters
      const url = new URL("/api/users", window.location.origin)
      url.searchParams.append("page", currentPage.toString())
      url.searchParams.append("limit", itemsPerPage.toString())

      // Add search parameter if provided
      if (debouncedSearchTerm) {
        url.searchParams.append("search", debouncedSearchTerm)
      }

      // Add sort parameters
      url.searchParams.append("sortField", sortField)
      url.searchParams.append("sortDirection", sortDirection)

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users")
      console.error("Error fetching users:", err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, itemsPerPage, debouncedSearchTerm, sortField, sortDirection])

  // Fetch users when dependencies change
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Handle sort
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) return null
    return sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
  }
  // Open delete confirmation modal
  const openDeleteModal = (id: string) => {
    setUserToDelete(id)
    setDeleteModalOpen(true)
  }

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setUserToDelete(null)
  }

  // Handle delete user confirmation
  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/users/${userToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      // Refresh the users list after successful deletion
      await fetchUsers()

      // Show success toast notification
      toast.success("The user has been successfully deleted.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user")
      console.error("Error deleting user:", err)

      // Show error toast notification
      toast.error("Failed to delete the user. Please try again.")
    } finally {
      setIsLoading(false)
      closeDeleteModal()
    }
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="grid gap-6 p-5">
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage your system users</p>
        </div>
        <Button>
          <Link href={"/users/create"} className="flex justify-center items-center gap-3">
            <Plus className="mr-2 h-4 w-4" />
            <span>Add User</span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            A list of all users in your system. You can sort, filter and manage users from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                  }}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
                      <div className="flex items-center">
                        Email
                        {renderSortIcon("email")}
                      </div>
                    </TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableSkeleton />
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user._id}>
                        {/* <TableCell className="font-medium">{user.image}</TableCell> */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.image} alt={user.name} />
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Link href={`/dashboard/users/${user._id}/manage`}>
                                  <span>Manage Access</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>Edit user</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => openDeleteModal(user._id)}>
                                Delete user
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {pagination && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {users.length > 0 ? (pagination.currentPage - 1) * pagination.limit + 1 : 0} to{" "}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords)} of{" "}
                  {pagination.totalRecords} users
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  <div className="flex items-center gap-1">
                    {pagination.totalPages > 0 &&
                      Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                        let pageNumber = i + 1

                        // Adjust page numbers for pagination with many pages
                        if (pagination.totalPages > 5) {
                          if (currentPage > 3 && currentPage < pagination.totalPages - 1) {
                            pageNumber = currentPage - 2 + i
                          } else if (currentPage >= pagination.totalPages - 1) {
                            pageNumber = pagination.totalPages - 4 + i
                          }
                        }

                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="icon"
                            onClick={() => setCurrentPage(pageNumber)}
                            className="h-8 w-8"
                            disabled={isLoading}
                          >
                            {pageNumber}
                          </Button>
                        )
                      })}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                    disabled={currentPage === pagination.totalPages || isLoading}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

