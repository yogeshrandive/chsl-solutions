export default function DashboardLoading() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded">
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="p-6 bg-white rounded-lg shadow-sm space-y-3"
                    >
                        <div className="h-5 w-24 bg-gray-200 animate-pulse rounded">
                        </div>
                        <div className="h-8 w-28 bg-gray-200 animate-pulse rounded">
                        </div>
                        <div className="h-4 w-36 bg-gray-200 animate-pulse rounded">
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 p-6 bg-white rounded-lg shadow-sm space-y-4">
                    <div className="h-6 w-32 bg-gray-200 animate-pulse rounded">
                    </div>
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-gray-200 animate-pulse rounded">
                        </div>
                        <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded">
                        </div>
                    </div>
                </div>
                <div className="col-span-3 p-6 bg-white rounded-lg shadow-sm space-y-4">
                    <div className="h-6 w-32 bg-gray-200 animate-pulse rounded">
                    </div>
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-gray-200 animate-pulse rounded">
                        </div>
                        <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
