import type React from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CreateAccountForm from "@/components/forms/CreateAccountForm"

export default function CreateAccountPage() {


    return (
        <div className="grid gap-4 p-3 md:gap-6 md:p-5">
            <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Create Account</h1>
                    <p className="text-sm text-muted-foreground md:text-base">
                        Add a new customer or company account to the system
                    </p>
                </div>
                <Link href="/dashboard/accounts">
                    <Button variant="outline" asChild className="w-full md:w-auto">
                        <span>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Accounts
                        </span>
                    </Button>
                </Link>
            </div>

            <CreateAccountForm />
        </div>
    )
}

