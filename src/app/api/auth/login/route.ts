import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import { signJwt } from "@/lib/jwt";
import User from "@/models/User";
import { handleErrorResponse } from "@/utils";
import { loginSchema } from "@/validations";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = loginSchema.parse(body);

        await dbConnect();

        const user = await User.findOne({ email: validatedData.email }).exec();
        if (!user) return handleErrorResponse(NextResponse, new Error("Invalid email or password"), 401);

        const isMatch = await bcrypt.compare(validatedData.password, user.password);
        if (!isMatch) return handleErrorResponse(NextResponse, new Error("Invalid email or password"), 401);

        const token = signJwt({ id: user._id.toString(), email: user.email });
        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email
            },
            userDetails: user
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: "lax",
        });

        return response;

    } catch (error: unknown) {
        return handleErrorResponse(NextResponse, error instanceof Error ? error : new Error("Unknown error"));
    }
}
