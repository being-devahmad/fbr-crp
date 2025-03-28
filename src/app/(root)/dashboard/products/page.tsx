
import { getCategories } from "@/actions/category"
import { AddCategoryModal } from "@/components/modals/AddCategoryModal"
import { AddProductModal } from "@/components/modals/AddProductModal"
import ProductsTable from "@/components/products/ProductsTable"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default async function ProductsPage() {
    const categories = await getCategories()

    return (
        <div className="grid gap-6 p-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">Manage your customer and company Products</p>
                </div>

                <div className="flex gap-2">
                    <AddProductModal categories={categories} />
                    <AddCategoryModal />
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>All Products</CardTitle>
                    <CardDescription>
                        A list of all products in your system. You can sort, filter and manage products from here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductsTable categories={categories} />
                </CardContent>
            </Card>
        </div>
    )
}

