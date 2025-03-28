"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/User"; // Import the User model
import dbConnect from "@/lib/db";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

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

export async function updateUser({
  firstName,
  lastName,
  image,
}: {
  firstName: string;
  lastName: string;
  image: string;
}) {
  try {
    // 1. Get user ID from token
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return { success: false, message: "Authentication required" };
    }

    // 2. Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    if (!decoded?.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
      return { success: false, message: "Invalid authentication token" };
    }

    // 3. Connect to database
    await dbConnect();

    // 4. Update user data
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id, // Use ID from token
      {
        firstName,
        lastName,
        image,
      },
      { new: true, runValidators: true } // Add validation
    ).lean();

    if (!updatedUser) {
      return { success: false, message: "User not found" };
    }

    // 5. Revalidate cached data
    revalidatePath("/profile");

    // 6. Return sanitized response
    return {
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Update error:", error);

    // Handle specific error cases
    if (error instanceof jwt.JsonWebTokenError) {
      return { success: false, message: "Invalid authentication token" };
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return { success: false, message: error.message };
    }

    return {
      success: false,
      message: "Failed to update profile. Please try again.",
    };
  }
}
