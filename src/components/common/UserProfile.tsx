'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserType } from "@/types";


interface UserProfileProps {
    user: UserType | null; 
  }
  
  const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    // Handle loading state or case when user is null
    if (!user) {
        return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;
    }

    return (
        <div className="border-t p-4">
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border-2 border-primary/10">
                    <AvatarImage src={user.avatarUrl || ""} alt={`${user.firstName}-${user.lastName}`} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.email}</span>
                    <span className="text-xs text-muted-foreground">
                        {user.role}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
