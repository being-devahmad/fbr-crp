"use client"

import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useInvoiceForm } from "@/hooks/use-invoice-form"
import { AccountInformation } from "@/components/invoices/AccountInfo"
import { ProductForm } from "@/components/invoices/ProductForm"
import { ShippingDetails } from "@/components/invoices/ShippingDetails"
import { InvoiceItemsTable } from "@/components/invoices/InvoiceItemsTable"
import { PaymentDetails } from "@/components/invoices/PaymentDetails"

export default function CreateInvoicePage() {
    const { formState, updateField, subTotal, total, resetProductForm, removeProduct, submitForm, accounts } =
        useInvoiceForm()

    // Ensure invoiceItems is always an array
    const invoiceItems = Array.isArray(formState.invoiceItems) ? formState.invoiceItems : []

    console.log("accounts page-->", accounts)

    return (
        <div className="flex flex-col bg-background h-screen md:overflow-hidden">
            {/* Header - Fixed height */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b p-3 bg-background sm:gap-0 shrink-0">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Create Invoice</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Create a new invoice for a customer or company account
                    </p>
                </div>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                    <Link href="/dashboard/invoices">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Invoices
                    </Link>
                </Button>
            </div>

            {/* Main content - Takes remaining height */}
            <form onSubmit={submitForm} className="flex-1 md:overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 h-full">
                    {/* Left Column */}
                    <div className="flex flex-col gap-3 sm:gap-4 md:overflow-auto">
                        {/* Account Information Section */}
                        <AccountInformation formState={formState} updateField={updateField} accounts={accounts} />

                        {/* Product Form */}
                        <ProductForm formState={formState} updateField={updateField} resetProductForm={resetProductForm} />

                        {/* Shipping Details */}
                        <ShippingDetails formState={formState} updateField={updateField} />
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-3 sm:gap-4">
                        {/* Invoice Items Table - Takes most of the space */}
                        <div className="md:flex-1 h-[200px] md:h-auto">
                            <InvoiceItemsTable items={invoiceItems} onRemoveItem={removeProduct} />
                        </div>

                        {/* Payment Details - Fixed height */}
                        <div className="shrink-0">
                            <PaymentDetails formState={formState} updateField={updateField} subTotal={subTotal} total={total} />
                        </div>

                        {/* Form Actions - Fixed height */}
                        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 shrink-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => (window.location.href = "/dashboard/invoices")}
                                disabled={formState.isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={formState.isSubmitting} className="w-full sm:w-auto">
                                {formState.isSubmitting ? (
                                    <span className="flex items-center gap-1">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Creating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Save className="h-4 w-4" />
                                        Save Invoice
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

