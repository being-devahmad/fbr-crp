import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Account from "@/models/Account";

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
    const query: {
      $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
      type?: string;
    } = {};

    // Add search functionality - only search in string fields
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { cnic: { $regex: search, $options: "i" } },
        { branch: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }

    // Add type filter
    if (type && type !== "all") {
      query.type = type;
    }

    // Compute the number of documents to skip
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: { [key: string]: 1 | -1 } = {};
    sort[sortField] = sortDirection === "asc" ? 1 : -1;

    // Fetch total count (for pagination metadata)
    const totalRecords = await Account.countDocuments(query);

    // Fetch paginated accounts with optimized query
    const accounts = await Account.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(); // Improves read performance

    // console.log("accounts", accounts)

    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / limit);

    return NextResponse.json({
      accounts,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
