import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeProvider } from "next-themes"
import { ThemeToggle } from "@/components/ThemeToggle"
import MobileLayoutSidebar from "@/components/common/MobileLayoutSidebar"
import Sidebar from "@/components/common/Sidebar"
import { ReactNode, Suspense } from "react"
import { getUser } from "@/actions/get-user"
import { FileText, User } from "lucide-react"
import LogoutButton from "@/components/LogoutButton"
import { UserType } from "@/types"

interface DashboardLayoutProps {
    children: ReactNode;
}


export default async function DashboardLayout({ children }: DashboardLayoutProps) {
    const user: UserType | null = await getUser();

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex flex-col h-screen bg-muted/10">
                {/* Header */}
                <header className="flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 shrink-0 sticky top-0 z-30 shadow-sm">
                    <MobileLayoutSidebar />
                    <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-xl">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <FileText className="h-4 w-4" />
                        </div>
                        <span>FBR Software</span>
                    </Link>

                    <div className="ml-auto flex items-center gap-4">
                        <ThemeToggle />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Suspense fallback={<AvatarFallback>...</AvatarFallback>}>
                                        <Avatar className="h-8 w-8 border-2 border-primary/10">
                                            <AvatarImage src={user?.avatarUrl || ""} alt={`${user?.firstName}-${user?.lastName}`} />
                                            <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </Suspense>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <LogoutButton />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <Sidebar user={user} />

                    {/* Main content */}
                    <main className="flex-1 overflow-auto p-3 relative">
                        <div className="container mx-auto max-w-7xl ">{children}</div>
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
}








