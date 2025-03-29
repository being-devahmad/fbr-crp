"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { InvoiceFormState, InvoiceItem } from "@/types"

interface PaymentDetailsProps {
    formState: InvoiceFormState
    updateField: (field: keyof InvoiceFormState, value: string | InvoiceItem[] | boolean) => void
    subTotal: number
    total: number
}

export function PaymentDetails({ formState, updateField, subTotal, total }: PaymentDetailsProps) {
    return (
        <Card className="shrink-0">
            <CardHeader >
                <CardTitle className="text-base sm:text-lg">Payment Information</CardTitle>
                <CardDescription className="text-xs">Enter payment details for this invoice</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
                    <div className="space-y-1">
                        <Label htmlFor="expense" className="text-xs">
                            Expense
                        </Label>
                        <Input
                            id="expense"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formState.expense}
                            onChange={(e) => updateField("expense", e.target.value)}
                            placeholder="Enter expense"
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="discount" className="text-xs">
                            Discount
                        </Label>
                        <Input
                            id="discount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formState.discount}
                            onChange={(e) => updateField("discount", e.target.value)}
                            placeholder="Enter discount"
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="space-y-1 col-span-2 md:col-span-1">
                        <Label htmlFor="subTotal" className="text-xs">
                            Sub Total
                        </Label>
                        <Input id="subTotal" value={`${subTotal.toLocaleString()}`} readOnly className="bg-muted h-8 text-xs" />
                    </div>

                    <div className="space-y-1 col-span-2 md:col-span-1 md:col-start-3">
                        <Label htmlFor="total" className="text-xs">
                            Total
                        </Label>
                        <Input id="total" value={`${total.toLocaleString()}`} readOnly className="bg-muted font-bold h-8 text-xs" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

