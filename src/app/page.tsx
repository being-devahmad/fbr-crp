import { LayoutDashboard, Shield, Users } from "lucide-react"
import { getUser } from "@/actions/get-user";
import AuthButtons from "@/components/AuthButtons";


export default async function HomePage() {
  const isAuthenticated = await getUser();


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-8 py-16 md:py-0 gap-12 max-w-7xl mx-auto">
        <div className="flex-1 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Welcome to <span className="text-primary">FBR</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            An invoice management system for your organization. Sign in to access your personalized dashboard.
          </p>
          <AuthButtons isAuthenticated={isAuthenticated} />
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/40 rounded-lg blur-lg"></div>
            <div className="relative bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Intuitive Dashboard</h3>
                  <p className="text-sm text-gray-500">Manage all your invoices in one place</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Team Collaboration</h3>
                  <p className="text-sm text-gray-500">Work together seamlessly</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Role-Based Access</h3>
                  <p className="text-sm text-gray-500">Secure and customized for each role</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main >
    </div >
  );
}
