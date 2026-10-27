import { Card } from "@/components/ui/Card";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
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
                    <span className="text-[9px] font-mono font-bold tracking-widest text-[#D4AF37]">FINCORE 2.0</span>
                </div>
                <div className="space-y-1">
                    <div className="text-[10px] font-mono tracking-wider text-white/40">•••• •••• •••• 8821</div>
                    <div className="flex justify-between items-center text-[9px] text-white/70 font-medium">
                        <span>BUSINESS ELITE</span>
                        <span>09/28</span>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 p-7 h-full flex flex-col justify-between items-start">
                <div className="space-y-3">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 px-3 py-1.5 rounded-full border border-[#D4AF37]/25 backdrop-blur-md">
                        <Sparkles size={13} className="text-[#D4AF37]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">Business Tier</span>
                    </div>

                    {/* Heading */}
                    <h3 className="text-2xl font-bold tracking-tight leading-snug">
                        Upgrade to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#D4AF37]">
                            Business Account
                        </span>
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-zinc-400 max-w-[210px] leading-relaxed">
                        Unlock 0% FX transfer fees, dedicated treasury support, and higher limits for your team.
                    </p>
                </div>

                {/* Action Button */}
                <Link
                    href="#"
                    className="inline-flex items-center gap-2 text-xs font-semibold bg-white text-black px-4 py-2.5 rounded-xl hover:bg-zinc-100 transition-all shadow-md group/btn"
                >
                    <span>Explore Business</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </Card>
    );
}