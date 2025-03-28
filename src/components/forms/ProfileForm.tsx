"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { useRouter } from "next/navigation"
import { Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { userSchema } from "@/validations"
import { uploadImageToCloudinary } from "@/actions/cloudinary"
import { updateUser } from "@/actions/get-user"

type ProfileFormValues = z.infer<typeof userSchema>

type ProfileFormProps = {
    image?: string;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl?: string;
    // Add any other props the form needs
}

// Client-side File to base64 conversion
function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}


export default function ProfileForm({
    image,
    firstName,
    lastName,
    email,
    imageUrl
}: ProfileFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(image || null)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstName: firstName || "",
            lastName: lastName || "",
            email: email || "",
            imageUrl: image || "",
        },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    async function onSubmit(data: ProfileFormValues) {
        setIsLoading(true)
        try {
            let imageUrl = image
            if (imageFile) {
                // Convert to base64 on client before uploading
                const base64Image = await fileToBase64(imageFile)
                imageUrl = await uploadImageToCloudinary(base64Image)
                console.log("imageUrl", imageUrl)
            }

            const result = await updateUser({
                firstName: data.firstName,
                lastName: data.lastName,
                image: imageUrl || "",
            })

            if (result.success) {
                toast.success(result.message || "Your profile has been updated successfully.")
                router.refresh()
            } else {
                toast.error(result.message || "Failed to update profile")
            }
        } catch (error) {
            console.error("Profile update error:", error)
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="h-24 w-24">
                                    {(previewUrl || imageUrl) ? (
                                        <AvatarImage src={previewUrl || imageUrl} alt="Profile" />
                                    ) : (
                                        <AvatarFallback className="text-2xl">
                                            {firstName?.charAt(0)}
                                            {lastName?.charAt(0)}
                                        </AvatarFallback>
                                    )}
                                </Avatar>

                                <div className="flex items-center gap-2">
                                    <label htmlFor="picture" className="cursor-pointer">
                                        <div className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                                            <Upload className="h-4 w-4" />
                                            <span>Change Picture</span>
                                        </div>
                                        <input id="picture" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} readOnly className="bg-muted" />
                                            </FormControl>
                                            <FormDescription>Email cannot be changed</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

