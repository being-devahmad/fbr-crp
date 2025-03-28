"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Printer } from "lucide-react"
import { formatDate } from "@/utils/formatDate"
import { printInvoice } from "@/utils/printInvoice"

interface InvoiceItem {
    id: string
    productName: string
    quantity: number
    rate: number
    total: number
    [key: string]: string | number
}

interface InvoiceAccount {
    id: string
    name: string
    type: string
    mobileNumber?: string
    accountTag?: string
    creditLimit?: number
    ledgerBalance?: number
    chequeBalance?: number
    totalBalance?: number
    city?: string
}

interface InvoiceShipping {
    barCode?: string
    shipperId?: string
    shipperName?: string
    tellerId?: string
    tellerName?: string
    cartons?: number
    bags?: number
    notes?: string
}

interface InvoicePayment {
    expense?: number
    discount?: number
    subTotal: number
    total: number
}

interface InvoiceDetailsProps {
    isOpen: boolean
    onClose: () => void
    invoice: {
        _id: string
        invoiceNumber: string
        invoiceDate: string
        invoiceType: "simple" | "detailed" | "tax"
        status: "pending" | "paid" | "cancelled"
        account: InvoiceAccount
        items: InvoiceItem[]
        shipping?: InvoiceShipping
        payment: InvoicePayment
        createdAt: string
    } | null
}

export function InvoiceDetailsModal({ isOpen, onClose, invoice }: InvoiceDetailsProps) {
    if (!invoice) return null


    // Get status badge variant
    const getStatusVariant = (status: string) => {
        switch (status) {
            case "paid":
                return "default"
            case "pending":
                return "outline"
            case "cancelled":
                return "destructive"
            default:
                return "default"
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] p-0">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <DialogTitle className="text-xl">Invoice #{invoice.invoiceNumber}</DialogTitle>
                            <DialogDescription className="mt-1">
                                Created on {formatDate(invoice.invoiceDate || invoice.createdAt)}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(80vh-120px)]">
                    <div className="px-3 pt-2 print-container">
                        <div className="print-header">
                            <h1 className="text-xl font-bold">Invoice #{invoice.invoiceNumber}</h1>
                            <p className="text-muted-foreground">Created on {formatDate(invoice.invoiceDate || invoice.createdAt)}</p>
                        </div>
                        {/* Invoice Info and Account Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">INVOICE DETAILS</h3>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Invoice Number:</span>
                                            <span className="font-medium">{invoice.invoiceNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Date:</span>
                                            <span>{formatDate(invoice.invoiceDate || invoice.createdAt)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Type:</span>
                                            <span>{invoice.invoiceType.charAt(0).toUpperCase() + invoice.invoiceType.slice(1)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Status:</span>
                                            <Badge variant={getStatusVariant(invoice.status)}>
                                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">ACCOUNT INFORMATION</h3>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Name:</span>
                                            <span className="font-medium">{invoice.account.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Type:</span>
                                            <span>{invoice.account.type}</span>
                                        </div>
                                        {invoice.account.mobileNumber && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Mobile:</span>
                                                <span>{invoice.account.mobileNumber}</span>
                                            </div>
                                        )}
                                        {invoice.account.city && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">City:</span>
                                                <span>{invoice.account.city}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Items Table */}
                        <h3 className="font-semibold mb-2">Items</h3>
                        <div className="border rounded-md mb-6 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-muted">
                                            <th className="text-left p-3 font-medium">Product</th>
                                            <th className="text-left p-3 font-medium">Category</th>
                                            <th className="text-right p-3 font-medium">Quantity</th>
                                            <th className="text-right p-3 font-medium">Rate</th>
                                            <th className="text-right p-3 font-medium">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map((item, index) => (
                                            <tr key={item.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                                                <td className="p-3">{item.productName}</td>
                                                <td className="p-3">{item.categoryName || "N/A"}</td>
                                                <td className="p-3 text-right">{item.quantity}</td>
                                                <td className="p-3 text-right">{item.rate}</td>
                                                <td className="p-3 text-right font-medium">{item.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Shipping Details (if available) */}
                        {invoice.shipping && (
                            <>
                                <h3 className="font-semibold mb-2">Shipping Details</h3>
                                <Card className="mb-2">
                                    <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {invoice.shipping.shipperName && (
                                            <div>
                                                <span className="text-sm text-muted-foreground">Shipper:</span>
                                                <p>{invoice.shipping.shipperName}</p>
                                            </div>
                                        )}
                                        {invoice.shipping.tellerName && (
                                            <div>
                                                <span className="text-sm text-muted-foreground">Teller:</span>
                                                <p>{invoice.shipping.tellerName}</p>
                                            </div>
                                        )}
                                        {(invoice.shipping.cartons || invoice.shipping.bags) && (
                                            <div>
                                                <span className="text-sm text-muted-foreground">Packaging:</span>
                                                <p>
                                                    {invoice.shipping.cartons ? `${invoice.shipping.cartons} cartons` : ""}
                                                    {invoice.shipping.cartons && invoice.shipping.bags ? ", " : ""}
                                                    {invoice.shipping.bags ? `${invoice.shipping.bags} bags` : ""}
                                                </p>
                                            </div>
                                        )}
                                        {invoice.shipping.notes && (
                                            <div className="sm:col-span-2">
                                                <span className="text-sm text-muted-foreground">Notes:</span>
                                                <p>{invoice.shipping.notes}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {/* Payment Summary */}
                        <div className="flex flex-col sm:flex-row sm:justify-end mb-6">
                            <div className="w-full sm:w-72 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal:</span>
                                    <span>{invoice.payment.subTotal}</span>
                                </div>

                                {invoice.payment.discount !== undefined && invoice.payment.discount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Discount:</span>
                                        <span>-{invoice.payment.discount}</span>
                                    </div>
                                )}

                                {invoice.payment.expense !== undefined && invoice.payment.expense > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Additional Expenses:</span>
                                        <span>{invoice.payment.expense}</span>
                                    </div>
                                )}

                                <Separator />

                                <div className="flex justify-between font-medium text-lg">
                                    <span>Total:</span>
                                    <span>{invoice.payment.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="p-2 border-t">
                    <div className="flex flex-col-reverse sm:flex-row justify-between w-full gap-2">
                        <div className="flex gap-2 mt-2 sm:mt-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 cursor-pointer"
                                onClick={printInvoice}
                            >
                                <Printer className="h-4 w-4" />
                                <span className="hidden sm:inline">Print</span>
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

