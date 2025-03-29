/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable prefer-const */
// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/db";
// import Invoice from "@/models/Invoice";
// import Report from "@/models/Report";

// // Helper function: calculate date range based on report type
// const calculateDateRange = (month: string | undefined, year: number, reportType: string) => {
//     let startDate, endDate;
//     if (reportType === 'yearly') {
//         startDate = new Date(`${year}-01-01`);
//         endDate = new Date(`${year}-12-31`);
//     } else if (reportType === 'monthly') {
//         if (!month) throw new Error("Month is required for monthly reports");
//         startDate = new Date(`${year}-${month}-01`);
//         endDate = new Date(year, new Date(`${year}-${month}-01`).getMonth() + 1, 0);
//     } else if (reportType === 'daily') {
//         if (!month) throw new Error("Month (day) is required for daily reports");
//         startDate = new Date(`${year}-${month}`);
//         endDate = new Date(`${year}-${month}`);
//     }
//     return { startDate, endDate };
// };

// export async function GET() {
//     try {
//         await dbConnect();
//         const reports = await Report.find({}).sort({ createdAt: -1 });
//         console.log("reports->", reports)
//         return NextResponse.json(reports);
//     } catch (error) {
//         console.error("Error retrieving reports:", error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }


// export async function POST(request: Request) {
//     try {
//         await dbConnect();
//         const body = await request.json();
//         console.log("Received payload:", body);
//         const { reportType, filters, generatedBy } = body;

//         if ( !reportType || !filters || !generatedBy) {
//             return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//         }

//         // Adjusted destructuring to extract month and year from filters.dateRange
//         const { month, year } = filters.dateRange;
//         const { invoiceType, status, account } = filters;

//         const { startDate, endDate } = calculateDateRange(reportType === "yearly" ? undefined : month, Number(year), reportType);
//         console.log("Calculated date range:", { startDate, endDate });

//         // Query invoices based on filters.
//         const query = {
//             account,
//             invoiceDate: { $gte: startDate, $lte: endDate },
//             invoiceType,
//             status,
//         };
//         console.log("Invoice query:", query);

//         const invoices = await Invoice.find(query).populate("account");
//         console.log("Fetched invoices:", invoices);

//         // Summarize invoice data
//         const reportData = invoices.map((inv) => {
//             const finalAmount = inv.payment.total - inv.payment.discount;
//             return {
//                 invoiceNumber: inv.invoiceNumber,
//                 invoiceDate: inv.invoiceDate,
//                 accountName: inv.account?.name || "N/A",
//                 invoiceType: inv.invoiceType,
//                 totalAmount: inv.payment.total,
//                 discount: inv.payment.discount,
//                 finalAmount,
//                 status: inv.status,
//             };
//         });

//         console.log("reportData->", reportData)

//         // Create and save the report document.
//         const report = await Report.create({
//             reportType,
//             generatedBy,
//             filtersApplied: {
//                 account,
//                 dateRange: { startDate, endDate },
//                 invoiceType,
//                 status,
//             },
//             totalInvoices: invoices.length,
//             reportData,
//         });

//         console.log("generatedReport--->", report)

//         return NextResponse.json(
//             { message: "Report generated successfully", reportId: report._id },
//             { status: 201 }
//         );
//     } catch (error) {
//         console.error("Error generating report:", error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }
















import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Invoice from "@/models/Invoice"
import Report from "@/models/Report"
import mongoose from "mongoose"


interface InvoiceQuery {
    invoiceDate: {
        $gte: Date | undefined;
        $lte: Date | undefined;
    };
    account?: string;
    invoiceType?: string;
    status?: string;
}


// Helper function: calculate date range based on report type
const calculateDateRange = (dateRange: any, reportType: string) => {
    // Use the provided date range directly if it's already defined
    if (dateRange.startDate && dateRange.endDate) {
        return {
            startDate: new Date(dateRange.startDate),
            endDate: new Date(dateRange.endDate),
            month: dateRange.month,
            year: dateRange.year,
        }
    }

    // Otherwise, calculate it based on month/year
    const { month, year } = dateRange
    let startDate, endDate

    if (reportType === "yearly") {
        startDate = new Date(`${year}-01-01`)
        endDate = new Date(`${year}-12-31`)
    } else if (reportType === "monthly") {
        if (!month) throw new Error("Month is required for monthly reports")
        startDate = new Date(`${year}-${month}-01`)
        // Get last day of month
        const monthIndex = new Date(`${year}-${month}-01`).getMonth()
        endDate = new Date(Number(year), monthIndex + 1, 0)
    } else if (reportType === "daily") {
        if (!month) throw new Error("Date is required for daily reports")
        startDate = new Date(`${year}-${month}`)
        endDate = new Date(`${year}-${month}`)
    }

    return { startDate, endDate, month, year }
}

