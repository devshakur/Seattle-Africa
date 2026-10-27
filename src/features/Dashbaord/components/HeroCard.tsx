import { ArrowUpRight, Download, RefreshCw, Plus, Send } from "lucide-react";

export function HeroCard() {
    return (
        <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden shadow-xl">
            {/* Decorative subtle grid/blob background for that premium feel */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 relative z-10">
                <div>
                    <p className="text-gray-400 text-sm mb-1 flex items-center gap-1">
                        Total Volume Transferred
                    </p>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">$12,480.00</h2>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-300">
                        <ArrowUpRight size={16} className="text-white" />
                        <span className="text-white">+12.5%</span> vs last month
                    </div>
                </div>

                {/* Quick Action Buttons inside Hero Card */}
                <div className="flex gap-3 sm:gap-4">
                    {[
                        { label: "Send", icon: Send },
                        { label: "Receive", icon: Download },
                        { label: "Exchange", icon: RefreshCw },
                        { label: "New", icon: Plus },
                    ].map((action) => (
                        <button key={action.label} className="flex flex-col items-center justify-center gap-2 group">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all border border-white/5">
                                <action.icon size={20} className="text-white" />
                            </div>
                            <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}