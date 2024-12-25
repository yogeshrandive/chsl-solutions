import { redirect } from "next/navigation";
import { getUserDetails } from "@/lib/dal";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const userData = await getUserDetails();

  if (userData != null) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8">
        {/* Branding Section */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 p-8">
          <div className="space-y-4">
            {/* Creative Text Logo */}
            <div className="flex items-center space-x-2 mb-8">
              <div className="relative">
                <span className="text-5xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  SIMBLING
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full">
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900">
              Welcome Back!
            </h1>
            <p className="text-lg text-gray-600">
              Your complete billing and collection management solution
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100">
              <div className="text-primary mb-2">📊</div>
              <h3 className="font-semibold text-gray-900">Easy Billing</h3>
              <p className="text-sm text-gray-600">
                Streamlined billing process for your society
              </p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100">
              <div className="text-primary mb-2">💳</div>
              <h3 className="font-semibold text-gray-900">Smart Collections</h3>
              <p className="text-sm text-gray-600">
                Efficient payment collection system
              </p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100">
              <div className="text-primary mb-2">👥</div>
              <h3 className="font-semibold text-gray-900">Member Management</h3>
              <p className="text-sm text-gray-600">
                Complete member information system
              </p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100">
              <div className="text-primary mb-2">📈</div>
              <h3 className="font-semibold text-gray-900">Financial Reports</h3>
              <p className="text-sm text-gray-600">
                Detailed financial reporting
              </p>
            </div>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-block">
              <span className="text-4xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                SIMBLING
              </span>
              <div className="h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full mt-1">
              </div>
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
