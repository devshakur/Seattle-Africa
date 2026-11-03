"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { useFrankfurterRates } from "../hooks/useFrankfurterRates";

export function ExchangeRateTicker() {
    const { tickerRates, isLoading, isLive, lastUpdated, refresh } =
        useFrankfurterRates();

    // Duplicate array for seamless infinite sliding loop to the left
    const marqueeRates = [...tickerRates, ...tickerRates];

    return (
        <div className="relative mb-6 w-full overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-2.5 sm:p-3 shadow-xs">
            <div className="flex items-center justify-between gap-3">
                {/* Fixed African FX Indicator on Left */}
                <div className="flex shrink-0 items-center gap-2 border-r border-gray-200 pr-3 sm:pr-4 z-10 bg-white select-none">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-black"></span>
                    </span>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-mono font-bold tracking-wider text-gray-900 uppercase leading-none">
                            African FX
                        </span>
                        <span className="text-[9px] font-mono text-gray-400 mt-0.5">
                            {isLive ? "Frankfurter Live" : "Indicative"}
                        </span>
                    </div>
                </div>

                {/* Sliding Ticker Track (Continuously Sliding to the Left, Zero Scrollbar) */}
                <div
                    className="relative flex-1 overflow-hidden select-none"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        maskImage:
                            "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
                        WebkitMaskImage:
                            "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
                    }}
                >
                    {isLoading ? (
                        /* Sleek Pulsing Black/Gray Skeleton Loader */
                        <div className="flex items-center gap-6 py-0.5">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="flex shrink-0 items-center gap-2"
                                    aria-hidden="true"
                                >
                                    <div className="h-4 w-10 rounded bg-zinc-200 animate-pulse" />
                                    <div className="h-4 w-16 rounded bg-zinc-200 animate-pulse" />
                                    <div className="h-3.5 w-14 rounded bg-zinc-200 animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Continuous Leftward Sliding Track */
                        <motion.div
                            className="flex items-center gap-7 whitespace-nowrap cursor-default"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 36,
                                    ease: "linear",
                                },
                            }}
                        >
                            {marqueeRates.map((item, idx) => (
                                <div
                                    key={`${item.pair}-${idx}`}
                                    className="inline-flex shrink-0 items-center gap-2 text-xs"
                                >
                                    {/* Country Flags */}
                                    <span className="flex items-center gap-1 text-sm select-none" aria-hidden="true">
                                        <span>{item.flagFrom}</span>
                                        <span className="text-[10px] text-gray-400 font-mono">➔</span>
                                        <span>{item.flagTo}</span>
                                    </span>

                                    <span className="font-semibold text-gray-900 font-mono">
                                        {item.pair}
                                    </span>

                                    <span className="font-mono font-tabular-nums tabular-nums font-semibold text-gray-950">
                                        {item.rate}
                                    </span>

                                    <span
                                        className={`inline-flex items-center gap-0.5 text-[11px] font-mono font-medium font-tabular-nums tabular-nums px-1.5 py-0.5 rounded ${
                                            item.isUp
                                                ? "bg-zinc-100 text-black font-semibold"
                                                : "bg-zinc-100 text-zinc-600"
                                        }`}
                                    >
                                        {item.isUp ? (
                                            <TrendingUp size={11} className="stroke-[2.5]" />
                                        ) : (
                                            <TrendingDown size={11} className="stroke-[2.5]" />
                                        )}
                                        <span>{item.change}</span>
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* Refresh Trigger with Frankfurter Feed Status */}
                <div className="flex items-center gap-2 shrink-0 z-10 bg-white pl-2">
                    <span className="hidden xl:inline text-[10px] font-mono text-gray-400">
                        {lastUpdated}
                    </span>
                    <button
                        type="button"
                        onClick={refresh}
                        disabled={isLoading}
                        title="Fetch latest African rates from Frankfurter API"
                        aria-label="Fetch latest African rates from Frankfurter API"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw
                            size={13}
                            className={isLoading ? "animate-spin text-black" : ""}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
