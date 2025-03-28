/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/lib/db";
import { revalidateTag } from "next/cache";
import Invoice from "@/models/Invoice";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Parse request body
    const body = await request.json();

    console.log("Received invoice data:", JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.account?.id || !body.account?.name || !body.account?.type) {
      return NextResponse.json(
        { error: "Account information is required" },
        { status: 400 }
      );
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "At least one item is required" },
        { status: 400 }
      );
    }

    // Generate invoice number if not provided
    if (!body.invoiceNumber) {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
      body.invoiceNumber = `INV-${year}${month}-${random}`;
    }

    // Set invoice date if not provided
    if (!body.invoiceDate) {
      body.invoiceDate = new Date();
    } else if (typeof body.invoiceDate === "string") {
      // Convert ISO string to Date object
      body.invoiceDate = new Date(body.invoiceDate);
    }

    // Calculate totals if not provided
    let subTotal = 0;

    // Process items and calculate totals
    const processedItems = body.items.map((item: any) => {
      // Generate ID for item if not provided
      if (!item.id) {
        item.id = uuidv4();
      }

      // Calculate total for item if not provided
      if (!item.total && item.quantity && item.rate) {
        item.total = Number(item.quantity) * Number(item.rate);
      }

      subTotal += Number(item.total);

      // Ensure all required fields are present and have the correct type
      return {
        id: String(item.id),
        productId: String(item.productId || ""),
        productName: String(item.productName),
        barCode: String(item.barCode || ""),
        categoryId: String(item.categoryId || ""),
        categoryName: String(item.categoryName || ""),
        // Add default values for required fields that are not in the UI
        subCategoryId: String(item.subCategoryId || "default"),
        subCategoryName: String(item.subCategoryName || "Default Subcategory"),
        packingTypeId: String(item.packingTypeId || "default"),
        packingTypeName: String(item.packingTypeName || "Default Packing"),
        quantity: Number(item.quantity),
        rate: Number(item.rate),
        total: Number(item.total),
      };
    });

    // Calculate payment details
    const expense = Number(body.payment?.expense || 0);
    const discount = Number(body.payment?.discount || 0);
    const total = subTotal + expense - discount;

    // Create invoice object with simplified schema
    const invoiceData: {
      invoiceNumber: any;
      invoiceDate: any;
      invoiceType: any;
      status: any;
      account: {
        id: any;
        name: any;
        type: any;
        cnic: any;
        mobileNumber: any;
        creditLimit: number;
        city: any;
      };
      items: any;
      payment: {
        expense: number;
        discount: number;
        subTotal: number;
        total: number;
      };
      shipping?: {
        barCode: string;
        cartons: number;
        bags: number;
        notes: string;
      };
    } = {
      invoiceNumber: body.invoiceNumber,
      invoiceDate: body.invoiceDate,
      invoiceType: body.invoiceType || "simple",
      status: body.status || "pending",
      account: {
        id: body.account.id, // Make sure account.id is included
        name: body.account.name,
        type: body.account.type,
        cnic: body.account.cnic,
        mobileNumber: body.account.mobileNumber || "",
        creditLimit: Number(body.account.creditLimit || 0),
        city: body.account.city || "",
      },
      items: processedItems,
      payment: {
        expense,
        discount,
        subTotal,
        total,
      },
    };

    // Add shipping information if provided
    if (body.shipping) {
      invoiceData.shipping = {
        barCode: body.shipping.barCode || "",
        cartons: Number(body.shipping.cartons || 0),
        bags: Number(body.shipping.bags || 0),
        notes: body.shipping.notes || "",
      };
    }

    console.log(
      "Processed invoice data:",
      JSON.stringify(invoiceData, null, 2)
    );

    const newInvoice = await Invoice.create(invoiceData);
    console.log("newInvoice->", newInvoice);

    revalidateTag("invoices");

    return NextResponse.json(
      {
        success: true,
        message: "Invoice created successfully",
        data: { ...invoiceData, _id: newInvoice.insertedId },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating invoice:", error);

    // Handle duplicate invoice number error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Invoice number already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create invoice",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
