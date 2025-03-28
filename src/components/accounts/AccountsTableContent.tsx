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
import { TableSkeleton } from "../skeletons/TableSkeleton"

export type SortField = "name" | "code" | "cnic" | "branch" | "type"
export type SortDirection = "asc" | "desc"

interface Account {
    _id: string
    name: string
    code: string
    cnic: string
    branch: string
    type: string
    createdAt: string
}

interface AccountsTableContentProps {
    accounts: Account[]
    isLoading: boolean
    sortField: SortField
    sortDirection: SortDirection
    onSort: (field: SortField) => void
    onViewDetails: (id: string) => void
    onDeleteAccount: (id: string) => void
}

export const AccountsTableContent = memo(function AccountsTableContent({
    accounts,
    isLoading,
    sortField,
    sortDirection,
    onSort,
    onViewDetails,
    onDeleteAccount,
}: AccountsTableContentProps) {
    // Add client-side only state to prevent hydration mismatch
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Render sort icon
    const renderSortIcon = (field: SortField) => {
        if (field !== sortField) return null
        return sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[250px] cursor-pointer" onClick={() => onSort("name")}>
                            <div className="flex items-center">
                                Account Name
                                {renderSortIcon("name")}
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => onSort("code")}>
                            <div className="flex items-center">
                                Code
                                {renderSortIcon("code")}
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => onSort("cnic")}>
                            <div className="flex items-center">
                                CNIC
                                {renderSortIcon("cnic")}
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => onSort("branch")}>
                            <div className="flex items-center">
                                Branch
                                {renderSortIcon("branch")}
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => onSort("type")}>
                            <div className="flex items-center">
                                Type
                                {renderSortIcon("type")}
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

                    ) : accounts.length > 0 ? (
                        accounts.map((account) => (
                            <TableRow key={account._id}>
                                <TableCell className="font-medium">{account.name}</TableCell>
                                <TableCell>{account.code}</TableCell>
                                <TableCell>{account.cnic}</TableCell>
                                <TableCell>{account.branch}</TableCell>
                                <TableCell>
                                    <Badge variant={account.type === "company" ? "default" : "secondary"}>
                                        {account.type === "company" ? "Company" : "Customer"}
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
                                            <DropdownMenuItem onClick={() => onViewDetails(account._id)}>View details</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive" onClick={() => onDeleteAccount(account._id)}>
                                                Delete account
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No accounts found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
})

