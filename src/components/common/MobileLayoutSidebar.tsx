'use client';

import React from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from '../ui/button';
import { FileText, Menu } from 'lucide-react';
import Link from 'next/link';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { menuItems } from '@/constants/menuItems';

const MobileLayoutSidebar = () => {
    const pathname = usePathname();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0">
                {/* Accessibility Enhancements */}
                <SheetTitle>
                    <VisuallyHidden>Mobile Navigation Sidebar</VisuallyHidden>
                </SheetTitle>
                <SheetDescription>
                    <VisuallyHidden>Navigate to different sections of the application.</VisuallyHidden>
                </SheetDescription>

                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <FileText className="h-4 w-4" />
                        </div>
                        <span>FBR Software</span>
                    </Link>
                </div>

                <nav className="grid gap-2 p-4 text-lg font-medium">
                    {menuItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                                item.match(pathname)
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
};

export default MobileLayoutSidebar;
