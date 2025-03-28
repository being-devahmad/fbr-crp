"use client"

import { memo } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductsFiltersProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    productCategoryFilter: string
    onProductCategoryFilterChange: (value: string) => void
}

export const ProductsFilters = memo(function ProductsFilters({
    searchTerm,
    onSearchChange,
    productCategoryFilter,
    onProductCategoryFilterChange,
}: ProductsFiltersProps) {


    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
            <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2">
                <Select value={productCategoryFilter} onValueChange={onProductCategoryFilterChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
})

