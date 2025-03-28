'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { AlertCircle } from 'lucide-react'
import { ConfirmationModal } from '../modals/ConfirmationModal'
import { ProductsTableContent } from './ProductsTableContent'
import { useProducts } from '@/hooks/use-products'
import { ProductsFilters } from './ProjectsFIlters'
import { ProductPagination } from './ProductsPagination'

export type SortField = "name" | "categoryName" | "salesTax"
export type SortDirection = "asc" | "desc"

interface Category {
    _id: string
    name: string
}

interface AddProductModalProps {
    categories: Category[]
}

const ProductsTable = ({ categories }: AddProductModalProps) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [productCategoryFilter, setProductCategoryFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [sortField, setSortField] = useState<SortField>("name")
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

    // Modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState<string | null>(null)
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

    // Fetch products with the custom hook
    const { products, pagination, isLoading, error,  fetchProductDetails, deleteProduct, isDeleting } =
        useProducts({
            page: currentPage,
            limit: 10,
            search: searchTerm,
            category: productCategoryFilter !== "all" ? productCategoryFilter : undefined,
            sortField,
            sortDirection,
        })

    // Memoized selected product
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const selectedProduct = useMemo(() => {
        return products?.find((product: { _id: string | null }) => product._id === selectedProductId) || null
    }, [products, selectedProductId])

    // Handle sort
    const handleSort = useCallback((field: SortField) => {
        setSortField((prevField) => {
            if (prevField === field) {
                setSortDirection((prevDirection) => (prevDirection === "asc" ? "desc" : "asc"))
                return prevField
            }
            setSortDirection("asc")
            return field
        })
    }, [])

    // Open delete confirmation modal
    const openDeleteModal = useCallback((id: string) => {
        setProductToDelete(id)
        setDeleteModalOpen(true)
    }, [])

    // Close delete confirmation modal
    const closeDeleteModal = useCallback(() => {
        setDeleteModalOpen(false)
        setProductToDelete(null)
    }, [])

    // Handle delete product confirmation
    const confirmDeleteProduct = useCallback(async () => {
        if (!productToDelete) return

        try {
            // Use the deleteproduct mutation from the hook with proper callbacks
            deleteProduct(productToDelete, {
                onSuccess: () => {
                    toast.success("The product has been successfully deleted.")
                    closeDeleteModal()
                },
                onError: (error) => {
                    console.error("Error deleting product:", error)
                    toast.error(error instanceof Error ? error.message : "Failed to delete the product. Please try again.")
                    closeDeleteModal()
                },
            })
        } catch (err) {
            console.error("Error deleting product:", err)
            toast.error("Failed to delete the product. Please try again.")
            closeDeleteModal()
        }
    }, [productToDelete, closeDeleteModal, deleteProduct])

    // Open product details modal
    const openDetailsModal = useCallback(
        async (id: string) => {
            try {
                setSelectedProductId(id)
                await fetchProductDetails(id)
            } catch (err) {
                console.error("Error fetching product details:", err)
                toast.error("Failed to load product details. Please try again.")
            }
        },
        [fetchProductDetails],
    )

    return (
        <div className="flex flex-col gap-4">
            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDeleteProduct}
                title="Delete Product"
                description="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />

            {/* Product Details Modal */}
            {/* <AccountDetailsModal
                isOpen={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                product={selectedAccount}
            /> */}

            <ProductsFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                productCategoryFilter={productCategoryFilter}
                onProductCategoryFilterChange={(value) => {
                    setProductCategoryFilter(value)
                    setCurrentPage(1)
                }}
            />

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <ProductsTableContent
                products={products || []}
                isLoading={isLoading}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onViewDetails={openDetailsModal}
                onDeleteProduct={openDeleteModal}
                categories={categories}
            />

            {pagination && (
                <ProductPagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    totalRecords={pagination.totalRecords}
                    limit={pagination.limit}
                    isLoading={isLoading}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    )
}

export default ProductsTable