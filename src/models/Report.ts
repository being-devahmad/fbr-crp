// import mongoose from "mongoose";

// const reportSchema = new mongoose.Schema({
//     reportName: { type: String, required: true },          // Name of the report (e.g., "Monthly Invoice Report")
//     reportType: { type: String, enum: ['daily', 'monthly', 'yearly'], required: true },  // Type of report
//     generatedBy: { type: String, required: true },         // User who generated the report
//     filtersApplied: {                                      // Filters applied by the user during report generation
//         account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },  // Account selected
//         dateRange: {                                         // Date range filter
//             startDate: { type: Date, required: true },
//             endDate: { type: Date, required: true }
//         },
//         invoiceType: { type: String, enum: ['tax', 'simple', 'detailed'] },  // Invoice type filter
//         status: { type: String, enum: ['pending', 'paid', 'cancelled'] }     // Status filter
//     },
//     totalInvoices: { type: Number, default: 0 },           // Total invoices included in the report
//     reportData: [                                          // Array of summarized invoice data
//         {
//             invoiceNumber: String,
//             invoiceDate: Date,
//             accountName: String,
//             invoiceType: String,
//             totalAmount: Number,
//             discount: Number,
//             finalAmount: Number,
//             status: String
//         }
//     ],

// }, { timestamps: true });


// const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);

// export default Report;










import mongoose, { Schema, type Document } from "mongoose"

// Define interfaces for type safety
export interface DateRange {
    startDate: Date
    endDate: Date
    month?: string
    year?: string
}

export interface ReportFilters {
    account: string // account ID or "all"
    dateRange: DateRange
    invoiceType: string // "tax", "simple", "detailed" or "all"
    status: string // "pending", "paid", "cancelled" or "all"
}

export interface ReportData {
    // This will contain the actual report data
    totalSales: number
    totalItems: number
    totalTax?: number
    items: Array<{
        date: Date
        invoiceNumber: string
        accountName: string
        amount: number
        status: string
        invoiceType: string
    }>
    summary?: {
        byStatus?: Record<string, number>
        byInvoiceType?: Record<string, number>
        byAccount?: Record<string, number>
        byDate?: Record<string, number>
    }
}

export interface ReportDocument extends Document {
    reportName: string
    reportType: "monthly" | "yearly" | "daily"
    createdBy: mongoose.Types.ObjectId
    createdAt: Date
    filters: ReportFilters
    data?: ReportData
    isGenerated: boolean
    generatedAt?: Date
    lastAccessed?: Date
    accessCount: number
}

const ReportSchema = new Schema<ReportDocument>(
    {
        reportType: {
            type: String,
            enum: ["monthly", "yearly", "daily"],
            required: [true, "Report type is required"],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        filters: {
            account: {
                type: String,
            },
            dateRange: {
                startDate: {
                    type: Date,
                },
                endDate: {
                    type: Date,
                },
                month: String,
                year: String,
            },
            invoiceType: {
                type: String,
                required: [true, "Invoice type filter is required"],
            },
            status: {
                type: String,
                required: [true, "Status filter is required"],
            },
        },
        data: {
            totalSales: Number,
            totalItems: Number,
        },
    },
    {
        timestamps: true,
    },
)

// Indexes for better query performance
ReportSchema.index({ createdBy: 1, reportType: 1 })
ReportSchema.index({ "filters.account": 1 })
ReportSchema.index({ "filters.dateRange.startDate": 1, "filters.dateRange.endDate": 1 })
ReportSchema.index({ createdAt: -1 })


// Create and export the model
const Report = mongoose.models.Report || mongoose.model<ReportDocument>("Report", ReportSchema)

export default Report

