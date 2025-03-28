"use server";

import dbConnect from "@/lib/db";
import Invoice from "@/models/Invoice";

export async function getAllInvoices() {
  try {
    await dbConnect();

    // Fetch all invoices
    const rawInvoices = await Invoice.find({}).lean();
    // console.log("rawInvoices-->", rawInvoices)

    const invoices = JSON.parse(JSON.stringify(rawInvoices));
    return {
      success: true,
      invoices,
    };
  } catch (error) {
    console.error("Error fetching all invoices:", error);
    return {
      success: false,
      error: "Failed to fetch invoices",
    };
  }
}
