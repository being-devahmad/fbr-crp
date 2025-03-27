"use client";

import { useRouter } from "next/navigation";
import { LayoutDashboard, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthButtons({ isAuthenticated }: { isAuthenticated: boolean }) {
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            {isAuthenticated ? (
                <Button size="lg" className="gap-2 text-base cursor-pointer" onClick={() => router.push("/dashboard")}>
                    <LayoutDashboard className="w-5 h-5" />
                    Go to Dashboard
                </Button>
            ) : (
                <>
                    <Button size="lg" className="gap-2 text-base cursor-pointer" onClick={() => router.push("/sign-in")}>
                        <User className="w-5 h-5" />
                        Sign In
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="gap-2 text-base cursor-pointer"
                        onClick={() => router.push("/sign-up")}
                    >
                        <Shield className="w-5 h-5" />
                        Create Account
                    </Button>
                </>
            )}
        </div>
    );
}
