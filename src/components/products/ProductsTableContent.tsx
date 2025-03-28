"use client"

import { memo, useEffect, useState } from "react"
import { ArrowDown, ArrowUp, MoreHorizontal } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableSkeleton } from "../skeletons/TableSkeleton"
import { SortDirection, SortField } from "./ProductsTable"

interface Product {
    _id: string
    name: string
    category: string
    categoryName?: string  // Added field for category name
    salesTax: number
}

interface Category {
    _id: string
    name: string
}




interface ProductsTableContentProps {
    products: Product[]
    isLoading: boolean
    sortField: SortField
    sortDirection: SortDirection
    onSort: (field: SortField) => void
    onViewDetails: (id: string) => void
    onDeleteProduct: (id: string) => void
    categories: Category[]
}

export const ProductsTableContent = memo(function ProductsTableContent({
    products,
    isLoading,
    sortField,
    sortDirection,
    onSort,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onViewDetails,
    onDeleteProduct,
    categories
}: ProductsTableContentProps) {
    // Add client-side only state to prevent hydration mismatch
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        console.log("prodcuts->", products)
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
                                Product Name
                                {renderSortIcon("name")}
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => onSort("categoryName")}>
                            <div className="flex items-center">
                                Category
                                {renderSortIcon("categoryName")}
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => onSort("salesTax")}>
                            <div className="flex items-center">
                                Sales Tax
                                {renderSortIcon("salesTax")}
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
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                {/* <TableCell>{product.categoryName || product.category}</TableCell> */}
                                <TableCell>
                                    {categories.find((c) => c._id === product.category)?.name || product.category}
                                </TableCell>
                                <TableCell>{product.salesTax}</TableCell>
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
                                            {/* <DropdownMenuItem onClick={() => onViewDetails(product._id)}>View details</DropdownMenuItem> */}
                                            <DropdownMenuItem className="text-destructive" onClick={() => onDeleteProduct(product._id)}>
                                                Delete product
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No products found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
})