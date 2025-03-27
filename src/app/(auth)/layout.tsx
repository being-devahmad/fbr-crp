import type React from "react"
import { CircleDollarSign, BarChart3 } from 'lucide-react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-screen flex">
            {/* Left side - Branding and features */}
            <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-primary/90 to-primary/70
             text-white p-12 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Floating elements */}
                <div className="absolute -right-20 top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -left-20 bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold flex items-center">
                            <CircleDollarSign className="mr-2 h-10 w-10" />
                            FBR
                        </h1>
                        <p className="text-xl mt-2 text-white/80">
                            Professional invoicing for modern businesses
                        </p>
                    </div>

                    <div className="flex-grow">
                        <div className="max-w-md space-y-12">
                            <div className="relative">
                                <div className="relative h-[300px] w-[500px] flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-2xl overflow-hidden">
                                    <svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="50" y="30" width="300" height="190" rx="8" fill="rgba(255,255,255,0.2)" />
                                        <rect x="70" y="50" width="260" height="30" rx="4" fill="rgba(255,255,255,0.3)" />
                                        <rect x="70" y="90" width="120" height="10" rx="2" fill="rgba(255,255,255,0.2)" />
                                        <rect x="70" y="110" width="180" height="10" rx="2" fill="rgba(255,255,255,0.2)" />
                                        <rect x="70" y="130" width="150" height="10" rx="2" fill="rgba(255,255,255,0.2)" />
                                        <rect x="70" y="150" width="200" height="10" rx="2" fill="rgba(255,255,255,0.2)" />
                                        <rect x="70" y="180" width="260" height="20" rx="4" fill="rgba(255,255,255,0.3)" />
                                        <circle cx="310" cy="65" r="10" fill="rgba(255,255,255,0.4)" />
                                        <path d="M310 60V70M305 65H315" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
                                    </svg>
                                </div>
                                <div className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20">
                                    <BarChart3 className="h-8 w-8" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Auth forms */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-background">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-8">
                        <h1 className="text-3xl font-bold flex items-center text-primary">
                            <CircleDollarSign className="mr-2 h-8 w-8" />
                            InvoiceHub
                        </h1>
                        <p className="text-muted-foreground mt-1">Professional invoicing for modern businesses</p>
                    </div>

                    <div className="bg-card rounded-xl shadow-sm border p-8">{children}</div>

                    <div className="mt-8 text-center text-sm text-muted-foreground lg:hidden">
                        <p>© {new Date().getFullYear()} InvoiceHub. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
