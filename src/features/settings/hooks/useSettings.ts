"use client";

import { useState } from "react";

export type SettingsTab = "profile" | "account" | "security" | "notifications";
export type AccountType = "personal" | "business";

export function useSettings() {
    const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
    const [isSaving, setIsSaving] = useState(false);
    const [accountType, setAccountType] = useState<AccountType>("personal");

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
        }, 1500);
    };

    return {
        activeTab,
        setActiveTab,
        isSaving,
        handleSave,
        accountType,
        setAccountType,
    };
}
