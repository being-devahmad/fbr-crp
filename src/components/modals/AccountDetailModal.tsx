"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { User, Building, Tag, Calendar } from "lucide-react"
import { formatDate } from "@/utils/formatDate"

// Update the AccountDetailsProps interface to match the simplified account structure
interface AccountDetailsProps {
    isOpen: boolean
    onClose: () => void
    account: {
        _id: string
        name: string
        code: string
        cnic: string
        branch: string
        type: string
        createdAt: string
    } | null
}

export function AccountDetailsModal({ isOpen, onClose, account }: AccountDetailsProps) {
    if (!account) return null

    // Get account type badge variant
    const getAccountTypeVariant = (type: string) => {
        switch (type?.toLowerCase()) {
            case "customer":
                return "default"
            case "supplier":
                return "outline"
            case "employee":
                return "secondary"
            case "bank":
                return "default"
            default:
                return "default"
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <DialogTitle className="text-xl flex items-center gap-2">
                                <User className="h-5 w-5" />
                                {account.name}
                            </DialogTitle>
                            <DialogDescription className="mt-1 flex items-center gap-2">
                                <Badge variant={getAccountTypeVariant(account.type)}>{account.type}</Badge>
                                <Badge variant="outline" className="ml-2">
                                    {account.code}
                                </Badge>
                            </DialogDescription>
                        </div>
                        {/* <Button variant="outline" size="icon" onClick={onClose}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button> */}
                    </div>
                </DialogHeader>

                <div className="p-6 pt-2">
                    {/* Account Details */}
                    <Card>
                        <CardContent className="p-4 mt-2">
                            <h3 className="font-semibold text-sm text-muted-foreground mb-4">ACCOUNT DETAILS</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-2">
                                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Name</p>
                                        <p className="font-medium">{account.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-muted-foreground mt-0.5"
                                    >
                                        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                                        <path d="M18 14h-8" />
                                        <path d="M15 18h-5" />
                                        <path d="M10 6h8v4h-8V6Z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Code</p>
                                        <p>{account.code}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-muted-foreground mt-0.5"
                                    >
                                        <rect width="20" height="14" x="2" y="5" rx="2" />
                                        <line x1="2" x2="22" y1="10" y2="10" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-muted-foreground">CNIC</p>
                                        <p>{account.cnic}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Branch</p>
                                        <p>{account.branch}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Type</p>
                                        <p>{account.type}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Calendar className="text-muted-foreground w-4 h-4" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Created On</p>
                                        <p>{formatDate(account.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* <DialogFooter className="p-6 pt-2 border-t">
                    <div className="flex flex-col-reverse sm:flex-row justify-between w-full gap-2">
                        <div className="flex gap-2 mt-2 sm:mt-0">
                            <Button variant="outline" size="sm" className="gap-1">
                                <Printer className="h-4 w-4" />
                                <span className="hidden sm:inline">Print</span>
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1">
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="default" size="sm" className="gap-1">
                                <Edit className="h-4 w-4" />
                                <span>Edit Account</span>
                            </Button>
                        </div>
                    </div>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}

