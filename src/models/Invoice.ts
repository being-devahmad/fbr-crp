// import mongoose, { Schema, Document } from "mongoose";

// // Define TypeScript interface for Invoice
// export interface IInvoice extends Document {
//     invoiceNumber: string;
//     invoiceDate: Date;
//     invoiceType: "simple" | "detailed" | "tax";
//     status: "pending" | "paid" | "cancelled";

//     account: {
//         id: string;
//         name: string;
//         type: string;
//         cnic: string;
//         mobileNumber?: string;
//         creditLimit?: number;
//         city?: string;
//     };

//     items: {
//         id: string;
//         productId?: string;
//         productName: string;
//         barCode?: string;
//         categoryId: string;
//         categoryName: string;
//         quantity: number;
//         rate: number;
//         total: number;
//     }[];

//     shipping?: {
//         barCode?: string;
//         cartons?: number;
//         bags?: number;
//         notes?: string;
//     };

//     payment: {
//         expense?: number;
//         discount?: number;
//         subTotal: number;
//         total: number;
//     };
// }

// // Create Mongoose Schema
// const InvoiceSchema: Schema<IInvoice> = new Schema(
//     {
//         invoiceNumber: {
//             type: String,
//             required: true,
//             unique: true
//         },
//         invoiceDate: {
//             type: Date,
//             required: true
//         },
//         invoiceType: {
//             type: String,
//             enum: ["simple", "detailed", "tax"],
//             default: "simple",
//         },
//         status: {
//             type: String,
//             enum: ["pending", "paid", "cancelled"],
//             default: "pending",
//         },

//         account: {
//             id: { type: String, required: true },
//             name: { type: String, required: true },
//             type: { type: String, required: true },
//             cnic: { type: String, required: true, unique: true },
//             mobileNumber: String,
//             creditLimit: Number,
//             city: String,
//         },

//         items: [
//             {
//                 id: { type: String, required: true },
//                 productId: String,
//                 productName: { type: String, required: true },
//                 barCode: String,
//                 categoryId: { type: String, required: true },
//                 categoryName: { type: String, required: true },
//                 quantity: { type: Number, required: true },
//                 rate: { type: Number, required: true },
//                 total: { type: Number, required: true },
//             },
//         ],

//         shipping: {
//             barCode: String,
//             cartons: Number,
//             bags: Number,
//             notes: String,
//         },

//         payment: {
//             expense: { type: Number, default: 0 },
//             discount: { type: Number, default: 0 },
//             subTotal: { type: Number, required: true },
//             total: { type: Number, required: true },
//         },
//     },
//     { timestamps: true }
// );

// // Export Mongoose Model with TypeScript type
// const Invoice = mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
// export default Invoice;

import mongoose, { Schema, type Document } from "mongoose";

// Define TypeScript interface for Invoice
export interface IInvoice extends Document {
  invoiceNumber: string;
  invoiceDate: Date;
  invoiceType: "simple" | "detailed" | "tax";
  status: "pending" | "paid" | "cancelled";

  account: {
    name: string;
    type: string;
    cnic: string;
    mobileNumber?: string;
    creditLimit?: number;
    city?: string;
  };

  items: {
    productId?: string;
    productName: string;
    barCode?: string;
    categoryId: string;
    categoryName: string;
    quantity: number;
    rate: number;
    total: number;
  }[];

  shipping?: {
    barCode?: string;
    cartons?: number;
    bags?: number;
    notes?: string;
  };

  payment: {
    expense?: number;
    discount?: number;
    subTotal: number;
    total: number;
  };
}

// Create Mongoose Schema
const InvoiceSchema: Schema<IInvoice> = new Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    invoiceDate: {
      type: Date,
      required: true,
    },
    invoiceType: {
      type: String,
      enum: ["simple", "detailed", "tax"],
      default: "simple",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },

    account: {
      name: { type: String, required: true },
      type: { type: String, required: true },
      cnic: { type: String, required: true },
      mobileNumber: String,
      creditLimit: Number,
      city: String,
    },

    items: [
      {
        productId: String,
        productName: { type: String, required: true },
        barCode: String,
        categoryId: { type: String, required: true },
        categoryName: { type: String, required: true },
        quantity: { type: Number, required: true },
        rate: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],

    shipping: {
      barCode: String,
      cartons: Number,
      bags: Number,
      notes: String,
    },

    payment: {
      expense: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      subTotal: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

// Export Mongoose Model with TypeScript type
const Invoice =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
export default Invoice;
