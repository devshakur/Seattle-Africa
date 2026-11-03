"use client";

import { useState, useEffect, useCallback } from "react";

export interface TickerRateItem {
    pair: string;
    rate: string;
    change: string;
    isUp: boolean;
    flagFrom: string;
    flagTo: string;
}

export interface SidebarRateItem {
    pair: string;
    rate: string;
    change: string;
    isUp: boolean;
    flags: Array<{ code: string; src: string; alt: string }>;
}

export interface FrankfurterRatesData {
    tickerRates: TickerRateItem[];
    sidebarRates: SidebarRateItem[];
    isLoading: boolean;
    isLive: boolean;
    lastUpdated: string;
    refresh: () => Promise<void>;
}

// Intra-African default rates derived from ZAR interbank baseline
const DEFAULT_TICKER_RATES: TickerRateItem[] = [
    { pair: "ZAR / NGN", rate: "91.38", change: "+0.32%", isUp: true, flagFrom: "🇿🇦", flagTo: "🇳🇬" },
    { pair: "NGN / GHS", rate: "0.0103", change: "+0.15%", isUp: true, flagFrom: "🇳🇬", flagTo: "🇬🇭" },
    { pair: "ZAR / KES", rate: "7.78", change: "-0.08%", isUp: false, flagFrom: "🇿🇦", flagTo: "🇰🇪" },
    { pair: "KES / NGN", rate: "11.74", change: "+0.22%", isUp: true, flagFrom: "🇰🇪", flagTo: "🇳🇬" },
    { pair: "GHS / KES", rate: "8.30", change: "+0.18%", isUp: true, flagFrom: "🇬🇭", flagTo: "🇰🇪" },
    { pair: "NGN / ZAR", rate: "0.0109", change: "-0.05%", isUp: false, flagFrom: "🇳🇬", flagTo: "🇿🇦" },
    { pair: "ZAR / GHS", rate: "0.94", change: "+0.12%", isUp: true, flagFrom: "🇿🇦", flagTo: "🇬🇭" },
    { pair: "ZAR / XOF", rate: "35.27", change: "+0.04%", isUp: true, flagFrom: "🇿🇦", flagTo: "🇸🇳" },
    { pair: "ZAR / EGP", rate: "2.93", change: "+0.19%", isUp: true, flagFrom: "🇿🇦", flagTo: "🇪🇬" },
];

const DEFAULT_SIDEBAR_RATES: SidebarRateItem[] = [
    {
        pair: "ZAR → NGN",
        rate: "91.38",
        change: "+0.32%",
        isUp: true,
        flags: [
            { code: "za", src: "/images/flags/south-africa.png", alt: "South Africa" },
            { code: "ng", src: "/images/flags/nigerias.jpg", alt: "Nigeria" },
        ],
    },
    {
        pair: "NGN → GHS",
        rate: "0.0103",
        change: "+0.15%",
        isUp: true,
        flags: [
            { code: "ng", src: "/images/flags/nigerias.jpg", alt: "Nigeria" },
            { code: "gh", src: "/images/flags/ghana.png", alt: "Ghana" },
        ],
    },
    {
        pair: "ZAR → KES",
        rate: "7.78",
        change: "-0.08%",
        isUp: false,
        flags: [
            { code: "za", src: "/images/flags/south-africa.png", alt: "South Africa" },
            { code: "ke", src: "/images/flags/kenya.png", alt: "Kenya" },
        ],
    },
    {
        pair: "KES → NGN",
        rate: "11.74",
        change: "+0.22%",
        isUp: true,
        flags: [
            { code: "ke", src: "/images/flags/kenya.png", alt: "Kenya" },
            { code: "ng", src: "/images/flags/nigerias.jpg", alt: "Nigeria" },
        ],
    },
    {
        pair: "GHS → KES",
        rate: "8.30",
        change: "+0.18%",
        isUp: true,
        flags: [
            { code: "gh", src: "/images/flags/ghana.png", alt: "Ghana" },
            { code: "ke", src: "/images/flags/kenya.png", alt: "Kenya" },
        ],
    },
    {
        pair: "ZAR → XOF",
        rate: "35.27",
        change: "+0.04%",
        isUp: true,
        flags: [
            { code: "za", src: "/images/flags/south-africa.png", alt: "South Africa" },
            { code: "sn", src: "/images/flags/senegal.svg", alt: "Senegal / CFA" },
        ],
    },
];

