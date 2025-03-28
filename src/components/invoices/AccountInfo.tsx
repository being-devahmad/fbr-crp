"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { InvoiceFormState, InvoiceItem } from "@/types"

interface Account {
    id: string;
    name: string;
    type: string;
    contactNumber?: string;
    cnic?: string;
    creditLimit?: number;
    city?: string;
}

interface AccountInformationProps {
    formState: InvoiceFormState
    updateField: (field: keyof InvoiceFormState, value: string | InvoiceItem[] | boolean) => void
    accounts: Account[]
}

export function AccountInformation({ formState, updateField, accounts }: AccountInformationProps) {
    // Handle account selection and auto-fill related fields
    const handleAccountChange = (accountId: string) => {
        // Update the selected account ID
        updateField("selectedAccount", accountId)

        // Find the selected account in our accounts array
        const selectedAccount = accounts.find((account) => account.id === accountId)
        console.log("selectedAccount-->", selectedAccount)

        if (selectedAccount) {
            // Auto-fill fields if they exist in the account data
            if (selectedAccount.contactNumber) {
                updateField("contactNumber", selectedAccount.contactNumber)
            }
            if (selectedAccount.cnic) {
                updateField("cnic", selectedAccount.cnic)
            }
            if (selectedAccount.creditLimit) {
                updateField("creditLimit", selectedAccount.creditLimit.toString())
            }
            if (selectedAccount.city) {
                updateField("city", selectedAccount.city)
            }
        }
    }

    return (
        <Card className="shrink-0">
            <CardHeader>
                <CardTitle className="text-base sm:text-lg">Invoice Information</CardTitle>
                <CardDescription className="text-xs">Enter the basic information for this invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label htmlFor="account" className="text-xs">
                            Account Name <span className="text-destructive">*</span>
                        </Label>
                        <Select value={formState.selectedAccount} onValueChange={handleAccountChange}>
                            <SelectTrigger id="account" className="h-8 text-xs">
                                <SelectValue placeholder={accounts.length === 0 ? "Loading accounts..." : "Select account"} />
                            </SelectTrigger>
                            <SelectContent>
                                {accounts.length === 0 ? (
                                    <SelectItem value="no-accounts" disabled>
                                        No accounts found
                                    </SelectItem>
                                ) : (
                                    accounts.map((account) => (
                                        <SelectItem key={account.id} value={account.id}>
                                            {account.name} ({account.type})
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="invoiceNumber" className="text-xs">
                            Invoice Number
                        </Label>
                        <Input id="invoiceNumber" value={formState.invoiceNumber} readOnly className="bg-muted h-8 text-xs" />
                    </div>
                </div>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label htmlFor="contactNumber" className="text-xs">
                            Mobile Number
                        </Label>
                        <Input
                            id="contactNumber"
                            value={formState.contactNumber}
                            onChange={(e) => updateField("contactNumber", e.target.value)}
                            placeholder="Enter mobile number"
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="cnic" className="text-xs">
                            CNIC
                        </Label>
                        <Input
                            id="cnic"
                            value={formState.cnic}
                            onChange={(e) => updateField("cnic", e.target.value)}
                            placeholder="Enter CNIC"
                            className="h-8 text-xs"
                        />
                    </div>
                </div>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                    <div className="space-y-1">
                        <Label htmlFor="creditLimit" className="text-xs">
                            Credit Limit
                        </Label>
                        <Input
                            id="creditLimit"
                            type="number"
                            value={formState.creditLimit}
                            onChange={(e) => updateField("creditLimit", e.target.value)}
                            placeholder="Enter credit limit"
                            className="h-8 text-xs"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="city" className="text-xs">
                            City
                        </Label>
                        <Input
                            id="city"
                            value={formState.city}
                            onChange={(e) => updateField("city", e.target.value)}
                            placeholder="Enter city"
                            className="h-8 text-xs"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="invoiceType" className="text-xs">
                            Invoice Type
                        </Label>
                        <Select value={formState.invoiceType} onValueChange={(value) => updateField("invoiceType", value)}>
                            <SelectTrigger id="invoiceType" className="h-8 text-xs">
                                <SelectValue placeholder="Select invoice type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="simple">Simple</SelectItem>
                                <SelectItem value="detailed">Detailed</SelectItem>
                                <SelectItem value="tax">Tax Invoice</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

