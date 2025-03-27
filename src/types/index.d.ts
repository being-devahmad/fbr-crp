export interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatarUrl?: string; // Optional since it may be empty
}
