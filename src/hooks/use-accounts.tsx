"use client"

import { useCallback, useEffect, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useDebounce } from "./use-debounce"

interface Account {
    _id: string
    name: string
    code: string
    cnic: string
    branch: string
    type: string
    createdAt: string
}

interface PaginationData {
    totalRecords: number
    totalPages: number
    currentPage: number
    limit: number
}

interface ApiResponse {
    accounts: Account[]
    pagination: PaginationData
}

interface UseAccountsParams {
    page: number
    limit: number
    search?: string
    type?: string
    sortField: string
    sortDirection: string
}

export function useAccounts({ page, limit, search, type, sortField, sortDirection }: UseAccountsParams) {
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
    const queryKey = ["accounts", page, limit, debouncedSearch, type, sortField, sortDirection]

    // Fetch accounts function
    const fetchAccounts = async (): Promise<ApiResponse> => {
        // Use relative URL to avoid window.location during SSR
        const baseUrl = "/api/accounts"
        const params = new URLSearchParams()

        params.append("page", page.toString())
        params.append("limit", limit.toString())

        // Add search parameter if provided
        if (debouncedSearch) {
            params.append("search", debouncedSearch)
        }

        // Add account type filter if provided
        if (type) {
            params.append("type", type)
        }

        // Add sort parameters
        params.append("sortField", sortField)
        params.append("sortDirection", sortDirection)

        const url = `${baseUrl}?${params.toString()}`
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }

        return response.json()
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
        queryFn: fetchAccounts,
        staleTime: 30000, // Consider data fresh for 30 seconds
        refetchOnMount: "always", // Refetch on mount to ensure data is up to date
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        enabled: isMounted, // Only run on client-side after mount
    })

    // Fetch account details
    const fetchAccountDetails = useCallback(async (id: string) => {
        const response = await fetch(`/api/accounts/${id}`)
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }
        return response.json()
    }, [])

    // Delete account mutation
    const deleteAccountMutation = useMutation({
        mutationFn: async (accountId: string) => {
            const response = await fetch(`/api/accounts/${accountId}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            return response.json()
        },
        onSuccess: () => {
            // Invalidate the accounts query to refetch data
            queryClient.invalidateQueries({ queryKey: ["accounts"] })
        },
    })

    // Only show loading state on client after mount
    const isLoading = isMounted && (queryIsLoading || isFetching)

    return {
        accounts: data?.accounts || [],
        pagination: data?.pagination,
        isLoading,
        error: error ? (error instanceof Error ? error.message : "Failed to fetch accounts") : null,
        mutate: refetch,
        fetchAccountDetails,
        deleteAccount: deleteAccountMutation.mutate,
        isDeleting: deleteAccountMutation.isPending,
    }
}