export async function GET() {
    try {
        await dbConnect();
        const reports = await Report.find({}).sort({ createdAt: -1 });

        // Format the response to match what the frontend expects
        const formattedReports = reports.map((report) => {
            const reportObj = report.toObject ? report.toObject() : report;
            console.log("reportObject----->", reportObj)
            // Check if we're using filtersApplied or filters
            const filterData = reportObj.filtersApplied || reportObj.filters || {};
            console.log("filterData->", filterData)

            return {
                _id: reportObj._id,
                reportType: reportObj.reportType,
                reportName: reportObj.reportName,
                createdAt: reportObj.createdAt,
                filtersApplied: {
                    account: filterData.account || "All Accounts",
                    dateRange: filterData.dateRange || {
                        startDate: reportObj.createdAt,
                        endDate: reportObj.createdAt,
                    },
                    invoiceType: filterData.invoiceType || "All",
                    status: filterData.status || "All",
                },
                totalInvoices: reportObj.totalInvoices || reportObj.data?.totalItems || 0,
                totalSales: reportObj.data?.totalSales || 0,
                reportData: reportObj.reportData || [],
            };
        });

        return NextResponse.json(formattedReports);
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

        // Extract the data from the request body
        const { reportType, filters } = body;
        if (!reportType || !filters) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Extract filters
        const { account, dateRange, invoiceType, status } = filters;

        // Calculate date range
        const processedDateRange = calculateDateRange(dateRange, reportType);
        console.log("Calculated date range:", processedDateRange);

        // Build the invoice query. Only add a filter if its value is not "all".
        const query: InvoiceQuery = {
            invoiceDate: {
                $gte: processedDateRange.startDate,
                $lte: processedDateRange.endDate,
            },
        };
        if (account && account.toLowerCase() !== "all") query.account = account;
        if (invoiceType && invoiceType.toLowerCase() !== "all") query.invoiceType = invoiceType;
        if (status && status.toLowerCase() !== "all") query.status = status;
        console.log("Invoice query:", query);

        const invoices = await Invoice.find(query).populate("account");
        console.log("Fetched invoices:", invoices.length);

        // Process invoice data for the report
        const items = invoices.map((inv: any) => ({
            date: inv.invoiceDate,
            invoiceNumber: inv.invoiceNumber,
            accountName: inv.account?.name || "N/A",
            amount: inv.payment.total,
            status: inv.status,
            invoiceType: inv.invoiceType,
        }));

        // Calculate summary data
        const totalSales = items.reduce((sum: number, item: any) => sum + item.amount, 0);
        console.log("totalSales---", totalSales)

        const summary = {
            byStatus: items.reduce((acc: any, item: any) => {
                acc[item.status] = (acc[item.status] || 0) + item.amount;
                return acc;
            }, {}),
            byInvoiceType: items.reduce((acc: any, item: any) => {
                acc[item.invoiceType] = (acc[item.invoiceType] || 0) + item.amount;
                return acc;
            }, {}),
            byAccount: items.reduce((acc: any, item: any) => {
                acc[item.accountName] = (acc[item.accountName] || 0) + item.amount;
                return acc;
            }, {}),
        };

        const reportData = {
            totalSales,
            totalItems: items.length,
            items,
            summary,
        };

        console.log("reportData--->", reportData)

        // Generate a report name (here just capitalizing the report type)
        const reportName = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`;

        // Build filtersApplied.
        // If the incoming value is "all" (case-insensitive), we omit that field.
        const filtersApplied: { [key: string]: any } = {
            dateRange: {
                startDate: processedDateRange.startDate,
                endDate: processedDateRange.endDate,
                month: processedDateRange.month,
                year: processedDateRange.year,
            },
        };

        if (account && account.toLowerCase() !== "all") {
            filtersApplied.account = account;
        }
        if (invoiceType && invoiceType.toLowerCase() !== "all") {
            filtersApplied.invoiceType = invoiceType;
        }
        if (status && status.toLowerCase() !== "all") {
            filtersApplied.status = status;
        }


        // Create the report document
        const reportDoc = {
            reportType,
            reportName,
            generatedBy: body.createdBy || new mongoose.Types.ObjectId(), // Required field
            filtersApplied,
            totalInvoices: items.length,
            reportData: items,
            data: reportData,
        };

        console.log("reportDoc----->", reportDoc)

        console.log("Creating report with:", JSON.stringify(reportDoc, null, 2));

        // Save the report
        const report = await Report.create(reportDoc);

        // Format the response to match what the frontend expects.
        // (Note: your GET endpoint will supply default display values if a filter is missing.)
        const formattedReport = {
            _id: report._id,
            reportType: report.reportType,
            reportName: report.reportName,
            filtersApplied: report.filtersApplied || {},
            totalInvoices: report.totalInvoices || 0,
            totalSales: reportData.totalSales,
            createdAt: report.createdAt,
            data: reportDoc,
        };

        return NextResponse.json(
            {
                message: "Report generated successfully",
                reportId: report._id,
                report: formattedReport,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error generating report:", error);
        return NextResponse.json(
            {
                message: "Error generating report",
                error: (error as Error).message,
                stack: (error as Error).stack,
            },
            { status: 500 }
        );
    }
}
