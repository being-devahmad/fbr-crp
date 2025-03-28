import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Helper function to handle CastError
function handleCastError(error: unknown, modelName: string) {
  if (error instanceof mongoose.Error.CastError) {
    return NextResponse.json(
      { error: `Invalid ${modelName} ID format` },
      { status: 400 }
    );
  }
  return null;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const id = (await params).id;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting account:", error);

    // Handle invalid ID format
    const castErrorResponse = handleCastError(error, "Account");
    if (castErrorResponse) return castErrorResponse;

    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}

