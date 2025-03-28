"use server";

import dbConnect from "@/lib/db";
import Account from "@/models/Account";

export async function getAllAccounts() {
  try {
    await dbConnect();

    // Fetch all accounts
    const rawAccounts = await Account.find({}).lean();

    // Convert MongoDB documents to plain objects
    const accounts = JSON.parse(JSON.stringify(rawAccounts));

    // Format the accounts to ensure they have consistent properties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedAccounts = accounts.map((account: any) => ({
      id: account._id, // Use MongoDB's _id as our id
      name: account.name,
      cnic: account.cnic,
      contactNumber: account.contactNumber,
      type: account.type,
      code: account.code,
      city: account.city,
      branch: account.branch,
    }));

    return {
      success: true,
      data: formattedAccounts,
    };
  } catch (error) {
    console.error("Error fetching all accounts:", error);
    return {
      success: false,
      error: "Failed to fetch accounts",
      data: [],
    };
  }
}
