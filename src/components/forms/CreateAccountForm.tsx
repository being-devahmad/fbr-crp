'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Save } from 'lucide-react'

const CreateAccountForm = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        cnic: "",
        contactNumber: "",
        city: "",
        branch: "",
        type: "",
    })

    const [errors, setErrors] = useState({
        name: "",
        cnic: "",
        contactNumber: "",
        city: "",
        branch: "",
        type: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error when user types
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const handleBranchChange = (value: string) => {
        setFormData((prev) => ({ ...prev, branch: value }))
        // Clear error when user selects
        if (errors.branch) {
            setErrors((prev) => ({ ...prev, branch: "" }))
        }
    }

    const handleTypeChange = (value: string) => {
        setFormData((prev) => ({ ...prev, type: value }))

        // Clear error when user selects
        if (errors.type) {
            setErrors((prev) => ({ ...prev, type: "" }))
        }
    }

    const formatCNIC = (value: string) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, "")
        // Format as xxxxx-xxxxxxx-x
        let formatted = ""
        for (let i = 0; i < digits.length && i < 13; i++) {
            if (i === 5 || i === 12) {
                formatted += "-"
            }
            formatted += digits[i]
        }
        return formatted
    }

    const handleCNICChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCNIC(e.target.value)
        setFormData((prev) => ({ ...prev, cnic: formatted }))

        // Clear error when user types
        if (errors.cnic) {
            setErrors((prev) => ({ ...prev, cnic: "" }))
        }
    }

    const validateForm = () => {
        const newErrors = {
            name: "",
            cnic: "",
            contactNumber: "",
            city: "",
            branch: "",
            type: "",
        }

        let isValid = true

        if (!formData.name.trim()) {
            newErrors.name = "Account name is required"
            isValid = false
        }

        if (!formData.cnic.trim()) {
            newErrors.cnic = "CNIC is required"
            isValid = false
        } else if (!/^\d{5}-\d{7}-\d$/.test(formData.cnic)) {
            newErrors.cnic = "CNIC must be in format: xxxxx-xxxxxxx-x"
            isValid = false
        }

        if (!formData.contactNumber.trim()) {
            newErrors.contactNumber = "Contact number is required"
            isValid = false
        }

        if (!formData.city.trim()) {
            newErrors.city = "City name is required"
            isValid = false
        }

        if (!formData.branch.trim()) {
            newErrors.branch = "Branch is required"
            isValid = false
        }

        if (!formData.type) {
            newErrors.type = "Account type is required"
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch("/api/accounts/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()
            console.log("data->", data)

            if (!response.ok) {
                toast.error(data.error)
                throw new Error(data.error || "Something went wrong")
            }

            // Show success toast
            toast.success(`Account created: ${formData.name} has been successfully created.`)

            // Redirect to accounts list
            router.push("/dashboard/accounts")
        } catch (error) {
            // toast.error("There was an error creating the account. Please try again.")
            console.log("error", error);
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Card className='overflow-hidden'>
                <form onSubmit={handleSubmit}>
                    <CardHeader className="px-4 py-4 md:px-6">
                        <CardTitle className="text-xl">Account Information</CardTitle>
                        <CardDescription className="text-xs md:text-sm">
                            Enter the details for the new account. The account code will be automatically generated.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 px-4 md:px-6 md:space-y-6">
                        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Account Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Enter account name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={errors.name ? "border-destructive" : ""}
                                />
                                {errors.name && <p className="text-xs text-destructive md:text-sm">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cnic">
                                    CNIC <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="cnic"
                                    name="cnic"
                                    placeholder="e.g. 12345-6789012-3"
                                    value={formData.cnic}
                                    onChange={handleCNICChange}
                                    className={errors.cnic ? "border-destructive" : ""}
                                />
                                {errors.cnic && <p className="text-xs text-destructive md:text-sm">{errors.cnic}</p>}
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="contactNumber">
                                    Contact Number <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="contactNumber"
                                    name="contactNumber"
                                    placeholder="Enter contact number"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    className={errors.contactNumber ? "border-destructive" : ""}
                                />
                                {errors.contactNumber &&
                                    <p className="text-xs text-destructive md:text-sm">{errors.contactNumber}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">
                                    City <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="city"
                                    name="city"
                                    placeholder="Enter city name"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={errors.city ? "border-destructive" : ""}
                                />
                                {errors.city && <p className="text-xs text-destructive md:text-sm">{errors.city}</p>}
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="branch">
                                    Branch <span className="text-destructive">*</span>
                                </Label>
                                <Select value={formData.branch} onValueChange={handleBranchChange}>
                                    <SelectTrigger id="branch" className={errors.branch ? "border-destructive" : ""}>
                                        <SelectValue placeholder="Select branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="head office">Head Office</SelectItem>
                                        <SelectItem value="main branch">Main Branch</SelectItem>
                                        <SelectItem value="side branch">Side Branch</SelectItem>
                                        <SelectItem value="regional branch">Regional Branch</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.branch && <p className="text-xs text-destructive md:text-sm">{errors.branch} </p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">
                                    Account Type <span className="text-destructive">*</span>
                                </Label>
                                <Select value={formData.type} onValueChange={handleTypeChange}>
                                    <SelectTrigger id="type" className={errors.type ? "border-destructive" : ""}>
                                        <SelectValue placeholder="Select account type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="customer">Customer Account</SelectItem>
                                        <SelectItem value="company">Company Account</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && <p className="text-xs text-destructive md:text-sm">{errors.type}</p>}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-3 border-t bg-muted/50 px-4 py-4 md:flex-row md:justify-between md:space-y-0 md:px-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/dashboard/accounts")}
                            disabled={isSubmitting}
                            className="w-full md:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                            {isSubmitting ? (
                                <span className="flex items-center gap-1">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Creating...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    Create Account
                                </span>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </>
    )
}

export default CreateAccountForm
