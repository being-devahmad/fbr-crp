"use client"

import { memo, useEffect, useState } from "react"
import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SortDirection, SortField } from "./InvoicesTable"
import { Invoice } from "@/types"
import { TableSkeleton } from "../skeletons/TableSkeleton"



interface InvoicesTableContentProps {
    invoices: Invoice[]
    isLoading: boolean
    sortField: SortField
    sortDirection: SortDirection
    onSort: (field: SortField) => void
    onViewDetails: (id: string) => void
    onDeleteInvoice: (id: string) => void
}

export const InvoicesTableContent = memo(function InvoicesTableContent({
    invoices,
    isLoading,
    sortField,
    sortDirection,
    onSort,
    onViewDetails,
    onDeleteInvoice,
}: InvoicesTableContentProps) {
    // Client-side only state to prevent hydration mismatch
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Render sort icon
    const renderSortIcon = (field: SortField) => {
        if (field !== sortField) return null
        return sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
    }

    // Get badge variant based on status
    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "paid":
                return "default"
            case "pending":
                return "secondary"
            case "cancelled":
                return "destructive"
            default:
                return "outline"
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px] cursor-pointer" onClick={() => onSort("invoiceNumber")}>
                            <div className="flex items-center">Invoice #{renderSortIcon("invoiceNumber")}</div>
                        </TableHead>
                        <TableHead className="w-[150px] cursor-pointer" onClick={() => onSort("createdAt")}>
                            <div className="flex items-center">
                                Date
                                {renderSortIcon("createdAt")}
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => onSort("account")}>
                            <div className="flex items-center">
                                Account
                                {renderSortIcon("account")}
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => onSort("invoiceType")}>
                            <div className="flex items-center">
                                Invoice Type
                                {renderSortIcon("invoiceType")}
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => onSort("items")}>
                            <div className="flex items-center">
                                Items
                                {renderSortIcon("items")}
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => onSort("amount")}>
                            <div className="flex items-center">
                                Amount
                                {renderSortIcon("amount")}
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => onSort("status")}>
                            <div className="flex items-center">
                                Status
                                {renderSortIcon("status")}
                            </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Only show loading state after component has mounted on client */}
                    {isMounted && isLoading ? (
                        <>
                            <TableSkeleton />
                        </>
                    ) : invoices.length > 0 ? (
                        invoices.map((invoice) => (
                            <TableRow key={invoice._id}>
                                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                <TableCell>
                                    {invoice.createdAt
                                        ? new Date(invoice.createdAt).toLocaleDateString("en-GB") // DD/MM/YYYY
                                        : ""}
                                </TableCell>
                                <TableCell>{invoice?.account?.name}</TableCell>
                                <TableCell>{invoice?.invoiceType}</TableCell>
                                <TableCell>{invoice.items.length}</TableCell>
                                <TableCell>PKR {invoice.payment.total.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(invoice.status)}>
                                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                    </Badge>
                                </TableCell>
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
                                            <DropdownMenuItem onClick={() => onViewDetails(invoice._id)}>View details</DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <a href={`/dashboard/invoices/edit/${invoice._id}`}>Edit invoice</a>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive" onClick={() => onDeleteInvoice(invoice._id)}>
                                                Delete invoice
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                                No invoices found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
})

