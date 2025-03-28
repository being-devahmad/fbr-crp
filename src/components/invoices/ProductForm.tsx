"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import type { InvoiceFormState, InvoiceItem } from "@/types"
import { useProductForm } from "@/hooks/use-product-form"

interface ProductFormProps {
    formState: InvoiceFormState
    updateField: (field: keyof InvoiceFormState, value: string | InvoiceItem[] | boolean) => void
    resetProductForm: () => void
}

export function ProductForm({ formState, updateField, resetProductForm }: ProductFormProps) {
    const { addProduct, products } = useProductForm(formState, updateField)

    // Handle product selection and auto-fill related fields
    const handleProductSelect = (productId: string) => {
        const selectedProduct = products.find((product) => product._id === productId)

        if (selectedProduct) {
            updateField("selectedProduct", productId)
            updateField("productName", selectedProduct.name || "")
            updateField("selectedCategory", selectedProduct.category || "")
        }
    }

    return (
        <Card className="shrink-0">
            <CardHeader>
                <CardTitle className="text-base sm:text-lg">Add Products</CardTitle>
                <CardDescription className="text-xs">Add products to this invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label htmlFor="product" className="text-xs">
                            Select Product
                        </Label>
                        <Select value={formState.selectedProduct} onValueChange={handleProductSelect}>
                            <SelectTrigger id="product" className="h-8 text-xs">
                                <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.length === 0 ? (
                                    <SelectItem value="no-products" disabled>
                                        No products found
                                    </SelectItem>
                                ) : (
                                    products.map((product) => (
                                        <SelectItem key={product._id} value={product._id}>
                                            {product.name || "Unnamed Product"}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="productName" className="text-xs">
                            Product Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="productName"
                            value={formState.productName}
                            onChange={(e) => updateField("productName", e.target.value)}
                            placeholder="Enter product name"
                            className="h-8 text-xs"
                        />
                    </div>
                </div>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label htmlFor="quantity" className="text-xs">
                            Quantity <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={formState.quantity}
                            onChange={(e) => updateField("quantity", e.target.value)}
                            placeholder="Enter quantity"
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="rate" className="text-xs">
                            Rate <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="rate"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formState.rate}
                            onChange={(e) => updateField("rate", e.target.value)}
                            placeholder="Enter rate"
                            className="h-8 text-xs"
                        />
                    </div>
                </div>

                <div className="grid gap-3 grid-cols-1">
                    <div className="space-y-1">
                        <Label htmlFor="barCode" className="text-xs">
                            Bar Code
                        </Label>
                        <Input
                            id="barCode"
                            value={formState.barCode}
                            onChange={(e) => updateField("barCode", e.target.value)}
                            placeholder="Enter bar code"
                            className="h-8 text-xs"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <Button type="button" className="flex-1 h-8 text-xs" onClick={addProduct}>
                        <Plus className="mr-2 h-3 w-3" /> Add Product
                    </Button>
                    <Button type="button" variant="outline" className="h-8 w-full sm:w-8 p-0 sm:p-0" onClick={resetProductForm}>
                        <X className="h-3 w-3" /> <span className="sm:sr-only">Cancel</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

