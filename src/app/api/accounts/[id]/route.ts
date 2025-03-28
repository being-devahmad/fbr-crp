import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Account from "@/models/Account";

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = context.params; // Correct destructuring

    const account = await Account.findById(id).lean();

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ account }, { status: 200 });
  } catch (error) {
    console.error("Error fetching account details:", error);
    return NextResponse.json(
      { error: "Failed to fetch account details" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = context.params; // Correct destructuring

    const account = await Account.findById(id);

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    await Account.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
