import { Card } from "@/components/ui/Card";
import { MoreHorizontal } from "lucide-react";

// Mock data for the chart
const data = [
    { month: "Jan", value: 45 },
    { month: "Feb", value: 60 },
    { month: "Mar", value: 35 },
    { month: "Apr", value: 75 },
    { month: "May", value: 90 },
    { month: "Jun", value: 85 },
];

export function ActivityChart() {
    return (
        <Card className="p-6 flex flex-col justify-between h-[300px]">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-bold text-gray-900">Transfer Volume</h3>
                    <p className="text-xs text-gray-500 mt-1">Your sending activity over the last 6 months</p>
                </div>
                <button className="text-gray-400 hover:text-black transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Chart Container */}
            <div className="flex items-end justify-between flex-1 gap-2 sm:gap-4 mt-4">
                {data.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 group w-full">
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] py-1 px-2 rounded mb-1 absolute -translate-y-8 pointer-events-none">
                            ${item.value * 100}
                        </div>

                        {/* Bar */}
                        <div className="w-full relative flex items-end justify-center h-[120px] bg-gray-50 rounded-md overflow-hidden">
                            <div
                                className="w-full bg-black rounded-t-sm transition-all duration-500 ease-out group-hover:bg-gray-800"
                                style={{ height: `${item.value}%` }}
                            />
                        </div>

                        {/* Label */}
                        <span className="text-[10px] sm:text-xs font-medium text-gray-400 group-hover:text-black transition-colors">
                            {item.month}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}