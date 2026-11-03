"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency, AFRICAN_CURRENCIES } from "./CurrencyContext";

interface CurrencySwitcherProps {
    variant?: "compact" | "card";
    className?: string;
}

export function CurrencySwitcher({ variant = "compact", className }: CurrencySwitcherProps) {
    const { currency, setCurrency, userPhone, detectedCountry } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Outside click & escape handler
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    return (
        <div className={`relative inline-block ${className || ""}`} ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-label={`Current currency: ${currency.code}. Click to change`}
                className={
                    variant === "compact"
                        ? "flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-2xs hover:border-black hover:bg-gray-50 transition-all select-none"
                        : "flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-white/20 transition-all select-none"
                }
            >
                <span className="text-sm select-none" aria-hidden="true">
                    {currency.flag}
                </span>
                <span className="font-mono font-bold">{currency.code}</span>
                <span className={variant === "compact" ? "text-gray-400 font-mono" : "text-white/60 font-mono"}>
                    ({currency.symbol})
                </span>
                <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${
                        variant === "compact" ? "text-gray-500" : "text-white/70"
                    }`}
                />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl z-50 text-left"
                    >
                        {/* Header with phone detection notice */}
                        <div className="pb-2.5 mb-2 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-950">Display Currency</span>
                                <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-bold">
                                    8 Currencies
                                </span>
                            </div>

                            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-500">
                                <Smartphone size={12} className="text-black shrink-0" />
                                <span className="truncate">
                                    Phone: <span className="font-mono font-semibold text-black">{userPhone}</span> ({detectedCountry})
                                </span>
                            </div>
                        </div>

                        {/* Currency List */}
                        <div className="max-h-60 overflow-y-auto space-y-1 no-scrollbar pr-0.5">
                            {AFRICAN_CURRENCIES.map((c) => {
                                const isSelected = currency.code === c.code;

                                return (
                                    <button
                                        key={c.code}
                                        type="button"
                                        onClick={() => {
                                            setCurrency(c);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                                            isSelected
                                                ? "bg-black text-white font-semibold"
                                                : "text-gray-800 hover:bg-gray-100/70"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-base select-none">{c.flag}</span>
                                            <div className="flex flex-col text-left">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-mono font-bold">{c.code}</span>
                                                    <span className={isSelected ? "text-gray-300 text-[11px]" : "text-gray-500 text-[11px]"}>
                                                        &bull; {c.symbol}
                                                    </span>
                                                </div>
                                                <span
                                                    className={`text-[10px] truncate ${
                                                        isSelected ? "text-gray-300" : "text-gray-400"
                                                    }`}
                                                >
                                                    {c.country} ({c.phonePrefix})
                                                </span>
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <Check size={14} className="text-white shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer note */}
                        <div className="mt-2.5 pt-2 border-t border-gray-100 text-[10px] text-gray-400 text-center">
                            Auto-detected from phone &bull; Switch anytime
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

