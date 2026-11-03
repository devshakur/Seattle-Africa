"use client";

import { useRef } from "react";
import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight, Send, Building } from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface Beneficiary {
    id: string;
    name: string;
    bank: string;
    accountNumber: string;
    currency: string;
    country: string;
    flag: string;
    initials: string;
    avatarBg: string;
}

const BENEFICIARIES: Beneficiary[] = [
    {
        id: "b-1",
        name: "Chioma Adeleke",
        bank: "GTBank",
        accountNumber: "•••• 4921",
        currency: "NGN",
        country: "Nigeria",
        flag: "🇳🇬",
        initials: "CA",
        avatarBg: "bg-zinc-900 text-white",
    },
    {
        id: "b-2",
        name: "Amina Yusuf",
        bank: "M-Pesa Kenya",
        accountNumber: "•••• 8832",
        currency: "KES",
        country: "Kenya",
        flag: "🇰🇪",
        initials: "AY",
        avatarBg: "bg-zinc-800 text-white",
    },
    {
        id: "b-3",
        name: "David Osei",
        bank: "GCB Bank",
        accountNumber: "•••• 1102",
        currency: "GHS",
        country: "Ghana",
        flag: "🇬🇭",
        initials: "DO",
        avatarBg: "bg-zinc-900 text-white",
    },
    {
        id: "b-4",
        name: "Naledi Sithole",
        bank: "Capitec Bank",
        accountNumber: "•••• 9420",
        currency: "ZAR",
        country: "South Africa",
        flag: "🇿🇦",
        initials: "NS",
        avatarBg: "bg-zinc-800 text-white",
    },
    {
        id: "b-5",
        name: "Kwame Mensah",
        bank: "Ecobank Ghana",
        accountNumber: "•••• 7741",
        currency: "GHS",
        country: "Ghana",
        flag: "🇬🇭",
        initials: "KM",
        avatarBg: "bg-zinc-900 text-white",
    },
    {
        id: "b-6",
        name: "Zainab Abdi",
        bank: "Equity Bank",
        accountNumber: "•••• 3190",
        currency: "KES",
        country: "Kenya",
        flag: "🇰🇪",
        initials: "ZA",
        avatarBg: "bg-zinc-800 text-white",
    },
    {
        id: "b-7",
        name: "Tariq Balogun",
        bank: "Access Bank",
        accountNumber: "•••• 6523",
        currency: "NGN",
        country: "Nigeria",
        flag: "🇳🇬",
        initials: "TB",
        avatarBg: "bg-zinc-900 text-white",
    },
];

export function RecentBeneficiaries() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const amount = direction === "left" ? -240 : 240;
            scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
        }
    };

    return (
        <div className="mb-6">
            {/* Header with Title and Scroll Arrows */}
            <div className="mb-3.5 flex items-center justify-between">
                <div>
                    <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <span>Recent Beneficiaries</span>
                        <span className="text-xs font-mono font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {BENEFICIARIES.length}
                        </span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        One-click instant payout to saved African accounts
                    </p>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => scroll("left")}
                        aria-label="Scroll beneficiaries left"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-black hover:border-gray-400 transition-colors shadow-xs"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => scroll("right")}
                        aria-label="Scroll beneficiaries right"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-black hover:border-gray-400 transition-colors shadow-xs"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Horizontal Scroll Carousel Container */}
            <div
                ref={scrollRef}
                className="flex items-center gap-3.5 overflow-x-auto no-scrollbar scroll-smooth pb-1 pt-1"
                style={{
                    scrollSnapType: "x mandatory",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                {/* Add New Beneficiary Card */}
                <Link
                    href="/send-money"
                    className="group flex min-w-[160px] sm:min-w-[170px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/70 p-4 text-center transition-all hover:border-black hover:bg-white hover:shadow-sm"
                    style={{ scrollSnapAlign: "start" }}
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-transform group-hover:scale-105 group-hover:bg-black group-hover:text-white">
                        <Plus size={18} />
                    </div>
                    <span className="mt-2.5 text-xs font-bold text-gray-900 group-hover:text-black">
                        Add New
                    </span>
                    <span className="text-[11px] text-gray-400">Beneficiary</span>
                </Link>

                {/* Beneficiary Cards */}
                {BENEFICIARIES.map((person) => (
                    <Card
                        key={person.id}
                        className="group relative flex min-w-[175px] sm:min-w-[190px] flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-400 hover:shadow-md"
                        style={{ scrollSnapAlign: "start" }}
                    >
                        {/* Top: Avatar & Flag Badge */}
                        <div className="flex items-start justify-between">
                            <div className="relative">
                                <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-full font-mono font-bold text-xs shadow-xs ${person.avatarBg}`}
                                >
                                    {person.initials}
                                </div>
                                <span
                                    className="absolute -bottom-1 -right-1 text-sm rounded-full bg-white shadow-xs p-0.5 border border-gray-100 leading-none select-none"
                                    title={person.country}
                                >
                                    {person.flag}
                                </span>
                            </div>

                            <span className="rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-gray-700 font-tabular-nums tabular-nums">
                                {person.currency}
                            </span>
                        </div>

                        {/* Mid: Name and Bank */}
                        <div className="mt-3.5 min-w-0">
                            <h3 className="truncate text-xs font-bold text-gray-950 group-hover:text-black">
                                {person.name}
                            </h3>
                            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500 truncate">
                                <Building size={11} className="shrink-0 text-gray-400" />
                                <span className="truncate">{person.bank}</span>
                            </p>
                            <p className="font-mono text-[10px] text-gray-400 font-tabular-nums tabular-nums mt-0.5">
                                {person.accountNumber}
                            </p>
                        </div>

                        {/* Bottom Action: Quick Send */}
                        <Link
                            href={`/send-money?beneficiary=${person.id}`}
                            className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50/80 py-1.5 text-[11px] font-semibold text-gray-800 transition-colors hover:bg-black hover:text-white hover:border-black"
                        >
                            <Send size={11} />
                            <span>Quick Send</span>
                        </Link>
                    </Card>
                ))}
            </div>
        </div>
    );
}

