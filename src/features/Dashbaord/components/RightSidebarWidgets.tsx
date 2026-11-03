"use client";

import Image from "next/image";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useFrankfurterRates } from "../hooks/useFrankfurterRates";

export function RightSidebarWidgets() {
    const { sidebarRates, isLoading, isLive, lastUpdated, refresh } =
        useFrankfurterRates();

    return (
        <div className="space-y-6">
            {/* Live African Exchange Rates powered by Frankfurter API */}
            <Card className="p-6 border border-gray-200/90 shadow-xs">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">African Exchange Rates</h3>
                            <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-black bg-zinc-100 px-2 py-0.5 rounded-full">
                                {isLive ? "Frankfurter Live" : "Indicative"}
                            </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">{lastUpdated}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={refresh}
                            disabled={isLoading}
                            title="Fetch latest rates from Frankfurter API"
                            aria-label="Fetch latest rates from Frankfurter API"
                            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                        >
                            <RefreshCw
                                size={13}
                                className={isLoading ? "animate-spin text-black" : ""}
                            />
                        </button>
                        <Link
                            href="#"
                            className="text-xs font-medium text-gray-500 transition-colors hover:text-black"
                        >
                            View all
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    /* Sleek Pulsing Black/Gray Skeleton Loader */
                    <div className="space-y-5">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between gap-3 animate-pulse"
                                aria-hidden="true"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex shrink-0 -space-x-2">
                                        <div className="h-8 w-8 rounded-full bg-zinc-200 border-2 border-white" />
                                        <div className="h-8 w-8 rounded-full bg-zinc-200 border-2 border-white" />
                                    </div>
                                    <div className="h-4 w-20 rounded bg-zinc-200" />
                                </div>
                                <div className="space-y-1 text-right">
                                    <div className="h-4 w-14 rounded bg-zinc-200 ml-auto" />
                                    <div className="h-3 w-10 rounded bg-zinc-100 ml-auto" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-5">
                        {sidebarRates.map((item) => {
                            const isPositive = item.change.startsWith("+");

                            return (
                                <div
                                    key={item.pair}
                                    className="flex items-center justify-between gap-3"
                                >
                                    {/* Country Flags and Currency Pair */}
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex shrink-0 items-center">
                                            {item.flags.map((flag, index) => (
                                                <Image
                                                    key={`${item.pair}-${flag.code}`}
                                                    src={flag.src}
                                                    alt={`${flag.alt} flag`}
                                                    width={32}
                                                    height={32}
                                                    className={`relative size-8 rounded-full border-2 border-white object-cover ${
                                                        index === 0 ? "z-10" : "-ml-2"
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        <span className="whitespace-nowrap text-sm font-medium text-gray-700 font-mono">
                                            {item.pair}
                                        </span>
                                    </div>

                                    {/* Exchange Rate and Percentage Change */}
                                    <div className="shrink-0 text-right">
                                        <p className="text-sm font-bold font-mono font-tabular-nums tabular-nums text-gray-900">
                                            {item.rate}
                                        </p>

                                        <p
                                            className={`mt-0.5 text-[11px] font-semibold font-mono font-tabular-nums tabular-nums ${
                                                isPositive ? "text-gray-950 font-bold" : "text-gray-500"
                                            }`}
                                        >
                                            {item.change}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-5 border-t border-gray-100 pt-3">
                    <p className="text-[11px] text-gray-400">
                        Intra-African settlement rails &bull; Live Frankfurter feed
                    </p>
                </div>
            </Card>
        </div>
    );
}
