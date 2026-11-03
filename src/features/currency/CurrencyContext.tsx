"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CurrencyConfig {
    code: string;
    name: string;
    symbol: string;
    country: string;
    flag: string;
    phonePrefix: string;
    /** Relative exchange multiplier (relative to NGN baseline = 1) */
    exchangeRateToNgn: number;
}

export const AFRICAN_CURRENCIES: CurrencyConfig[] = [
    {
        code: "NGN",
        name: "Nigerian Naira",
        symbol: "₦",
        country: "Nigeria",
        flag: "🇳🇬",
        phonePrefix: "+234",
        exchangeRateToNgn: 1,
    },
    {
        code: "ZAR",
        name: "South African Rand",
        symbol: "R",
        country: "South Africa",
        flag: "🇿🇦",
        phonePrefix: "+27",
        exchangeRateToNgn: 91.38,
    },
    {
        code: "KES",
        name: "Kenyan Shilling",
        symbol: "KSh",
        country: "Kenya",
        flag: "🇰🇪",
        phonePrefix: "+254",
        exchangeRateToNgn: 11.74,
    },
    {
        code: "GHS",
        name: "Ghanaian Cedi",
        symbol: "GH₵",
        country: "Ghana",
        flag: "🇬🇭",
        phonePrefix: "+233",
        exchangeRateToNgn: 97.46,
    },
    {
        code: "XOF",
        name: "West African CFA",
        symbol: "CFA",
        country: "Senegal / Ivory Coast",
        flag: "🇸🇳",
        phonePrefix: "+221",
        exchangeRateToNgn: 2.59,
    },
    {
        code: "EGP",
        name: "Egyptian Pound",
        symbol: "E£",
        country: "Egypt",
        flag: "🇪🇬",
        phonePrefix: "+20",
        exchangeRateToNgn: 31.15,
    },
    {
        code: "RWF",
        name: "Rwandan Franc",
        symbol: "FRw",
        country: "Rwanda",
        flag: "🇷🇼",
        phonePrefix: "+250",
        exchangeRateToNgn: 1.14,
    },
    {
        code: "UGX",
        name: "Ugandan Shilling",
        symbol: "USh",
        country: "Uganda",
        flag: "🇺🇬",
        phonePrefix: "+256",
        exchangeRateToNgn: 0.41,
    },
];

/**
 * Detects currency from phone number prefix
 */
export function detectCurrencyFromPhone(phone: string): CurrencyConfig {
    const detected = tryDetectCurrency(phone);
    return detected || AFRICAN_CURRENCIES[0];
}

/**
 * Tries to detect currency from phone prefix, returning null if unrecognized or email
 */
export function tryDetectCurrency(input: string): CurrencyConfig | null {
    const clean = input.trim().replace(/[\s-()]/g, "");
    if (!clean || clean.includes("@")) return null;

    if (clean.startsWith("+234") || clean.startsWith("234") || clean.startsWith("080") || clean.startsWith("090") || clean.startsWith("070") || clean.startsWith("081")) {
        return AFRICAN_CURRENCIES.find((c) => c.code === "NGN") || null;
    }
    if (clean.startsWith("+27") || clean.startsWith("27")) {
        return AFRICAN_CURRENCIES.find((c) => c.code === "ZAR") || null;
    }
    if (clean.startsWith("+254") || clean.startsWith("254") || clean.startsWith("071") || clean.startsWith("072") || clean.startsWith("079")) {
        return AFRICAN_CURRENCIES.find((c) => c.code === "KES") || null;
    }
    if (clean.startsWith("+233") || clean.startsWith("233")) {
        return AFRICAN_CURRENCIES.find((c) => c.code === "GHS") || null;
    }
    if (clean.startsWith("+221") || clean.startsWith("221") || clean.startsWith("+225") || clean.startsWith("225")) {
        return AFRICAN_CURRENCIES.find((c) => c.code === "XOF") || null;
    }
    if (clean.startsWith("+20") || clean.startsWith("20")) {
        return AFRICAN_CURRENCIES.find((c) => c.code === "EGP") || null;
    }
    if (clean.startsWith("+250") || clean.startsWith("250")) {
        return AFRICAN_CURRENCIES.find((c) => c.code === "RWF") || null;
    }
    if (clean.startsWith("+256") || clean.startsWith("256")) {
        return AFRICAN_CURRENCIES.find((c) => c.code === "UGX") || null;
    }

    return null;
}

