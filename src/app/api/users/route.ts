/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Extract query params
    const { searchParams } = new URL(req.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortDirection = searchParams.get("sortDirection") || "desc";

    // Ensure page and limit are valid numbers
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    // Build query based on search parameters
    const query: any = {};

    // Add search functionality - search in name and email fields
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Compute the number of documents to skip
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortField] = sortDirection === "asc" ? 1 : -1;

    // Fetch total count (for pagination metadata)
    const totalRecords = await User.countDocuments(query);

    // Fetch paginated users with optimized query
    // Only select the fields we need to display
    const users = await User.find(query)
      .select("_id firstName lastName email role image")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean() // Improves read performance
      .then((users) =>
        users.map((user) => ({
          _id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          image:
            user.image ||
            "https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fwww.gravatar.com%2Favatar%2F2c7d99fe281ecd3bcd65ab915bac6dd5%3Fs%3D250",
        }))
      );

    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / limit);

    return NextResponse.json({
      users,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
