import { Card } from "@/components/ui/Card";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function PromoBanner() {
    return (
        <Card className="relative h-[320px] bg-[#0B0C10] text-white overflow-hidden group border border-white/10 shadow-xl shadow-black/40 rounded-2xl">
            {/* Ambient Glow Effects */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-[#D4AF37]/20 via-amber-600/10 to-transparent rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-blue-900/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Stylized 3D Glassmorphic Card Graphic */}
            <div className="absolute right-[-15px] bottom-[-20px] w-48 h-32 bg-gradient-to-br from-zinc-800/90 via-zinc-900/90 to-black/90 backdrop-blur-xl rounded-2xl border border-white/15 shadow-2xl rotate-[-12deg] group-hover:rotate-[-4deg] group-hover:translate-x-[-5px] transition-all duration-500 flex flex-col justify-between p-4">
                <div className="flex items-center justify-between">
                    <div className="w-7 h-5 bg-gradient-to-r from-amber-200 to-yellow-400 rounded-md shadow-inner opacity-90"></div>
                    <span className="text-[10px] tracking-widest uppercase font-mono text-white/50">PLATINUM</span>
                </div>
                <div className="space-y-1">
                    <div className="w-16 h-1.5 bg-white/20 rounded-full"></div>
                    <div className="w-24 h-1.5 bg-white/10 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tracking-wider text-white/80">•••• 8829</span>
                    <span className="text-[9px] font-bold tracking-tighter text-amber-300">SETTLE</span>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 flex flex-col justify-between h-full max-w-[280px]">
                <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md mb-4 shadow-sm">
                        <Sparkles size={12} className="text-amber-300" />
                        Pan-African Treasury
                    </span>
                    <h3 className="text-xl font-bold tracking-tight text-white mb-2 leading-snug">
                        Zero FX Spread on High-Volume Transfers
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                        Experience real-time settlements across African corridors with zero markup.
                    </p>
                </div>

                <Link
                    href="/send-money"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-black bg-white hover:bg-zinc-200 px-4 py-2.5 rounded-xl transition-all w-fit shadow-md group-hover:shadow-white/10 group-hover:translate-x-1"
                >
                    Transfer Funds
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>
        </Card>
    );
}
