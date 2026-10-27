"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AccountTypeToggle } from "./AccountTypeToggle";
import { SocialAuth } from "./SocialAuth";

export function LoginForm() {
    const [accountType, setAccountType] = useState<
        "personal" | "business"
    >("personal");

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Logging in as:", accountType);
    };

    return (
        <main className="relative h-dvh w-full flex flex-col items-center justify-center overflow-hidden">
            <div className="w-full flex flex-col items-center justify-center bg-[#F7F8FA] py-3 rounded-3xl px-3">
                {/* Big Soft Bubbles stuck at the right edge */}

                {/* Animated blue bubble — enters and settles at top-right */}
                <div
                    className="pointer-events-none absolute -right-25 top-40 lg:top-35 xl:top-9 2xl:top-6 z-0 h-[200px] w-[200px] animate-bubble-enter rounded-full border border-indigo-300/40 bg-indigo-400/20 shadow-[inset_-12px_-12px_30px_rgba(99,102,241,0.12),inset_10px_10px_24px_rgba(255,255,255,0.45),0_20px_60px_rgba(99,102,241,0.12)]"
                    aria-hidden="true"
                />


                {/* Container with maintained width */}
                <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">

                    {/* Brand */}
                    <Link
                        href="/"
                        className="mb-3 flex items-center justify-center gap-2"
                        aria-label="Settle Africa home"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white shadow-sm">
                            <span className="text-base font-bold">S</span>
                        </span>

                        <span className="text-base font-bold tracking-tight text-gray-950">
                            Settle <span className="font-normal text-gray-600">Africa</span>
                        </span>
                    </Link>

                    {/* Login Card */}
                    <section className="relative w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white/95 backdrop-blur-md px-6 py-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)] sm:px-8 sm:py-6">

                        {/* Heading */}
                        <div className="mb-4">
                            <h1 className="text-xl font-semibold tracking-tight text-gray-950">
                                Welcome back
                            </h1>

                            <p className="mt-0.5 text-xs text-gray-500">
                                Log in to your account to continue.
                            </p>
                        </div>

                        {/* Account Type Toggle */}
                        <div className="mb-3.5">
                            <AccountTypeToggle
                                value={accountType}
                                onChange={setAccountType}
                            />
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-3"
                        >
                            <Input
                                label="Email address"
                                type="email"
                                placeholder="you@example.com"
                                required
                            />

                            <div className="space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                    <label className="text-xs font-medium text-gray-800">
                                        Password
                                    </label>

                                    <Link
                                        href="/forgot-password"
                                        className="text-xs font-medium text-gray-600 hover:text-black transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    required
                                    icon={
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            className="text-gray-400 hover:text-gray-700 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={16} />
                                            ) : (
                                                <Eye size={16} />
                                            )}
                                        </button>
                                    }
                                />
                            </div>

                            {/* Remember Me */}
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="h-3.5 w-3.5 rounded border-gray-300 accent-black focus:ring-black"
                                />
                                <span className="text-xs text-gray-600">
                                    Remember me
                                </span>
                            </label>

                            <Button
                                type="submit"
                                className="h-10 w-full rounded-xl text-sm font-semibold shadow-sm"
                                href="/dashboard"
                                loadingText="Validating User..."
                                aria-label="Login"
                            >
                                Log in
                            </Button>
                        </form>

                        {/* Signup */}
                        <div className="mt-3.5 border-t border-gray-100 pt-3.5">
                            <p className="text-center text-xs text-gray-500">
                                Don't have an account?{" "}
                                <Link
                                    href="/signup"
                                    className="font-semibold text-gray-950 hover:underline"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                        <ShieldCheck size={13} className="text-gray-400" />
                        <span>Your financial information stays protected.</span>
                    </div>
                </div>
            </div>
        </main>
    );
}