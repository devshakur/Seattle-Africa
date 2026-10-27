import { Check, Clock, Circle } from "lucide-react";
import { TrackedTransaction } from "../hooks/useTrackTransaction";
import { cn } from "@/libs/utils";

export function TrackTimeline({ transaction }: { transaction: TrackedTransaction }) {
    return (
        <div className="py-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Transfer Timeline</h3>

            <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-200">
                {transaction.timeline.map((event, index) => {
                    const isCompleted = event.status === "completed";
                    const isCurrent = event.status === "current";
                    const isPending = event.status === "pending";

                    return (
                        <div key={index} className="relative flex items-start gap-4">
                            {/* Dot/Icon */}
                            <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white shrink-0 z-10 -ml-10",
                                isCompleted ? "border-black text-black" :
                                    isCurrent ? "border-black text-black ring-4 ring-gray-100" :
                                        "border-gray-300 text-gray-300"
                            )}>
                                {isCompleted ? <Check size={14} strokeWidth={3} /> :
                                    isCurrent ? <Clock size={14} className="animate-pulse" /> :
                                        <Circle size={10} fill="currentColor" />}
                            </div>

                            {/* Content */}
                            <div className={cn(
                                "flex flex-col pb-2 pt-0.5",
                                isPending ? "opacity-50" : "opacity-100"
                            )}>
                                <div className="flex items-center justify-between gap-4">
                                    <h4 className={cn(
                                        "text-sm font-bold",
                                        isCurrent ? "text-black" : "text-gray-900"
                                    )}>
                                        {event.title}
                                    </h4>
                                    <span className="text-xs font-medium text-gray-400 whitespace-nowrap">{event.timestamp}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-md">{event.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}