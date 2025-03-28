
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
    return (
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[60vh]">
            <div className="max-w-lg w-full">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>
                        You don&apos;t have permission to view this page.
                    </AlertDescription>
                </Alert>
                <Button variant="outline" className="mt-4" asChild>
                    <Link href="/dashboard">
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
        </div>
    );
}