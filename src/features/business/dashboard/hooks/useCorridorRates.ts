"use client";

import { useEffect, useState } from "react";

export interface CorridorRate {
    pair: string;
    rate: number;
}

const API_URL = "https://open.er-api.com/v6/latest/USD";
const REFRESH_MS = 5 * 60 * 1000;

/** Live USD/NGN, GBP/KES and EUR/GHS, derived from USD-based rates. */
export function useCorridorRates() {
    const [rates, setRates] = useState<CorridorRate[]>([]);

    useEffect(() => {
        let mounted = true;

        async function load() {
            try {
                const res = await fetch(API_URL, { cache: "no-store" });
                if (!res.ok) return;
                const data = await res.json();
                const r = data?.rates;
                if (!r || !r.NGN || !r.KES || !r.GHS || !r.GBP || !r.EUR) return;
                if (!mounted) return;
                setRates([
                    { pair: "USD/NGN", rate: r.NGN },
                    { pair: "GBP/KES", rate: r.KES / r.GBP },
                    { pair: "EUR/GHS", rate: r.GHS / r.EUR },
                ]);
            } catch {
                // keep previous rates
            }
        }

        load();
        const id = setInterval(load, REFRESH_MS);
        return () => {
            mounted = false;
            clearInterval(id);
        };
    }, []);

    return rates;
}

