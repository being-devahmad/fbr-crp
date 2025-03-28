"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FileBarChart2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { getAllAccounts } from "@/actions/account"
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
    // New state for new fields based on the schema
    const [reportName, setReportName] = useState("")
    const [reportType, setReportType] = useState("monthly")
    const [month, setMonth] = useState("")
    const [year, setYear] = useState(new Date().getFullYear().toString())
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
        if (!reportName) {
            toast.error("Report name is required")
            return
        }
        if (!year) {
            toast.error("Year is required")
            return
        }
        if (reportType !== "yearly" && !month) {
            toast.error("Month is required for daily and monthly reports")
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
            // Map form values to the new API schema
            // The backend can convert month/year to a dateRange (startDate & endDate) as needed.
            const formData = {
                reportName,
                reportType: reportType === "yearly" ? "yearly" : reportType === "dayToDay" ? "daily" : "monthly",
                filters: {
                    account: accountId,
                    // For simplicity, we pass month and year and let the backend calculate start/end dates.
                    dateRange: {
                        month: reportType !== "yearly" ? month : undefined,
                        year
                    },
                    invoiceType,
                    status
                }
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
                    {/* Report Name */}
                    <div className="space-y-2">
                        <Label htmlFor="reportName" className="text-sm text-muted-foreground">
                            Report Name:
                        </Label>
                        <Input
                            id="reportName"
                            placeholder="Enter Report Name"
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Report Type */}
                    <div className="space-y-2">
                        <RadioGroup
                            defaultValue="monthly"
                            className="flex flex-wrap items-center gap-6"
                            onValueChange={setReportType}
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

                    {/* Date Period */}
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                            {reportType !== "yearly" && (
                                <div className="space-y-2">
                                    <Label htmlFor="month" className="text-sm text-muted-foreground">
                                        Month:
                                    </Label>
                                    <Select onValueChange={setMonth} required={reportType !== "yearly"}>
                                        <SelectTrigger id="month">
                                            <SelectValue placeholder="Select Month" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="january">January</SelectItem>
                                            <SelectItem value="february">February</SelectItem>
                                            <SelectItem value="march">March</SelectItem>
                                            <SelectItem value="april">April</SelectItem>
                                            <SelectItem value="may">May</SelectItem>
                                            <SelectItem value="june">June</SelectItem>
                                            <SelectItem value="july">July</SelectItem>
                                            <SelectItem value="august">August</SelectItem>
                                            <SelectItem value="september">September</SelectItem>
                                            <SelectItem value="october">October</SelectItem>
                                            <SelectItem value="november">November</SelectItem>
                                            <SelectItem value="december">December</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <div className={`${reportType !== "yearly" ? "" : "col-span-2"} space-y-2`}>
                                <Label htmlFor="year" className="text-sm text-muted-foreground">
                                    Year:
                                </Label>
                                <Input
                                    id="year"
                                    placeholder="Enter Year"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
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
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <FileBarChart2 className="h-4 w-4" />
                            )}
                            {isLoading ? "Generating..." : "Generate Report"}
                        </span>
                    </Button>
                </div>
            </form>
        </div>
    )
}
