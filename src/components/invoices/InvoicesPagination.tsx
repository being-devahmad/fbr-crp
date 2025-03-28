"use client"

import { memo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InvoicesPaginationProps {
    currentPage: number
    totalPages: number
    totalRecords: number
    limit: number
    isLoading: boolean
    onPageChange: (page: number) => void
}

export const InvoicesPagination = memo(function InvoicesPagination({
    currentPage,
    totalPages,
    totalRecords,
    limit,
    isLoading,
    onPageChange,
}: InvoicesPaginationProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = []
        let startPage = 1
        let endPage = Math.min(totalPages, 5)

        // Adjust page numbers for pagination with many pages
        if (totalPages > 5) {
            if (currentPage > 3 && currentPage < totalPages - 1) {
                startPage = currentPage - 2
                endPage = currentPage + 2
            } else if (currentPage >= totalPages - 1) {
                startPage = totalPages - 4
                endPage = totalPages
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i)
        }

        return pageNumbers
    }

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                Showing {totalRecords > 0 ? (currentPage - 1) * limit + 1 : 0} to {Math.min(currentPage * limit, totalRecords)}{" "}
                of {totalRecords} invoices
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1 || isLoading}
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                </Button>
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNumber) => (
                        <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="icon"
                            onClick={() => onPageChange(pageNumber)}
                            className="h-8 w-8"
                            disabled={isLoading}
                        >
                            {pageNumber}
                        </Button>
                    ))}
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || isLoading}
                >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                </Button>
            </div>
        </div>
    )
})

