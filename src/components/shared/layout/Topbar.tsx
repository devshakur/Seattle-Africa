"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";

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
                    className="lg:hidden p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    aria-label="Open navigation menu"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Right Side Actions with Notifications & User Initials Avatar */}
            <div className="flex items-center gap-2 sm:gap-3 ml-4">
                {/* Notification Dropdown */}
                <NotificationDropdown />

                {/* User Initials Avatar */}
                <Link
                    href="/settings"
                    aria-label="Account Settings"
                    className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-full border border-gray-200 hover:border-black bg-white transition-all cursor-pointer group select-none shrink-0 shadow-xs"
                    title="Abdulshakur Dauda (Settings)"
                >
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0">
                        <span className="text-white font-mono font-bold text-xs leading-none tracking-wide">
                            AD
                        </span>
                    </div>
                    <span className="hidden sm:inline-block text-xs font-semibold text-gray-900 group-hover:text-black pr-1">
                        Abdulshakur Dauda
                    </span>
                </Link>
            </div>
        </header>
    );
}

export default Topbar;
