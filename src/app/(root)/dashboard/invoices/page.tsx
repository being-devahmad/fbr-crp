"use client"

import { useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { InvoicesTable } from "@/components/invoices/InvoicesTable"

export const dynamic = "force-dynamic"

export default function InvoicesPage() {
  useEffect(() => {
    // Simple performance measurement
    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      console.log(`Invoices page rendered in ${endTime - startTime}ms`)
    }
  }, [])

  return (
    <div className="grid gap-6 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage your customer and company invoices</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/invoices/create" className="flex items-center gap-3">
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Invoice</span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>
            A list of all invoices in your system. You can sort, filter and manage invoices from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoicesTable />
        </CardContent>
      </Card>
    </div>
  )
}

