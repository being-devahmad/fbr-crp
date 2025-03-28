import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { getAllInvoices } from '@/actions/invoice';

const InvoiceStatus = async () => {

    const invoices = await getAllInvoices()
    const totalInvoices = invoices.invoices

    const invoicesCount = totalInvoices.length;
    const statusCounts = totalInvoices.reduce(
        (acc: { [status: string]: number; }, invoice: { status: string | number; }) => {
            acc[invoice.status] = (acc[invoice.status] || 0) + 1;
            return acc;
        },
        { paid: 0, pending: 0, cancelled: 0 }
    );

    // Calculate percentages
    const paidPercentage = invoicesCount ? Math.round((statusCounts.paid / invoicesCount) * 100) : 0;
    const pendingPercentage = invoicesCount ? Math.round((statusCounts.pending / invoicesCount) * 100) : 0;
    const cancelledPercentage = invoicesCount ? Math.round((statusCounts.cancelled / invoicesCount) * 100) : 0;

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Invoice Status</CardTitle>
                <CardDescription>Distribution of invoices by status</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="flex h-[240px] items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="h-40 w-40 rounded-full border-8 border-primary bg-background flex items-center justify-center text-4xl font-bold">
                                    {paidPercentage}%
                                </div>
                                <span className="mt-2 font-medium">Paid</span>
                            </div>
                            <div className="flex flex-col gap-2 justify-center">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                                    <span>Paid ({paidPercentage}%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-muted-foreground"></div>
                                    <span>Pending ({pendingPercentage}%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-muted-foreground"></div>
                                    <span>Cancelled ({cancelledPercentage}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default InvoiceStatus;
