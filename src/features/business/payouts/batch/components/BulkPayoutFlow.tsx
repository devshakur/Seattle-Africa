"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    UploadCloud,
    AlertCircle,
    Check,
    Download,
    ArrowRight,
    ArrowLeft,
    ShieldCheck,
    FileText,
    RefreshCw,
    Lock,
} from "lucide-react";
import Link from "next/link";
import { useBusiness } from "@/features/business/context/BusinessContext";

type StepIndex = 0 | 1 | 2;

interface RecipientRow {
    id: string;
    name: string;
    corridor: string;
    bank: string;
    account: string;
    amountUsd: number;
    amountLocal: string;
    error?: string;
}

const STEP_LABELS = [
    { number: 1, label: "Upload Sheet" },
    { number: 2, label: "Review & Validate" },
    { number: 3, label: "Authorize Payout" },
];

const INITIAL_SAMPLE_ROWS: RecipientRow[] = [
    {
        id: "rec-1",
        name: "Dangote Port Logistics Ltd",
        corridor: "Nigeria (NGN)",
        bank: "Access Bank PLC",
        account: "••2736",
        amountUsd: 14500,
        amountLocal: "₦ 23,084,000",
    },
    {
        id: "rec-2",
        name: "Nairobi Telematics Ltd",
        corridor: "Kenya (KES)",
        bank: "Safaricom M-Pesa",
        account: "••4812",
        amountUsd: 9400,
        amountLocal: "KSh 1,216,830",
    },
    {
        id: "rec-3",
        name: "Kwame Mensah & Sons",
        corridor: "Ghana (GHS)",
        bank: "GTBank Ghana",
        account: "••9027",
        amountUsd: 8200,
        amountLocal: "GH₵ 129,970",
    },
    {
        id: "rec-4",
        name: "Cape Town Cold Chain",
        corridor: "South Africa (ZAR)",
        bank: "Standard Bank SA",
        account: "••7754",
        amountUsd: 12500,
        amountLocal: "R 220,250",
    },
    {
        id: "rec-err-1",
        name: "Fatou Diop Consulting",
        corridor: "Senegal (XOF)",
        bank: "Ecobank Senegal",
        account: "••1186",
        amountUsd: 2100,
        amountLocal: "CFA 1,291,500",
        error: "Invalid SWIFT/BIC routing code for WAEMU zone",
    },
    {
        id: "rec-err-2",
        name: "Chidi Eze Freight",
        corridor: "Nigeria (NGN)",
        bank: "Zenith Bank PLC",
        account: "••",
        amountUsd: 1800,
        amountLocal: "₦ 2,865,600",
        error: "Missing 10-digit NUBAN account number",
    },
];

const TOTAL_RECIPIENTS_COUNT = 34;
const TOTAL_BATCH_AMOUNT_USD = 48500.0;

const formatUsd = (num: number) =>
    num.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const TEMPLATE_CSV_CONTENT =
    "RecipientName,CountryCode,Currency,PayoutMethod,InstitutionName,AccountNumber,RoutingCode,AmountUSD\n" +
    "Dangote Port Logistics Ltd,NG,NGN,Bank,Access Bank PLC,0049182736,044150149,14500.00\n" +
    "Nairobi Telematics Ltd,KE,KES,MobileMoney,Safaricom M-Pesa,+254712904812,,9400.00\n" +
    "Kwame Mensah & Sons,GH,GHS,Bank,GTBank Ghana,2018491029,GTBGHAC,8200.00\n" +
    "Cape Town Cold Chain,ZA,ZAR,Bank,Standard Bank,0284910284,051001,12500.00\n";

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 28 : -28,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -28 : 28,
        opacity: 0,
    }),
};

