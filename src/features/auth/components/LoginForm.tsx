"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AccountTypeToggle, AccountType } from "./AccountTypeToggle";
import { toast } from "react-toastify";
import { PhoneInputWithCountry } from "./PhoneInputWithCountry";
import { AFRICAN_CURRENCIES, CurrencyConfig } from "@/features/currency/CurrencyContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
    const router = useRouter();
    const [accountType, setAccountType] = useState<AccountType>("personal");

    // Login mode: default to phone number
    const [useEmailMode, setUseEmailMode] = useState(false);

    // Two-part phone input states
    const [country, setCountry] = useState<CurrencyConfig>(AFRICAN_CURRENCIES[0]);
    const [phoneNumber, setPhoneNumber] = useState("");

    // Email input state
    const [email, setEmail] = useState("");

    // Password & UI states
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ phone?: string; email?: string; password?: string }>({});


    // Validate inputs
    const validateForm = () => {
        const nextErrors: { phone?: string; email?: string; password?: string } = {};

        if (!useEmailMode) {
            const digits = phoneNumber.replace(/\D/g, "");
            if (!digits) {
                nextErrors.phone =
                    accountType === "business"
                        ? "Corporate phone number is required."
                        : "Phone number is required.";
            } else if (digits.length < 7) {
                nextErrors.phone = "Please enter a valid phone number (minimum 7 digits).";
            }
        } else {
            if (!email.trim()) {
                nextErrors.email =
                    accountType === "business"
                        ? "Work email address is required."
                        : "Email address is required.";
            } else if (!EMAIL_REGEX.test(email.trim())) {
                nextErrors.email = "Please enter a valid email address (e.g., name@domain.com).";
            }
        }

        if (!password) {
            nextErrors.password = "Password is required.";
        } else if (password.length < 8) {
            nextErrors.password = "Password must be at least 8 characters.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleAccountTypeChange = (type: AccountType) => {
        setAccountType(type);
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Strict Mock Validation
        const isValid = validateForm();
        if (!isValid) {
            toast.error(
                useEmailMode
                    ? "Authentication blocked: Please enter a valid email and password."
                    : "Authentication blocked: Please enter a valid phone number and password."
            );
            return;
        }

        // 2. Submission & Loading State
        setIsSubmitting(true);

        // Save phone number and persist active African currency preference
        try {
            if (!useEmailMode) {
                const fullPhone = `${country.phonePrefix} ${phoneNumber.trim()}`;
                localStorage.setItem("settle_africa_user_phone", fullPhone);
                localStorage.setItem("settle_africa_active_currency", country.code);
            } else {
                localStorage.setItem("settle_africa_user_email", email.trim());
                if (!localStorage.getItem("settle_africa_user_phone")) {
                    localStorage.setItem("settle_africa_user_phone", "+234 803 123 4567");
                }
            }
        } catch {
            // ignore localStorage quota errors
        }

        // Simulate network latency verification
        await new Promise((resolve) => setTimeout(resolve, 800));

        // 3. Post-Login Mock Alert
        const accountLabel = accountType === "business" ? "Business" : "Personal";
        const currencyNotice = !useEmailMode
            ? ` (${country.code} wallet active)`
            : "";
        const successMessage = `Login successful...`;

        toast.success(successMessage, { autoClose: 1800 });

        // 4. Simulate Navigation
        setTimeout(() => {
            router.push("/dashboard");
        }, 1800);
    };

    return (
        <section
            aria-labelledby="login-heading"
            className="w-full rounded-2xl border border-[#E5E5E5] bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
        >
            {/* Brand Logo & Heading */}
            <div className="mb-6 flex flex-col items-center text-center">
                <Link
                    href="/"
                    className="mb-3.5 inline-flex items-center gap-2.5 transition-transform hover:scale-105 focus:outline-none"
                    aria-label="Settle Africa home"
                >
                    <Image
                        src="/images/settle-logo.png"
                        alt="Settle Africa logo"
                        width={46}
                        height={46}
                        priority
                        className="object-contain"
                    />
                    <span className="text-xl font-bold tracking-tight text-black">
                        Settle <span className="font-normal text-zinc-500">Africa</span>
                    </span>
                </Link>

                <h1
                    id="login-heading"
                    className="text-2xl font-bold tracking-tight text-black"
                >
                    Welcome back
                </h1>
                <p className="mt-1 text-xs text-zinc-500">
                    {accountType === "business"
                        ? "Access enterprise liquidity pools, bulk settlements, and treasury."
                        : "Access multi-currency wallets and instant cross-border remittances."}
                </p>
            </div>

            {/* Account Type Toggle */}
            <div className="mb-6">
                <AccountTypeToggle
                    value={accountType}
                    onChange={handleAccountTypeChange}
                    disabled={isSubmitting}
                />
            </div>

            {/* Post-Login Alert Banner or Validation Error Toast */}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={accountType}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-4"
                    >
                        {/* Phone Number Input (Two parts: Flag & Code selector + Number) */}
                        {!useEmailMode ? (
                            <div className="space-y-1.5">
                                <PhoneInputWithCountry
                                    id="login-phone"
                                    label={
                                        accountType === "business"
                                            ? "Corporate phone number"
                                            : "Phone number"
                                    }
                                    country={country}
                                    onCountryChange={setCountry}
                                    phoneNumber={phoneNumber}
                                    onPhoneNumberChange={(val) => {
                                        setPhoneNumber(val);
                                        if (errors.phone) {
                                            setErrors((prev) => ({ ...prev, phone: undefined }));
                                        }
                                    }}
                                    error={errors.phone}
                                    disabled={isSubmitting}
                                />

                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                <Input
                                    id="login-email"
                                    label={accountType === "business" ? "Work email address" : "Email address"}
                                    type="email"
                                    value={email}
                                    disabled={isSubmitting}
                                    placeholder={accountType === "business" ? "treasury@company.com" : "name@domain.com"}
                                    autoComplete="email"
                                    required
                                    error={errors.email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) {
                                            setErrors((prev) => ({ ...prev, email: undefined }));
                                        }
                                    }}
                                    icon={<Mail size={16} className="text-zinc-400" />}
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUseEmailMode(false);
                                            setErrors({});
                                        }}
                                        className="text-[11px] font-medium text-zinc-500 hover:text-black transition-colors"
                                    >
                                        Sign in with phone number instead
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Password Input */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="login-password"
                                    className="text-xs font-semibold text-black tracking-tight"
                                >
                                    Password <span className="text-zinc-400">*</span>
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-zinc-500 hover:text-black transition-colors font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                disabled={isSubmitting}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                error={errors.password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) {
                                        setErrors((prev) => ({ ...prev, password: undefined }));
                                    }
                                }}
                                icon={
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="text-zinc-400 hover:text-black transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                }
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            disabled={isSubmitting}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 rounded border-[#E5E5E5] text-black accent-black focus:ring-1 focus:ring-black cursor-pointer"
                        />
                        <span className="text-xs text-zinc-600">Remember this device</span>
                    </label>

                    {accountType === "business" && (
                        <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 font-tabular-nums tabular-nums">
                            <Lock size={11} className="text-zinc-400" />
                            SSO READY
                        </span>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    loading={isSubmitting}
                    loadingText={`Authenticating User...`}
                    className="mt-2 w-full h-11 text-sm font-semibold rounded-lg bg-black text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                >
                    <span>Sign in to {accountType === "business" ? "Business" : "Personal"}</span>
                    {!isSubmitting && <ArrowRight size={14} className="stroke-[2.2]" />}
                </Button>
            </form>

            {/* Footer switcher */}
            <div className="mt-6 pt-5 border-t border-[#E5E5E5] text-center">
                <p className="text-xs text-zinc-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-semibold text-black hover:underline underline-offset-4"
                    >
                        Create an account
                    </Link>
                </p>
            </div>
        </section>
    );
}
