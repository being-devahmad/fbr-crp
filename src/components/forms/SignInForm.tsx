"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import debounce from "lodash/debounce"
import { loginSchema } from "@/validations"


export default function SignInForm() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    })

    // Form submit handler
    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        setLoading(true)
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(values),
            })

            let data
            try {
                data = await response.json()
            } catch {
                throw new Error("Unexpected server response. Please try again.")
            }

            if (!response.ok) throw new Error(data.error || "Something went wrong")

            toast.success(data.message || "Login successful!")
            router.replace("/dashboard")
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Login failed.")
        } finally {
            setLoading(false)
        }
    }

    const debouncedSubmit = debounce(onSubmit, 500)

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Sign In</h1>
                <p className="text-muted-foreground">Enter your credentials to access your account</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(debouncedSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="someone@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <div className="flex items-center justify-center gap-3">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                <span>Signing In...</span>
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
            </Form>

            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
