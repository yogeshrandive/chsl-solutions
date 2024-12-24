"use client";

export default function Error({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Something went wrong!</h2>
                <button
                    onClick={() => reset()}
                    className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
