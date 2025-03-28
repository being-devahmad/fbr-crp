"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { InvoiceFormState, InvoiceItem } from "@/types"
import { getAllAccounts } from "@/actions/account"

// Generate a new invoice number
const generateInvoiceNumber = () => {
    const prefix = "INV"
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const date = new Date().toISOString().slice(2, 10).replace(/-/g, "")
    return `${prefix}-${date}-${randomNum}`
}

export function useInvoiceForm() {
    const router = useRouter()
    const queryClient = useQueryClient()

    // Fetch accounts with React Query
    const { data: accounts = [] } = useQuery({
        queryKey: ["accounts"],
        queryFn: async () => {
            try {
                const response = await getAllAccounts()
                if (response.success && response.data) {
                    console.log("accountsData->", response.data)
                    return response.data
                }
                throw new Error(response.error || "Failed to fetch accounts")
            } catch (error) {
                console.error("Error fetching accounts:", error)
                toast.error("Failed to load accounts. Please try again later.")
                return []
            }
        },
    })

    // Initialize form state
    const [formState, setFormState] = useState<InvoiceFormState>({
        // Basic invoice info
        invoiceNumber: generateInvoiceNumber(),
        selectedAccount: "",
        contactNumber: "",
        cnic: "",
        creditLimit: "",
        city: "",
        invoiceType: "simple",

        // Product form
        productName: "",
        selectedProduct: "",
        selectedCategory: "",
        quantity: "1",
        rate: "",
        barCode: "",

        // Shipping info
        cartons: "",
        bags: "",
        notes: "",

        // Payment info
        expense: "",
        discount: "",

        // Items
        invoiceItems: [],

        // Form state
        isSubmitting: false,
    })

    // Update form field
    const updateField = (field: keyof InvoiceFormState, value: string | InvoiceItem[] | boolean) => {
        setFormState((prev) => {
            const newState = { ...prev, [field]: value }
            return newState
        })
    }

    // Calculate totals
    const subTotal = Array.isArray(formState.invoiceItems)
        ? formState.invoiceItems.reduce((sum, item) => sum + item.total, 0)
        : 0
    const expenseValue = Number.parseFloat(formState.expense) || 0
    const discountValue = Number.parseFloat(formState.discount) || 0
    const total = subTotal + expenseValue - discountValue

    // Reset product form
    const resetProductForm = () => {
        updateField("productName", "")
        updateField("selectedProduct", "")
        updateField("selectedCategory", "")
        updateField("quantity", "1")
        updateField("rate", "")
        updateField("barCode", "")
    }

    // Remove product from invoice
    const removeProduct = (id: number) => {
        if (!Array.isArray(formState.invoiceItems)) {
            console.error("invoiceItems is not an array:", formState.invoiceItems)
            return
        }

        const updatedItems = formState.invoiceItems.filter((item) => item.id !== id)
        updateField("invoiceItems", updatedItems)
    }

    // Submit form
    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formState.selectedAccount) {
            toast.error("Missing account: Please select an account for this invoice.")
            return
        }

        if (!Array.isArray(formState.invoiceItems) || formState.invoiceItems.length === 0) {
            toast.error("No items added: Please add at least one item to the invoice.")
            return
        }

        updateField("isSubmitting", true)

        try {
            // Find the selected account
            const account = accounts.find((acc: { id: string }) => acc.id === formState.selectedAccount)

            if (!account) {
                throw new Error("Selected account not found")
            }

            // Prepare the invoice data exactly matching the Mongoose schema
            const invoiceData = {
                invoiceNumber: formState.invoiceNumber,
                invoiceDate: new Date().toISOString(), // Send as ISO string
                invoiceType: formState.invoiceType,
                status: "pending",

                account: {
                    id: account.id, // Make sure account.id is included
                    name: account.name,
                    type: account.type,
                    cnic: formState.cnic || account.cnic,
                    contactNumber: formState.contactNumber || account.contactNumber || "",
                    creditLimit: formState.creditLimit ? Number(formState.creditLimit) : account.creditLimit || 0,
                    city: formState.city || account.city || "",
                },

                items: formState.invoiceItems.map((item) => ({
                    id: String(item.id), // Ensure it's a string
                    productId: String(item.productId || ""),
                    productName: item.productName,
                    barCode: item.barCode || "",
                    categoryId: String(item.categoryId || ""),
                    categoryName: item.categoryName || "",
                    // Add default values for required fields that are not in the UI
                    subCategoryId: "default",
                    subCategoryName: "Default Subcategory",
                    packingTypeId: "default",
                    packingTypeName: "Default Packing",
                    quantity: Number(item.quantity),
                    rate: Number(item.rate),
                    total: Number(item.total),
                })),

                shipping: {
                    barCode: formState.barCode || "",
                    cartons: formState.cartons ? Number(formState.cartons) : 0,
                    bags: formState.bags ? Number(formState.bags) : 0,
                    notes: formState.notes || "",
                },

                payment: {
                    expense: expenseValue,
                    discount: discountValue,
                    subTotal: subTotal,
                    total: total,
                },
            }

            console.log("Submitting invoice data:", JSON.stringify(invoiceData, null, 2))

            // Send the request to our new direct-create endpoint
            const response = await fetch("/api/invoices/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(invoiceData),
            })

            const responseText = await response.text()
            console.log("API Response:", responseText)

            let responseData
            try {
                responseData = JSON.parse(responseText)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                console.error("Failed to parse response as JSON:", responseText)
                throw new Error("Invalid response from server")
            }

            if (!response.ok) {
                console.error("API error response:", responseData)
                throw new Error(responseData.error || "Failed to create invoice")
            }

            // Show success toast
            toast.success(`Invoice ${formState.invoiceNumber} has been successfully created.`)

            // Invalidate queries
            queryClient.invalidateQueries({ queryKey: ["invoices"] })

            // Redirect to invoices list
            router.push("/dashboard/invoices")
        } catch (error) {
            console.error("Error creating invoice:", error)
            toast.error(error instanceof Error ? error.message : "There was an error creating the invoice. Please try again.")
        } finally {
            updateField("isSubmitting", false)
        }
    }

    return {
        formState,
        updateField,
        subTotal,
        total,
        resetProductForm,
        removeProduct,
        submitForm,
        accounts,
    }
}

