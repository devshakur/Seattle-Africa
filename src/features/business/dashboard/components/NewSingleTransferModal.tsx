"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    ArrowRight,
    ArrowLeft,
    Check,
    ShieldCheck,
    Search,
    Lock,
    RefreshCw,
    Building2,
    CreditCard,
    Smartphone,
    Landmark,
} from "lucide-react";
import { useBusiness, CorporateBeneficiary } from "@/features/business/context/BusinessContext";
import { toast } from "react-toastify";

interface NewSingleTransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedBeneficiary?: CorporateBeneficiary | null;
}

type StepIndex = 0 | 1 | 2;
export type CorporatePaymentMethod = "bank" | "card" | "mobile";

const STEP_LABELS = [
    { number: 1, label: "Recipient" },
    { number: 2, label: "Payment Method" },
    { number: 3, label: "Authorize" },
];

const PAYMENT_METHODS: {
    id: CorporatePaymentMethod;
    label: string;
    icon: typeof Landmark;
    note: string;
}[] = [
    {
        id: "bank",
        label: "Bank Transfer",
        icon: Landmark,
        note: "Direct RTGS / NIP",
    },
    {
        id: "card",
        label: "Debit Card",
        icon: CreditCard,
        note: "Commercial Visa/MC",
    },
    {
        id: "mobile",
        label: "Mobile Money",
        icon: Smartphone,
        note: "M-Pesa / MoMo Rail",
    },
];

const FX_RATES_BY_CURRENCY: Record<string, number> = {
    NGN: 1592.0,
    KES: 129.45,
    GHS: 15.85,
    ZAR: 17.62,
    XOF: 615.0,
    RWF: 1385.0,
    EGP: 49.2,
    UGX: 3680.0,
};

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 24 : -24,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -24 : 24,
        opacity: 0,
    }),
};

