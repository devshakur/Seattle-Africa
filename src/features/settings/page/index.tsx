"use client";

import { User, Building2, ShieldCheck, Bell, Shield, ArrowUpRight } from "lucide-react";
import { useSettings, SettingsTab } from "../hooks/useSettings";
import { ProfileSettings } from "../components/ProfileSettings";
import { AccountSettings } from "../components/AccountSettings";
import { SecuritySettings } from "../components/SecuritySettings";
import { NotificationSettings } from "../components/NotificationSettings";
import { Card } from "@/components/ui/Card";

const TABS: { id: SettingsTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: "profile", label: "Profile Information", icon: User },
    { id: "account", label: "Account & Limits", icon: Building2 },
    { id: "security", label: "Security & 2FA", icon: ShieldCheck },
    { id: "notifications", label: "Notifications", icon: Bell },
];

export function SettingsPage() {
    const settings = useSettings();

    // Default user initials: "AY" (Amina Yusuf)
    const userInitials = "AD";

    return (
        <div className="animate-in fade-in duration-300 max-w-4xl mx-auto pb-16 space-y-6 text-left">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight">
                    Account Settings
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Manage your personal profile, settlement account preferences, security, and alerts.
                </p>
            </div>

            {/* Profile Overview Card (Top Banner) */}
            <Card className="p-5 sm:p-6 border border-gray-200/90 shadow-xs bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* Initials Avatar */}
                        <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center font-mono font-bold text-xl shadow-xs border-2 border-white ring-2 ring-black/5 shrink-0 select-none">
                            {userInitials}
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-gray-950">Abdulshakur Dauda</h2>
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                    <ShieldCheck size={11} />
                                    Tier 2
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">devshakur@settleafrica.com</p>
                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400 font-mono">
                                <span>ID: SA-USER-8910</span>
                                <span>&bull;</span>
                                <span className="text-gray-700 font-medium capitalize">{settings.accountType} Account</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                        <span className="text-[11px] text-gray-400 font-mono uppercase">Daily Clearing Limit</span>
                        <span className="font-mono font-bold text-gray-950 text-sm sm:text-base">$50,000 USD</span>
                    </div>
                </div>
            </Card>

            {/* Horizontal Settings Tabs (Professional Fintech View - Single Column) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1.5 rounded-2xl border border-gray-200 bg-gray-50/80 shadow-2xs">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = settings.activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => settings.setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${isActive
                                ? "bg-white text-gray-950 shadow-xs border border-gray-200/90"
                                : "text-gray-500 hover:text-black hover:bg-gray-100/60"
                                }`}
                        >
                            <Icon size={15} className={isActive ? "text-black" : "text-gray-400"} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Unified Settings Content Card */}
            <Card className="p-6 sm:p-9 border border-gray-200/90 shadow-xs bg-white">
                {settings.activeTab === "profile" && (
                    <ProfileSettings
                        isSaving={settings.isSaving}
                        onSave={settings.handleSave}
                    />
                )}
                {settings.activeTab === "account" && (
                    <AccountSettings
                        accountType={settings.accountType}
                        onSwitch={settings.setAccountType}
                    />
                )}
                {settings.activeTab === "security" && <SecuritySettings />}
                {settings.activeTab === "notifications" && <NotificationSettings />}
            </Card>
        </div>
    );
}
