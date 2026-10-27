import { ArrowUpRight, Plus, MoreHorizontal, User } from "lucide-react";

export function PhoneMockup() {
    return (
        // Wrapper to handle the 3D slant and positioning
        <div
            className="relative w-[320px] h-[650px] bg-gray-900 rounded-[45px] p-[12px] shadow-2xl border-4 border-gray-800/50"
            style={{
                transform: 'perspective(1200px) rotateY(-15deg) rotateX(5deg) rotateZ(-8deg) scale(1.05)',
                transformStyle: 'preserve-3d',
            }}
        >
            {/* Screen */}
            <div className="w-full h-full bg-[#f8f9fa] rounded-[35px] overflow-hidden flex flex-col relative">
                {/* Status Bar & Notch */}
                <div className="h-10 flex justify-between items-center px-6 pt-2 text-[11px] font-semibold z-20">
                    <span>9:41</span>
                    {/* Dynamic Island / Notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full" />
                    <div className="flex gap-1 items-center">
                        <div className="w-3.5 h-3 bg-black rounded-sm" />
                        <div className="w-4 h-3 bg-black rounded-sm" />
                        <div className="w-5 h-3 bg-black rounded-sm" />
                    </div>
                </div>

                {/* Header */}
                <div className="px-6 py-4 flex justify-between items-center mt-2">
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Good morning,</p>
                        <h3 className="text-lg font-bold text-gray-900"></h3>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                        <User size={18} className="text-gray-500" />
                    </div>
                </div>

                {/* Balance */}
                <div className="px-6 py-3">
                    <p className="text-xs text-gray-500 mb-1 font-medium">Total balance</p>
                    <h2 className="text-[32px] font-bold tracking-tight text-gray-900">$2,480.00</h2>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 flex gap-3">
                    <button className="flex-1 bg-black text-white rounded-xl py-3.5 flex flex-col items-center justify-center gap-2 shadow-lg">
                        <ArrowUpRight size={20} />
                        <span className="text-[11px] font-medium">Send Money</span>
                    </button>
                    <button className="flex-1 bg-white border border-gray-200 text-black rounded-xl py-3.5 flex flex-col items-center justify-center gap-2 shadow-sm">
                        <Plus size={20} />
                        <span className="text-[11px] font-medium">Add money</span>
                    </button>
                </div>

                {/* Transactions Container */}
                <div className="flex-1 bg-white rounded-t-[28px] mt-4 px-6 pt-6 pb-4 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
                    <div className="flex justify-between items-center mb-5">
                        <h4 className="text-sm font-bold text-gray-900">Recent transactions</h4>
                        <MoreHorizontal size={18} className="text-gray-400" />
                    </div>

                    <div className="flex flex-col gap-5">
                        {/* Transaction 1 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-bold">
                                    NG
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-gray-900">To Nigeria</p>
                                    <p className="text-[11px] text-gray-400">GTB - Completed</p>
                                </div>
                            </div>
                            <p className="text-[13px] font-bold text-green-500">+₦ 245,000</p>
                        </div>

                        {/* Transaction 2 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-bold">
                                    GH
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-gray-900">From Ghana</p>
                                    <p className="text-[11px] text-gray-400">GCB - Completed</p>
                                </div>
                            </div>
                            <p className="text-[13px] font-bold text-green-500">+$ 120.50</p>
                        </div>

                        {/* Transaction 3 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">
                                    KE
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-gray-900">To Kenya</p>
                                    <p className="text-[11px] text-gray-400">KCB - Completed</p>
                                </div>
                            </div>
                            <p className="text-[13px] font-bold text-gray-900">-₹ 15,000</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}