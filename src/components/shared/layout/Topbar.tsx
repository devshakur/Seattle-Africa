"use client";

import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { CurrencySwitcher } from "@/features/currency/CurrencySwitcher";

interface TopbarProps {
    onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-30">

            <div className="flex items-center gap-3 sm:gap-4 flex-1">
                {/* Mobile Hamburger Menu */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Open navigation menu"
                >
                    <Menu size={24} />
                </button>



            </div>

            {/* Right Side Actions with Currency Switcher & Notifications */}
            <div className="flex items-center gap-2 sm:gap-3 ml-4">
                {/* User Active African Currency Switcher */}


                {/* Notification Dropdown */}
                <NotificationDropdown />

                {/* User Initials Avatar */}
                <Link
                    href="/settings"
                    aria-label="Account Settings"
                    className="w-9 h-9 rounded-full bg-black text-white font-mono font-bold text-xs flex items-center justify-center border border-zinc-800 shadow-xs hover:ring-2 hover:ring-black/20 transition-all cursor-pointer shrink-0 select-none"
                    title="Amina Yusuf (Settings)"
                >
                    AY
                </Link>
            </div>
        </header>
    );
}
