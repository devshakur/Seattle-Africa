import { ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/libs/utils";

export function SecuritySettings() {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Security</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your password and account security preferences.</p>
            </div>

            {/* Password Change */}
            <div className="space-y-5 max-w-md">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5 transition-all" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5 transition-all" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5 transition-all" />
                </div>
                <Button className="h-11 rounded-xl px-6 bg-black text-white hover:bg-gray-800">Update Password</Button>
            </div>

            <div className="h-px w-full bg-gray-100" />

            {/* 2FA Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-gray-200 bg-gray-50">
                <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <Smartphone size={20} className="text-gray-900" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Two-Factor Authentication (2FA)</h3>
                        <p className="text-xs text-gray-500 mt-1 max-w-sm">Add an extra layer of security to your account by requiring a code from your phone.</p>
                    </div>
                </div>
                {/* Custom Toggle Switch */}
                <button className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                    <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                </button>
            </div>
        </div>
    );
}