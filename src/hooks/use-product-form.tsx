"use client"

import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import type { InvoiceFormState, InvoiceItem } from "@/types"
import { getProducts } from "@/actions/product"

export function useProductForm(
    formState: InvoiceFormState,
    updateField: (field: keyof InvoiceFormState, value: string | InvoiceItem[] | boolean) => void,
) {
    // Fetch products with React Query
    const { data: products = [] } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            try {
                const result = await getProducts()
                return result || []
            } catch (error) {
                console.error("Error fetching products:", error)
                toast.error("Failed to load products. Please try again later.")
                return []
            }
        },
    })

    // Add product to invoice
    const addProduct = () => {
        const { selectedProduct, productName, selectedCategory, quantity, rate } = formState

        if (!productName) {
            toast.error("Product name is required")
            return
        }

        if (!rate || isNaN(Number(rate)) || Number(rate) <= 0) {
            toast.error("Please enter a valid rate")
            return
        }

        if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
            toast.error("Please enter a valid quantity")
            return
        }

        // Find selected product
        const product = products.find((p) => p._id === selectedProduct)

        // Ensure we have valid category information
        const categoryId = selectedCategory || product?.category || ""
        const categoryName = product?.categoryName || "Default Category"

        const newItem: InvoiceItem = {
            id: Date.now(),
            productId: product?._id || "",
            productName: productName,
            categoryId: categoryId,
            categoryName: categoryName,
            barCode: formState.barCode || `PROD-${Date.now()}`,
            quantity: Number(quantity),
            rate: Number(rate),
            total: Number(quantity) * Number(rate),
        }

        // Ensure invoiceItems is always an array
        const currentItems = Array.isArray(formState.invoiceItems) ? [...formState.invoiceItems] : []
        const updatedItems = [...currentItems, newItem]

        // Update the state with the new array
        updateField("invoiceItems", updatedItems)

        // Reset product form fields
        updateField("barCode", "")
        updateField("rate", "")
        updateField("quantity", "1")
        toast.success("Product added to invoice")
    }

    return {
        addProduct,
        products,
    }
}

