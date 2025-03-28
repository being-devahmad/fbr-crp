import React from "react";
import {
    CheckCircleIcon,
    ClockIcon,
    DollarSignIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvoiceStatus from "@/components/dashboard/InvoiceStatus";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import { getAllInvoices } from "@/actions/invoice";

const Dashboard = async () => {
    const { invoices: totalInvoices } = await getAllInvoices();

    // Filter invoices by status
    const paidInvoices = totalInvoices?.filter((
        invoice: { status: string; }) => invoice.status === "paid");
    const pendingInvoices = totalInvoices.filter((
        invoice: { status: string; }) => invoice.status === "pending");
    const cancelledInvoices = totalInvoices.filter((
        invoice: { status: string; }) => invoice.status === "cancelled");

    // Calculate totals dynamically
    const totalPayment = totalInvoices.reduce((sum: number, invoice: { payment: { total: number } }) => sum + invoice.payment.total, 0);
    const totalPaid = paidInvoices.reduce((sum: number, invoice: { payment: { total: number } }) => sum + invoice.payment.total, 0);
    const totalPending = pendingInvoices.reduce((sum: number, invoice: { payment: { total: number } }) => sum + invoice.payment.total, 0);
    const totalCancelled = cancelledInvoices.reduce((sum: number, invoice: { payment: { total: number } }) => sum + invoice.payment.total, 0);


    return (
        <>
            <main className="flex-1 p-6">
                <div className="flex flex-col gap-6">
                    {/* Page Title and Actions */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Dashboard
                            </h1>
                            <p className="text-muted-foreground">
                                Manage and track your invoices
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Total Payment */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Payment
                                </CardTitle>
                                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    PKR {totalPayment.toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Paid Invoices */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Paid Invoices
                                </CardTitle>
                                <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    PKR {totalPaid.toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pending Invoices */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Pending Invoices
                                </CardTitle>
                                <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    PKR {totalPending.toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cancelled Invoices */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Cancelled Invoices
                                </CardTitle>
                                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    PKR {totalCancelled.toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Invoices */}
                    <RecentInvoices />

                    {/* Invoice Summary */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <InvoiceStatus />
                        <QuickActions />
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