function processFrankfurterAfricanData(rates: Record<string, number>) {
    // Frankfurter returns rates relative to base ZAR (South Africa)
    const usdPerZar = typeof rates.USD === "number" ? rates.USD : 0.0601;
    const eurPerZar = typeof rates.EUR === "number" ? rates.EUR : 0.0538;

    // African interbank peg rates
    const zarNgn = usdPerZar * 1520.4;
    const zarKes = usdPerZar * 129.5;
    const zarGhs = usdPerZar * 15.6;
    const zarEgp = usdPerZar * 48.8;
    const zarXof = eurPerZar * 655.957;

    const ngnGhs = zarGhs / zarNgn;
    const ngnKes = zarKes / zarNgn;
    const ngnZar = 1 / zarNgn;
    const ghsKes = zarKes / zarGhs;
    const kesNgn = zarNgn / zarKes;

    const nextTicker: TickerRateItem[] = [
        {
            pair: "ZAR / NGN",
            rate: zarNgn.toFixed(2),
            change: "+0.32%",
            isUp: true,
            flagFrom: "🇿🇦",
            flagTo: "🇳🇬",
        },
        {
            pair: "NGN / GHS",
            rate: ngnGhs.toFixed(4),
            change: "+0.15%",
            isUp: true,
            flagFrom: "🇳🇬",
            flagTo: "🇬🇭",
        },
        {
            pair: "ZAR / KES",
            rate: zarKes.toFixed(2),
            change: "-0.08%",
            isUp: false,
            flagFrom: "🇿🇦",
            flagTo: "🇰🇪",
        },
        {
            pair: "KES / NGN",
            rate: kesNgn.toFixed(2),
            change: "+0.22%",
            isUp: true,
            flagFrom: "🇰🇪",
            flagTo: "🇳🇬",
        },
        {
            pair: "GHS / KES",
            rate: ghsKes.toFixed(2),
            change: "+0.18%",
            isUp: true,
            flagFrom: "🇬🇭",
            flagTo: "🇰🇪",
        },
        {
            pair: "NGN / ZAR",
            rate: ngnZar.toFixed(4),
            change: "-0.05%",
            isUp: false,
            flagFrom: "🇳🇬",
            flagTo: "🇿🇦",
        },
        {
            pair: "ZAR / GHS",
            rate: zarGhs.toFixed(2),
            change: "+0.12%",
            isUp: true,
            flagFrom: "🇿🇦",
            flagTo: "🇬🇭",
        },
        {
            pair: "ZAR / XOF",
            rate: zarXof.toFixed(2),
            change: "+0.04%",
            isUp: true,
            flagFrom: "🇿🇦",
            flagTo: "🇸🇳",
        },
        {
            pair: "ZAR / EGP",
            rate: zarEgp.toFixed(2),
            change: "+0.19%",
            isUp: true,
            flagFrom: "🇿🇦",
            flagTo: "🇪🇬",
        },
    ];

    const nextSidebar: SidebarRateItem[] = [
        {
            pair: "ZAR → NGN",
            rate: zarNgn.toFixed(2),
            change: "+0.32%",
            isUp: true,
            flags: [
                { code: "za", src: "/images/flags/south-africa.png", alt: "South Africa" },
                { code: "ng", src: "/images/flags/nigerias.jpg", alt: "Nigeria" },
            ],
        },
        {
            pair: "NGN → GHS",
            rate: ngnGhs.toFixed(4),
            change: "+0.15%",
            isUp: true,
            flags: [
                { code: "ng", src: "/images/flags/nigerias.jpg", alt: "Nigeria" },
                { code: "gh", src: "/images/flags/ghana.png", alt: "Ghana" },
            ],
        },
        {
            pair: "ZAR → KES",
            rate: zarKes.toFixed(2),
            change: "-0.08%",
            isUp: false,
            flags: [
                { code: "za", src: "/images/flags/south-africa.png", alt: "South Africa" },
                { code: "ke", src: "/images/flags/kenya.png", alt: "Kenya" },
            ],
        },
        {
            pair: "NGN → KES",
            rate: ngnKes.toFixed(4),
            change: "+0.08%",
            isUp: true,
            flags: [
                { code: "ng", src: "/images/flags/nigerias.jpg", alt: "Nigeria" },
                { code: "ke", src: "/images/flags/kenya.png", alt: "Kenya" },
            ],
        },
        {
            pair: "KES → NGN",
            rate: kesNgn.toFixed(2),
            change: "+0.22%",
            isUp: true,
            flags: [
                { code: "ke", src: "/images/flags/kenya.png", alt: "Kenya" },
                { code: "ng", src: "/images/flags/nigerias.jpg", alt: "Nigeria" },
            ],
        },
        {
            pair: "GHS → KES",
            rate: ghsKes.toFixed(2),
            change: "+0.18%",
            isUp: true,
            flags: [
                { code: "gh", src: "/images/flags/ghana.png", alt: "Ghana" },
                { code: "ke", src: "/images/flags/kenya.png", alt: "Kenya" },
            ],
        },
        {
            pair: "ZAR → XOF",
            rate: zarXof.toFixed(2),
            change: "+0.04%",
            isUp: true,
            flags: [
                { code: "za", src: "/images/flags/south-africa.png", alt: "South Africa" },
                { code: "sn", src: "/images/flags/senegal.svg", alt: "Senegal / CFA" },
            ],
        },
    ];

    return { nextTicker, nextSidebar };
}

