"use client"

import { useCallback, useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import type { Invoice } from "../types"

interface PaginationData {
    totalRecords: number
    totalPages: number
    currentPage: number
    limit: number
}

interface ApiResponse {
    invoices: Invoice[]
    pagination: PaginationData
}

interface UseInvoicesParams {
    page: number
    limit: number
    search?: string
    type?: string
    date?: Date
    sortField: string
    sortDirection: string
}

export function useInvoices({ page, limit, search, type, date, sortField, sortDirection }: UseInvoicesParams) {
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
    const queryKey = ["invoices", page, limit, debouncedSearch, type, date?.toISOString(), sortField, sortDirection];

    // Fetch invoices function
    const fetchInvoices = async (): Promise<ApiResponse> => {
        // Use relative URL to avoid window.location during SSR
        const baseUrl = "/api/invoices"
        const params = new URLSearchParams()

        params.append("page", page.toString())
        params.append("limit", limit.toString())

        // Add search parameter if provided
        if (debouncedSearch) {
            params.append("search", debouncedSearch)
        }

        // Add invoice type filter if provided
        if (type) {
            params.append("type", type)
        }

        // Add sort parameters
        params.append("sortField", sortField)
        params.append("sortDirection", sortDirection)

        // Add date filter if provided
        if (date) {
            const formattedDate = format(date, "yyyy-MM-dd")
            params.append("date", formattedDate)
        }

        const url = `${baseUrl}?${params.toString()}`
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }

        const data: ApiResponse = await response.json()

        // If the API doesn't handle date filtering, do it client-side
        let filteredInvoices = data.invoices

        if (date && filteredInvoices.length > 0) {
            // Format the selected date to compare with invoice dates (without time)
            const selectedDate = format(date, "yyyy-MM-dd")

            // Filter invoices by the selected date
            filteredInvoices = filteredInvoices.filter((invoice) => {
                if (!invoice.createdAt) return false
                const invoiceDate = format(new Date(invoice.createdAt), "yyyy-MM-dd")
                return invoiceDate === selectedDate
            })

            // Update pagination for client-side filtering
            if (data.pagination && filteredInvoices.length !== data.invoices.length) {
                const totalPages = Math.ceil(filteredInvoices.length / limit)
                data.pagination = {
                    ...data.pagination,
                    totalRecords: filteredInvoices.length,
                    totalPages: totalPages > 0 ? totalPages : 1,
                }
            }
        }

        return {
            invoices: filteredInvoices,
            pagination: data.pagination,
        }
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
        queryFn: fetchInvoices,
        staleTime: 60 * 1000, // Consider data fresh for 60 seconds (matching server cache)
        refetchOnMount: "always", // Refetch on mount to ensure data is up to date
        refetchOnWindowFocus: false,
        enabled: isMounted,
    })

    // Fetch invoice details
    const fetchInvoiceDetails = useCallback(async (id: string) => {
        const response = await fetch(`/api/invoices/${id}`)
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }
        return response.json()
    }, [])

    // Delete invoice mutation
    // const deleteInvoiceMutation = useMutation({
    //     mutationFn: async (invoiceId: string) => {
    //         const response = await fetch(`/api/invoices/${invoiceId}`, {
    //             method: "DELETE",
    //         })

    //         if (!response.ok) {
    //             throw new Error(`Error: ${response.status}`)
    //         }

    //         return response.json()
    //     },
    //     onMutate: async (invoiceId) => {
    //         // Cancel any outgoing refetches
    //         await queryClient.cancelQueries({ queryKey: ["invoices"] })

    //         // Snapshot the previous value
    //         const previousInvoices = queryClient.getQueryData(queryKey)

    //         // Optimistically update to the new value
    //         queryClient.setQueryData(queryKey, (old: any) => {
    //             return {
    //                 ...old,
    //                 invoices: old.invoices.filter((invoice: Invoice) => invoice._id !== invoiceId),
    //             }
    //         })

    //         return { previousInvoices }
    //     },
    //     onError: (err, invoiceId, context) => {
    //         // If the mutation fails, use the context returned from onMutate to roll back
    //         queryClient.setQueryData(queryKey, context?.previousInvoices)
    //     },
    //     onSettled: () => {
    //         // Always refetch after error or success
    //         queryClient.invalidateQueries({ queryKey: ["invoices"] })
    //     },
    // })

    // Delete invoice mutation with 404 handling
    // Delete invoice mutation with 404 handling and consistent query key invalidation
    const deleteInvoiceMutation = useMutation({
        mutationFn: async (invoiceId: string) => {
            const response = await fetch(`/api/invoices/${invoiceId}`, {
                method: "DELETE",
            });

            // If invoice not found, treat as deleted
            if (response.status === 404) {
                return { message: "Invoice not found; it may have already been deleted." };
            }

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return response.json();
        },
        onMutate: async (invoiceId) => {
            // Cancel any outgoing refetches using the full query key
            await queryClient.cancelQueries({ queryKey });

            const previousInvoices = queryClient.getQueryData(queryKey);

            // Optimistically update the cache by removing the invoice
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData(queryKey, (old: any) => ({
                ...old,
                invoices: old.invoices.filter((invoice: Invoice) => invoice._id !== invoiceId),
            }));

            return { previousInvoices };
        },
        onError: (err, invoiceId, context) => {
            // Roll back the optimistic update on error
            queryClient.setQueryData(queryKey, context?.previousInvoices);
        },
        onSettled: () => {
            // Invalidate using the same query key to trigger an immediate refetch
            queryClient.invalidateQueries({ queryKey });
        },
    });



    // Only show loading state on client after mount
    const isLoading = isMounted && (queryIsLoading || isFetching)

    return {
        invoices: data?.invoices || [],
        pagination: data?.pagination,
        isLoading,
        error: error ? (error instanceof Error ? error.message : "Failed to fetch invoices") : null,
        mutate: refetch,
        fetchInvoiceDetails,
        deleteInvoice: deleteInvoiceMutation.mutate,
        isDeleting: deleteInvoiceMutation.isPending,
    }
}

