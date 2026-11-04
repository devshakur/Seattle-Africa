"use client";

import Link from "next/link";
import { Menu, Bell } from "lucide-react";
import { useBusiness } from "@/features/business/context/BusinessContext";

interface BusinessTopbarProps {
    onMenuClick: () => void;
}

export function BusinessTopbar({ onMenuClick }: BusinessTopbarProps) {
    const { unreadNotificationsCount } = useBusiness();

    return (
        <header className="h-16 bg-white border-b border-[#E5E5E5] flex items-center justify-between px-4 sm:px-6 lg:hidden sticky top-0 z-30">
            <button
                type="button"
                onClick={onMenuClick}
                className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Open navigation menu"
            >
                <Menu size={24} />
            </button>

            <Link
                href="/business/notifications"
                className="relative p-2 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors"
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-black ring-2 ring-white" />
                )}
            </Link>
        </header>
    );
}

