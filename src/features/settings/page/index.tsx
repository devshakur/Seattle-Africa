"use client";

import { useSettings } from "../hooks/useSettings";
import { SettingsSidebar } from "../components/SettingsSidebar";
import { ProfileSettings } from "../components/ProfileSettings";
import { AccountSettings } from "../components/AccountSettings";
import { SecuritySettings } from "../components/SecuritySettings";
import { NotificationSettings } from "../components/NotificationSettings";

export function SettingsPage() {
    const settings = useSettings();

    return (
        <div className="animate-in fade-in duration-300 max-w-6xl mx-auto">

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account preferences and security.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Settings Navigation Sidebar */}
                <SettingsSidebar
                    activeTab={settings.activeTab}
                    setActiveTab={settings.setActiveTab}
                />

                {/* Settings Content Area */}
                <div className="flex-1 w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-10">
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
                </div>

            </div>
        </div>
    );
}
