'use client';

import React, { useState, memo } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { debounce } from 'lodash';
import { menuItems } from '@/constants/menuItems';
import UserProfile from './UserProfile';
import { UserType } from '@/types';

interface SidebarProps {
    user: UserType | null;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const pathname = usePathname();

    // Debounced Sidebar Toggle for performance improvement
    const toggleSidebar = debounce(() => setSidebarCollapsed((prev) => !prev), 200);

    return (
        <aside
            className={cn(
                'hidden md:flex flex-col border-r bg-card/50 backdrop-blur-sm shrink-0 transition-all duration-300 ease-in-out z-20',
                sidebarCollapsed ? 'w-[70px]' : 'w-64'
            )}
        >
            {/* Sidebar Header with Toggle Button */}
            <div className="flex items-center justify-end p-2 border-b">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="h-8 w-8 rounded-full"
                    aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            {/* Sidebar Navigation */}
            <nav className={cn('flex-1 py-4', sidebarCollapsed ? 'px-2' : 'px-3')}>
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={`menu-item-${item.title}`}
                            href={item.href}
                            prefetch={true}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted',
                                item.match(pathname)
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-muted-foreground hover:text-foreground',
                                sidebarCollapsed ? 'justify-center' : ''
                            )}
                        >
                            <div
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-md',
                                    item.match(pathname) ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                            </div>
                            {!sidebarCollapsed && <span>{item.title}</span>}
                        </Link>
                    )
                    )}
                </div>
            </nav>

            {/* User Profile at Bottom of Sidebar */}
            {!sidebarCollapsed && <UserProfile user={user} />}
        </aside>
    );
};

// Memoized Sidebar for Performance
export default memo(Sidebar);
