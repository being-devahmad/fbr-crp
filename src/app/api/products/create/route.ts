import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product, { IProduct } from "@/models/Product";

// Create Account - POST /api/accounts
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body: IProduct = await req.json();

    const { name, category, salesTax } = body;
    if (!name || !category || !salesTax) {
      console.log("All fields required");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create new product with auto-generated code
    const newProduct = await Product.create({ name, category, salesTax });

    console.log("newProduct-->", newProduct);
    return NextResponse.json(
      { message: "Product added successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
