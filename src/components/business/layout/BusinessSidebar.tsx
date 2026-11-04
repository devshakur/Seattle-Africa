"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ArrowLeftRight,
    FileSpreadsheet,
    BookUser,
    Bell,
    Users,
    ArrowRightLeft,
    LogOut,
    X,
} from "lucide-react";
import { cn } from "@/libs/utils";
import { useBusiness } from "@/features/business/context/BusinessContext";

const navItems = [
    { name: "Dashboard", href: "/business/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/business/transactions", icon: ArrowLeftRight },
    { name: "Bulk Payouts", href: "/business/payouts/batch", icon: FileSpreadsheet },
    { name: "Beneficiaries", href: "/business/beneficiaries", icon: BookUser },
    { name: "Notifications", href: "/business/notifications", icon: Bell },
    { name: "Team", href: "/business/settings/team", icon: Users },
];

interface BusinessSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BusinessSidebar({ isOpen, onClose }: BusinessSidebarProps) {
    const pathname = usePathname();
    const { companyName, unreadNotificationsCount, initiateAccountSwitch } = useBusiness();

    return (
        <>
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <aside
                className={cn(
                    "w-[260px] h-screen bg-black text-white flex flex-col fixed left-0 top-0 z-50 overflow-y-auto transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="h-20 flex items-center justify-between px-6">
                    <Link
                        href="/business/dashboard"
                        className="flex items-center gap-2"
                        onClick={onClose}
                    >
                        <Image
                            src="/images/settle-logo.png"
                            alt="Settle Africa logo"
                            width={36}
                            height={36}
                            priority
                            className="object-contain invert"
                        />
                        <span className="text-base font-bold tracking-tight">Business</span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg"
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="px-6 pb-4 text-sm font-semibold truncate">{companyName}</p>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-white !text-black font-semibold shadow-xs"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                )}
                            >
                                <item.icon
                                    size={18}
                                    className={cn("shrink-0", isActive ? "!text-black text-black" : "text-zinc-400")}
                                />
                                <span className={cn("flex-1 truncate", isActive ? "!text-black text-black font-semibold" : "")}>
                                    {item.name}
                                </span>
                                {item.name === "Notifications" && unreadNotificationsCount > 0 && (
                                    <span
                                        className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0",
                                            isActive ? "bg-black text-white" : "bg-white text-black"
                                        )}
                                    >
                                        {unreadNotificationsCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 space-y-1 mb-2 border-t border-zinc-800">
                    <button
                        type="button"
                        onClick={() => initiateAccountSwitch("personal")}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
                    >
                        <ArrowRightLeft size={18} />
                        Personal account
                    </button>
                    <Link
                        href="/login"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                    >
                        <LogOut size={18} />
                        Log out
                    </Link>
                </div>
            </aside>
        </>
    );
}

