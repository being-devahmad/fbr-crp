import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Extract query params
    const { searchParams } = new URL(req.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortDirection = searchParams.get("sortDirection") || "desc";

    // Ensure page and limit are valid numbers
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    // Build query based on search and filter parameters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    // Add search functionality - only search in string fields
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { salesTax: { $regex: search, $options: "i" } },
      ];
    }

    // Add type filter
    if (type && type !== "all") {
      query.type = type;
    }

    // Compute the number of documents to skip
    const skip = (page - 1) * limit;

    // Build sort object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sort: any = {};
    sort[sortField] = sortDirection === "asc" ? 1 : -1;

    // Fetch total count (for pagination metadata)
    const totalRecords = await Product.countDocuments(query);

    // Fetch paginated products with optimized query
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(); // Improves read performance

    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / limit);

    return NextResponse.json({
      products,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
