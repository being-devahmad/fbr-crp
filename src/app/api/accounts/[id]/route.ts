import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Account from "@/models/Account";
import mongoose from "mongoose"; // Import mongoose for error type checking
import type { NextRequest } from "next/server";

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const id = (await params).id;
    // const { id } = params;

    const account = await Account.findById(id)
      .select("-password") // Exclude sensitive fields
      .lean();

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ account }, { status: 200 });
  } catch (error) {
    console.error("Error fetching account details:", error);

    // Handle invalid ID format
    const castErrorResponse = handleCastError(error, "Account");
    if (castErrorResponse) return castErrorResponse;

    return NextResponse.json(
      { error: "Failed to fetch account details" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const id = (await params).id;

    const deletedAccount = await Account.findByIdAndDelete(id);

    if (!deletedAccount) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Account deleted successfully" },
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
