import { Card } from "@/components/ui/Card";
import { ChevronDown } from "lucide-react";

export function RevenueChart() {
    return (
        <Card className="p-6 mb-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Revenue</h2>
                    <div className="flex items-center gap-6 mt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-black" />
                            <span className="text-xs text-gray-500">Gross Volume</span>
                            <span className="text-sm font-bold text-gray-900 ml-2">$48,580</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                            <span className="text-xs text-gray-500">Net Volume</span>
                            <span className="text-sm font-bold text-gray-900 ml-2">$29,540</span>
                        </div>
                    </div>
                </div>
                <button className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                    This year <ChevronDown size={14} />
                </button>
            </div>

            {/* SVG Chart Section */}
            <div className="relative w-full h-[250px] mt-4">
                {/* Y-Axis Labels */}
                <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-[10px] text-gray-400 pb-6">
                    <span>100,000</span>
                    <span>75,000</span>
                    <span>50,000</span>
                    <span>25,000</span>
                    <span>0</span>
                </div>

                {/* Chart Area */}
                <div className="absolute inset-0 left-10 border-l border-b border-gray-100 flex items-end">
                    {/* FIXED: Moved preserveAspectRatio out of className and corrected the attribute */}
                    <svg
                        viewBox="0 0 1000 300"
                        className="w-full h-full overflow-visible"
                        preserveAspectRatio="none"
                    >
                        {/* Horizontal Grid Lines */}
                        <line x1="0" y1="0" x2="100%" y2="0" stroke="#f3f4f6" strokeWidth="1" />
                        <line x1="0" y1="75" x2="100%" y2="75" stroke="#f3f4f6" strokeWidth="1" />
                        <line x1="0" y1="150" x2="100%" y2="150" stroke="#f3f4f6" strokeWidth="1" />
                        <line x1="0" y1="225" x2="100%" y2="225" stroke="#f3f4f6" strokeWidth="1" />

                        {/* Net Volume Line (Gray) */}
                        <path
                            d="M0,150 C100,140 200,180 300,160 C400,140 500,200 600,180 C700,160 800,220 900,200 L1000,210"
                            fill="none"
                            stroke="#d1d5db"
                            strokeWidth="2"
                        />

                        {/* Gross Volume Line (Black) */}
                        <path
                            d="M0,220 C100,200 200,230 300,180 C400,130 500,190 600,140 C700,90 800,160 900,120 L1000,130"
                            fill="none"
                            stroke="#111827"
                            strokeWidth="2"
                        />

                        {/* Gradient Fill under Gross Volume */}
                        <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#111827" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="#111827" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0,220 C100,200 200,230 300,180 C400,130 500,190 600,140 C700,90 800,160 900,120 L1000,130 L1000,300 L0,300 Z"
                            fill="url(#gradient)"
                        />
                    </svg>
                </div>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-[10px] text-gray-400 mt-2 pl-10 pr-2">
                {["12 Feb", "12 Mar", "9 Apr", "7 May", "11 Jun", "9 Jul", "13 Aug", "10 Sep", "8 Oct", "12 Nov", "10 Dec", "7 Jan"].map((month) => (
                    <span key={month}>{month}</span>
                ))}
            </div>
        </Card>
    );
}