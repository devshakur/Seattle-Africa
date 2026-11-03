"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface AfricanCurrencyMeta {
    code: string;
    country: string;
    /** ISO 3166-1 alpha-2 lowercase code used for the flag image */
    iso: string;
}

export const AFRICAN_FX_CURRENCIES: AfricanCurrencyMeta[] = [
    { code: "NGN", country: "Nigeria", iso: "ng" },
    { code: "ZAR", country: "South Africa", iso: "za" },
    { code: "KES", country: "Kenya", iso: "ke" },
    { code: "GHS", country: "Ghana", iso: "gh" },
    { code: "EGP", country: "Egypt", iso: "eg" },
    { code: "XOF", country: "West Africa (CFA)", iso: "sn" },
    { code: "XAF", country: "Central Africa (CFA)", iso: "cm" },
    { code: "TZS", country: "Tanzania", iso: "tz" },
    { code: "UGX", country: "Uganda", iso: "ug" },
    { code: "RWF", country: "Rwanda", iso: "rw" },
    { code: "ETB", country: "Ethiopia", iso: "et" },
    { code: "MAD", country: "Morocco", iso: "ma" },
    { code: "DZD", country: "Algeria", iso: "dz" },
    { code: "TND", country: "Tunisia", iso: "tn" },
    { code: "ZMW", country: "Zambia", iso: "zm" },
    { code: "BWP", country: "Botswana", iso: "bw" },
    { code: "MUR", country: "Mauritius", iso: "mu" },
    { code: "NAD", country: "Namibia", iso: "na" },
    { code: "MZN", country: "Mozambique", iso: "mz" },
    { code: "MWK", country: "Malawi", iso: "mw" },
    { code: "AOA", country: "Angola", iso: "ao" },
];

export interface AfricanRateItem extends AfricanCurrencyMeta {
    /** Units of this currency per 1 USD */
    rate: number;
    /** Previously stored units per 1 USD, or null if unknown */
    prevRate: number | null;
    /** % change vs the previously stored fetch, or null if unknown */
    changePct: number | null;
    flagSrc: string;
}

const API_URL = "https://open.er-api.com/v6/latest/USD";
const STORAGE_KEY = "settle_africa_prev_fx_rates";
const REFRESH_MS = 5 * 60 * 1000;

export const flagUrl = (iso: string) => `https://flagcdn.com/w40/${iso}.png`;

export function formatFxRate(rate: number): string {
    const digits = rate >= 100 ? 2 : rate >= 1 ? 3 : 4;
    return rate.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: digits,
    });
}

export function useAfricanLiveRates() {
    const [rates, setRates] = useState<AfricanRateItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLive, setIsLive] = useState(false);
    const [lastUpdated, setLastUpdated] = useState("");
    const mounted = useRef(true);

    const fetchRates = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(API_URL, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.result !== "success" || !data.rates) throw new Error("Bad payload");

            let prev: Record<string, number> = {};
            try {
                prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
            } catch {
                prev = {};
            }

            const next: AfricanRateItem[] = AFRICAN_FX_CURRENCIES.filter(
                (c) => typeof data.rates[c.code] === "number"
            ).map((c) => {
                const rate = data.rates[c.code] as number;
                const before = prev[c.code];
                const changePct =
                    typeof before === "number" && before > 0
                        ? ((rate - before) / before) * 100
                        : null;
                const prevRate = typeof before === "number" && before > 0 ? before : null;
                return { ...c, rate, prevRate, changePct, flagSrc: flagUrl(c.iso) };
            });

            // Store snapshot only when the provider's data has actually moved on
            try {
                const snapshot: Record<string, number> = {};
                next.forEach((r) => (snapshot[r.code] = r.rate));
                const changed = next.some((r) => r.changePct !== null && r.changePct !== 0);
                if (changed || Object.keys(prev).length === 0) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
                }
            } catch {
                // ignore storage errors
            }

            if (!mounted.current) return;
            setRates(next);
            setIsLive(true);
            setLastUpdated(
                data.time_last_update_utc
                    ? `Updated ${new Date(data.time_last_update_utc).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                      })}`
                    : "Live"
            );
        } catch {
            if (!mounted.current) return;
            setIsLive(false);
            setLastUpdated("Live rates unavailable");
        } finally {
            if (mounted.current) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        mounted.current = true;
        fetchRates();
        const id = setInterval(fetchRates, REFRESH_MS);
        return () => {
            mounted.current = false;
            clearInterval(id);
        };
    }, [fetchRates]);

    return { rates, isLoading, isLive, lastUpdated, refresh: fetchRates };
}

