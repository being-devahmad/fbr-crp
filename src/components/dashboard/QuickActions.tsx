import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { FileTextIcon, PlusIcon, UserIcon } from 'lucide-react';

const QuickActions = () => {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    {/* Add New Account */}
                    <Link href="/dashboard/accounts/create" passHref prefetch>
                        <Button variant="outline" className="w-full justify-start" size="lg">
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Add New Account</span>
                        </Button>
                    </Link>

                    {/* Create New Invoice */}
                    <Link href="/dashboard/invoices/create" passHref prefetch>
                        <Button className="w-full justify-start" size="lg">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            <span>Create New Invoice</span>
                        </Button>
                    </Link>

                    {/* Generate Reports */}
                    <Link href="/dashboard/reports/sales" passHref prefetch>
                        <Button variant="outline" className="w-full justify-start" size="lg">
                            <FileTextIcon className="mr-2 h-4 w-4" />
                            <span>Generate Reports</span>
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuickActions;
