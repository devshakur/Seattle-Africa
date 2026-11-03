"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Bell, Mail, Smartphone, ArrowRightLeft, ShieldAlert, TrendingUp, Tag } from "lucide-react";
import { cn } from "@/libs/utils";

interface NotificationSettingItem {
    id: string;
    title: string;
    desc: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    email: boolean;
    sms: boolean;
}

export function NotificationSettings() {
    const [settingsList, setSettingsList] = useState<NotificationSettingItem[]>([
        {
            id: "transfers",
            title: "Transfer Clearing & Delivery Updates",
            desc: "Instant real-time alerts whenever a cross-border settlement completes, fails, or clears.",
            icon: ArrowRightLeft,
            email: true,
            sms: true,
        },
        {
            id: "security",
            title: "Account Security & Device Logs",
            desc: "Alerts for new device sign-ins, IP changes, password updates, and 2FA modifications.",
            icon: ShieldAlert,
            email: true,
            sms: true,
        },
        {
            id: "rates",
            title: "African FX Rate Fluctuations",
            desc: "Daily morning rate digest and notifications when your target African FX cross-rates hit.",
            icon: TrendingUp,
            email: true,
            sms: false,
        },
        {
            id: "promos",
            title: "Vouchers & Fee Waivers",
            desc: "Zero-fee settlement promotional codes and platform product announcements.",
            icon: Tag,
            email: false,
            sms: false,
        },
    ]);

    const toggleChannel = (id: string, channel: "email" | "sms") => {
        setSettingsList((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const nextVal = !item[channel];
                    const nextItem = { ...item, [channel]: nextVal };
                    toast.success(
                        `${item.title} (${channel.toUpperCase()}): ${nextVal ? "Enabled" : "Disabled"}`
                    );
                    return nextItem;
                }
                return item;
            })
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h2 className="text-xl font-bold text-gray-950">Notification Preferences</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Select how you want to be notified about transfer deliveries, FX swings, and security events.
                </p>
            </div>

            <div className="space-y-3.5">
                {settingsList.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-colors"
                        >
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 bg-gray-100 rounded-xl text-gray-800 shrink-0 mt-0.5">
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-950">{item.title}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed max-w-md">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="flex items-center gap-6 self-end sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 w-full sm:w-auto justify-end">
                                {/* Email Toggle */}
                                <div className="flex items-center gap-2">
                                    <Mail size={13} className="text-gray-400" />
                                    <span className="text-xs font-medium text-gray-600">Email</span>
                                    <button
                                        type="button"
                                        onClick={() => toggleChannel(item.id, "email")}
                                        aria-label={`Toggle email for ${item.title}`}
                                        className={cn(
                                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none",
                                            item.email ? "bg-black" : "bg-gray-200"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                                item.email ? "translate-x-4" : "translate-x-0"
                                            )}
                                        />
                                    </button>
                                </div>

                                {/* SMS Toggle */}
                                <div className="flex items-center gap-2">
                                    <Smartphone size={13} className="text-gray-400" />
                                    <span className="text-xs font-medium text-gray-600">SMS</span>
                                    <button
                                        type="button"
                                        onClick={() => toggleChannel(item.id, "sms")}
                                        aria-label={`Toggle SMS for ${item.title}`}
                                        className={cn(
                                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none",
                                            item.sms ? "bg-black" : "bg-gray-200"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                                item.sms ? "translate-x-4" : "translate-x-0"
                                            )}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
