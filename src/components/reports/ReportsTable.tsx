"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Mail, Loader2 } from "lucide-react"

interface Report {
    reportType: "daily" | "monthly" | "yearly"
    filtersApplied: {
        account: string
        dateRange?: {
            startDate: string
            endDate: string
            month?: string
            year?: string
        }
    }
    totalInvoices: number
    totalSales: number
    createdAt: string
}

interface ReportsTableProps {
    data?: Report[] // Make data optional
    isLoading: boolean
    hasGenerated: boolean
}

const ReportsTable = ({ data = [], isLoading, hasGenerated }: ReportsTableProps) => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    // Ensure data is always an array
    const safeData = Array.isArray(data) ? data : []
    const totalPages = Math.ceil(safeData.length / itemsPerPage)
    const paginatedData = safeData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    const hasData = paginatedData.length > 0

    useEffect(() => {
        console.log('reportsdata------>', data)
    }, [])

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A"
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
        } catch (e: unknown) {
            console.log("error", e)
            return "Invalid Date"
        }
    }

    // const formatCurrency = (amount: number) => {
    //     return new Intl.NumberFormat("en-US", {
    //         style: "currency",
    //         currency: "USD",
    //     }).format(amount || 0)
    // }

    const getDateRange = (report: Report) => {
        // Handle case where dateRange is undefined
        if (!report.filtersApplied?.dateRange) {
            return formatDate(report.createdAt)
        }

        const { dateRange } = report.filtersApplied

        switch (report.reportType) {
            case "monthly":
                try {
                    return new Date(dateRange.startDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                } catch (e: unknown) {
                    console.log("error", e)
                    return dateRange.month && dateRange.year ? `${dateRange.month} ${dateRange.year}` : "Monthly Report"
                }
            case "yearly":
                try {
                    return new Date(dateRange.startDate).getFullYear().toString()
                } catch (e: unknown) {
                    console.log("error", e)
                    return dateRange.year || "Yearly Report"
                }
            default:
                return `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
        }
    }

    return (
        <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
                <div className="bg-muted/50 px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-medium">Sales Reports</h2>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="font-medium">Report Type</TableHead>
                                <TableHead className="font-medium">Account</TableHead>
                                <TableHead className="font-medium">Date Range</TableHead>
                                <TableHead className="font-medium text-right">Total Invoices</TableHead>
                                <TableHead className="font-medium text-right">Total Sales</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-[300px] text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Loader2 className="h-12 w-12 mb-2 animate-spin" />
                                            <p>Loading report data...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : hasData ? (
                                paginatedData.map((report, index) => (
                                    <TableRow key={index} className="hover:bg-muted/50">
                                        <TableCell className="capitalize">{report.reportType}</TableCell>
                                        <TableCell>{report.filtersApplied?.account || "All Accounts"}</TableCell>
                                        <TableCell>{getDateRange(report)}</TableCell>
                                        <TableCell className="text-right">{report.totalInvoices || 0}</TableCell>
                                        <TableCell className="text-right">{report.totalSales || 0}</TableCell>
                                    </TableRow>
                                ))
                            ) : hasGenerated ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-[300px] text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Mail className="h-12 w-12 mb-2 text-muted-foreground/30" />
                                            <p>No results found</p>
                                            <p className="text-sm mt-1">Try adjusting your filters</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-[300px] text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Mail className="h-12 w-12 mb-2 text-muted-foreground/30" />
                                            <p>No data available</p>
                                            <p className="text-sm mt-1">Generate a report to view details</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/50">
                    <div className="text-sm text-muted-foreground">
                        {hasData
                            ? `Showing ${Math.min(itemsPerPage, paginatedData.length)} of ${safeData.length} entries`
                            : "Showing 0 of 0 entries"}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!hasData || currentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!hasData || currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportsTable

