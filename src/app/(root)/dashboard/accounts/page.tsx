import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { AccountsTable } from "@/components/accounts/AccountsTable"

export default function AccountsPage() {
    return (
        <div className="grid gap-6 p-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
                    <p className="text-muted-foreground">Manage your customer and company accounts</p>
                </div>

                <Link href="/dashboard/accounts/create" className="flex items-center gap-3">
                    <Button asChild>
                        <span>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Add Account</span>
                        </span>
                    </Button>
                </Link>

            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>All Accounts</CardTitle>
                    <CardDescription>
                        A list of all accounts in your system. You can sort, filter and manage accounts from here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AccountsTable />
                </CardContent>
            </Card>
        </div>
    )
}

