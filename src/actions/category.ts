"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

// Define response types
interface ActionResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

interface CategoryResponse extends ActionResponse {
  category?: {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

export async function addCategory(
  formData: FormData
): Promise<CategoryResponse> {
  try {
    // Connect to the database
    await dbConnect();

    // Extract form data
    const name = formData.get("name") as string;

    // Validate data
    if (!name) {
      return { error: "Category name is required" };
    }

    // Create new category
    const newCategory = new Category({
      name,
    });

    // Save to database
    await newCategory.save();

    // Convert to plain object before returning
    const plainCategory = {
      _id: newCategory._id.toString(),
      name: newCategory.name,
      createdAt: newCategory.createdAt.toISOString(),
      updatedAt: newCategory.updatedAt.toISOString(),
    };

    // Revalidate the products page
    revalidatePath("/products");

    return {
      success: true,
      message: `${name} category has been added successfully.`,
      category: plainCategory,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error adding category:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return { error: "A category with this name already exists" };
    }

    if (error.name === "ValidationError") {
      return {
        error: Object.values(error.errors)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((e: any) => e.message)
          .join(", "),
      };
    }

    return { error: "Failed to add category. Please try again." };
  }
}

// Get Categories
export interface CategoryWithId {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export async function getCategories(): Promise<CategoryWithId[]> {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all categories
    const categories = await Category.find({}).sort({ name: 1 });

    // Convert MongoDB documents to plain objects
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