export function NewSingleTransferModal({
    isOpen,
    onClose,
    preselectedBeneficiary = null,
}: NewSingleTransferModalProps) {
    const { beneficiaries, fundingSources, addSingleTransfer } = useBusiness();

    const [step, setStep] = useState<StepIndex>(0);
    const [direction, setDirection] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<CorporatePaymentMethod>("bank");
    const [selectedFundingId, setSelectedFundingId] = useState<string>("");
    const [amountUsdInput, setAmountUsdInput] = useState<string>("5000");
    const [invoiceRef, setInvoiceRef] = useState<string>("INV-2026-910");
    const [securityCode, setSecurityCode] = useState<string>("");
    const [confirmedTerms, setConfirmedTerms] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [createdRef, setCreatedRef] = useState<string>("");

    // Initialize or reset selections when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(0);
            setDirection(1);
            setIsProcessing(false);
            setIsComplete(false);
            setSecurityCode("");
            setConfirmedTerms(false);
            setSearchQuery("");
            setPaymentMethod("bank");
            setSelectedBeneficiaryId(
                preselectedBeneficiary?.id || beneficiaries[0]?.id || ""
            );
            setSelectedFundingId(fundingSources[0]?.id || "");
        }
    }, [isOpen, preselectedBeneficiary, beneficiaries, fundingSources]);

    const activeBeneficiary = useMemo(() => {
        if (preselectedBeneficiary && preselectedBeneficiary.id === selectedBeneficiaryId) {
            return preselectedBeneficiary;
        }
        return (
            beneficiaries.find((b) => b.id === selectedBeneficiaryId) ||
            preselectedBeneficiary ||
            beneficiaries[0]
        );
    }, [beneficiaries, selectedBeneficiaryId, preselectedBeneficiary]);

    // Filter available funding instruments based on selected payment method
    const matchingFundingSources = useMemo(() => {
        if (paymentMethod === "card") {
            const cards = fundingSources.filter((fs) => fs.type === "corporate_card");
            return cards.length > 0 ? cards : fundingSources;
        }
        if (paymentMethod === "bank") {
            const banks = fundingSources.filter((fs) => fs.type === "corporate_bank");
            return banks.length > 0 ? banks : fundingSources;
        }
        return fundingSources;
    }, [fundingSources, paymentMethod]);

    // Ensure selectedFundingId matches the current payment method filter
    useEffect(() => {
        if (matchingFundingSources.length > 0) {
            const exists = matchingFundingSources.some((fs) => fs.id === selectedFundingId);
            if (!exists) {
                setSelectedFundingId(matchingFundingSources[0].id);
            }
        }
    }, [paymentMethod, matchingFundingSources, selectedFundingId]);

    const activeFundingSource = useMemo(
        () =>
            matchingFundingSources.find((f) => f.id === selectedFundingId) ||
            matchingFundingSources[0] ||
            fundingSources[0],
        [matchingFundingSources, selectedFundingId, fundingSources]
    );

    const parsedAmountUsd = useMemo(() => {
        const cleaned = parseFloat(amountUsdInput.replace(/,/g, ""));
        return isNaN(cleaned) || cleaned < 0 ? 0 : cleaned;
    }, [amountUsdInput]);

    const fxRate = activeBeneficiary
        ? FX_RATES_BY_CURRENCY[activeBeneficiary.currencyCode] || 1592.0
        : 1592.0;

    const localPayoutAmount = parsedAmountUsd * fxRate;
    const feeRatePercent =
        paymentMethod === "card"
            ? 0.95
            : paymentMethod === "mobile"
              ? 0.35
              : activeFundingSource?.feePercent || 0.15;

    const clearingFeeUsd = Number(
        (parsedAmountUsd * (feeRatePercent / 100)).toFixed(2)
    );
    const totalDirectDebitUsd = parsedAmountUsd + clearingFeeUsd;

    const filteredBeneficiaries = useMemo(() => {
        if (!searchQuery.trim()) return beneficiaries;
        const q = searchQuery.toLowerCase();
        return beneficiaries.filter(
            (b) =>
                b.entityName.toLowerCase().includes(q) ||
                b.institutionName.toLowerCase().includes(q) ||
                b.country.toLowerCase().includes(q) ||
                b.currencyCode.toLowerCase().includes(q)
        );
    }, [beneficiaries, searchQuery]);

    const navigateTo = (next: StepIndex) => {
        setDirection(next > step ? 1 : -1);
        setStep(next);
    };

    const handleAuthorize = async () => {
        if (!activeBeneficiary || parsedAmountUsd <= 0) return;

        setIsProcessing(true);
        await new Promise((r) => setTimeout(r, 750));

        const needsApproval = parsedAmountUsd >= 50000;

        const methodLabel =
            paymentMethod === "bank"
                ? "Direct Corporate Bank RTGS"
                : paymentMethod === "card"
                  ? "Corporate Commercial Card Rail"
                  : "Direct Mobile Money Partner Rail";

        const created = addSingleTransfer({
            type: "single",
            beneficiaryName: activeBeneficiary.entityName,
            beneficiarySubtext: `${activeBeneficiary.institutionName} • ${activeBeneficiary.accountOrMobileNumber} • ${invoiceRef.trim() || "Single Settlement"}`,
            corridorCountry: activeBeneficiary.country,
            corridorFlag: activeBeneficiary.flag,
            currencyCode: activeBeneficiary.currencyCode,
            currencySymbol: activeBeneficiary.currencySymbol,
            fxRateToUsd: fxRate,
            amountUsd: parsedAmountUsd,
            amountLocal: localPayoutAmount,
            feeUsd: clearingFeeUsd,
            fundingSourceId: activeFundingSource?.id || "direct-rail",
            fundingSourceName:
                paymentMethod === "mobile"
                    ? "Direct Mobile Money Corporate API Rail"
                    : `${activeFundingSource?.institutionName} ${activeFundingSource?.maskedNumber}`,
            fundingSourceRail: methodLabel,
            payoutPartnerRail:
                activeBeneficiary.payoutMethod === "Mobile Money" || paymentMethod === "mobile"
                    ? "Direct Mobile Money Rail (M-Pesa / MoMo)"
                    : "Direct Local Bank RTGS",
            status: needsApproval ? "pending_approval" : "clearing",
            initiatedBy: "Finance Maker",
            approvedBy: needsApproval ? undefined : "Authorized User",
            clearingStage: needsApproval ? 1 : 2,
        });

        setIsProcessing(false);
        setCreatedRef(created.reference);
        setIsComplete(true);

        toast.success(
            needsApproval
                ? "Payment staged for Approver sign-off."
                : `Transfer of $${parsedAmountUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })} authorized.`
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-[1px]"
                    />

                    {/* Modal Window */}
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative z-10 w-full max-w-lg rounded-xl border border-[#E5E5E5] bg-white text-black shadow-2xl overflow-hidden"
                    >
                        {/* Header & Step Tracker */}
                        <div className="px-6 pt-5 pb-4 border-b border-[#E5E5E5] bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-semibold tracking-tight text-black">
                                    New Corporate Transfer
                                </h3>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-1 rounded text-zinc-400 hover:text-black hover:border-black transition-colors cursor-pointer"
                                    aria-label="Close"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* 3-Step Tracker Component with "Payment Method" included */}
                            <nav aria-label="Transfer steps" className="flex items-center justify-between">
                                {STEP_LABELS.map((item, index) => {
                                    const isDone = step > index || isComplete;
                                    const isActive = step === index && !isComplete;

                                    return (
                                        <div
                                            key={item.number}
                                            className="flex items-center flex-1 last:flex-none"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono transition-colors ${
                                                        isDone
                                                            ? "bg-black text-white"
                                                            : isActive
                                                              ? "border border-black text-black font-semibold bg-white"
                                                              : "border border-[#E5E5E5] text-zinc-400 bg-white"
                                                    }`}
                                                >
                                                    {isDone ? (
                                                        <Check size={12} strokeWidth={2.5} />
                                                    ) : (
                                                        item.number
                                                    )}
                                                </div>
                                                <span
                                                    className={`text-xs ${
                                                        isActive || isDone
                                                            ? "text-black font-medium"
                                                            : "text-zinc-400"
                                                    }`}
                                                >
                                                    {item.label}
                                                </span>
                                            </div>

                                            {index < STEP_LABELS.length - 1 && (
                                                <div className="flex-1 h-px bg-[#E5E5E5] mx-3 relative overflow-hidden">
                                                    <motion.div
                                                        className="absolute inset-y-0 left-0 bg-black"
                                                        initial={false}
                                                        animate={{
                                                            width: step > index || isComplete ? "100%" : "0%",
                                                        }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Modal Body with Framer Motion slide transitions */}
                        <div className="p-6 min-h-[420px] max-h-[80vh] overflow-y-auto flex flex-col justify-between">
                            <AnimatePresence mode="wait" custom={direction} initial={false}>
                                <motion.div
                                    key={isComplete ? "complete" : step}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="space-y-5"
                                >
                                    {/* ==================== STEP 1: RECIPIENT ==================== */}
                                    {step === 0 && !isComplete && (
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-semibold text-black">
                                                    Select Recipient
                                                </h4>
                                                <p className="text-xs text-zinc-500 mt-0.5">
                                                    Choose a verified corporate beneficiary or contractor.
                                                </p>
                                            </div>

                                            {/* Search input */}
                                            <div className="relative">
                                                <Search
                                                    size={14}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                                                />
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Search recipient or corridor..."
                                                    className="w-full h-9 pl-9 pr-3 rounded-md border border-[#E5E5E5] text-xs focus:border-black focus:outline-none bg-white text-black"
                                                />
                                            </div>

                                            {/* Beneficiary List */}
                                            <div className="max-h-56 overflow-y-auto space-y-2 border border-[#E5E5E5] rounded-lg p-1 divide-y divide-[#E5E5E5]">
                                                {filteredBeneficiaries.map((b) => {
                                                    const isSelected = activeBeneficiary?.id === b.id;
                                                    return (
                                                        <button
                                                            key={b.id}
                                                            type="button"
                                                            onClick={() => setSelectedBeneficiaryId(b.id)}
                                                            className={`w-full p-2.5 rounded text-left transition-colors flex items-center justify-between cursor-pointer ${
                                                                isSelected
                                                                    ? "bg-black text-white"
                                                                    : "bg-white text-black hover:bg-zinc-50"
                                                            }`}
                                                        >
                                                            <div className="min-w-0 pr-2">
                                                                <p className="text-xs font-semibold truncate">
                                                                    {b.entityName}
                                                                </p>
                                                                <p
                                                                    className={`text-[11px] font-mono mt-0.5 truncate ${
                                                                        isSelected
                                                                            ? "text-zinc-300"
                                                                            : "text-zinc-500"
                                                                    }`}
                                                                >
                                                                    {b.institutionName} • {b.accountOrMobileNumber}
                                                                </p>
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                <span
                                                                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                                                        isSelected
                                                                            ? "border-white/30 text-white"
                                                                            : "border-[#E5E5E5] text-zinc-600 bg-zinc-50"
                                                                    }`}
                                                                >
                                                                    {b.currencyCode}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    );
                                                })}

                                                {filteredBeneficiaries.length === 0 && (
                                                    <div className="py-6 text-center text-xs text-zinc-400">
                                                        No verified beneficiaries matching &quot;{searchQuery}&quot;
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E5E5]">
                                                <button
                                                    type="button"
                                                    onClick={onClose}
                                                    className="px-4 h-9 rounded-md border border-[#E5E5E5] text-xs font-medium text-black hover:border-black transition-colors bg-white cursor-pointer"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => navigateTo(1)}
                                                    disabled={!activeBeneficiary}
                                                    className="inline-flex items-center gap-1.5 bg-black text-white px-4 h-9 rounded-md text-xs font-medium hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                                >
                                                    <span>Continue</span>
                                                    <ArrowRight size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* ==================== STEP 2: PAYMENT METHOD & AMOUNT ==================== */}
                                    {step === 1 && !isComplete && (
                                        <div className="space-y-4">
                                            {/* Recipient summary strip */}
                                            <div className="border border-[#E5E5E5] rounded-md px-3.5 py-2 flex items-center justify-between text-xs bg-zinc-50/50">
                                                <div>
                                                    <span className="text-zinc-500">Sending to: </span>
                                                    <span className="font-semibold text-black">
                                                        {activeBeneficiary?.entityName}
                                                    </span>
                                                </div>
                                                <span className="font-mono text-zinc-600">
                                                    {activeBeneficiary?.currencyCode}
                                                </span>
                                            </div>

                                            {/* Amount Input */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-black block">
                                                    Settlement Amount (USD)
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400">
                                                        $
                                                    </span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="1"
                                                        value={amountUsdInput}
                                                        onChange={(e) => setAmountUsdInput(e.target.value)}
                                                        className="w-full h-10 pl-7 pr-3 rounded-md border border-[#E5E5E5] text-base font-mono font-semibold focus:border-black focus:outline-none bg-white text-black"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>

                                            {/* Payment Method Selector (matching the personal flow) */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-black tracking-tight block">
                                                    Payment Method
                                                </label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {PAYMENT_METHODS.map((item) => {
                                                        const isSelected = paymentMethod === item.id;
                                                        const Icon = item.icon;
                                                        return (
                                                            <button
                                                                key={item.id}
                                                                type="button"
                                                                onClick={() => setPaymentMethod(item.id)}
                                                                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                                                                    isSelected
                                                                        ? "border-black bg-black text-white shadow-xs"
                                                                        : "border-[#E5E5E5] bg-white hover:border-black text-black"
                                                                }`}
                                                            >
                                                                <Icon size={16} className="mb-1" />
                                                                <span className="text-xs font-semibold">
                                                                    {item.label}
                                                                </span>
                                                                <span
                                                                    className={`text-[10px] mt-0.5 ${
                                                                        isSelected
                                                                            ? "text-zinc-300"
                                                                            : "text-zinc-400"
                                                                    }`}
                                                                >
                                                                    {item.note}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Funding Account Selector */}
                                            {paymentMethod !== "mobile" ? (
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-black block">
                                                        Debit Funding Instrument
                                                    </label>
                                                    <select
                                                        value={activeFundingSource?.id || ""}
                                                        onChange={(e) => setSelectedFundingId(e.target.value)}
                                                        className="w-full h-9 rounded-md border border-[#E5E5E5] bg-white px-3 text-xs font-medium text-black focus:border-black focus:outline-none"
                                                    >
                                                        {matchingFundingSources.map((fs) => (
                                                            <option key={fs.id} value={fs.id}>
                                                                {fs.institutionName} ({fs.accountLabel}) {fs.maskedNumber}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ) : (
                                                <div className="border border-[#E5E5E5] rounded-md px-3 py-2 text-xs bg-zinc-50/50 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Smartphone size={14} className="text-black" />
                                                        <span className="text-black font-medium">
                                                            Pan-African Mobile Money Treasury Gateway
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] font-mono text-zinc-500">
                                                        Direct API Pull
                                                    </span>
                                                </div>
                                            )}

                                            {/* Conversion preview */}
                                            <div className="border border-[#E5E5E5] rounded-md p-2.5 text-xs space-y-1 bg-white">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-zinc-500">Recipient Receives</span>
                                                    <span className="font-mono font-semibold text-black">
                                                        {activeBeneficiary?.currencySymbol}{" "}
                                                        {localPayoutAmount.toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}{" "}
                                                        {activeBeneficiary?.currencyCode}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                                                    <span>Rate: 1 USD = {fxRate} {activeBeneficiary?.currencyCode}</span>
                                                    <span>Clearing Fee: ${clearingFeeUsd.toFixed(2)} USD</span>
                                                </div>
                                            </div>

                                            {/* Invoice / Reference */}
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-black block">
                                                    Invoice Reference (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={invoiceRef}
                                                    onChange={(e) => setInvoiceRef(e.target.value)}
                                                    placeholder="e.g. INV-2026-910"
                                                    className="w-full h-8 px-3 rounded-md border border-[#E5E5E5] text-xs font-mono focus:border-black focus:outline-none bg-white text-black"
                                                />
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E5]">
                                                <button
                                                    type="button"
                                                    onClick={() => navigateTo(0)}
                                                    className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md border border-[#E5E5E5] text-xs font-medium text-black hover:border-black transition-colors bg-white cursor-pointer"
                                                >
                                                    <ArrowLeft size={13} />
                                                    <span>Back</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => navigateTo(2)}
                                                    disabled={parsedAmountUsd <= 0}
                                                    className="inline-flex items-center gap-1.5 bg-black text-white px-4 h-9 rounded-md text-xs font-medium hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                                >
                                                    <span>Review</span>
                                                    <ArrowRight size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* ==================== STEP 3: AUTHORIZE ==================== */}
                                    {step === 2 && !isComplete && (
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-semibold text-black">
                                                    Review & Authorize
                                                </h4>
                                                <p className="text-xs text-zinc-500 mt-0.5">
                                                    Confirm transfer details before debiting your corporate account.
                                                </p>
                                            </div>

                                            {/* Summary Breakdown */}
                                            <div className="border border-[#E5E5E5] rounded-md divide-y divide-[#E5E5E5] text-xs bg-white">
                                                <div className="p-2.5 flex justify-between">
                                                    <span className="text-zinc-500">Recipient</span>
                                                    <span className="font-semibold text-black">
                                                        {activeBeneficiary?.entityName}
                                                    </span>
                                                </div>
                                                <div className="p-2.5 flex justify-between">
                                                    <span className="text-zinc-500">Payment Method</span>
                                                    <span className="font-medium text-black capitalize">
                                                        {paymentMethod === "bank"
                                                            ? "Bank Transfer"
                                                            : paymentMethod === "card"
                                                              ? "Debit Card"
                                                              : "Mobile Money"}
                                                    </span>
                                                </div>
                                                <div className="p-2.5 flex justify-between">
                                                    <span className="text-zinc-500">Delivery Amount</span>
                                                    <span className="font-mono font-semibold text-black">
                                                        {activeBeneficiary?.currencySymbol}{" "}
                                                        {localPayoutAmount.toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}{" "}
                                                        {activeBeneficiary?.currencyCode}
                                                    </span>
                                                </div>
                                                <div className="p-2.5 flex justify-between">
                                                    <span className="text-zinc-500">Total Debit (USD)</span>
                                                    <span className="font-mono font-semibold text-black">
                                                        ${totalDirectDebitUsd.toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="p-2.5 flex justify-between">
                                                    <span className="text-zinc-500">Funding Rail</span>
                                                    <span className="font-mono text-black">
                                                        {paymentMethod === "mobile"
                                                            ? "Mobile Money Partner Rail"
                                                            : `${activeFundingSource?.institutionName} ${activeFundingSource?.maskedNumber}`}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Security confirmation */}
                                            <div className="border border-[#E5E5E5] rounded-md p-3 space-y-2.5 bg-white">
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-black">
                                                    <Lock size={13} />
                                                    <span>Security PIN Confirmation</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="password"
                                                        maxLength={6}
                                                        value={securityCode}
                                                        onChange={(e) =>
                                                            setSecurityCode(e.target.value.replace(/\D/g, ""))
                                                        }
                                                        placeholder="Enter 6-digit PIN"
                                                        className="flex-1 h-9 px-3 rounded-md border border-[#E5E5E5] text-xs font-mono tracking-widest focus:border-black focus:outline-none bg-white text-black"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setSecurityCode("123456")}
                                                        className="px-2.5 h-9 rounded-md border border-[#E5E5E5] text-xs font-mono text-zinc-500 hover:text-black hover:border-black transition-colors shrink-0 cursor-pointer"
                                                    >
                                                        Auto-fill
                                                    </button>
                                                </div>

                                                <label className="flex items-start gap-2 text-xs text-zinc-600 cursor-pointer pt-0.5 select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={confirmedTerms}
                                                        onChange={(e) => setConfirmedTerms(e.target.checked)}
                                                        className="w-3.5 h-3.5 mt-0.5 accent-black rounded border-[#E5E5E5]"
                                                    />
                                                    <span>I authorize direct pass-through debit.</span>
                                                </label>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E5]">
                                                <button
                                                    type="button"
                                                    onClick={() => navigateTo(1)}
                                                    disabled={isProcessing}
                                                    className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md border border-[#E5E5E5] text-xs font-medium text-black hover:border-black transition-colors bg-white cursor-pointer"
                                                >
                                                    <ArrowLeft size={13} />
                                                    <span>Back</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleAuthorize}
                                                    disabled={
                                                        !confirmedTerms ||
                                                        securityCode.length < 6 ||
                                                        isProcessing
                                                    }
                                                    className="inline-flex items-center gap-1.5 bg-black text-white px-5 h-9 rounded-md text-xs font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <RefreshCw size={13} className="animate-spin" />
                                                            <span>Authorizing…</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShieldCheck size={14} />
                                                            <span>Authorize Payment</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* ==================== SUCCESS STATE ==================== */}
                                    {isComplete && (
                                        <div className="py-6 flex flex-col items-center text-center space-y-3">
                                            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                                                <Check size={20} strokeWidth={2.5} />
                                            </div>

                                            <div>
                                                <h4 className="text-base font-semibold tracking-tight text-black">
                                                    Transfer Authorized & Clearing
                                                </h4>
                                                <p className="text-xs text-zinc-500 mt-1">
                                                    ${parsedAmountUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD has been routed to {activeBeneficiary?.entityName}.
                                                </p>
                                            </div>

                                            <div className="border border-[#E5E5E5] rounded px-3 py-1.5 font-mono text-xs text-black">
                                                Ref: <span className="font-bold">{createdRef}</span>
                                            </div>

                                            <div className="pt-3">
                                                <button
                                                    type="button"
                                                    onClick={onClose}
                                                    className="bg-black text-white px-6 h-9 rounded-md text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default NewSingleTransferModal;
