import { NextResponse } from "next/server";

// Utility function for error handling
export function handleErrorResponse(res: typeof NextResponse, error: Error, statusCode = 500) {
    console.error("Error:", error);
    return res.json({
        success: false,
        error: {
            message: error.message || "Something went wrong"
        }
    }, {
        status: statusCode
    });
}