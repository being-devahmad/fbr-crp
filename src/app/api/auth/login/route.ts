import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { signJwt } from "@/lib/jwt";
import { loginSchema } from "@/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    await dbConnect();

    // Find user in the database
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(validatedData.password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signJwt({
      id: user._id.toString(),
      permissions: user.permissions.map((p: { module: string }) => p.module),
      email: user.email,
    });

    // Create response and set token as HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user._id.toString(),
          email: user.email,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days expiration
    });

    return response;
  } catch (error: unknown) {
    console.error(
      "Login error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
