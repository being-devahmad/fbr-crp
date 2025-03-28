"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

import ReportsTable from "@/components/reports/ReportsTable"
import { SalesReportFilters } from "@/components/reports/SalesReportFilters"

export default function SalesReport() {
    const [reportData, setReportData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasGenerated, setHasGenerated] = useState(false)
    const [lastFilters, setLastFilters] = useState(null)

    const fetchReports = async () => {
        try {
            const res = await fetch("/api/reports", {
                method: "GET",
            })
            const data = await res.json()
            console.log("data------>", data)
            setReportData(data)
        } catch (error) {
            console.error("Error fetching reports:", error)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleGenerateReport = async (filters: any) => {
        setIsLoading(true)
        setLastFilters(filters)

        try {
            // Call our new API endpoint for generating a report
            const response = await fetch("/api/reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // Include generatedBy in your filters if required by your API logic.
                body: JSON.stringify({ ...filters, generatedBy: "currentUser" }),
            })

            const result = await response.json()
            console.log("result-->", result)

            if (!response.ok) {
                throw new Error(result.message || "Failed to generate report")
            }

            // Optionally, you can show a toast or success message here.
            // After generating the report, refresh the reports list.
            await fetchReports()
            setHasGenerated(true)
        } catch (error) {
            console.error("Error generating report:", error)
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
