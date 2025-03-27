'use client'

import { LogOut } from 'lucide-react';
import React from 'react'

const LogoutButton = () => {

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Redirect to login page or update UI state
                window.location.href = '/sign-in';
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <>
            <div onClick={() => handleLogout()} className='flex gap-2 cursor-pointer'>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </div>
        </>
    )
}

export default LogoutButton
