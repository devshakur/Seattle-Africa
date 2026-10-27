"use client";

import Link from "next/link";
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
    ChevronDown
} from "lucide-react";
import { cn } from "@/libs/utils";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Send Money", href: "/send-money", icon: Send },
    { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
    { name: "Track Transactions", href: "/track-transaction", icon: Download },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[260px] h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 overflow-y-auto hidden lg:flex z-20">
            {/* Logo */}
            <div className="h-20 flex items-center px-6 mb-2">
                <Link href="/" className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 16L12 20L20 16V8L12 4L4 8V16Z" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 20V12" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 8L12 12L20 8" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-lg font-bold tracking-tight text-gray-900">Settle Africa</span>
                </Link>
            </div>

            {/* User Profile Snippet */}
            <div className="px-4 mb-6">
                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amina" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Amina Yusuf</p>
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
                <Link href="/help" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                    <HelpCircle size={18} className="text-gray-400" />
                    Help & Support
                </Link>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                    <LogOut size={18} className="text-gray-400" />
                    Log out
                </button>
            </div>
        </aside>
    );
}