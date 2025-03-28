import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Invoice from "@/models/Invoice";
import Report from "@/models/Report";

// Helper function: calculate date range based on report type
const calculateDateRange = (month: string | undefined, year: number, reportType: string) => {
    let startDate, endDate;
    if (reportType === 'yearly') {
        startDate = new Date(`${year}-01-01`);
        endDate = new Date(`${year}-12-31`);
    } else if (reportType === 'monthly') {
        if (!month) throw new Error("Month is required for monthly reports");
        startDate = new Date(`${year}-${month}-01`);
        endDate = new Date(year, new Date(`${year}-${month}-01`).getMonth() + 1, 0);
    } else if (reportType === 'daily') {
        if (!month) throw new Error("Month (day) is required for daily reports");
        startDate = new Date(`${year}-${month}`);
        endDate = new Date(`${year}-${month}`);
    }
    return { startDate, endDate };
};

export async function GET() {
    try {
        await dbConnect();
        const reports = await Report.find({}).sort({ createdAt: -1 });
        console.log("reports->", reports)
        return NextResponse.json(reports);
    } catch (error) {
        console.error("Error retrieving reports:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        console.log("Received payload:", body);
        const { reportName, reportType, filters, generatedBy } = body;

        if (!reportName || !reportType || !filters || !generatedBy) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Adjusted destructuring to extract month and year from filters.dateRange
        const { month, year } = filters.dateRange;
        const { invoiceType, status, account } = filters;

        const { startDate, endDate } = calculateDateRange(reportType === "yearly" ? undefined : month, Number(year), reportType);
        console.log("Calculated date range:", { startDate, endDate });

        // Query invoices based on filters.
        const query = {
            account,
            invoiceDate: { $gte: startDate, $lte: endDate },
            invoiceType,
            status,
        };
        console.log("Invoice query:", query);

        const invoices = await Invoice.find(query).populate("account");
        console.log("Fetched invoices:", invoices);

        // Summarize invoice data
        const reportData = invoices.map((inv) => {
            const finalAmount = inv.payment.total - inv.payment.discount;
            return {
                invoiceNumber: inv.invoiceNumber,
                invoiceDate: inv.invoiceDate,
                accountName: inv.account?.name || "N/A",
                invoiceType: inv.invoiceType,
                totalAmount: inv.payment.total,
                discount: inv.payment.discount,
                finalAmount,
                status: inv.status,
            };
        });

        console.log("reportData->", reportData)

        // Create and save the report document.
        const report = await Report.create({
            reportName,
            reportType,
            generatedBy,
            filtersApplied: {
                account,
                dateRange: { startDate, endDate },
                invoiceType,
                status,
            },
            totalInvoices: invoices.length,
            reportData,
        });

        console.log("generatedReport--->", report)

        return NextResponse.json(
            { message: "Report generated successfully", reportId: report._id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error generating report:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
