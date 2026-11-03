"use client";

import { useState } from "react";
import { ShieldCheck, Smartphone, KeyRound, Laptop, MapPin, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";

export function SecuritySettings() {
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [isUpdatingPass, setIsUpdatingPass] = useState(false);

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPass || !newPass || !confirmPass) {
            toast.error("Please fill in all password fields.");
            return;
        }
        if (newPass.length < 8) {
            toast.error("New password must be at least 8 characters long.");
            return;
        }
        if (newPass !== confirmPass) {
            toast.error("New passwords do not match.");
            return;
        }

        setIsUpdatingPass(true);
        setTimeout(() => {
            setIsUpdatingPass(false);
            setCurrentPass("");
            setNewPass("");
            setConfirmPass("");
            toast.success("Security password updated successfully!");
        }, 1200);
    };

    const handleToggle2FA = () => {
        const next = !twoFactorEnabled;
        setTwoFactorEnabled(next);
        if (next) {
            toast.success("Two-Factor Authentication (2FA) enabled.");
        } else {
            toast.info("Two-Factor Authentication disabled.");
        }
    };

    const handleSignoutOtherDevices = () => {
        toast.success("All other active device sessions have been terminated.");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-950">Security & Access</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Manage your credentials, multi-factor authentication, and active settlement sessions.
                </p>
            </div>

            {/* 2FA Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-gray-200 bg-gray-50/70">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs text-black shrink-0">
                        <Smartphone size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-gray-950">
                                Two-Factor Authentication (2FA)
                            </h3>
                            <span
                                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                                    twoFactorEnabled
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                {twoFactorEnabled ? "Active" : "Disabled"}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 max-w-md leading-relaxed">
                            Require an SMS or authenticator passkey verification prompt when initiating high-value transfers or signing in.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleToggle2FA}
                    aria-label="Toggle Two-Factor Authentication"
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                        twoFactorEnabled ? "bg-black" : "bg-gray-300"
                    }`}
                >
                    <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                </button>
            </div>

            {/* Password Update Form */}
            <form onSubmit={handlePasswordUpdate} className="space-y-4 pt-2">
                <div className="flex items-center gap-2 mb-2">
                    <KeyRound size={16} className="text-gray-400" />
                    <h3 className="text-sm font-bold text-gray-950">Change Password</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-black tracking-tight">
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={currentPass}
                            onChange={(e) => setCurrentPass(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-mono focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-black tracking-tight">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-mono focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-black tracking-tight">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-mono focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
                        />
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                    <Button
                        type="submit"
                        disabled={isUpdatingPass}
                        className="h-10 rounded-xl px-6 bg-black text-white hover:bg-zinc-800 text-xs font-semibold"
                    >
                        {isUpdatingPass ? "Updating..." : "Update Password"}
                    </Button>
                </div>
            </form>

            <div className="h-px w-full bg-gray-100" />

            {/* Active Sessions */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-gray-950">Active Device Sessions</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Devices currently authenticated to your Settle Africa account.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleSignoutOtherDevices}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                    >
                        Sign out other devices
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white text-xs">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
                                <Laptop size={16} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-950 flex items-center gap-2">
                                    <span>Chrome on macOS (Current Session)</span>
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                </p>
                                <p className="text-gray-500 mt-0.5 flex items-center gap-1">
                                    <MapPin size={11} /> Lagos, Nigeria &bull; IP: 102.89.41.22
                                </p>
                            </div>
                        </div>
                        <span className="font-mono text-gray-400">Active now</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50/50 text-xs">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
                                <Smartphone size={16} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">iPhone 15 Pro • Safari</p>
                                <p className="text-gray-500 mt-0.5 flex items-center gap-1">
                                    <MapPin size={11} /> Nairobi, Kenya &bull; IP: 197.232.10.14
                                </p>
                            </div>
                        </div>
                        <span className="font-mono text-gray-400">2 days ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
