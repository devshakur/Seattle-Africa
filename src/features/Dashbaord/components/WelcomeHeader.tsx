import { BadgeCheck } from "lucide-react";

export function WelcomeHeader() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Good evening, Shakiru</h1>
                <p className="text-sm text-gray-500 mt-1">Here's your overview. Let's make it happen.</p>
            </div>

            {/* Account Verified Badge */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm self-start sm:self-auto">
                <BadgeCheck className="text-black" size={18} />
                <div>
                    <p className="text-xs font-bold text-gray-900 leading-none">Account Verified</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">KYC completed • Fully active</p>
                </div>
            </div>
        </div>
    );
}