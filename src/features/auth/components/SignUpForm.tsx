"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Building, Hash, User, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AccountTypeToggle, AccountType } from "./AccountTypeToggle";
import { IndustrySelect } from "./IndustrySelect";
import { toast } from "react-toastify";
import { PhoneInputWithCountry } from "./PhoneInputWithCountry";
import { AFRICAN_CURRENCIES, CurrencyConfig } from "@/features/currency/CurrencyContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
    fullName?: string;
    phone?: string;
    email?: string;
    password?: string;
    businessName?: string;
    rcNumber?: string;
    industry?: string;
    terms?: string;
}

export function SignupForm() {
    const router = useRouter();
    const [accountType, setAccountType] = useState<AccountType>("personal");

    // Personal & Contact Fields
    const [fullName, setFullName] = useState("");
    const [country, setCountry] = useState<CurrencyConfig>(AFRICAN_CURRENCIES[0]);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Business Specific Fields
    const [businessName, setBusinessName] = useState("");
    const [rcNumber, setRcNumber] = useState("");
    const [industry, setIndustry] = useState("");

    // Shared State
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});


    const handleAccountTypeChange = (type: AccountType) => {
        setAccountType(type);
        setErrors({});
    };

    const validateForm = (): boolean => {
        const nextErrors: FormErrors = {};

        // Validation for Name
        if (!fullName.trim()) {
            nextErrors.fullName =
                accountType === "business"
                    ? "Authorized representative full legal name is required."
                    : "Full legal name is required.";
        } else if (fullName.trim().length < 3) {
            nextErrors.fullName = "Please enter your full legal name (minimum 3 characters).";
        }

        // Validation for Phone (2-part input)
        const digits = phoneNumber.replace(/\D/g, "");
        if (!digits) {
            nextErrors.phone =
                accountType === "business"
                    ? "Corporate phone number is required."
                    : "Mobile phone number is required.";
        } else if (digits.length < 7) {
            nextErrors.phone = "Please enter a valid phone number (minimum 7 digits).";
        }

        if (!email.trim()) {
            nextErrors.email =
                accountType === "business"
                    ? "Corporate work email is required."
                    : "Email address is required.";
        } else if (!EMAIL_REGEX.test(email.trim())) {
            nextErrors.email = "Please enter a valid email address (e.g., name@domain.com).";
        }

        if (!password) {
            nextErrors.password = "Password is required.";
        } else if (password.length < 8) {
            nextErrors.password = "Password must be at least 8 characters.";
        }

        // Additional validation for Business fields
        if (accountType === "business") {
            if (!businessName.trim()) {
                nextErrors.businessName = "Registered company legal name is required.";
            }

            if (!rcNumber.trim()) {
                nextErrors.rcNumber = "Company Registration / RC number is required (e.g., RC-1849204).";
            }

            if (!industry) {
                nextErrors.industry = "Please select your business industry.";
            }
        }

        // Terms validation
        if (!acceptedTerms) {
            nextErrors.terms = "You must agree to the terms to create an account.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Strict Mock Validation
        const isValid = validateForm();
        if (!isValid) {
            toast.error("Registration blocked: Please complete all required fields marked below.");
            return;
        }

        // 2. Submission & Loading State
        setIsSubmitting(true);

        // Save phone number and persist auto-detected African currency preference
        try {
            const fullPhone = `${country.phonePrefix} ${phoneNumber.trim()}`;
            localStorage.setItem("settle_africa_user_phone", fullPhone);
            localStorage.setItem("settle_africa_active_currency", country.code);
            localStorage.setItem("settle_africa_user_email", email.trim());
        } catch {
            // ignore localStorage quota errors
        }

        // Simulate network latency & compliance check
        await new Promise((resolve) => setTimeout(resolve, 850));

        // 3. Post-Signup Mock Alert
        const accountLabel = accountType === "business" ? "Business" : "Personal";
        const successMessage = `Successfully created Settle Africa ${accountLabel} Account (${country.code} wallet configured). Redirecting to dashboard...`;

        toast.success(successMessage, { autoClose: 1800 });

        // 4. Simulate Navigation
        setTimeout(() => {
            router.push("/dashboard");
        }, 1800);
    };

    return (
        <section
            aria-labelledby="signup-heading"
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
                    id="signup-heading"
                    className="text-2xl font-bold tracking-tight text-black"
                >
                    Create an account
                </h1>
                <p className="mt-1 text-xs text-zinc-500">
                    {accountType === "business"
                        ? "Register your African corporate entity for seamless cross-border treasury."
                        : "Open your personal digital settlement account in seconds."}
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

            {/* Post-Signup Alert Banner or Validation Error Toast */}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={accountType}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-3.5"
                    >
                        {/* Business Specific Inputs */}
                        {accountType === "business" && (
                            <>
                                <Input
                                    id="signup-business-name"
                                    label="Business / Company Legal Name"
                                    type="text"
                                    value={businessName}
                                    disabled={isSubmitting}
                                    placeholder="Acme Logistics Ltd."
                                    autoComplete="organization"
                                    required
                                    error={errors.businessName}
                                    onChange={(e) => {
                                        setBusinessName(e.target.value);
                                        if (errors.businessName) {
                                            setErrors((prev) => ({ ...prev, businessName: undefined }));
                                        }
                                    }}
                                    icon={<Building size={16} className="text-zinc-400" />}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <Input
                                        id="signup-rc-number"
                                        label="Registration / RC Number"
                                        type="text"
                                        tabular
                                        value={rcNumber}
                                        disabled={isSubmitting}
                                        placeholder="RC-1940291"
                                        required
                                        error={errors.rcNumber}
                                        onChange={(e) => {
                                            setRcNumber(e.target.value);
                                            if (errors.rcNumber) {
                                                setErrors((prev) => ({ ...prev, rcNumber: undefined }));
                                            }
                                        }}
                                        icon={<Hash size={15} className="text-zinc-400" />}
                                    />

                                    <IndustrySelect
                                        id="signup-industry"
                                        value={industry}
                                        disabled={isSubmitting}
                                        error={errors.industry}
                                        onChange={(val) => {
                                            setIndustry(val);
                                            if (errors.industry) {
                                                setErrors((prev) => ({ ...prev, industry: undefined }));
                                            }
                                        }}
                                    />
                                </div>
                            </>
                        )}

                        {/* Full Name */}
                        <Input
                            id="signup-fullname"
                            label={accountType === "business" ? "Authorized Signatory Full Name" : "Full Legal Name"}
                            type="text"
                            value={fullName}
                            disabled={isSubmitting}
                            placeholder={accountType === "business" ? "Chioma Adeleke" : "Amara Okafor"}
                            autoComplete="name"
                            required
                            error={errors.fullName}
                            onChange={(e) => {
                                setFullName(e.target.value);
                                if (errors.fullName) {
                                    setErrors((prev) => ({ ...prev, fullName: undefined }));
                                }
                            }}
                            icon={<User size={16} className="text-zinc-400" />}
                        />

                        {/* Phone Number (Two parts: Flag & Code selector + Number) */}
                        <PhoneInputWithCountry
                            id="signup-phone"
                            label={accountType === "business" ? "Corporate phone number" : "Phone number"}
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

                        {/* Email Address */}
                        <Input
                            id="signup-email"
                            label={accountType === "business" ? "Work Email Address" : "Email Address"}
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

                        {/* Password */}
                        <div>
                            <Input
                                id="signup-password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                disabled={isSubmitting}
                                placeholder="Create a strong password (min 8 characters)"
                                autoComplete="new-password"
                                required
                                error={errors.password}
                                hint="At least 8 characters, numbers & symbols recommended."
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

                {/* Terms Agreement Checkbox */}
                <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={acceptedTerms}
                            disabled={isSubmitting}
                            onChange={(e) => {
                                setAcceptedTerms(e.target.checked);
                                if (errors.terms) {
                                    setErrors((prev) => ({ ...prev, terms: undefined }));
                                }
                            }}
                            className="mt-0.5 h-4 w-4 rounded border-[#E5E5E5] text-black accent-black focus:ring-1 focus:ring-black cursor-pointer shrink-0"
                        />
                        <span className="text-xs text-zinc-600 leading-relaxed">
                            I agree to the{" "}
                            <Link href="/terms" className="text-black font-semibold hover:underline">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-black font-semibold hover:underline">
                                Privacy Policy
                            </Link>
                            , including KYC compliance checks.
                        </span>
                    </label>
                    {errors.terms && (
                        <p className="mt-1 text-xs text-red-600 font-medium">{errors.terms}</p>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    loading={isSubmitting}
                    loadingText={`Registering ${accountType === "business" ? "Business" : "Personal"}...`}
                    className="mt-2 w-full h-11 text-sm font-semibold rounded-lg bg-black text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                >
                    <span>Create {accountType === "business" ? "Business" : "Personal"} Account</span>
                    {!isSubmitting && <ArrowRight size={14} className="stroke-[2.2]" />}
                </Button>
            </form>

            {/* Footer switcher */}
            <div className="mt-6 pt-5 border-t border-[#E5E5E5] text-center">
                <p className="text-xs text-zinc-500">
                    Already registered?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-black hover:underline underline-offset-4"
                    >
                        Sign in instead
                    </Link>
                </p>
            </div>
        </section>
    );
}
