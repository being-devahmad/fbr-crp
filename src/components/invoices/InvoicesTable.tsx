"use client"

import { useState, useCallback, useMemo } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ConfirmationModal } from "@/components/modals/ConfirmationModal"
import { toast } from "sonner"
import { useInvoices } from "@/hooks/use-invoices"
import { AlertCircle } from "lucide-react"
import { InvoicesFilters } from "./InvoicesFilters"
import { InvoicesTableContent } from "./InvoicesTableContent"
import { InvoicesPagination } from "./InvoicesPagination"
import { InvoiceDetailsModal } from "../modals/InvoiceDetailsModal"

export type SortField = "invoiceNumber" | "createdAt" | "account" | "invoiceType" | "items" | "amount" | "status"
export type SortDirection = "asc" | "desc"

export function InvoicesTable() {
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("")
    const [invoiceTypeFilter, setInvoiceTypeFilter] = useState<string>("all")
    const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
    const [currentPage, setCurrentPage] = useState(1)
    const [sortField, setSortField] = useState<SortField>("createdAt")
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

    // Modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)
    const [detailsModalOpen, setDetailsModalOpen] = useState(false)
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

    // Fetch invoices with the custom hook
    const { invoices, pagination, isLoading, error, fetchInvoiceDetails, deleteInvoice } =
        useInvoices({
            page: currentPage,
            limit: 10,
            search: searchTerm,
            type: invoiceTypeFilter !== "all" ? invoiceTypeFilter : undefined,
            date: dateFilter,
            sortField,
            sortDirection,
        })

    // Memoized selected invoice
    const selectedInvoice = useMemo(() => {
        return invoices?.find((invoice: { _id: string | null }) => invoice._id === selectedInvoiceId) || null
    }, [invoices, selectedInvoiceId])

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
        setInvoiceToDelete(id)
        setDeleteModalOpen(true)
    }, [])

    // Close delete confirmation modal
    const closeDeleteModal = useCallback(() => {
        setDeleteModalOpen(false)
        setInvoiceToDelete(null)
    }, [])

    // Handle delete invoice confirmation
    const confirmDeleteInvoice = useCallback(async () => {
        if (!invoiceToDelete) return

        try {
            // Use the deleteInvoice mutation from the hook
            deleteInvoice(invoiceToDelete, {
                onSuccess: () => {
                    toast.success("The invoice has been successfully deleted.")
                    closeDeleteModal()
                },
                onError: (error) => {
                    console.error("Error deleting invoice:", error)
                    toast.error("Failed to delete the invoice. Please try again.")
                    closeDeleteModal()
                },
            })
        } catch (err) {
            console.error("Error deleting invoice:", err)
            toast.error("Failed to delete the invoice. Please try again.")
            closeDeleteModal()
        }
    }, [invoiceToDelete, closeDeleteModal, deleteInvoice])

    // Open invoice details modal
    const openDetailsModal = useCallback(
        async (id: string) => {
            try {
                setSelectedInvoiceId(id)
                await fetchInvoiceDetails(id)
                setDetailsModalOpen(true)
            } catch (err) {
                console.error("Error fetching invoice details:", err)
                toast.error("Failed to load invoice details. Please try again.")
            }
        },
        [fetchInvoiceDetails],
    )

    return (
        <div className="flex flex-col gap-4">
            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDeleteInvoice}
                title="Delete Invoice"
                description="Are you sure you want to delete this invoice? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />

            {/* Invoice Details Modal */}
            <InvoiceDetailsModal
                isOpen={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                invoice={selectedInvoice as any}
            />

            <InvoicesFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                invoiceTypeFilter={invoiceTypeFilter}
                onInvoiceTypeFilterChange={(value) => {
                    setInvoiceTypeFilter(value)
                    setCurrentPage(1)
                }}
                dateFilter={dateFilter}
                onDateFilterChange={(date) => {
                    setDateFilter(date)
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

            <InvoicesTableContent
                invoices={invoices || []}
                isLoading={isLoading}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onViewDetails={openDetailsModal}
                onDeleteInvoice={openDeleteModal}
            />

            {pagination && (
                <InvoicesPagination
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

