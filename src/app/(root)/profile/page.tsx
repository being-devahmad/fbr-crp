
import { getUser } from "@/actions/get-user"
import ProfileForm from "@/components/forms/ProfileForm"
export default async function ProfilePage() {
    const user = await getUser()

    return (
        <div className="container max-w-4xl mx-auto py-10">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                    <p className="text-muted-foreground">
                        Manage your personal information and account settings
                    </p>
                </div>
                <ProfileForm image={user?.avatarUrl || ""}
                    firstName={user?.firstName || ""}
                    lastName={user?.lastName || ""}
                    email={user?.email || ""}
                    imageUrl={user?.avatarUrl || ""} />
            </div>
        </div>
    )
}
