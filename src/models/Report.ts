import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reportName: { type: String, required: true },          // Name of the report (e.g., "Monthly Invoice Report")
    reportType: { type: String, enum: ['daily', 'monthly', 'yearly'], required: true },  // Type of report
    generatedBy: { type: String, required: true },         // User who generated the report
    filtersApplied: {                                      // Filters applied by the user during report generation
        account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },  // Account selected
        dateRange: {                                         // Date range filter
            startDate: { type: Date, required: true },
            endDate: { type: Date, required: true }
        },
        invoiceType: { type: String, enum: ['tax', 'simple', 'detailed'] },  // Invoice type filter
        status: { type: String, enum: ['pending', 'paid', 'cancelled'] }     // Status filter
    },
    totalInvoices: { type: Number, default: 0 },           // Total invoices included in the report
    reportData: [                                          // Array of summarized invoice data
        {
            invoiceNumber: String,
            invoiceDate: Date,
            accountName: String,
            invoiceType: String,
            totalAmount: Number,
            discount: Number,
            finalAmount: Number,
            status: String
        }
    ],

}, { timestamps: true });


const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);

export default Report;