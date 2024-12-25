export default function LoginLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto">
                </div>
                <p className="text-lg text-gray-600">Loading Simblling...</p>
            </div>
        </div>
    );
}