export function BulkPayoutFlow() {
    const [step, setStep] = useState<StepIndex>(0);
    const [direction, setDirection] = useState(1);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [excludeFlaggedRows, setExcludeFlaggedRows] = useState(true);
    const [securityCode, setSecurityCode] = useState("");
    const [confirmedTerms, setConfirmedTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [batchRef, setBatchRef] = useState("SA-BP-2026-9041");

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Context integration if available
    let fundingSourceName = "Stanbic IBTC Corporate Account ••4821";
    try {
        const { fundingSources } = useBusiness();
        if (fundingSources && fundingSources.length > 0) {
            fundingSourceName = `${fundingSources[0].institutionName} (${fundingSources[0].accountLabel}) ${fundingSources[0].maskedNumber}`;
        }
    } catch {
        // Fallback to default if outside business context
    }

    const flaggedRows = INITIAL_SAMPLE_ROWS.filter((r) => r.error);
    const validRows = INITIAL_SAMPLE_ROWS.filter((r) => !r.error);

    const flaggedAmountUsd = flaggedRows.reduce((acc, r) => acc + r.amountUsd, 0);
    const activeRecipientCount = excludeFlaggedRows
        ? TOTAL_RECIPIENTS_COUNT - flaggedRows.length
        : TOTAL_RECIPIENTS_COUNT;
    const activeTotalAmountUsd = excludeFlaggedRows
        ? TOTAL_BATCH_AMOUNT_USD - flaggedAmountUsd
        : TOTAL_BATCH_AMOUNT_USD;

    const navigateToStep = (next: StepIndex) => {
        setDirection(next > step ? 1 : -1);
        setStep(next);
    };

    const handleFile = (file?: File) => {
        if (!file) return;
        setFileName(file.name);
        setFileSize(`${(file.size / 1024).toFixed(1)} KB`);
        // Smooth simulated parsing transition
        setTimeout(() => {
            navigateToStep(1);
        }, 350);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const handleDownloadTemplate = () => {
        const blob = new Blob([TEMPLATE_CSV_CONTENT], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "settle_africa_bulk_payout_template.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleProcessBatch = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsComplete(true);
            setBatchRef(`SA-BP-${Date.now().toString().slice(-6)}`);
        }, 1200);
    };

    const handleReset = () => {
        setFileName(null);
        setFileSize(null);
        setSecurityCode("");
        setConfirmedTerms(false);
        setIsProcessing(false);
        setIsComplete(false);
        navigateToStep(0);
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-white text-black border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
            {/* Step Tracker Component */}
            <div className="px-6 sm:px-10 py-6 border-b border-[#E5E5E5] bg-white">
                <nav aria-label="Progress" className="flex items-center justify-between">
                    {STEP_LABELS.map((item, index) => {
                        const isDone = step > index || isComplete;
                        const isActive = step === index && !isComplete;

                        return (
                            <div
                                key={item.number}
                                className="flex items-center flex-1 last:flex-none"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono transition-colors ${
                                            isDone
                                                ? "bg-black text-white"
                                                : isActive
                                                  ? "border border-black text-black font-semibold bg-white"
                                                  : "border border-[#E5E5E5] text-zinc-400 bg-white"
                                        }`}
                                    >
                                        {isDone ? <Check size={13} strokeWidth={2.5} /> : item.number}
                                    </div>
                                    <span
                                        className={`text-xs sm:text-sm tracking-tight ${
                                            isActive || isDone
                                                ? "text-black font-medium"
                                                : "text-zinc-400"
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </div>

                                {index < STEP_LABELS.length - 1 && (
                                    <div className="flex-1 h-px bg-[#E5E5E5] mx-4 relative overflow-hidden">
                                        <motion.div
                                            className="absolute inset-y-0 left-0 bg-black"
                                            initial={false}
                                            animate={{
                                                width: step > index || isComplete ? "100%" : "0%",
                                            }}
                                            transition={{ duration: 0.35, ease: "easeInOut" }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Step Body with Framer Motion slide transitions */}
            <div className="p-6 sm:p-10 min-h-[460px] flex flex-col justify-between">
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                        key={isComplete ? "complete" : step}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="space-y-6"
                    >
                        {/* ==================== STEP 1: UPLOAD ==================== */}
                        {step === 0 && !isComplete && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold tracking-tight text-black">
                                        Upload payout sheet
                                    </h2>
                                    <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                                        Upload your disbursement workbook. We will automatically validate
                                        corridor routing codes, account numbers, and rates.
                                    </p>
                                </div>

                                {/* Drag and drop box */}
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => fileInputRef.current?.click()}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            fileInputRef.current?.click();
                                        }
                                    }}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    className={`h-60 rounded-lg border border-dashed flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-colors ${
                                        isDragging
                                            ? "border-black bg-zinc-50"
                                            : "border-[#E5E5E5] hover:border-black bg-white"
                                    }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".csv"
                                        className="hidden"
                                        onChange={(e) => handleFile(e.target.files?.[0])}
                                    />
                                    <div className="w-12 h-12 rounded-full border border-[#E5E5E5] flex items-center justify-center mb-3">
                                        <UploadCloud size={20} className="text-black" />
                                    </div>
                                    <p className="text-sm font-medium text-black">
                                        Click to browse or drop your CSV file here
                                    </p>
                                    <p className="text-xs text-zinc-400 mt-1 font-mono">
                                        Standard CSV format • UTF-8 • Up to 5,000 rows
                                    </p>
                                </div>

                                {/* Actions row */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleDownloadTemplate}
                                        className="inline-flex items-center justify-center gap-2 px-4 h-10 rounded-md border border-[#E5E5E5] text-xs font-medium text-black hover:border-black transition-colors bg-white cursor-pointer"
                                    >
                                        <Download size={14} />
                                        <span>Download Template (.csv)</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFileName("settle_africa_q4_batch.csv");
                                            setFileSize("18.4 KB");
                                            setTimeout(() => navigateToStep(1), 350);
                                        }}
                                        className="text-xs text-zinc-500 hover:text-black underline underline-offset-4 cursor-pointer text-left sm:text-right"
                                    >
                                        Load sample dataset (34 recipients)
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ==================== STEP 2: REVIEW & VALIDATE ==================== */}
                        {step === 1 && !isComplete && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold tracking-tight text-black">
                                        Review & validate
                                    </h2>
                                    <p className="text-sm text-zinc-500 mt-1">
                                        Pre-flight verification completed for{" "}
                                        <span className="font-mono text-black">
                                            {fileName || "batch_upload.csv"}
                                        </span>
                                        .
                                    </p>
                                </div>

                                {/* Summary Card */}
                                <div className="border border-[#E5E5E5] rounded-lg p-5 bg-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <FileText size={14} className="text-black" />
                                            <span>{fileName || "settle_africa_payouts.csv"}</span>
                                            {fileSize && <span>• {fileSize}</span>}
                                        </div>
                                        <span className="text-xs font-mono border border-[#E5E5E5] px-2 py-0.5 rounded text-zinc-600">
                                            Pre-flight OK
                                        </span>
                                    </div>
                                    <p className="text-lg font-semibold text-black mt-2 tracking-tight">
                                        {TOTAL_RECIPIENTS_COUNT} recipients loaded • Total:{" "}
                                        {formatUsd(TOTAL_BATCH_AMOUNT_USD)} USD
                                    </p>
                                </div>

                                {/* Flagged Errors Section with 1px borders */}
                                {flaggedRows.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                                                Flagged items ({flaggedRows.length})
                                            </span>
                                            <span className="text-xs text-zinc-500">
                                                Excluded rows will not be debited
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {flaggedRows.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="border border-black rounded-md p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <AlertCircle
                                                            size={16}
                                                            className="text-black shrink-0 mt-0.5"
                                                        />
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-medium text-black">
                                                                    {item.name}
                                                                </p>
                                                                <span className="text-xs text-zinc-500 font-mono">
                                                                    {item.corridor}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-zinc-600 mt-0.5">
                                                                {item.error}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-sm font-mono font-medium text-black">
                                                            {formatUsd(item.amountUsd)}
                                                        </p>
                                                        <p className="text-xs text-zinc-400 font-mono">
                                                            {item.amountLocal}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <label className="flex items-center gap-2 text-xs text-zinc-600 cursor-pointer pt-1 select-none">
                                            <input
                                                type="checkbox"
                                                checked={excludeFlaggedRows}
                                                onChange={(e) => setExcludeFlaggedRows(e.target.checked)}
                                                className="w-4 h-4 accent-black rounded border-[#E5E5E5]"
                                            />
                                            <span>
                                                Skip flagged rows and proceed with {activeRecipientCount} valid
                                                payouts ({formatUsd(activeTotalAmountUsd)})
                                            </span>
                                        </label>
                                    </div>
                                )}

                                {/* Simplified Preview List */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                                            Verified recipients preview
                                        </span>
                                        <span className="text-xs text-zinc-400 font-mono">
                                            {validRows.length} shown
                                        </span>
                                    </div>

                                    <div className="border border-[#E5E5E5] rounded-md divide-y divide-[#E5E5E5] bg-white">
                                        {validRows.map((item) => (
                                            <div
                                                key={item.id}
                                                className="px-4 py-3 flex items-center justify-between text-sm"
                                            >
                                                <div>
                                                    <p className="font-medium text-black">{item.name}</p>
                                                    <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                                                        {item.bank} • {item.account} • {item.corridor}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-mono font-medium text-black">
                                                        {formatUsd(item.amountUsd)}
                                                    </p>
                                                    <p className="text-xs text-zinc-400 font-mono">
                                                        {item.amountLocal}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="px-4 py-2.5 text-xs text-zinc-500 bg-zinc-50/50 flex items-center justify-between">
                                            <span>
                                                + {TOTAL_RECIPIENTS_COUNT - validRows.length - flaggedRows.length}{" "}
                                                additional verified recipients
                                            </span>
                                            <span className="font-mono">Direct clearing rail</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 2 Action Buttons */}
                                <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="inline-flex items-center gap-2 px-4 h-10 rounded-md border border-[#E5E5E5] text-xs font-medium text-black hover:border-black transition-colors bg-white cursor-pointer"
                                    >
                                        <ArrowLeft size={14} />
                                        <span>Replace Sheet</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navigateToStep(2)}
                                        disabled={!excludeFlaggedRows && flaggedRows.length > 0}
                                        className="inline-flex items-center gap-2 bg-black text-white px-5 h-10 rounded-md text-xs font-medium hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <span>Continue to Authorization</span>
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ==================== STEP 3: AUTHORIZATION ==================== */}
                        {step === 2 && !isComplete && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold tracking-tight text-black">
                                        Authorize payout
                                    </h2>
                                    <p className="text-sm text-zinc-500 mt-1">
                                        Review the settlement schedule and confirm corporate debit authorization.
                                    </p>
                                </div>

                                {/* Final Review Summary Card */}
                                <div className="border border-[#E5E5E5] rounded-lg divide-y divide-[#E5E5E5] bg-white text-sm">
                                    <div className="p-4 flex items-center justify-between">
                                        <span className="text-zinc-500">Total Disbursement</span>
                                        <span className="font-mono text-base font-semibold text-black">
                                            {formatUsd(activeTotalAmountUsd)}
                                        </span>
                                    </div>
                                    <div className="p-4 flex items-center justify-between">
                                        <span className="text-zinc-500">Recipients Count</span>
                                        <span className="font-mono text-black">
                                            {activeRecipientCount} recipients
                                            {excludeFlaggedRows && flaggedRows.length > 0 && (
                                                <span className="text-xs text-zinc-400 ml-1">
                                                    ({flaggedRows.length} excluded)
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="p-4 flex items-center justify-between">
                                        <span className="text-zinc-500">Direct Funding Rail</span>
                                        <span className="font-mono text-black text-right text-xs sm:text-sm">
                                            {fundingSourceName}
                                        </span>
                                    </div>
                                    <div className="p-4 flex items-center justify-between">
                                        <span className="text-zinc-500">Settlement SLA</span>
                                        <span className="font-mono text-black text-xs">
                                            Instant / Real-time Pan-African RTGS
                                        </span>
                                    </div>
                                </div>

                                {/* Mock Security Confirmation State */}
                                <div className="border border-[#E5E5E5] rounded-lg p-5 space-y-4 bg-white">
                                    <div className="flex items-center gap-2 text-sm font-medium text-black">
                                        <ShieldCheck size={16} />
                                        <span>Security Confirmation</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                        Enter your 6-digit corporate authorization PIN or token code to approve
                                        immediate debit.
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-1">
                                            <Lock
                                                size={14}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                                            />
                                            <input
                                                type="password"
                                                maxLength={6}
                                                value={securityCode}
                                                onChange={(e) =>
                                                    setSecurityCode(e.target.value.replace(/\D/g, ""))
                                                }
                                                placeholder="Enter 6-digit code (e.g. 123456)"
                                                className="w-full h-10 pl-9 pr-3 rounded-md border border-[#E5E5E5] text-sm font-mono tracking-widest focus:border-black focus:outline-none bg-white text-black placeholder:tracking-normal placeholder:font-sans placeholder:text-zinc-400"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSecurityCode("840219")}
                                            className="px-3 h-10 rounded-md border border-[#E5E5E5] text-xs font-mono text-zinc-500 hover:text-black hover:border-black transition-colors shrink-0 cursor-pointer"
                                        >
                                            Auto-fill
                                        </button>
                                    </div>

                                    <label className="flex items-start gap-2 text-xs text-zinc-600 cursor-pointer pt-1 select-none">
                                        <input
                                            type="checkbox"
                                            checked={confirmedTerms}
                                            onChange={(e) => setConfirmedTerms(e.target.checked)}
                                            className="w-4 h-4 mt-0.5 accent-black rounded border-[#E5E5E5]"
                                        />
                                        <span>
                                            I confirm that all recipient coordinates are authorized, and direct
                                            corporate debit of {formatUsd(activeTotalAmountUsd)} is final.
                                        </span>
                                    </label>
                                </div>

                                {/* Step 3 Action Buttons */}
                                <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
                                    <button
                                        type="button"
                                        onClick={() => navigateToStep(1)}
                                        disabled={isProcessing}
                                        className="inline-flex items-center gap-2 px-4 h-10 rounded-md border border-[#E5E5E5] text-xs font-medium text-black hover:border-black transition-colors bg-white cursor-pointer"
                                    >
                                        <ArrowLeft size={14} />
                                        <span>Back</span>
                                    </button>

                                    {/* Solid black "Process Batch" CTA */}
                                    <button
                                        type="button"
                                        onClick={handleProcessBatch}
                                        disabled={
                                            !confirmedTerms ||
                                            securityCode.length < 6 ||
                                            isProcessing
                                        }
                                        className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 h-10 rounded-md text-xs font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <RefreshCw size={14} className="animate-spin" />
                                                <span>Authorizing Corporate Rail…</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck size={14} />
                                                <span>Process Batch</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ==================== SUCCESS STATE ==================== */}
                        {isComplete && (
                            <div className="py-8 flex flex-col items-center text-center space-y-4">
                                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
                                    <Check size={24} strokeWidth={2.5} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold tracking-tight text-black">
                                        Batch Authorized & Processing
                                    </h2>
                                    <p className="text-sm text-zinc-500 mt-1 max-w-md mx-auto">
                                        {activeRecipientCount} payouts totaling {formatUsd(activeTotalAmountUsd)}{" "}
                                        have been submitted to the pan-African clearing network.
                                    </p>
                                </div>

                                <div className="border border-[#E5E5E5] rounded-lg px-4 py-3 font-mono text-xs text-black">
                                    Batch Reference: <span className="font-bold">{batchRef}</span>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 h-10 rounded-md border border-[#E5E5E5] text-xs font-medium text-black hover:border-black transition-colors bg-white cursor-pointer"
                                    >
                                        Create Another Batch
                                    </button>
                                    <Link
                                        href="/business/dashboard"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white px-5 h-10 rounded-md text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
                                    >
                                        <span>View in Overview</span>
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default BulkPayoutFlow;
