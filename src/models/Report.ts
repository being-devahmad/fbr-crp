import mongoose, { Schema, type Document } from "mongoose"

export interface DateRange {
    startDate: Date
    endDate: Date
    month?: number
    year?: number
}

export interface ReportFilters {
    account?: string
    dateRange: DateRange
    invoiceType?: string
    status?: string
}

export interface ReportItem {
    date: Date
    invoiceNumber: string
    accountName: string
    amount: number
    status: string
    invoiceType: string
}

export interface ReportSummary {
    byStatus?: Record<string, number>
    byInvoiceType?: Record<string, number>
    byAccount?: Record<string, number>
    byDate?: Record<string, number>
}

export interface ReportData {
    totalSales: number
    totalItems: number
    items: ReportItem[]
    summary?: ReportSummary
}

export interface ReportDocument extends Document {
    reportName: string
    reportType: "monthly" | "yearly" | "daily" | "custom"
    generatedBy: mongoose.Types.ObjectId
    filtersApplied: ReportFilters
    totalInvoices: number
    reportData: ReportItem[]
    data: ReportData
    createdAt: Date
    updatedAt: Date
}

const ReportSchema = new Schema<ReportDocument>(
    {
        reportName: {
            type: String,
        },
        reportType: {
            type: String,
            enum: ["monthly", "yearly", "daily", "custom"],
            required: [true, "Report type is required"],
        },
        generatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        filtersApplied: {
            account: String,
            dateRange: {
                startDate: { type: Date, required: true },
                endDate: { type: Date, required: true },
                month: Number,
                year: Number
            },
            invoiceType: String,
            status: String
        },
        totalInvoices: {
            type: Number,
            default: 0
        },
        reportData: [{
            date: Date,
            invoiceNumber: String,
            accountName: String,
            amount: Number,
            status: String,
            invoiceType: String
        }],
        data: {
            totalSales: { type: Number, required: true },
            totalItems: { type: Number, required: true },
            items: [{
                date: Date,
                invoiceNumber: String,
                accountName: String,
                amount: Number,
                status: String,
                invoiceType: String
            }],
            summary: {
                byStatus: Schema.Types.Mixed,
                byInvoiceType: Schema.Types.Mixed,
                byAccount: Schema.Types.Mixed,
                byDate: Schema.Types.Mixed
            }
        }
    },
    {
        timestamps: true,
    }
);

// Indexes
ReportSchema.index({ generatedBy: 1, reportType: 1 });
ReportSchema.index({ "filtersApplied.account": 1 });
ReportSchema.index({ "filtersApplied.dateRange.startDate": 1, "filtersApplied.dateRange.endDate": 1 });

const Report = mongoose.models.Report || mongoose.model<ReportDocument>("Report", ReportSchema);

export default Report;