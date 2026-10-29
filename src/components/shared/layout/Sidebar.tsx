"use client";

import Link from "next/link"
import Image from "next/image";

import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Send,
    Download,
    ArrowLeftRight,
    Wallet,
    Settings,
    HelpCircle,
    LogOut,
    ChevronDown,
    X,
    Search
} from "lucide-react";
import { cn } from "@/libs/utils";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Send Money", href: "/send-money", icon: Send },
    { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
    { name: "Track Transaction", href: "/track-transaction", icon: Search },
    { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar Panel */}
            <aside
                className={cn(
                    "w-[260px] h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50 overflow-y-auto transition-transform duration-300 ease-in-out",
                    // Slide in on mobile if isOpen, otherwise slide out (-translate-x-full).
                    // On large screens (lg), keep it static and visible.
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Logo & Mobile Close Button */}
                <div className="h-20 flex items-center justify-between px-6 mb-2">
                    <Link href="/" className="flex items-center gap-2" onClick={onClose}>
                        <Image src="/images/settle-logo.png" alt="Settle Africa logo" width={45} height={45} priority className="object-contain" />
                        <span className="text-lg font-bold tracking-tight text-gray-900">Settle Africa</span>
                    </Link>

                    {/* Close button visible only on mobile */}
                    <button onClick={onClose} className="lg:hidden p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                {/* User Profile Snippet */}
                <div className="px-4 mb-6">
                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amina" alt="User" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Abdulshakur Dauda</p>
                                <p className="text-xs text-gray-500">Personal Account</p>
                            </div>
                        </div>
                        <ChevronDown size={16} className="text-gray-400" />
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose} // Close menu when link is clicked
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                )}
                            >
                                <item.icon size={18} className={isActive ? "text-gray-900" : "text-gray-400"} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Links */}
                <div className="p-4 mt-auto space-y-1 mb-2">
                    <Link href="/help" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                        <HelpCircle size={18} className="text-gray-400" />
                        Help & Support
                    </Link>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                        <LogOut size={18} className="text-gray-400" />
                        Log out
                    </button>
                </div>
            </aside>
        </>
    );
}