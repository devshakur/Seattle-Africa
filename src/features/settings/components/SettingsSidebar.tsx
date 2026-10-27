import { User, Shield, Bell } from "lucide-react";
import { SettingsTab } from "../hooks/useSettings";
import { cn } from "@/libs/utils";

interface Props {
    activeTab: SettingsTab;
    setActiveTab: (tab: SettingsTab) => void;
}

const tabs = [
    { id: "profile" as SettingsTab, label: "Profile", icon: User },
    { id: "security" as SettingsTab, label: "Security", icon: Shield },
    { id: "notifications" as SettingsTab, label: "Notifications", icon: Bell },
];

export function SettingsSidebar({ activeTab, setActiveTab }: Props) {
    return (
        <div className="w-full lg:w-64 shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-4 lg:pb-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap",
                            activeTab === tab.id
                                ? "bg-black text-white shadow-sm"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                    >
                        <tab.icon size={18} className={activeTab === tab.id ? "text-white" : "text-gray-400"} />
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}