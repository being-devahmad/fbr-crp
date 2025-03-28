/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

// Define response types
interface ActionResponse {
  success?: boolean;
  message?: string;
  error?: string;
}


interface ProductResponse extends ActionResponse {
  product?: {
    _id: string;
    name: string;
    category: string;
    salesTax: string;
    createdAt: string;
    updatedAt: string;
  };
}

export async function addProduct(formData: FormData): Promise<ProductResponse> {
  try {
    // Connect to the database
    await dbConnect();

    // Extract form data
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const salesTax = formData.get("salesTax") as string;

    // Validate data
    if (!name || !category || !salesTax) {
      return { error: "All fields are required" };
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return { error: "Selected category does not exist" };
    }

    // Create new product
    const newProduct = new Product({
      name,
      category,
      salesTax,
    });

    // Save to database
    await newProduct.save();

    // Convert to plain object before returning
    const plainProduct = {
      _id: newProduct._id.toString(),
      name: newProduct.name,
      category: newProduct.category.toString(),
      salesTax: newProduct.salesTax,
      createdAt: newProduct.createdAt.toISOString(),
      updatedAt: newProduct.updatedAt.toISOString(),
    };

    // Revalidate the products page to show the new product
    revalidatePath("/products");

    return {
      success: true,
      message: `${name} has been added successfully.`,
      product: plainProduct,
    };
  } catch (error: any) {
    console.error("Error adding product:", error);

    // Handle specific MongoDB errors
    if (error.name === "ValidationError") {
      return {
        error: Object.values(error.errors)
          .map((e: any) => e.message)
          .join(", "),
      };
    }

    return { error: "Failed to add product. Please try again." };
  }
}

export interface ProductWithCategory {
  _id: string;
  name: string;
  category: string;
  categoryName: string;
  salesTax: string;
  createdAt: string;
  updatedAt: string;
}

export async function getProducts(): Promise<ProductWithCategory[]> {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all products with populated category
    const products = await Product.find({})
      .populate("category", "name")
      .sort({ createdAt: -1 });

    // Convert to plain objects and format for frontend
    const formattedProducts = products.map((product) => {
      const plainProduct = product.toObject();
      return {
        _id: plainProduct._id.toString(),
        name: plainProduct.name,
        category: plainProduct.category._id.toString(),
        categoryName: (plainProduct.category as any).name,
        salesTax: plainProduct.salesTax,
        createdAt: plainProduct.createdAt.toISOString(),
        updatedAt: plainProduct.updatedAt.toISOString(),
      };
    });

    return formattedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
