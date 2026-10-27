import { useState } from "react";

export type SettingsTab = "profile" | "security" | "notifications";

export function useSettings() {
    const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            // You could add a toast notification here
        }, 1500);
    };

    return {
        activeTab,
        setActiveTab,
        isSaving,
        handleSave,
    };
}