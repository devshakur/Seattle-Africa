import Link from "next/link";
import { Send, UserPlus, Landmark, HeadphonesIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

const actions = [
    { title: "Send Money", desc: "Transfer to bank account", icon: Send, href: "/send-money" },
    { title: "Add Recipient", desc: "Save a new beneficiary", icon: UserPlus, href: "#" },
    { title: "Exchange Rates", desc: "View live market rates", icon: Landmark, href: "#" },
    { title: "Support", desc: "Get help with a transfer", icon: HeadphonesIcon, href: "#" },
];

export function QuickActions() {
    return (
        <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {actions.map((action) => (
                    <Link key={action.title} href={action.href}>
                        <Card className="p-4 hover:border-gray-400 hover:shadow-md transition-all group cursor-pointer h-full">
                            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center mb-3 group-hover:bg-black group-hover:text-white transition-colors">
                                <action.icon size={18} />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">{action.title}</h3>
                            <p className="text-xs text-gray-500 leading-snug">{action.desc}</p>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}