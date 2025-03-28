"use client"

import { memo } from "react"
import { Search, CalendarIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface InvoicesFiltersProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    invoiceTypeFilter: string
    onInvoiceTypeFilterChange: (value: string) => void
    dateFilter: Date | undefined
    onDateFilterChange: (date: Date | undefined) => void
}

export const InvoicesFilters = memo(function InvoicesFilters({
    searchTerm,
    onSearchChange,
    invoiceTypeFilter,
    onInvoiceTypeFilterChange,
    dateFilter,
    onDateFilterChange,
}: InvoicesFiltersProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search invoices..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn("w-[190px] justify-start text-left font-normal", !dateFilter && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateFilter ? format(dateFilter, "PPP") : <span>Filter by date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={dateFilter} onSelect={onDateFilterChange} initialFocus />
                        </PopoverContent>
                    </Popover>

                    {dateFilter && (
                        <Button variant="ghost" size="icon" onClick={() => onDateFilterChange(undefined)} title="Clear date filter">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Select value={invoiceTypeFilter} onValueChange={onInvoiceTypeFilterChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
})

