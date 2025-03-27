'use client'

import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from '../ui/button'
import { ChevronDown, FileText, Menu } from 'lucide-react'
import Link from 'next/link'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { menuItems } from '@/constants/menuItems'
const MobileLayoutSidebar = () => {
    const pathname = usePathname()
    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                    <div className="flex h-16 items-center border-b px-6">
                        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <FileText className="h-4 w-4" />
                            </div>
                            <span>FBR Software</span>
                        </Link>
                    </div>
                    <nav className="grid gap-2 p-4 text-lg font-medium">
                        {menuItems.map((item) =>
                            item.children ? (
                                <DropdownMenu key={item.title}>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            className={cn(
                                                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                                                item.match(pathname)
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {item.title}
                                            <ChevronDown className="ml-auto h-4 w-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="start" sideOffset={0}>
                                        {item.children.map((child) => (
                                            <DropdownMenuItem key={child.title} asChild>
                                                <Link href={child.href} className={cn("w-full", child.match(pathname) && "bg-muted")}>
                                                    {child.title}
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                                        item.match(pathname)
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.title}
                                </Link>
                            ),
                        )}
                    </nav>
                </SheetContent>
            </Sheet>
        </>
    )
}

export default MobileLayoutSidebar
