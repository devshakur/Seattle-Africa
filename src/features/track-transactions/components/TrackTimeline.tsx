
import { Check, Clock, Circle } from "lucide-react";
import { TrackedTransaction } from "../hooks/useTrackTransaction";
import { cn } from "@/libs/utils";

export function TrackTimeline({
    transaction,
}: {
    transaction: TrackedTransaction;
}) {
    return (
        <div className="py-8">
            <h3 className="mb-6 text-lg font-bold text-gray-900">
                Transfer Timeline
            </h3>

            <div className="relative space-y-8 pl-0">
                {/* Connecting line aligned with the center of each circle */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200" />

                {transaction.timeline.map((event, index) => {
                    const isCompleted = event.status === "completed";
                    const isCurrent = event.status === "current";
                    const isPending = event.status === "pending";

                    return (
                        <div
                            key={index}
                            className="relative flex items-start gap-4"
                        >
                            {/* Status icon */}
                            <div
                                className={cn(
                                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white",
                                    isCompleted &&
                                    "border-black text-black",
                                    isCurrent &&
                                    "border-black text-black ring-4 ring-gray-100",
                                    isPending &&
                                    "border-gray-300 text-gray-300"
                                )}
                            >
                                {isCompleted ? (
                                    <Check size={14} strokeWidth={3} />
                                ) : isCurrent ? (
                                    <Clock
                                        size={14}
                                        className="animate-pulse"
                                    />
                                ) : (
                                    <Circle
                                        size={10}
                                        fill="currentColor"
                                    />
                                )}
                            </div>

                            {/* Event content */}
                            <div
                                className={cn(
                                    "flex min-w-0 flex-1 flex-col pb-2 pt-0.5",
                                    isPending
                                        ? "opacity-50"
                                        : "opacity-100"
                                )}
                            >
                                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                                    <h4
                                        className={cn(
                                            "text-sm font-bold",
                                            isCurrent
                                                ? "text-black"
                                                : "text-gray-900"
                                        )}
                                    >
                                        {event.title}
                                    </h4>

                                    <span className="whitespace-nowrap text-xs font-medium text-gray-400">
                                        {event.timestamp}
                                    </span>
                                </div>

                                <p className="mt-1 max-w-md text-sm leading-relaxed text-gray-500">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
