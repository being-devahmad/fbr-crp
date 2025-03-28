"use client"

import { useCallback, useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface Category {
    _id: string
    name: string
}

interface Product {
    _id: string
    name: string
    category: string
    categoryName?: string  // Added field for category name
    salesTax: number
}

interface PaginationData {
    totalRecords: number
    totalPages: number
    currentPage: number
    limit: number
}

interface ApiResponse {
    products: Product[]
    pagination: PaginationData
}

interface CategoriesResponse {
    categories: Category[]
}

interface UseProductsParams {
    page: number
    limit: number
    search?: string
    category?: string
    sortField: string
    sortDirection: string
}

export function useProducts({ page, limit, search, category, sortField, sortDirection }: UseProductsParams) {
    // Track if component is mounted (client-side only)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Get the query client for cache invalidation
    const queryClient = useQueryClient()

    // Debounce search term to prevent excessive API calls
    const debouncedSearch = useDebounce(search, 500)

    // Build the query key - React Query uses this to cache and deduplicate requests
    const queryKey = ["products", page, limit, debouncedSearch, category, sortField, sortDirection]

    // Fetch categories to map IDs to names
    const fetchCategories = async (): Promise<CategoriesResponse> => {
        const response = await fetch("/api/categories")
        if (!response.ok) {
            throw new Error(`Error fetching categories: ${response.status}`)
        }
        return response.json()
    }

    // Use React Query to fetch and cache categories
    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: 5 * 60 * 1000, // Cache categories for 5 minutes
        enabled: isMounted,
    })

    // Create a map of category IDs to names
    const categoryMap = new Map<string, string>()
    if (categoriesData?.categories) {
        categoriesData.categories.forEach((cat) => {
            categoryMap.set(cat._id, cat.name)
        })
    }

    // Fetch products function
    const fetchProducts = async (): Promise<ApiResponse> => {
        // Use relative URL to avoid window.location during SSR
        const baseUrl = "/api/products"
        const params = new URLSearchParams()

        params.append("page", page.toString())
        params.append("limit", limit.toString())

        // Add search parameter if provided
        if (debouncedSearch) {
            params.append("search", debouncedSearch)
        }

        // Add product category filter if provided
        if (category) {
            params.append("category", category)
        }

        // Add sort parameters
        params.append("sortField", sortField)
        params.append("sortDirection", sortDirection)

        const url = `${baseUrl}?${params.toString()}`
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()

        // Add category names to products
        if (data.products && categoryMap.size > 0) {
            data.products = data.products.map((product: Product) => ({
                ...product,
                categoryName: categoryMap.get(product.category) || "Unknown Category"
            }))
        }

        return data
    }

    // Use React Query's useQuery hook for data fetching with caching
    const {
        data,
        error,
        isLoading: queryIsLoading,
        isFetching,
        refetch,
    } = useQuery({
        queryKey,
        queryFn: fetchProducts,
        staleTime: 0, // Always refetch fresh data
        refetchOnMount: true, // Refetch every time the component mounts
        refetchOnWindowFocus: false, // Avoid refetching when switching tabs (optional)
    })

    // Fetch product details
    const fetchProductDetails = useCallback(async (id: string) => {
        const response = await fetch(`/api/products/${id}`)
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }
        return response.json()
    }, [])

    // Delete product mutation
    const deleteProductMutation = useMutation({
        mutationFn: async (productId: string) => {
            const response = await fetch(`/api/products/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                // Get more detailed error information if available
                let errorMessage = `Error: ${response.status}`
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorMessage
                } catch (e: unknown) {
                    console.log("error", e)
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage)
            }

            return response.json()
        },
        // Add optimistic updates for better UX
        onMutate: async (productId) => {
            // Cancel any outgoing refetches to avoid overwriting our optimistic update
            await queryClient.cancelQueries({ queryKey: ["products"] })

            // Snapshot the previous value
            const previousProducts = queryClient.getQueryData(queryKey)

            // Optimistically update the UI by removing the deleted product
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData(queryKey, (old: any) => {
                if (!old || !old.products) return old

                return {
                    ...old,
                    products: old.products.filter((product: Product) => product._id !== productId),
                    pagination: old.pagination ? {
                        ...old.pagination,
                        totalRecords: old.pagination.totalRecords - 1,
                    } : null,
                }
            })

            // Return the previous data so we can revert if something goes wrong
            return { previousProducts }
        },
        onError: (error, productId, context) => {
            // If the mutation fails, revert to the previous state
            if (context?.previousProducts) {
                queryClient.setQueryData(queryKey, context.previousProducts)
            }
            console.error("Error deleting product:", error)
        },
        onSettled: () => {
            // Always refetch after error or success to ensure data consistency
            queryClient.invalidateQueries({ queryKey: ["products"] })
        },
    })

    // Only show loading state on client after mount
    const isLoading = isMounted && (queryIsLoading || isFetching)

    return {
        products: data?.products || [],
        pagination: data?.pagination,
        isLoading,
        error: error ? (error instanceof Error ? error.message : "Failed to fetch products") : null,
        mutate: refetch,
        fetchProductDetails,
        deleteProduct: deleteProductMutation.mutate,
        isDeleting: deleteProductMutation.isPending,
    }
}