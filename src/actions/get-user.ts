"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/User"; // Import the User model
import dbConnect from "@/lib/db";

export async function getUser() {
  try {
    // Fetch the token from cookies (server-side)
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    if (!decoded?.id) return null; // Check if the token contains a valid user ID

    // Connect to MongoDB (if not already connected)
    await dbConnect();

    // Fetch the user from the database and exclude sensitive fields
    const user = await User.findById(decoded.id).select(
      "firstName lastName email role avatarUrl"
    );
    if (!user) return null;

    // Return a clean user object
    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };
  } catch (error: unknown) {
    // Type narrowing: Check if error is an instance of Error
    if (error instanceof Error) {
      console.error("Error fetching user:", error.message); // Access error.message safely
    } else {
      console.error("An unknown error occurred:", error); // Handle other error types
    }
    return null; // Return null if any error occurs
  }
}
