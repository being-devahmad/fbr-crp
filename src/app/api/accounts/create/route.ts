import { NextResponse } from "next/server";
import Account, { IAccount } from "@/models/Account";
import dbConnect from "@/lib/db";

// Function to generate the next account code
const generateAccountCode = async () => {
  const lastAccount = await Account.findOne().sort({ createdAt: -1 }); // Get latest account
  let nextNumber = 1001; // Default start number

  if (lastAccount && lastAccount.code) {
    const lastCodeNumber = parseInt(lastAccount.code.split("-")[1]); // Extract number part
    nextNumber = lastCodeNumber + 1; // Increment
  }

  return `ACC-${nextNumber}`; // Return new code
};

// Create Account - POST /api/accounts
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body: IAccount = await req.json();

    // Validate required fields (excluding 'code' since it's auto-generated)
    const { name, cnic, branch, type, city, contactNumber } = body;
    if (!name || !cnic || !branch || !type || !city || !contactNumber) {
      console.log("All fields required");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if account with the same CNIC already exists
    const existingAccount = await Account.findOne({ cnic });
    if (existingAccount) {
      return NextResponse.json(
        { error: "Account with this CNIC already exists" },
        { status: 400 }
      );
    }

    // Generate new account code
    const code = await generateAccountCode();

    // Create new account with auto-generated code
    const newAccount = await Account.create({
      name,
      code,
      cnic,
      branch,
      type,
      city,
      contactNumber,
    });

    console.log("newAccount-->", newAccount);
    return NextResponse.json(
      { message: "Account created successfully", account: newAccount },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
