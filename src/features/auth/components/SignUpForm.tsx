
"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AccountTypeToggle } from "./AccountTypeToggle";

export function SignupForm() {
    const [accountType, setAccountType] = useState<
        "personal" | "business"
    >("personal");

    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!acceptedTerms) return;

        // Connect your registration API here.
        console.log("Creating account:", { accountType });
    };

    return (
        <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden px-3 py-4 sm:px-5">
            <div className="relative flex w-full flex-col items-center justify-center rounded-3xl bg-[#F7F8FA] px-4 py-5 sm:px-6">

                {/* Animated blue bubble */}
                <div
                    className="pointer-events-none absolute -right-20 top-[-65px] z-0 h-[200px] w-[200px] animate-bubble-enter rounded-full border border-indigo-300/40 bg-indigo-400/20 shadow-[inset_-12px_-12px_30px_rgba(99,102,241,0.12),inset_10px_10px_24px_rgba(255,255,255,0.45),0_20px_60px_rgba(99,102,241,0.12)]"
                    aria-hidden="true"
                />

                <div className="relative z-10 flex w-full max-w-[420px] flex-col items-center">

                    {/* Brand */}
                    <Link
                        href="/"
                        aria-label="Settle Africa home"
                        className="mb-3 flex items-center justify-center gap-2"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white shadow-sm">
                            <span className="text-base font-bold">S</span>
                        </span>

                        <span className="text-base font-bold tracking-tight text-gray-950">
                            Settle{" "}
                            <span className="font-normal text-gray-600">
                                Africa
                            </span>
                        </span>
                    </Link>

                    {/* Signup Card */}
                    <section className="w-full rounded-2xl border border-gray-200/80 bg-white/95 px-6 py-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)] backdrop-blur-md sm:px-8 sm:py-6">

                        {/* Heading */}
                        <div className="mb-4">
                            <h1 className="text-xl font-semibold tracking-tight text-gray-950">
                                Create your account
                            </h1>

                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                Send money across Africa with confidence.
                            </p>
                        </div>

                        {/* Account Type */}
                        <div className="mb-4">
                            <AccountTypeToggle
                                value={accountType}
                                onChange={setAccountType}
                            />
                        </div>

                        {/* Signup Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-3"
                        >
                            <Input
                                label={
                                    accountType === "personal"
                                        ? "Full name"
                                        : "Business name"
                                }
                                type="text"
                                placeholder={
                                    accountType === "personal"
                                        ? "Enter your full name"
                                        : "Enter your registered business name"
                                }
                                autoComplete="name"
                                required
                            />

                            <Input
                                label="Email address"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-800">
                                    Password
                                </label>

                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    autoComplete="new-password"
                                    required
                                    minLength={8}
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
                                            className="text-gray-400 transition-colors hover:text-gray-700"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={16} />
                                            ) : (
                                                <Eye size={16} />
                                            )}
                                        </button>
                                    }
                                />

                                <p className="text-[11px] text-gray-400">
                                    Use at least 8 characters.
                                </p>
                            </div>

                            {/* Terms */}
                            <label className="flex cursor-pointer items-start gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) =>
                                        setAcceptedTerms(e.target.checked)
                                    }
                                    required
                                    className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-gray-300 accent-black focus:ring-black"
                                />

                                <span className="text-[11px] leading-4 text-gray-500">
                                    I agree to the{" "}
                                    <Link
                                        href="/terms"
                                        className="font-medium text-gray-900 underline underline-offset-2"
                                    >
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="/privacy"
                                        className="font-medium text-gray-900 underline underline-offset-2"
                                    >
                                        Privacy Policy
                                    </Link>
                                    .
                                </span>
                            </label>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="mt-1 h-10 w-full rounded-xl text-sm font-semibold shadow-sm"
                            >
                                Create account
                            </Button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-4 border-t border-gray-100 pt-4">
                            <p className="text-center text-xs text-gray-500">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="font-semibold text-gray-950 hover:underline"
                                >
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </section>

                    {/* Security Footer */}
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                        <ShieldCheck size={13} />
                        <span>Your financial information stays protected.</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
