"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    ArrowRight,
    Building2,
    CreditCard,
    ShieldCheck,
    Check,
    AlertCircle,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useBusiness, CorporateBeneficiary } from "@/features/business/context/BusinessContext";
import { toast } from "react-toastify";

interface NewSingleTransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedBeneficiary?: CorporateBeneficiary | null;
}

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

export function NewSingleTransferModal({
    isOpen,
    onClose,
    preselectedBeneficiary = null,
}: NewSingleTransferModalProps) {
    const { beneficiaries, fundingSources, addSingleTransfer } = useBusiness();

    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>(
        preselectedBeneficiary?.id || beneficiaries[0]?.id || ""
    );
    const [selectedFundingId, setSelectedFundingId] = useState<string>(
        fundingSources[0]?.id || ""
    );
    const [amountUsdInput, setAmountUsdInput] = useState<string>("12500");
    const [invoiceRef, setInvoiceRef] = useState<string>("INV-2026-910");
    const [paymentPurpose, setPaymentPurpose] = useState<string>(
        "Corporate Supplier Settlement"
    );
    const [requireCheckerApproval, setRequireCheckerApproval] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

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

    const activeFundingSource = useMemo(
        () => fundingSources.find((f) => f.id === selectedFundingId) || fundingSources[0],
        [fundingSources, selectedFundingId]
    );

    const parsedAmountUsd = useMemo(() => {
        const cleaned = parseFloat(amountUsdInput.replace(/,/g, ""));
        return isNaN(cleaned) || cleaned < 0 ? 0 : cleaned;
    }, [amountUsdInput]);

    const fxRate = activeBeneficiary
        ? FX_RATES_BY_CURRENCY[activeBeneficiary.currencyCode] || 1592.0
        : 1592.0;
    const localPayoutAmount = parsedAmountUsd * fxRate;
    const clearingFeeUsd = Number(
        (parsedAmountUsd * ((activeFundingSource?.feePercent || 0.15) / 100)).toFixed(2)
    );
    const totalDirectDebitUsd = parsedAmountUsd + clearingFeeUsd;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeBeneficiary) {
            setError("Please select a verified corporate beneficiary.");
            return;
        }
        if (parsedAmountUsd <= 0) {
            setError("Please enter a valid pass-through settlement amount greater than $0.00.");
            return;
        }
        if (!invoiceRef.trim()) {
            setError("Invoice or contract reference is required for audit compliance.");
            return;
        }

        setError("");
        setIsSubmitting(true);
        await new Promise((r) => setTimeout(r, 650));

        const needsApproval = requireCheckerApproval || parsedAmountUsd >= 50000;

        addSingleTransfer({
            type: "single",
            beneficiaryName: activeBeneficiary.entityName,
            beneficiarySubtext: `${activeBeneficiary.institutionName} • ${activeBeneficiary.accountOrMobileNumber} • ${invoiceRef.trim()}`,
            corridorCountry: activeBeneficiary.country,
            corridorFlag: activeBeneficiary.flag,
            currencyCode: activeBeneficiary.currencyCode,
            currencySymbol: activeBeneficiary.currencySymbol,
            fxRateToUsd: fxRate,
            amountUsd: parsedAmountUsd,
            amountLocal: localPayoutAmount,
            feeUsd: clearingFeeUsd,
            fundingSourceId: activeFundingSource.id,
            fundingSourceName: `${activeFundingSource.institutionName} ${activeFundingSource.maskedNumber}`,
            fundingSourceRail: activeFundingSource.rail,
            payoutPartnerRail:
                activeBeneficiary.payoutMethod === "Mobile Money"
                    ? "Direct Mobile Money Partner API"
                    : "Direct Local Bank RTGS / NIP",
            status: needsApproval ? "pending_approval" : "clearing",
            initiatedBy: "Amina Yusuf (Admin)",
            approvedBy: needsApproval ? undefined : "Amina Yusuf (Admin)",
            clearingStage: needsApproval ? 1 : 2,
        });

        setIsSubmitting(false);
        toast.success(
            needsApproval
                ? "Corporate transfer staged for Approver/Checker sign-off."
                : `Direct pass-through of $${parsedAmountUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })} initiated from ${activeFundingSource.institutionName}.`
        );
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Monochrome Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-[1px]"
                    />

                    {/* Modal Window */}
                    <motion.div
                        initial={{ opacity: 0, y: 14, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-black bg-white p-6 sm:p-8 text-black shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#E5E5E5]">
                            <div>
                                <div className="inline-flex items-center gap-1.5 rounded border border-black bg-black text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                                    <span>Direct Pass-Through Rail</span>
                                </div>
                                <h2 className="text-xl font-bold tracking-tight text-black">
                                    New Single Corporate Transfer
                                </h2>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    Funds are debited directly from your linked corporate bank or card and routed immediately to the payout partner.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 rounded-lg border border-[#E5E5E5] text-zinc-500 hover:text-black hover:border-black transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-left">
                            {error && (
                                <div className="rounded-lg border border-black bg-zinc-50 p-3 flex items-center gap-2 text-xs font-mono text-black">
                                    <AlertCircle size={15} className="shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* 1. Select Verified Corporate Beneficiary */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider font-mono text-black block">
                                    1. Verified Corporate Beneficiary / Contractor
                                </label>
                                <select
                                    value={activeBeneficiary?.id || ""}
                                    onChange={(e) => setSelectedBeneficiaryId(e.target.value)}
                                    className="w-full h-11 rounded-lg border border-[#E5E5E5] bg-white px-3.5 text-sm font-medium text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                >
                                    {beneficiaries.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.flag} {b.entityName} ({b.currencyCode} • {b.institutionName} • {b.accountOrMobileNumber})
                                        </option>
                                    ))}
                                </select>
                                {activeBeneficiary && (
                                    <div className="mt-2 rounded-lg border border-[#E5E5E5] bg-zinc-50 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-black">
                                                {activeBeneficiary.payoutMethod}:
                                            </span>
                                            <span className="text-zinc-600 font-mono font-tabular-nums">
                                                {activeBeneficiary.institutionName} ({activeBeneficiary.accountOrMobileNumber})
                                            </span>
                                        </div>
                                        <span className="font-mono text-[11px] font-bold border border-black px-2 py-0.5 rounded bg-white text-black font-tabular-nums">
                                            {activeBeneficiary.taxIdNumber}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* 2. Source Corporate Funding Instrument */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider font-mono text-black block">
                                    2. Direct Source Funding Instrument (No Wallet Balance)
                                </label>
                                <div className="grid grid-cols-1 gap-2.5">
                                    {fundingSources.map((fs) => {
                                        const isSelected = activeFundingSource?.id === fs.id;
                                        return (
                                            <button
                                                key={fs.id}
                                                type="button"
                                                onClick={() => setSelectedFundingId(fs.id)}
                                                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                                    isSelected
                                                        ? "border-black bg-black text-white"
                                                        : "border-[#E5E5E5] bg-white text-black hover:border-black"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div
                                                        className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${
                                                            isSelected
                                                                ? "border-white/20 bg-white/10 text-white"
                                                                : "border-[#E5E5E5] bg-zinc-50 text-black"
                                                        }`}
                                                    >
                                                        {fs.type === "corporate_bank" ? (
                                                            <Building2 size={16} />
                                                        ) : (
                                                            <CreditCard size={16} />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold truncate">
                                                            {fs.institutionName}{" "}
                                                            <span className="font-mono font-tabular-nums">
                                                                {fs.maskedNumber}
                                                            </span>
                                                        </p>
                                                        <p
                                                            className={`text-[11px] truncate ${
                                                                isSelected ? "text-zinc-300" : "text-zinc-500"
                                                            }`}
                                                        >
                                                            {fs.rail} • Fee:{" "}
                                                            <span className="font-mono font-tabular-nums">
                                                                {fs.feePercent}%
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span
                                                        className={`text-[10px] font-mono font-tabular-nums px-2 py-0.5 rounded border ${
                                                            isSelected
                                                                ? "border-white/30 text-white"
                                                                : "border-[#E5E5E5] text-zinc-600"
                                                        }`}
                                                    >
                                                        Limit ${(fs.dailyLimitUsd / 1000).toFixed(0)}k/d
                                                    </span>
                                                    {isSelected && <Check size={15} />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 3. Amount & Invoice Metadata */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Settlement Principal (USD)"
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    tabular
                                    value={amountUsdInput}
                                    onChange={(e) => setAmountUsdInput(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Invoice / Contract Reference"
                                    type="text"
                                    tabular
                                    value={invoiceRef}
                                    onChange={(e) => setInvoiceRef(e.target.value)}
                                    icon={<FileText size={15} className="text-zinc-400" />}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black tracking-tight block">
                                        Regulatory Purpose Code
                                    </label>
                                    <select
                                        value={paymentPurpose}
                                        onChange={(e) => setPaymentPurpose(e.target.value)}
                                        className="w-full h-11 rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs font-medium text-black focus:border-black focus:outline-none"
                                    >
                                        <option value="Corporate Supplier Settlement">
                                            PUR-01 • Corporate Supplier Settlement
                                        </option>
                                        <option value="Contractor Retainer & Milestone">
                                            PUR-02 • Contractor Retainer & Milestone
                                        </option>
                                        <option value="Freight, Customs & Port Clearing">
                                            PUR-03 • Freight, Customs & Port Clearing
                                        </option>
                                        <option value="Software & Cloud Infrastructure">
                                            PUR-04 • Software & Cloud Infrastructure
                                        </option>
                                    </select>
                                </div>

                                <label className="flex items-start gap-2.5 p-3 rounded-lg border border-[#E5E5E5] bg-zinc-50 cursor-pointer select-none mt-1 sm:mt-5">
                                    <input
                                        type="checkbox"
                                        checked={requireCheckerApproval || parsedAmountUsd >= 50000}
                                        onChange={(e) => setRequireCheckerApproval(e.target.checked)}
                                        className="mt-0.5 h-4 w-4 rounded border-black accent-black cursor-pointer"
                                    />
                                    <div className="text-xs">
                                        <p className="font-bold text-black">Stage for Checker Approval</p>
                                        <p className="text-[11px] text-zinc-500 font-tabular-nums">
                                            Auto-enforced for transfers &ge; $50,000 USD
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Live Pass-Through Calculation Box */}
                            <div className="rounded-xl border border-black bg-zinc-50 p-4 space-y-2.5 text-xs font-mono font-tabular-nums">
                                <div className="flex items-center justify-between text-zinc-600">
                                    <span>Correspondent Wholesale FX Rate</span>
                                    <span className="font-bold text-black">
                                        1.00 USD = {fxRate.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
                                        {activeBeneficiary?.currencyCode}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-zinc-600">
                                    <span>
                                        Pass-Through Clearing Fee ({activeFundingSource?.feePercent}%)
                                    </span>
                                    <span className="font-bold text-black">
                                        ${clearingFeeUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-zinc-600">
                                    <span>Direct Pull from {activeFundingSource?.institutionName}</span>
                                    <span className="font-bold text-black">
                                        ${totalDirectDebitUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
                                    </span>
                                </div>
                                <div className="pt-2.5 border-t border-[#E5E5E5] flex items-center justify-between text-sm">
                                    <span className="font-sans font-bold text-black">
                                        Net Recipient Delivery ({activeBeneficiary?.currencyCode})
                                    </span>
                                    <span className="font-bold text-black text-base">
                                        {activeBeneficiary?.currencySymbol}{" "}
                                        {localPayoutAmount.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="w-full sm:w-auto border-[#E5E5E5] text-black hover:border-black cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    loading={isSubmitting}
                                    loadingText="Authorizing Pass-Through..."
                                    className="w-full sm:w-auto bg-black text-white hover:bg-zinc-800 px-6 cursor-pointer"
                                >
                                    <ShieldCheck size={15} />
                                    <span>
                                        {requireCheckerApproval || parsedAmountUsd >= 50000
                                            ? "Submit for Checker Sign-Off"
                                            : "Authorize Direct Pass-Through"}
                                    </span>
                                    <ArrowRight size={14} />
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

