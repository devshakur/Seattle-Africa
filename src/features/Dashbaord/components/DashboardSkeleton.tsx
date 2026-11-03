function Bone({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse rounded-lg bg-zinc-200 ${className}`} />;
}

function CardShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`rounded-2xl border border-gray-200/90 bg-white p-5 shadow-xs ${className}`}>
            {children}
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading dashboard">
            {/* Welcome header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <Bone className="h-7 w-56" />
                    <Bone className="h-4 w-72 max-w-full" />
                </div>
                <Bone className="h-9 w-40 rounded-full" />
            </div>

            {/* Quick stats */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <CardShell key={i}>
                        <div className="mb-4 flex items-start justify-between">
                            <Bone className="h-10 w-10 rounded-xl" />
                            <Bone className="h-5 w-14 rounded-full" />
                        </div>
                        <Bone className="mb-2 h-4 w-24" />
                        <Bone className="h-7 w-32" />
                    </CardShell>
                ))}
            </div>

            {/* Ticker */}
            <div className="mb-6 flex items-center gap-6 rounded-2xl border border-gray-200/90 bg-white p-3">
                <Bone className="h-8 w-24 shrink-0" />
                {[1, 2, 3, 4].map((i) => (
                    <Bone key={i} className="hidden h-4 w-36 shrink-0 sm:block" />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Hero card */}
                    <div className="rounded-3xl bg-zinc-200/70 p-6 sm:p-8">
                        <div className="flex flex-col justify-between gap-6 md:flex-row">
                            <div className="space-y-3">
                                <Bone className="h-4 w-40 bg-zinc-300" />
                                <Bone className="h-10 w-56 bg-zinc-300" />
                                <Bone className="h-4 w-44 bg-zinc-300" />
                            </div>
                            <div className="flex gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <Bone className="h-10 w-10 rounded-full bg-zinc-300" />
                                        <Bone className="h-3 w-10 bg-zinc-300" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Beneficiaries */}
                    <CardShell>
                        <div className="mb-4 flex items-center justify-between">
                            <Bone className="h-5 w-32" />
                            <Bone className="h-8 w-36" />
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Bone className="h-9 w-9 shrink-0 rounded-full" />
                                    <div className="flex-1 space-y-1.5">
                                        <Bone className="h-4 w-36" />
                                        <Bone className="h-3 w-24" />
                                    </div>
                                    <Bone className="h-8 w-16" />
                                </div>
                            ))}
                        </div>
                    </CardShell>
                </div>

                {/* Calculator */}
                <div className="lg:col-span-1">
                    <CardShell className="space-y-3">
                        <Bone className="h-5 w-28" />
                        <Bone className="h-20 w-full rounded-xl" />
                        <Bone className="h-20 w-full rounded-xl" />
                        <Bone className="h-4 w-40" />
                        <Bone className="h-11 w-full rounded-xl" />
                    </CardShell>
                </div>

                {/* Transactions */}
                <div className="lg:col-span-3">
                    <CardShell className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Bone className="h-5 w-44" />
                                <Bone className="h-3 w-60 max-w-full" />
                            </div>
                            <Bone className="h-8 w-24" />
                        </div>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Bone className="h-9 w-9 shrink-0 rounded-xl" />
                                <div className="flex-1 space-y-1.5">
                                    <Bone className="h-4 w-40 max-w-full" />
                                    <Bone className="h-3 w-24" />
                                </div>
                                <Bone className="h-4 w-20" />
                            </div>
                        ))}
                    </CardShell>
                </div>
            </div>
        </div>
    );
}

