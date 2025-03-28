"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckSquare, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { menuItems } from "@/constants/menuItems"

interface User {
    _id: string
    name: string
    firstName: string
    lastName: string
    email: string
    image: string
    role: string
    permissions: { module: string }[]
}


export default function UserManagementPage() {
    const params = useParams()
    const userId = params.id as string

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set())

    // const menuItems: MenuItem[] = [
    //     { id: "dashboard", title: "Dashboard" },
    //     { id: "accounts", title: "Accounts" },
    //     { id: "invoices", title: "Invoices" },
    //     { id: "reports", title: "Reports" },
    //     { id: "users", title: "Users" },
    // ]

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch(`/api/users/${userId}`)

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`)
                }

                const data = await response.json()
                setUser(data.user)

                // Initialize selected modules from user permissions
                const userModules = new Set<string>(data.user.permissions?.map((p: { module: string }) => p.module) || [])
                setSelectedModules(userModules)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch user data")
                console.error("Error fetching user:", err)
            } finally {
                setLoading(false)
            }
        }

        if (userId) {
            fetchUser()
        }
    }, [userId])

    // Toggle module selection
    const toggleModule = (moduleId: string) => {
        setSelectedModules((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(moduleId)) {
                newSet.delete(moduleId)
            } else {
                newSet.add(moduleId)
            }
            return newSet
        })
    }

    // Select all modules
    const selectAllModules = () => {
        const allModuleIds = menuItems.map((item) => item.id)
        setSelectedModules(new Set(allModuleIds))
    }

    // Save permissions
    const savePermissions = async () => {
        try {
            setSaving(true)
            setError(null)

            // Convert Set to array of objects
            const permissions = Array.from(selectedModules).map((module) => ({ module }))

            const response = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ permissions }),
            })

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            toast.success("User permissions updated successfully")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update permissions")
            console.error("Error updating permissions:", err)
            toast.error("Failed to update permissions")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto pt-2 px-4 max-w-7xl flex justify-center items-center h-[70vh]">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p>Loading user data...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto pt-2 px-4 max-w-7xl">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="mt-4">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/users">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container mx-auto pt-2 px-4 max-w-7xl">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>User not found</AlertDescription>
                </Alert>
                <div className="mt-4">
                    <Button variant="outline" asChild>
                        <Link href="/users">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto pt-2 px-4 max-w-7xl">
            <div className="flex justify-end items-center pb-2">
                <Button variant="outline" asChild className="w-full sm:w-auto">
                    <Link href="/users">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Users
                    </Link>
                </Button>
            </div>
            {/* Header Section */}
            <div className="bg-card rounded-lg p-6 mb-8 border shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Manage Access for {user.name}</h1>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Email:</span> {user.email}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Role:</span> {user.role}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Select All Button */}
            <div className="mb-6 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Manage module access permissions</div>
                <Button variant="outline" size="sm" onClick={selectAllModules}>
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Select All
                </Button>
            </div>

            <div className="space-y-8">
                <div>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold mb-4">Main Menu</h2>
                        <Button variant="default" size="sm" onClick={savePermissions} disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save
                                </>
                            )}
                        </Button>
                    </div>
                    <Separator className="mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {menuItems.map((item) => (
                            <Card key={item.id} className="shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center space-x-2 pt-2">
                                        <Checkbox
                                            id={`enable-${item.id}`}
                                            checked={selectedModules.has(item.id)}
                                            onCheckedChange={() => toggleModule(item.id)}
                                        />
                                        <label
                                            htmlFor={`enable-${item.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed 
                                            peer-disabled:opacity-70"
                                        >
                                            Enable
                                        </label>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

