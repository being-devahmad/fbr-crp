"use client";

import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Category {
    _id: string;
    name: string;
}

interface Product {
    _id: string;
    name: string;
    category: string;
    categoryName?: string; // Added field for category name
    salesTax: number;
}

interface PaginationData {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

interface ApiResponse {
    products: Product[];
    pagination: PaginationData;
}

interface CategoriesResponse {
    categories: Category[];
}

interface UseProductsParams {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    sortField: string;
    sortDirection: string;
}

export function useProducts({
    page,
    limit,
    search,
    category,
    sortField,
    sortDirection,
}: UseProductsParams) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const queryClient = useQueryClient();
    const debouncedSearch = useDebounce(search, 500);

    const queryKey = [
        "products",
        page,
        limit,
        debouncedSearch,
        category,
        sortField,
        sortDirection,
    ];

    const fetchCategories = async (): Promise<CategoriesResponse> => {
        const response = await fetch("/api/categories");
        if (!response.ok) {
            throw new Error(`Error fetching categories: ${response.status}`);
        }
        return response.json();
    };

    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: 5 * 60 * 1000,
        enabled: isMounted,
    });

    const categoryMap = new Map<string, string>();
    if (categoriesData?.categories) {
        categoriesData.categories.forEach((cat) => {
            categoryMap.set(cat._id, cat.name);
        });
    }

    const fetchProducts = async (): Promise<ApiResponse> => {
        const baseUrl = "/api/products";
        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (debouncedSearch) {
            params.append("search", debouncedSearch);
        }

        if (category) {
            params.append("category", category);
        }

        params.append("sortField", sortField);
        params.append("sortDirection", sortDirection);

        const url = `${baseUrl}?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.products && categoryMap.size > 0) {
            data.products = data.products.map((product: Product) => ({
                ...product,
                categoryName: categoryMap.get(product.category) || "Unknown Category",
            }));
        }

        return data;
    };

    const {
        data,
        error,
        isLoading: queryIsLoading,
        isFetching,
        refetch,
    } = useQuery({
        queryKey,
        queryFn: fetchProducts,
        staleTime: 60 * 1000,
        refetchOnMount: "always",
        refetchOnWindowFocus: false,
        enabled: isMounted,
    });

    const fetchProductDetails = useCallback(async (id: string) => {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    }, []);

    const deleteProductMutation = useMutation({
        mutationFn: async (productId: string) => {
            const response = await fetch(`/api/products/${productId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                let errorMessage = `Error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e: unknown) {
                    console.error("Error parsing error response", e);
                }
                throw new Error(errorMessage);
            }
            return response.json();
        },

        onMutate: async (productId) => {
            await queryClient.cancelQueries({ queryKey: ["products"] });

            const previousProducts = queryClient.getQueryData(queryKey);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData(queryKey, (old: any) => {
                if (!old || !old.products) return old;

                return {
                    ...old,
                    products: old.products.filter(
                        (product: Product) => product._id !== productId
                    ),
                    pagination: old.pagination
                        ? {
                            ...old.pagination,
                            totalRecords: old.pagination.totalRecords - 1,
                        }
                        : null,
                };
            });

            return { previousProducts };
        },

        onError: (error, productId, context) => {
            if (context?.previousProducts) {
                queryClient.setQueryData(queryKey, context.previousProducts);
            }
            console.error("Error deleting product:", error);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    const isLoading = isMounted && (queryIsLoading || isFetching);

    return {
        products: data?.products || [],
        pagination: data?.pagination,
        isLoading,
        error: error
            ? error instanceof Error
                ? error.message
                : "Failed to fetch products"
            : null,
        mutate: refetch,
        fetchProductDetails,
        deleteProduct: deleteProductMutation.mutate,
        isDeleting: deleteProductMutation.isPending,
    };
}
