"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import type { InvoiceItem } from "@/types"

interface InvoiceItemsTableProps {
    items: InvoiceItem[]
    onRemoveItem: (id: number) => void
}

export function InvoiceItemsTable({ items, onRemoveItem }: InvoiceItemsTableProps) {
    // Ensure items is always an array
    const safeItems = Array.isArray(items) ? items : []

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="shrink-0">
                <CardTitle className="text-base sm:text-lg">Invoice Items</CardTitle>
                <CardDescription className="text-xs">Products added to this invoice</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <div className="rounded-md border h-full flex flex-col">
                    <div className="overflow-auto flex-1">
                        <Table>
                            <TableHeader className="sticky top-0 bg-card z-10">
                                <TableRow>
                                    <TableHead className="text-xs w-[40px]">ID</TableHead>
                                    <TableHead className="text-xs">Product</TableHead>
                                    <TableHead className="text-xs hidden sm:table-cell">Quantity</TableHead>
                                    <TableHead className="text-xs hidden sm:table-cell">Price</TableHead>
                                    <TableHead className="text-xs">Total</TableHead>
                                    <TableHead className="text-right text-xs w-[60px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {safeItems.length > 0 ? (
                                    safeItems.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="text-xs py-2">{index + 1}</TableCell>
                                            <TableCell className="text-xs py-2">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{item.productName}</span>
                                                    <span className="text-xs text-muted-foreground">{item.categoryName}</span>
                                                    <span className="text-xs text-muted-foreground sm:hidden">
                                                        {item.quantity} @ Rs. {item.rate.toLocaleString()}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs py-2 hidden sm:table-cell">{item.quantity}</TableCell>
                                            <TableCell className="text-xs py-2 hidden sm:table-cell">Rs. {item.rate.toLocaleString()}</TableCell>
                                            <TableCell className="text-xs py-2">Rs. {item.total.toLocaleString()}</TableCell>
                                            <TableCell className="text-right text-xs py-2">
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemoveItem(item.id)}>
                                                    <Trash className="h-3 w-3 text-destructive" />
                                                    <span className="sr-only">Remove</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-[100px] text-center">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="64"
                                                    height="64"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="mb-4 opacity-20"
                                                >
                                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                                </svg>
                                                <p>No items added to this invoice yet.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

