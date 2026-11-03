"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { useAfricanLiveRates, formatFxRate } from "../hooks/useAfricanLiveRates";
import { useCurrency } from "@/features/currency/CurrencyContext";

export function ExchangeRateTicker() {
    const { rates, isLoading, isLive, lastUpdated, refresh } = useAfricanLiveRates();
    const { currency } = useCurrency();

    // The user's own currency is the quote currency; every other African currency is converted into it
    const base = rates.find((r) => r.code === currency.code);
    const marqueeSource = rates.filter((r) => r.code !== currency.code);

    // Duplicate array for seamless infinite sliding loop to the left
    const marqueeRates = [...marqueeSource, ...marqueeSource];

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
                            {isLive ? `Live - to ${currency.code}` : "Unavailable"}
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
                                    duration: 70,
                                    ease: "linear",
                                },
                            }}
                        >
                            {marqueeRates.map((item, idx) => {
                                // Cross rate: 1 unit of this country's currency in the user's currency
                                const cross = base ? base.rate / item.rate : 0;
                                const prevCross =
                                    base && base.prevRate && item.prevRate
                                        ? base.prevRate / item.prevRate
                                        : null;
                                const changePct =
                                    prevCross && prevCross > 0
                                        ? ((cross - prevCross) / prevCross) * 100
                                        : null;
                                const up = (changePct ?? 0) >= 0;
                                return (
                                    <div
                                        key={`${item.code}-${idx}`}
                                        className="inline-flex shrink-0 items-center gap-2 text-xs"
                                        title={`${item.country} (${item.code})`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.flagSrc}
                                            alt={`${item.country} flag`}
                                            width={20}
                                            height={14}
                                            loading="lazy"
                                            className="h-3.5 w-5 rounded-[2px] object-cover border border-gray-200"
                                        />
                                        <span className="font-semibold text-gray-900 font-mono">
                                            1 {item.code}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-mono">=</span>
                                        <span className="font-mono tabular-nums font-semibold text-gray-950">
                                            {formatFxRate(cross)} {currency.code}
                                        </span>
                                        {changePct !== null && changePct !== 0 && (
                                            <span className="inline-flex items-center gap-0.5 text-[11px] font-mono font-medium tabular-nums px-1.5 py-0.5 rounded bg-zinc-100 text-black">
                                                {up ? (
                                                    <TrendingUp size={11} className="stroke-[2.5]" />
                                                ) : (
                                                    <TrendingDown size={11} className="stroke-[2.5]" />
                                                )}
                                                <span>
                                                    {up ? "+" : ""}
                                                    {changePct.toFixed(2)}%
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
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
                        title="Refresh live African rates"
                        aria-label="Refresh live African rates"
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
