
import dbConnect from "@/lib/db";
import Report from "@/models/Report";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const id = (await params).id;
        const report = await Report.findById(id).populate("filtersApplied.account");
        if (!report) {
            return NextResponse.json({ message: "Report not found" }, { status: 404 });
        }
        return NextResponse.json(report);
    } catch (error) {
        console.error("Error retrieving report:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
