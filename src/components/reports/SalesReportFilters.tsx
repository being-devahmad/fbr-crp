"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FileBarChart2, Loader2, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { getAllAccounts } from "@/actions/account"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import type { DateRange } from "react-day-picker"
import { DayPicker } from "react-day-picker"

interface SalesReportFiltersProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onGenerateReport: (filters: any) => Promise<void>
    isLoading: boolean
}

interface Account {
    id: string
    name: string
    type: string
    code: string
    cnic: string
    branch: string
}

export const SalesReportFilters = ({ onGenerateReport, isLoading }: SalesReportFiltersProps) => {
    const [reportType, setReportType] = useState("monthly")

    // Date states
    const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date())
    const [selectedYear, setSelectedYear] = useState<Date | undefined>(new Date())
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })

    const [accountId, setAccountId] = useState("")
    const [invoiceType, setInvoiceType] = useState("")
    const [status, setStatus] = useState("")

    // State for accounts
    const [accounts, setAccounts] = useState<Account[]>([])
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(false)

    // Fetch accounts on mount
    useEffect(() => {
        const fetchAccounts = async () => {
            setIsLoadingAccounts(true)
            try {
                const response = await getAllAccounts()
                if (response.success) {
                    setAccounts(response.data)
                } else {
                    toast.error("Failed to load accounts")
                }
            } catch (error) {
                console.error("Error loading accounts:", error)
                toast.error("Failed to load accounts")
            } finally {
                setIsLoadingAccounts(false)
            }
        }
        fetchAccounts()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Basic validation
        if (reportType === "monthly" && !selectedMonth) {
            toast.error("Month selection is required")
            return
        }

        if (reportType === "yearly" && !selectedYear) {
            toast.error("Year selection is required")
            return
        }

        if (reportType === "dayToDay" && (!dateRange?.from || !dateRange?.to)) {
            toast.error("Date range is required for daily reports")
            return
        }

        if (!accountId) {
            toast.error("Please select an account")
            return
        }
        if (!invoiceType) {
            toast.error("Please select an invoice type")
            return
        }
        if (!status) {
            toast.error("Please select a status")
            return
        }

        try {
            // Prepare date information based on report type
            let dateInfo = {}

            if (reportType === "monthly" && selectedMonth) {
                const start = startOfMonth(selectedMonth)
                const end = endOfMonth(selectedMonth)
                dateInfo = {
                    startDate: start,
                    endDate: end,
                    month: format(selectedMonth, "MMMM"),
                    year: format(selectedMonth, "yyyy"),
                }
            } else if (reportType === "yearly" && selectedYear) {
                const start = startOfYear(selectedYear)
                const end = endOfYear(selectedYear)
                dateInfo = {
                    startDate: start,
                    endDate: end,
                    year: format(selectedYear, "yyyy"),
                }
            } else if (reportType === "dayToDay" && dateRange?.from && dateRange?.to) {
                dateInfo = {
                    startDate: dateRange.from,
                    endDate: dateRange.to,
                }
            }

            // Map form values to the API schema
            const formData = {
                reportType: reportType === "yearly" ? "yearly" : reportType === "dayToDay" ? "daily" : "monthly",
                filters: {
                    account: accountId,
                    dateRange: dateInfo,
                    invoiceType,
                    status,
                },
            }

            await onGenerateReport(formData)
            toast.success("Your sales report has been successfully created.")
        } catch (error) {
            console.error("Error generating report:", error)
            toast.error("Failed to generate report")
        }
    }

    return (
        <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    {/* Report Type */}
                    <div className="space-y-2">
                        <RadioGroup
                            defaultValue="monthly"
                            className="flex flex-wrap items-center gap-6"
                            onValueChange={setReportType}
                            value={reportType}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="monthly" id="monthly" />
                                <Label htmlFor="monthly" className="font-medium">
                                    Monthly
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yearly" id="yearly" />
                                <Label htmlFor="yearly" className="font-medium">
                                    Yearly
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dayToDay" id="dayToDay" />
                                <Label htmlFor="dayToDay" className="font-medium">
                                    Daily
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Date Selection based on report type */}
                    <div className="space-y-2">
                        {reportType === "monthly" && (
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">Month:</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !selectedMonth && "text-muted-foreground",
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedMonth ? format(selectedMonth, "MMMM yyyy") : <span>Select month</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <div className="p-3">
                                            <DayPicker
                                                mode="single"
                                                selected={selectedMonth}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        // Set day to 1 to ensure we're just tracking month and year
                                                        const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
                                                        setSelectedMonth(firstOfMonth)
                                                    }
                                                }}
                                                month={selectedMonth}
                                                captionLayout="dropdown-buttons"
                                                fromYear={2020}
                                                toYear={2030}
                                                // Hide the day cells and only show month/year selection
                                                modifiers={{ disabled: { before: new Date(0) } }}
                                                onMonthChange={setSelectedMonth}
                                                footer={
                                                    <div className="mt-4 text-center">
                                                        <Button
                                                            variant="outline"
                                                            className="w-full"
                                                            onClick={() => {
                                                                if (selectedMonth) {
                                                                    const popoverClose = document.querySelector("[data-radix-popper-content-wrapper]")
                                                                    if (popoverClose) {
                                                                        ; (popoverClose as HTMLElement).style.display = "none"
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            Select {selectedMonth ? format(selectedMonth, "MMMM yyyy") : ""}
                                                        </Button>
                                                    </div>
                                                }
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}

                        {reportType === "yearly" && (
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">Year:</Label>
                                <Select
                                    onValueChange={(value) => setSelectedYear(new Date(Number.parseInt(value), 0, 1))}
                                    defaultValue={new Date().getFullYear().toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 11 }, (_, i) => 2020 + i).map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {reportType === "dayToDay" && (
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">Date Range:</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !dateRange && "text-muted-foreground",
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateRange?.from ? (
                                                dateRange.to ? (
                                                    <>
                                                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                                    </>
                                                ) : (
                                                    format(dateRange.from, "LLL dd, y")
                                                )
                                            ) : (
                                                <span>Select date range</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={dateRange?.from}
                                            selected={dateRange}
                                            onSelect={setDateRange}
                                            numberOfMonths={2}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}
                    </div>

                    {/* Account Selection */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="account" className="text-sm text-muted-foreground">
                                Account:
                            </Label>
                            <Select onValueChange={setAccountId}>
                                <SelectTrigger id="account">
                                    <SelectValue placeholder="Select Account" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Accounts</SelectItem>
                                    {isLoadingAccounts ? (
                                        <SelectItem value="loading" disabled>
                                            Loading accounts...
                                        </SelectItem>
                                    ) : accounts.length > 0 ? (
                                        accounts.map((account) => (
                                            <SelectItem key={account.id} value={account.id}>
                                                {account.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="none" disabled>
                                            No accounts found
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Invoice Type and Status Filters */}
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="invoiceType" className="text-sm text-muted-foreground">
                                Invoice Type:
                            </Label>
                            <Select onValueChange={setInvoiceType}>
                                <SelectTrigger id="invoiceType">
                                    <SelectValue placeholder="Select Invoice Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Invoice Types</SelectItem>
                                    <SelectItem value="tax">Tax</SelectItem>
                                    <SelectItem value="simple">Simple</SelectItem>
                                    <SelectItem value="detailed">Detailed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-sm text-muted-foreground">
                                Status:
                            </Label>
                            <Select onValueChange={setStatus}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-4 bg-muted/50 border-t border-border">
                    <Button className="w-full" type="submit" disabled={isLoading}>
                        <span className="flex items-center justify-center gap-2">
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileBarChart2 className="h-4 w-4" />}
                            {isLoading ? "Generating..." : "Generate Report"}
                        </span>
                    </Button>
                </div>
            </form>
        </div>
    )
}