interface CurrencyContextType {
    currency: CurrencyConfig;
    setCurrency: (currency: CurrencyConfig) => void;
    userPhone: string;
    setUserPhone: (phone: string) => void;
    detectedCountry: string;
    formatAmount: (amountInNgn: number, options?: { showSign?: boolean }) => string;
    allCurrencies: CurrencyConfig[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const LOCAL_STORAGE_CURRENCY_KEY = "settle_africa_active_currency";
const LOCAL_STORAGE_PHONE_KEY = "settle_africa_user_phone";
const DEFAULT_PHONE = "+234 803 123 4567"; // Default African user phone

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [userPhone, setUserPhoneState] = useState<string>(() => {
        if (typeof window === "undefined") return DEFAULT_PHONE;
        try {
            return localStorage.getItem(LOCAL_STORAGE_PHONE_KEY) || DEFAULT_PHONE;
        } catch {
            return DEFAULT_PHONE;
        }
    });

    const [currency, setCurrencyState] = useState<CurrencyConfig>(() => {
        if (typeof window === "undefined") return AFRICAN_CURRENCIES[0];
        try {
            const savedCurrencyCode = localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY);
            if (savedCurrencyCode) {
                const found = AFRICAN_CURRENCIES.find((c) => c.code === savedCurrencyCode);
                if (found) return found;
            }
            const savedPhone = localStorage.getItem(LOCAL_STORAGE_PHONE_KEY) || DEFAULT_PHONE;
            return detectCurrencyFromPhone(savedPhone);
        } catch {
            return AFRICAN_CURRENCIES[0];
        }
    });

    // Change currency manually
    const setCurrency = (newCurrency: CurrencyConfig) => {
        setCurrencyState(newCurrency);
        try {
            localStorage.setItem(LOCAL_STORAGE_CURRENCY_KEY, newCurrency.code);
        } catch {
            // ignore
        }
    };

    // Update phone number (and update currency if not manually overridden)
    const setUserPhone = (phone: string) => {
        setUserPhoneState(phone);
        try {
            localStorage.setItem(LOCAL_STORAGE_PHONE_KEY, phone);
            // If user hasn't explicitly set another currency code, auto-set to phone country
            const detected = detectCurrencyFromPhone(phone);
            setCurrencyState(detected);
            localStorage.setItem(LOCAL_STORAGE_CURRENCY_KEY, detected.code);
        } catch {
            // ignore
        }
    };

    // Format any NGN base amount into user's selected active currency
    const formatAmount = (
        amountInNgn: number,
        options?: { showSign?: boolean }
    ): string => {
        const isNegative = amountInNgn < 0;
        const absNgn = Math.abs(amountInNgn);

        // Convert from NGN baseline to active currency
        const converted = absNgn / currency.exchangeRateToNgn;

        const formattedNumber = converted.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        const sign = options?.showSign ? (isNegative ? "-" : "+") : isNegative ? "-" : "";

        // Currency symbol placement: e.g. "₦750,000.00", "R 8,240.50", "KSh 64,200.00"
        const space = currency.symbol.length > 1 ? " " : "";
        return `${sign}${currency.symbol}${space}${formattedNumber}`;
    };

    const detectedCountry = detectCurrencyFromPhone(userPhone).country;

    return (
        <CurrencyContext.Provider
            value={{
                currency,
                setCurrency,
                userPhone,
                setUserPhone,
                detectedCountry,
                formatAmount,
                allCurrencies: AFRICAN_CURRENCIES,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency(): CurrencyContextType {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
}
