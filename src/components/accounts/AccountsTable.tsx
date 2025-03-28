"use client"

import { useState, useCallback, useMemo } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ConfirmationModal } from "@/components/modals/ConfirmationModal"
import { toast } from "sonner"
import { useAccounts } from "@/hooks/use-accounts"
import { AlertCircle } from "lucide-react"
import { AccountsTableContent } from "./AccountsTableContent"
import { AccountsFilters } from "./AccountsFilters"
import { AccountsPagination } from "./AccountsPagination"
import { AccountDetailsModal } from "../modals/AccountDetailModal"

export type SortField = "name" | "code" | "cnic" | "branch" | "type"
export type SortDirection = "asc" | "desc"

export function AccountsTable() {
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("")
    const [accountTypeFilter, setAccountTypeFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [sortField, setSortField] = useState<SortField>("name")
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

    // Modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [accountToDelete, setAccountToDelete] = useState<string | null>(null)
    const [detailsModalOpen, setDetailsModalOpen] = useState(false)
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)

    // Fetch accounts with the custom hook
    const { accounts, pagination, isLoading, error, fetchAccountDetails, deleteAccount, isDeleting } =
        useAccounts({
            page: currentPage,
            limit: 10,
            search: searchTerm,
            type: accountTypeFilter !== "all" ? accountTypeFilter : undefined,
            sortField,
            sortDirection,
        })

    // Memoized selected account
    const selectedAccount = useMemo(() => {
        return accounts?.find((account) => account._id === selectedAccountId) || null
    }, [accounts, selectedAccountId])

    // Handle sort
    const handleSort = useCallback((field: SortField) => {
        setSortField((prevField) => {
            if (prevField === field) {
                setSortDirection((prevDirection) => (prevDirection === "asc" ? "desc" : "asc"))
                return prevField
            }
            setSortDirection("asc")
            return field
        })
    }, [])

    // Open delete confirmation modal
    const openDeleteModal = useCallback((id: string) => {
        setAccountToDelete(id)
        setDeleteModalOpen(true)
    }, [])

    // Close delete confirmation modal
    const closeDeleteModal = useCallback(() => {
        setDeleteModalOpen(false)
        setAccountToDelete(null)
    }, [])

    // Handle delete account confirmation
    const confirmDeleteAccount = useCallback(async () => {
        if (!accountToDelete) return

        try {
            // Use the deleteAccount mutation from the hook with proper callbacks
            deleteAccount(accountToDelete, {
                onSuccess: () => {
                    toast.success("The account has been successfully deleted.")
                    closeDeleteModal()
                },
                onError: (error) => {
                    console.error("Error deleting account:", error)
                    toast.error(error instanceof Error ? error.message : "Failed to delete the account. Please try again.")
                    closeDeleteModal()
                },
            })
        } catch (err) {
            console.error("Error deleting account:", err)
            toast.error("Failed to delete the account. Please try again.")
            closeDeleteModal()
        }
    }, [accountToDelete, closeDeleteModal, deleteAccount])

    // Open account details modal
    const openDetailsModal = useCallback(
        async (id: string) => {
            try {
                setSelectedAccountId(id)
                await fetchAccountDetails(id)
                setDetailsModalOpen(true)
            } catch (err) {
                console.error("Error fetching account details:", err)
                toast.error("Failed to load account details. Please try again.")
            }
        },
        [fetchAccountDetails],
    )

    return (
        <div className="flex flex-col gap-4">
            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDeleteAccount}
                title="Delete Account"
                description="Are you sure you want to delete this account? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />

            {/* Account Details Modal */}
            <AccountDetailsModal
                isOpen={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                account={selectedAccount}
            />

            <AccountsFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                accountTypeFilter={accountTypeFilter}
                onAccountTypeFilterChange={(value) => {
                    setAccountTypeFilter(value)
                    setCurrentPage(1)
                }}
            />

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <AccountsTableContent
                accounts={accounts || []}
                isLoading={isLoading}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onViewDetails={openDetailsModal}
                onDeleteAccount={openDeleteModal}
            />

            {pagination && (
                <AccountsPagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    totalRecords={pagination.totalRecords}
                    limit={pagination.limit}
                    isLoading={isLoading}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    )
}

