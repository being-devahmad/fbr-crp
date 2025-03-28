import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all categories
    const categories = await Category.find({}).sort({ name: 1 });

    // Convert MongoDB documents to plain objects
    return NextResponse.json({
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
