import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { handleErrorResponse } from "@/utils";
import { signupSchema } from "@/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input using Zod schema
    const validatedData = signupSchema.parse(body);

    // Connect to database
    await dbConnect();

    // Check if the user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create new user with default role handling
    const newUser = await User.create({
      ...validatedData,
      password: hashedPassword, 
    });

    // Return successful response
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: {
          id: newUser._id.toString(),
          email: newUser.email,
          role: newUser.role,
        },
        userDetails: newUser,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Handle errors using your utility function
    return handleErrorResponse(
      NextResponse,
      error instanceof Error ? error : new Error("Unknown error")
    );
  }
}
