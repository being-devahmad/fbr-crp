"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

import ReportsTable from "@/components/reports/ReportsTable"
import { SalesReportFilters } from "@/components/reports/SalesReportFilters"
import { toast } from "sonner"

interface ReportFilters {
    reportType: "daily" | "monthly" | "yearly"
    filters: {
        account: string
        dateRange: {
            startDate: string
            endDate: string
            month?: string
            year?: string
        }
        invoiceType: string
        status: string
    }
}

export default function SalesReport() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [reportData, setReportData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasGenerated, setHasGenerated] = useState(false)
    const [lastFilters, setLastFilters] = useState<ReportFilters | null>(null)

    const fetchReports = async () => {
        try {
            const response = await fetch('/api/reports')
            if (!response.ok) throw new Error("Failed to fetch reports")
            const data = await response.json()
            console.log("reportsData--->", data)

            setReportData(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Error fetching reports:", error)
            toast.error("Failed to load reports")
        }
    }

    useEffect(() => {
        fetchReports()
    }, [])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleGenerateReport = async (filters: ReportFilters) => {
        setIsLoading(true)
        setLastFilters(filters)

        try {
            const response = await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filters),
            })

            const result = await response.json()
            console.log("reportsData--->", result)

            if (!response.ok) {
                throw new Error(result.message || "Failed to generate report")
            }

            await fetchReports()
            setHasGenerated(true)
            toast.success("Report generated successfully")
        } catch (error) {
            console.error("Error generating report:", error)
            toast.error(error instanceof Error ? error.message : "Failed to generate report")
        } finally {
            setIsLoading(false)
        }
    }

    const handleRefresh = () => {
        if (hasGenerated && lastFilters) {
            // Re-generate and re-fetch reports using the last used filters.
            handleGenerateReport(lastFilters)
        }
    }

    return (
        <div className="max-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Sales Report</h1>
                        <p className="text-muted-foreground mt-1">
                            View and analyze your sales performance
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={handleRefresh}
                            disabled={isLoading || !hasGenerated}
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <SalesReportFilters
                            onGenerateReport={handleGenerateReport}
                            isLoading={isLoading} />
                    </div>
                    <ReportsTable
                        data={reportData}
                        isLoading={isLoading}
                        hasGenerated={hasGenerated} />
                </div>
            </div>
        </div>
    )
}