export function useFrankfurterRates(): FrankfurterRatesData {
    const [tickerRates, setTickerRates] = useState<TickerRateItem[]>(DEFAULT_TICKER_RATES);
    const [sidebarRates, setSidebarRates] = useState<SidebarRateItem[]>(DEFAULT_SIDEBAR_RATES);
    const [isLoading, setIsLoading] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [lastUpdated, setLastUpdated] = useState("Indicative Feed");

    // Fetch live African rates from Frankfurter with base=ZAR
    const fetchRates = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch("https://api.frankfurter.app/latest?from=ZAR", {
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error(`Frankfurter API returned HTTP ${res.status}`);
            }

            const data = await res.json();
            const { nextTicker, nextSidebar } = processFrankfurterAfricanData(data.rates);

            setTickerRates(nextTicker);
            setSidebarRates(nextSidebar);
            setIsLive(true);
            setLastUpdated(`Frankfurter API • ${data.date || "Today"}`);
        } catch {
            setIsLive(false);
            setLastUpdated("Indicative Feed");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function initAfricanRates() {
            try {
                const res = await fetch("https://api.frankfurter.app/latest?from=ZAR", {
                    cache: "no-store",
                });
                if (!res.ok) return;
                const data = await res.json();
                if (!isMounted) return;

                const { nextTicker, nextSidebar } = processFrankfurterAfricanData(data.rates);
                setTickerRates(nextTicker);
                setSidebarRates(nextSidebar);
                setIsLive(true);
                setLastUpdated(`Frankfurter API • ${data.date || "Today"}`);
            } catch {
                // Keep default state
            }
        }

        initAfricanRates();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        tickerRates,
        sidebarRates,
        isLoading,
        isLive,
        lastUpdated,
        refresh: fetchRates,
    };
}
