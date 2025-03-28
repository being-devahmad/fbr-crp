"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { InvoiceFormState, InvoiceItem } from "@/types"

interface ShippingDetailsProps {
    formState: InvoiceFormState
    updateField: (field: keyof InvoiceFormState, value: string | InvoiceItem[] | boolean) => void
}

export function ShippingDetails({ formState, updateField }: ShippingDetailsProps) {
    return (
        <Card className="shrink-0">
            <CardHeader >
                <CardTitle className="text-base sm:text-lg">Shipping Information</CardTitle>
                <CardDescription className="text-xs">Enter shipping details for this invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label htmlFor="barCode" className="text-xs">
                            Bar Code
                        </Label>
                        <Input
                            id="invoiceBarCode"
                            value={formState.barCode}
                            onChange={(e) => updateField("barCode", e.target.value)}
                            placeholder="Enter bar code"
                            className="h-8 text-xs"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="cartons" className="text-xs">
                            Cartons
                        </Label>
                        <Input
                            id="cartons"
                            type="number"
                            min="0"
                            value={formState.cartons}
                            onChange={(e) => updateField("cartons", e.target.value)}
                            placeholder="Enter number of cartons"
                            className="h-8 text-xs"
                        />
                    </div>
                </div>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label htmlFor="bags" className="text-xs">
                            Bags
                        </Label>
                        <Input
                            id="bags"
                            type="number"
                            min="0"
                            value={formState.bags}
                            onChange={(e) => updateField("bags", e.target.value)}
                            placeholder="Enter number of bags"
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="notes" className="text-xs">
                            Notes
                        </Label>
                        <Input
                            id="notes"
                            value={formState.notes}
                            onChange={(e) => updateField("notes", e.target.value)}
                            placeholder="Enter notes"
                            className="h-8 text-xs"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

