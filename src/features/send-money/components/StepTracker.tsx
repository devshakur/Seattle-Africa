"use client";

import { Check } from "lucide-react";

export const SEND_MONEY_STEPS = [
    { id: "from", label: "Sending From", stepNum: 1 },
    { id: "to", label: "Recipient", stepNum: 2 },
    { id: "review", label: "Review", stepNum: 3 },
];

/**
 * 3-step tracker:
 * current = 0 (Sending From)
 * current = 1 (Recipient)
 * current = 2 (Review)
 * current = 3 (Completed / Processing)
 */
export function StepTracker({ current }: { current: number }) {
    return (
        <nav aria-label="Send money progress" className="mx-auto mb-8 w-full max-w-xl px-4">
            <ol className="flex items-center justify-between">
                {SEND_MONEY_STEPS.map((step, i) => {
                    const done = i < current;
                    const active = i === current;
                    const isLast = i === SEND_MONEY_STEPS.length - 1;

                    return (
                        <li key={step.id} className={`flex items-center ${!isLast ? "flex-1" : ""}`}>
                            <div className="flex flex-col items-center gap-1.5 shrink-0">
                                <span
                                    aria-current={active ? "step" : undefined}
                                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                                        done
                                            ? "border-black bg-black text-white"
                                            : active
                                              ? "border-black bg-white text-black ring-4 ring-black/5"
                                              : "border-gray-200 bg-white text-gray-400"
                                    }`}
                                >
                                    {done ? <Check size={15} strokeWidth={2.8} /> : step.stepNum}
                                </span>
                                <span
                                    className={`text-xs font-semibold tracking-tight ${
                                        active
                                            ? "text-black font-bold"
                                            : done
                                              ? "text-gray-800"
                                              : "text-gray-400"
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {!isLast && (
                                <div
                                    className={`mx-3 mb-5 h-[2px] flex-1 rounded-full transition-colors ${
                                        done ? "bg-black" : "bg-gray-200"
                                    }`}
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
