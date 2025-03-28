import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import Link from 'next/link'
import { getAllInvoices } from '@/actions/invoice'

interface Invoice {
    _id: string;
    invoiceNumber: string;
    invoiceDate: string;
    invoiceType: "simple" | "detailed" | "tax";
    status: "pending" | "paid" | "cancelled";
    account: {
        id: string;
        name: string;
        type: string;
        cnic?: string;
        mobileNumber?: string;
        creditLimit?: number;
        city?: string;
    };
    items: Array<{
        id: string;
        productId: string;
        productName: string;
        quantity: number;
        rate: number;
        total: number;
    }>;
    payment: {
        expense: number;
        discount: number;
        subTotal: number;
        total: number;
    };
    shipping?: {
        barCode: string;
        cartons: number;
        bags: number;
        notes: string;
    };
    createdAt: string;
}

const RecentInvoices = async () => {
    const invoices = await getAllInvoices()
    const totalInvoices = invoices.invoices

    // Filter invoices based on the current month
    const currentMonthInvoices = totalInvoices.filter((invoice: Invoice) => {
        const invoiceDate = new Date(invoice.invoiceDate) // Access `invoiceDate` from object
        const today = new Date()
        return invoiceDate.getMonth() === today.getMonth() && invoiceDate.getFullYear() === today.getFullYear()
    })

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>You have {currentMonthInvoices.length} invoices this month.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentMonthInvoices.map((invoice: Invoice) => (
                            <TableRow key={invoice._id}>
                                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                <TableCell>{invoice.account.name}</TableCell>
                                <TableCell>PKR {invoice.payment.total.toLocaleString()}</TableCell>
                                <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant={invoice.status === "cancelled" ? "destructive" : "default"}>
                                        {invoice.status === "paid"
                                            ? "Paid"
                                            : invoice.status === "pending"
                                                ? "Pending"
                                                : invoice.status === "cancelled"
                                                    ? "Cancelled"
                                                    : ""
                                        }

                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button variant="outline" size="sm">
                    <Link href={'/dashboard/invoices'}>
                        <span>View all invoices</span>
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default RecentInvoices
