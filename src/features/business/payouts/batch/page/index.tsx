"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    UploadCloud,
    FileSpreadsheet,
    AlertCircle,
    CheckCircle2,
    Building2,
    CreditCard,
    Check,
    Download,
    Wrench,
    Trash2,
    ArrowRight,
    ArrowLeft,
    ShieldCheck,
    X,
    RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
    useBusiness,
    BatchRowItem,
    SAMPLE_BATCH_ROWS_WITH_ERRORS,
    validateBatchRow,
} from "@/features/business/context/BusinessContext";
import { toast } from "react-toastify";

type BatchFilterTab = "all" | "valid" | "errors";

export function BatchPayoutPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { fundingSources, processBatchTransfer } = useBusiness();

    // Batch Metadata & File State
    const [batchTitle, setBatchTitle] = useState("November Pan-African Vendor & Payroll Batch #14");
    const [uploadedFileName, setUploadedFileName] = useState("settle_africa_nov_disbursements_v2.csv");
    const [uploadedFileSize, setUploadedFileSize] = useState("28.4 KB");
    const [isDragging, setIsDragging] = useState(false);

    // Selected Direct Corporate Funding Source (Bank Account or Debit Card — No Wallet)
    const [selectedFundingId, setSelectedFundingId] = useState<string>(
        fundingSources[0]?.id || "fs-stanbic-ng"
    );

    // Pre-flight rows
    const [rows, setRows] = useState<BatchRowItem[]>(SAMPLE_BATCH_ROWS_WITH_ERRORS);
    const [activeTab, setActiveTab] = useState<BatchFilterTab>("all");
    const [excludeInvalidRows, setExcludeInvalidRows] = useState<boolean>(false);

    // Editing a single flagged row modal state
    const [editingRow, setEditingRow] = useState<BatchRowItem | null>(null);
    const [editRoutingCode, setEditRoutingCode] = useState("");
    const [editAccountNumber, setEditAccountNumber] = useState("");
    const [editAmountUsd, setEditAmountUsd] = useState("");

    // Execution Modal State
    const [isExecutingModalOpen, setIsExecutingModalOpen] = useState(false);
    const [executionStep, setExecutionStep] = useState<1 | 2 | 3 | 4>(1);
    const [createdBatchRef, setCreatedBatchRef] = useState<string>("");

    const activeFundingSource = useMemo(
        () => fundingSources.find((f) => f.id === selectedFundingId) || fundingSources[0],
        [fundingSources, selectedFundingId]
    );

    // Computed Pre-Flight Validation Stats
    const validationSummary = useMemo(() => {
        const validRows = rows.filter((r) => r.errors.length === 0);
        const errorRows = rows.filter((r) => r.errors.length > 0);
        const executableRows = excludeInvalidRows ? validRows : rows;

        const principalUsd = executableRows.reduce((sum, r) => sum + r.amountUsd, 0);
        const feeUsd = Number(
            (principalUsd * ((activeFundingSource?.feePercent || 0.15) / 100)).toFixed(2)
        );
        const totalDirectDebitUsd = principalUsd + feeUsd;
        const corridors = Array.from(new Set(executableRows.map((r) => r.currencyCode)));

        return {
            totalCount: rows.length,
            validCount: validRows.length,
            errorCount: errorRows.length,
            validRows,
            errorRows,
            executableRows,
            principalUsd,
            feeUsd,
            totalDirectDebitUsd,
            corridors,
            canProcess:
                executableRows.length > 0 &&
                (errorRows.length === 0 || excludeInvalidRows),
        };
    }, [rows, excludeInvalidRows, activeFundingSource]);

    const filteredRows = useMemo(() => {
        if (activeTab === "valid") return rows.filter((r) => r.errors.length === 0);
        if (activeTab === "errors") return rows.filter((r) => r.errors.length > 0);
        return rows;
    }, [rows, activeTab]);

    // Parse uploaded CSV file
    const parseUploadedFile = (file: File) => {
        setUploadedFileName(file.name);
        setUploadedFileSize(`${(file.size / 1024).toFixed(1)} KB`);

        if (file.name.endsWith(".csv")) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const text = (ev.target?.result as string) || "";
                const lines = text
                    .split(/\r?\n/)
                    .map((l) => l.trim())
                    .filter(Boolean);

                if (lines.length <= 1) {
                    toast.info("CSV loaded with sample pre-flight validation dataset.");
                    setRows(SAMPLE_BATCH_ROWS_WITH_ERRORS);
                    return;
                }

                const parsed: BatchRowItem[] = lines.slice(1).map((line, idx) => {
                    const cols = line.split(",").map((c) => c.trim());
                    const currencyCode = cols[3] || "NGN";
                    const fxMap: Record<string, { symbol: string; flag: string; fx: number }> = {
                        NGN: { symbol: "₦", flag: "🇳🇬", fx: 1592.0 },
                        KES: { symbol: "KSh", flag: "🇰🇪", fx: 129.45 },
                        GHS: { symbol: "GH₵", flag: "🇬🇭", fx: 15.85 },
                        ZAR: { symbol: "R", flag: "🇿🇦", fx: 17.62 },
                        XOF: { symbol: "CFA", flag: "🇸🇳", fx: 615.0 },
                    };
                    const meta = fxMap[currencyCode] || fxMap.NGN;
                    const amountUsd = parseFloat(cols[8] || "5000") || 5000;

                    const baseRow: Omit<BatchRowItem, "errors"> = {
                        id: `csv-row-${Date.now()}-${idx}`,
                        rowNumber: idx + 1,
                        recipientName: cols[0] || `Vendor Entity #${idx + 1}`,
                        category: cols[1] === "Contractor" ? "Contractor" : "Vendor",
                        country: cols[2] || "Nigeria",
                        flag: meta.flag,
                        currencyCode,
                        currencySymbol: meta.symbol,
                        payoutMethod: cols[4] === "Mobile Money" ? "Mobile Money" : "Local Bank",
                        institutionName: cols[5] || "Access Bank PLC",
                        routingCode: cols[6] || "",
                        accountNumber: cols[7] || "",
                        amountUsd,
                        amountLocal: amountUsd * meta.fx,
                        fxRate: meta.fx,
                        taxReference: cols[9] || "TIN-VERIFIED",
                        invoiceRef: cols[10] || `INV-2026-${100 + idx}`,
                    };

                    return {
                        ...baseRow,
                        errors: validateBatchRow(baseRow),
                    };
                });

                setRows(parsed);
                toast.success(`Parsed ${parsed.length} rows from ${file.name}.`);
            };
            reader.readAsText(file);
        } else {
            setRows(SAMPLE_BATCH_ROWS_WITH_ERRORS);
            toast.success(`Loaded workbook "${file.name}" into pre-flight validator.`);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) parseUploadedFile(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) parseUploadedFile(file);
        e.target.value = "";
    };

    const handleDownloadTemplate = () => {
        const csvContent = [
            "RecipientName,Category,Country,Currency,PayoutMethod,Institution,RoutingCode,AccountNumber,AmountUSD,TaxRef,InvoiceRef",
            "Dangote Port Logistics Ltd,Vendor,Nigeria,NGN,Local Bank,Access Bank PLC,044150149,0049182736,18500,TIN-20491829,INV-NG-901",
            "Nairobi Telematics Ltd,Vendor,Kenya,KES,Mobile Money,Safaricom M-Pesa,MPESA-400200,+254712904812,9400,KRA-P0519283,INV-KE-412",
            "Lagos Haulage Services,Vendor,Nigeria,NGN,Local Bank,Zenith Bank PLC,,10184920,12250,TIN-88491022,INV-NG-904",
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "settle_africa_batch_payout_template.csv";
        a.click();
        URL.revokeObjectURL(url);
        toast.info("Downloaded Settle Africa CSV batch template.");
    };

    const openFixRowModal = (row: BatchRowItem) => {
        setEditingRow(row);
        setEditRoutingCode(
            row.routingCode || (row.currencyCode === "NGN" ? "057150013" : "040101")
        );
        setEditAccountNumber(
            row.currencyCode === "NGN" && row.accountNumber.length < 10
                ? row.accountNumber.padEnd(10, "45")
                : row.accountNumber
        );
        setEditAmountUsd(String(row.amountUsd));
    };

    const handleSaveRowFix = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRow) return;

        const nextAmount = parseFloat(editAmountUsd) || editingRow.amountUsd;
        const updatedBase: Omit<BatchRowItem, "errors"> = {
            ...editingRow,
            routingCode: editRoutingCode.trim(),
            accountNumber: editAccountNumber.trim(),
            amountUsd: nextAmount,
            amountLocal: nextAmount * editingRow.fxRate,
        };
        const nextErrors = validateBatchRow(updatedBase);

        setRows((prev) =>
            prev.map((r) =>
                r.id === editingRow.id ? { ...updatedBase, errors: nextErrors } : r
            )
        );
        setEditingRow(null);
        if (nextErrors.length === 0) {
            toast.success(`Row #${editingRow.rowNumber} validated and cleared for pass-through.`);
        } else {
            toast.warning(`Row #${editingRow.rowNumber} still has ${nextErrors.length} issue(s).`);
        }
    };

    const handleAutoResolveAllErrors = () => {
        setRows((prev) =>
            prev.map((r) => {
                if (r.errors.length === 0) return r;
                const fixedRouting =
                    r.routingCode.trim() ||
                    (r.currencyCode === "NGN" ? "057150013" : "040101");
                const fixedAccount =
                    r.currencyCode === "NGN" && r.accountNumber.replace(/\D/g, "").length !== 10
                        ? "1018492045"
                        : r.accountNumber;
                const updated: Omit<BatchRowItem, "errors"> = {
                    ...r,
                    routingCode: fixedRouting,
                    accountNumber: fixedAccount,
                };
                return {
                    ...updated,
                    errors: validateBatchRow(updated),
                };
            })
        );
        toast.success("All missing routing codes and account lengths resolved.");
    };

    const handleDeleteRow = (id: string) => {
        setRows((prev) =>
            prev
                .filter((r) => r.id !== id)
                .map((r, index) => ({ ...r, rowNumber: index + 1 }))
        );
        toast.info("Row removed from batch manifest.");
    };

    const handleProcessBatchTransfer = async () => {
        if (!validationSummary.canProcess) {
            toast.error(
                "Pre-flight check blocked: Resolve flagged row errors or enable 'Exclude invalid rows' before processing."
            );
            return;
        }

        setIsExecutingModalOpen(true);
        setExecutionStep(1);

        await new Promise((r) => setTimeout(r, 700));
        setExecutionStep(2);

        await new Promise((r) => setTimeout(r, 750));
        setExecutionStep(3);

        await new Promise((r) => setTimeout(r, 700));
        const created = processBatchTransfer({
            batchTitle,
            validRows: validationSummary.executableRows,
            fundingSource: activeFundingSource,
        });
        setCreatedBatchRef(created.reference);
        setExecutionStep(4);
    };

    return (
        <div className="space-y-8 pb-16 text-black">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            href="/business/dashboard"
                            className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-zinc-500 hover:text-black transition-colors"
                        >
                            <ArrowLeft size={13} />
                            <span>Back to Overview</span>
                        </Link>
                        <span className="text-zinc-300">/</span>
                        <span className="inline-flex items-center gap-1 rounded border border-black bg-black text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                            Mass Pass-Through Engine
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
                        Bulk Payout &amp; Batch Transfer
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                        Upload CSV or Excel disbursements across African corridors. Funds pull directly from your corporate bank account or commercial card — zero wallet custody.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleDownloadTemplate}
                        className="h-10 px-4 text-xs font-semibold border-[#E5E5E5] text-black hover:border-black cursor-pointer"
                    >
                        <Download size={14} />
                        <span>Download CSV Template</span>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setRows(SAMPLE_BATCH_ROWS_WITH_ERRORS);
                            setUploadedFileName("settle_africa_nov_disbursements_v2.csv");
                            toast.info("Reset to sample batch with 2 pre-flight validation errors.");
                        }}
                        className="h-10 px-4 text-xs font-semibold border-[#E5E5E5] text-black hover:border-black cursor-pointer"
                    >
                        <RefreshCw size={14} />
                        <span>Reset Sample Batch</span>
                    </Button>
                </div>
            </div>

            {/* Top Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Drag-and-Drop Zone */}
                <div className="lg:col-span-5 rounded-2xl border border-[#E5E5E5] bg-white p-6 flex flex-col justify-between space-y-5">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                                Step 1 &bull; Batch Manifest File
                            </span>
                            <span className="text-[10px] font-mono font-semibold text-black border border-[#E5E5E5] px-2 py-0.5 rounded bg-zinc-50">
                                .CSV / .XLSX
                            </span>
                        </div>
                        <h2 className="text-base font-bold text-black">
                            Upload Vendor or Payroll Batch
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Supports multi-corridor bank RTGS/NUBAN and Mobile Money (M-Pesa, Wave, MTN MoMo) in a single file.
                        </p>
                    </div>

                    <Input
                        label="Batch Settlement Reference Label"
                        value={batchTitle}
                        onChange={(e) => setBatchTitle(e.target.value)}
                        placeholder="e.g., November East & West Africa Payroll"
                    />

                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isDragging
                                ? "border-black bg-zinc-100"
                                : "border-black/40 hover:border-black bg-zinc-50/60"
                        }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center mb-3">
                            <UploadCloud size={20} />
                        </div>

                        <p className="text-xs font-bold text-black">
                            Drag &amp; drop CSV or Excel file here, or{" "}
                            <span className="underline">browse computer</span>
                        </p>
                        <p className="text-[11px] font-mono text-zinc-500 mt-1 font-tabular-nums">
                            Max 2,500 recipients per batch &bull; Auto routing &amp; NUBAN validation
                        </p>

                        <div className="mt-4 w-full rounded-lg border border-black bg-white px-3.5 py-2.5 flex items-center justify-between text-left">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <FileSpreadsheet size={16} className="text-black shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs font-mono font-bold text-black truncate">
                                        {uploadedFileName}
                                    </p>
                                    <p className="text-[10px] font-mono text-zinc-500 font-tabular-nums">
                                        {uploadedFileSize} &bull; {rows.length} rows parsed
                                    </p>
                                </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold uppercase bg-black text-white px-2 py-0.5 rounded shrink-0">
                                Loaded
                            </span>
                        </div>
                    </div>
                </div>

                {/* Direct Corporate Funding Source Selector */}
                <div className="lg:col-span-7 rounded-2xl border border-[#E5E5E5] bg-white p-6 flex flex-col justify-between space-y-5">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                                Step 2 &bull; Direct Pass-Through Funding Source
                            </span>
                            <span className="text-[10px] font-mono font-bold uppercase bg-black text-white px-2 py-0.5 rounded">
                                Zero Wallet Holding
                            </span>
                        </div>
                        <h2 className="text-base font-bold text-black">
                            Select Corporate Bank Account or Commercial Card
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Settle Africa debits the batch total directly from your chosen corporate funding source and settles straight to recipient banks.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {fundingSources.map((fs) => {
                            const isSelected = activeFundingSource?.id === fs.id;
                            const feeForSource = Number(
                                (
                                    validationSummary.principalUsd *
                                    (fs.feePercent / 100)
                                ).toFixed(2)
                            );

                            return (
                                <button
                                    key={fs.id}
                                    type="button"
                                    onClick={() => setSelectedFundingId(fs.id)}
                                    className={`w-full rounded-xl border p-4 text-left transition-all cursor-pointer ${
                                        isSelected
                                            ? "border-black bg-black text-white"
                                            : "border-[#E5E5E5] bg-white text-black hover:border-black"
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-start gap-3.5">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 ${
                                                    isSelected
                                                        ? "border-white/20 bg-white/10 text-white"
                                                        : "border-[#E5E5E5] bg-zinc-50 text-black"
                                                }`}
                                            >
                                                {fs.type === "corporate_bank" ? (
                                                    <Building2 size={18} />
                                                ) : (
                                                    <CreditCard size={18} />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-sm font-bold">
                                                        {fs.institutionName}
                                                    </span>
                                                    <span className="font-mono text-xs font-bold font-tabular-nums">
                                                        {fs.maskedNumber}
                                                    </span>
                                                    <span
                                                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                                                            isSelected
                                                                ? "border-white/30 text-white"
                                                                : "border-[#E5E5E5] text-zinc-600 bg-zinc-50"
                                                        }`}
                                                    >
                                                        {fs.type === "corporate_bank"
                                                            ? "Corporate Bank Mandate"
                                                            : "Commercial Debit Card"}
                                                    </span>
                                                </div>
                                                <p
                                                    className={`text-xs mt-1 ${
                                                        isSelected ? "text-zinc-300" : "text-zinc-500"
                                                    }`}
                                                >
                                                    {fs.accountLabel} &bull; {fs.rail}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-white/15 font-mono font-tabular-nums shrink-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-bold">
                                                    Fee: {fs.feePercent}% (${feeForSource.toFixed(2)})
                                                </span>
                                                {isSelected && <Check size={15} />}
                                            </div>
                                            <span
                                                className={`text-[10px] mt-0.5 ${
                                                    isSelected ? "text-zinc-300" : "text-zinc-500"
                                                }`}
                                            >
                                                Daily Limit: $
                                                {fs.dailyLimitUsd.toLocaleString("en-US")}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="rounded-xl border border-[#E5E5E5] bg-zinc-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-tabular-nums">
                        <div className="flex items-center gap-2 text-black">
                            <ShieldCheck size={15} className="shrink-0" />
                            <span>
                                Active Mandate:{" "}
                                <strong>{activeFundingSource?.mandateRef}</strong> (
                                {activeFundingSource?.settlementSpeed})
                            </span>
                        </div>
                        <span className="text-zinc-500">Direct Atomic Pull</span>
                    </div>
                </div>
            </div>

            {/* 3. Pre-Flight Validation Table */}
            <div className="rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden">
                <div className="p-6 border-b border-[#E5E5E5] space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                                    Step 3 &bull; Pre-Flight Corridor Validation
                                </span>
                                {validationSummary.errorCount > 0 ? (
                                    <span className="inline-flex items-center gap-1 rounded bg-black text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase font-tabular-nums">
                                        <AlertCircle size={11} />
                                        <span>{validationSummary.errorCount} Errors Flagged</span>
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded border border-black bg-white text-black px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                                        <CheckCircle2 size={11} />
                                        <span>All Rows Verified Ready</span>
                                    </span>
                                )}
                            </div>
                            <h2 className="text-lg font-bold text-black mt-1">
                                Pre-Flight Validation Preview Table
                            </h2>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                Inspect bank routing codes, NUBAN/IBAN account lengths, and locked corridor FX rates before authorizing the pass-through debit.
                            </p>
                        </div>

                        {validationSummary.errorCount > 0 && (
                            <div className="flex flex-wrap items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={handleAutoResolveAllErrors}
                                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-black text-white hover:bg-zinc-800 text-xs font-mono font-bold transition-colors cursor-pointer"
                                >
                                    <Wrench size={13} />
                                    <span>Auto-Fix All {validationSummary.errorCount} Flagged Rows</span>
                                </button>

                                <label className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-black bg-zinc-50 text-xs font-semibold text-black cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={excludeInvalidRows}
                                        onChange={(e) => setExcludeInvalidRows(e.target.checked)}
                                        className="h-3.5 w-3.5 rounded border-black accent-black"
                                    />
                                    <span>
                                        Skip {validationSummary.errorCount} invalid row(s) &amp; process valid only
                                    </span>
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                        <div className="flex items-center gap-1.5">
                            {(
                                [
                                    {
                                        id: "all",
                                        label: "All Preview Rows",
                                        count: validationSummary.totalCount,
                                    },
                                    {
                                        id: "valid",
                                        label: "Valid & Ready",
                                        count: validationSummary.validCount,
                                    },
                                    {
                                        id: "errors",
                                        label: "Validation Errors",
                                        count: validationSummary.errorCount,
                                    },
                                ] as const
                            ).map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                                            isActive
                                                ? "text-white"
                                                : "text-zinc-600 hover:text-black bg-zinc-50 border border-[#E5E5E5]"
                                        }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="batchValidationTabPill"
                                                className="absolute inset-0 rounded-lg bg-black z-0"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 420,
                                                    damping: 32,
                                                }}
                                            />
                                        )}
                                        <span className="relative z-10">{tab.label}</span>
                                        <span
                                            className={`relative z-10 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded font-tabular-nums ${
                                                isActive
                                                    ? "bg-white text-black"
                                                    : "bg-white text-black border border-[#E5E5E5]"
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="text-xs font-mono text-zinc-500 font-tabular-nums">
                            Active Corridors:{" "}
                            <span className="font-bold text-black">
                                {validationSummary.corridors.join(" • ") || "None"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#E5E5E5] bg-zinc-50 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                                <th className="py-3.5 px-4">Row</th>
                                <th className="py-3.5 px-4">Recipient / Entity</th>
                                <th className="py-3.5 px-4">Corridor &amp; Rail</th>
                                <th className="py-3.5 px-4">Routing / Sort Code</th>
                                <th className="py-3.5 px-4">Account / Mobile No.</th>
                                <th className="py-3.5 px-4 text-right">Payout Amount</th>
                                <th className="py-3.5 px-4">Pre-Flight Validation</th>
                                <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5] text-xs">
                            {filteredRows.map((row) => {
                                const hasError = row.errors.length > 0;
                                const missingRouting = !row.routingCode.trim();
                                const badAccountLength = row.errors.some((e) =>
                                    e.toLowerCase().includes("length")
                                );

                                return (
                                    <tr
                                        key={row.id}
                                        className={
                                            hasError
                                                ? "bg-zinc-100/90 hover:bg-zinc-100 transition-colors"
                                                : "bg-white hover:bg-zinc-50/70 transition-colors"
                                        }
                                    >
                                        <td className="py-4 px-4 align-top font-mono font-bold text-black font-tabular-nums">
                                            #{row.rowNumber}
                                        </td>

                                        <td className="py-4 px-4 align-top min-w-[200px]">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-black">
                                                    {row.recipientName}
                                                </span>
                                            </div>
                                            
                                        </td>

                                        <td className="py-4 px-4 align-top whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 font-semibold text-black">
                                                <span>{row.flag}</span>
                                                <span>
                                                    {row.country} ({row.currencyCode})
                                                </span>
                                            </div>
                                            
                                        </td>

                                        <td className="py-4 px-4 align-top whitespace-nowrap font-mono font-tabular-nums">
                                            {missingRouting ? (
                                                <span className="inline-flex items-center gap-1 rounded border-2 border-black bg-white px-2.5 py-1 text-[11px] font-bold text-black">
                                                    <AlertCircle size={12} />
                                                    <span>MISSING CODE</span>
                                                </span>
                                            ) : (
                                                <span className="font-semibold text-black bg-zinc-50 border border-[#E5E5E5] px-2.5 py-1 rounded">
                                                    {row.routingCode}
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-4 px-4 align-top whitespace-nowrap font-mono font-tabular-nums">
                                            {badAccountLength ? (
                                                <div className="inline-flex flex-col">
                                                    <span className="inline-flex items-center gap-1 rounded border-2 border-black bg-white px-2.5 py-1 text-[11px] font-bold text-black">
                                                        <AlertCircle size={12} />
                                                        <span>{row.accountNumber}</span>
                                                    </span>
                                                    <span className="text-[10px] font-bold text-black mt-0.5">
                                                        {row.accountNumber.length}/10 digits
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="font-semibold text-black">
                                                    {row.accountNumber}
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-4 px-4 align-top text-right whitespace-nowrap font-mono font-tabular-nums">
                                            <p className="font-bold text-black text-sm">
                                                ${row.amountUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                            </p>
                                            
                                        </td>

                                        <td className="py-4 px-4 align-top min-w-[230px]">
                                            {hasError ? (
                                                <div className="space-y-1">
                                                    <span className="inline-flex items-center gap-1 rounded bg-black text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                                                        <AlertCircle size={10} />
                                                        <span>Validation Failed</span>
                                                    </span>
                                                    {row.errors.map((err, i) => (
                                                        <p
                                                            key={i}
                                                            className="text-[11px] font-mono font-semibold text-black leading-snug"
                                                        >
                                                            &bull; {err}
                                                        </p>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div>
                                                    <span className="inline-flex items-center gap-1 rounded border border-black bg-white text-black px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                                                        <Check size={10} />
                                                        <span>Verified Ready</span>
                                                    </span>
                                                    <p className="text-[10px] font-mono text-zinc-500 mt-1 font-tabular-nums">
                                                        FX Locked @ {row.fxRate} {row.currencyCode}/USD
                                                    </p>
                                                </div>
                                            )}
                                        </td>

                                        <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                                            <div className="inline-flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => openFixRowModal(row)}
                                                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                                                        hasError
                                                            ? "bg-black text-white hover:bg-zinc-800"
                                                            : "border border-[#E5E5E5] bg-white text-black hover:border-black"
                                                    }`}
                                                >
                                                    {hasError ? "Fix Row" : "Edit"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteRow(row.id)}
                                                    className="p-1.5 rounded-lg border border-[#E5E5E5] bg-white text-zinc-500 hover:text-black hover:border-black transition-colors cursor-pointer"
                                                    title="Remove row from batch"
                                                    aria-label="Remove row"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Bottom Bar */}
                <div className="p-6 bg-zinc-50 border-t border-black flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 font-tabular-nums">
                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                                Executable Rows
                            </p>
                            <p className="text-lg font-mono font-bold text-black mt-0.5">
                                {validationSummary.executableRows.length} / {validationSummary.totalCount}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                                Principal Volume
                            </p>
                            <p className="text-lg font-mono font-bold text-black mt-0.5">
                                $
                                {validationSummary.principalUsd.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                })}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                                Pass-Through Fee ({activeFundingSource?.feePercent}%)
                            </p>
                            <p className="text-lg font-mono font-bold text-black mt-0.5">
                                $
                                {validationSummary.feeUsd.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                })}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                                Total Direct Corporate Pull
                            </p>
                            <p className="text-xl font-mono font-bold text-black mt-0.5">
                                $
                                {validationSummary.totalDirectDebitUsd.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                })}{" "}
                                <span className="text-xs font-normal text-zinc-500">USD</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {validationSummary.errorCount > 0 && !excludeInvalidRows && (
                            <button
                                type="button"
                                onClick={handleAutoResolveAllErrors}
                                className="h-12 px-4 rounded-lg border border-black bg-white text-black hover:bg-zinc-100 text-xs font-mono font-bold transition-colors cursor-pointer"
                            >
                                Fix {validationSummary.errorCount} Error(s) First
                            </button>
                        )}
                        <Button
                            type="button"
                            size="lg"
                            onClick={handleProcessBatchTransfer}
                            className="h-12 px-7 rounded-lg bg-black text-white hover:bg-zinc-800 text-sm font-bold tracking-tight flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
                        >
                            <span>Process Batch Transfer</span>
                            <ArrowRight size={16} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Inline Fix/Edit Row Modal */}
            <AnimatePresence>
                {editingRow && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingRow(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-[1px]"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            className="relative z-10 w-full max-w-md rounded-2xl border border-black bg-white p-6 text-black shadow-2xl text-left"
                        >
                            <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#E5E5E5]">
                                <div>
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
                                        Row #{editingRow.rowNumber} Remediation
                                    </span>
                                    <h3 className="text-base font-bold text-black mt-1.5">
                                        {editingRow.recipientName}
                                    </h3>
                                    <p className="text-xs text-zinc-500">
                                        {editingRow.flag} {editingRow.country} &bull;{" "}
                                        {editingRow.institutionName}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setEditingRow(null)}
                                    className="p-1.5 rounded-lg border border-[#E5E5E5] text-zinc-500 hover:text-black hover:border-black cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveRowFix} className="mt-4 space-y-4">
                                <Input
                                    label="Bank Routing / Sort / Paybill Code"
                                    tabular
                                    value={editRoutingCode}
                                    onChange={(e) => setEditRoutingCode(e.target.value)}
                                    hint="e.g., 057150013 (9-digit NIBSS sort code) or 040101 (GhIPSS)"
                                    required
                                />
                                <Input
                                    label="Recipient Account / Mobile Number"
                                    tabular
                                    value={editAccountNumber}
                                    onChange={(e) => setEditAccountNumber(e.target.value)}
                                    hint={
                                        editingRow.currencyCode === "NGN"
                                            ? "Nigeria NUBAN requires exactly 10 digits"
                                            : "Minimum 8 digits required"
                                    }
                                    required
                                />
                                <Input
                                    label="Payout Amount (USD)"
                                    type="number"
                                    step="0.01"
                                    tabular
                                    value={editAmountUsd}
                                    onChange={(e) => setEditAmountUsd(e.target.value)}
                                    required
                                />

                                <div className="pt-2 flex items-center justify-end gap-2.5">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditingRow(null)}
                                        className="border-[#E5E5E5] text-black hover:border-black cursor-pointer"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-black text-white hover:bg-zinc-800 cursor-pointer"
                                    >
                                        Validate &amp; Save Row
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Batch Execution Modal */}
            <AnimatePresence>
                {isExecutingModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-[1px]"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 14, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            className="relative z-10 w-full max-w-lg rounded-2xl border border-black bg-white p-6 sm:p-8 text-black shadow-2xl text-left"
                        >
                            <div className="pb-4 border-b border-[#E5E5E5]">
                                <span className="inline-flex items-center gap-1.5 rounded bg-black text-white px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                                    {executionStep < 4
                                        ? "Executing Pass-Through Batch..."
                                        : "Batch Settlement Dispatched"}
                                </span>
                                <h3 className="text-xl font-bold text-black mt-2">
                                    {batchTitle}
                                </h3>
                                <p className="text-xs font-mono text-zinc-500 mt-0.5 font-tabular-nums">
                                    Source: {activeFundingSource?.institutionName}{" "}
                                    {activeFundingSource?.maskedNumber} &bull; Total Pull: $
                                    {validationSummary.totalDirectDebitUsd.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                    })}{" "}
                                    USD
                                </p>
                            </div>

                            <div className="my-6 space-y-3">
                                {[
                                    {
                                        step: 1,
                                        label: "Direct Atomic Corporate Debit Authorization",
                                        desc: `Pulling $${validationSummary.totalDirectDebitUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD via ${activeFundingSource?.rail} (No wallet custody)`,
                                    },
                                    {
                                        step: 2,
                                        label: "Wholesale Corridor FX Lock & Liquidity Allocation",
                                        desc: `Locking interbank rates across ${validationSummary.corridors.join(", ")} corridors`,
                                    },
                                    {
                                        step: 3,
                                        label: `Disbursing to ${validationSummary.executableRows.length} Verified Beneficiaries`,
                                        desc: "Routing payout instructions to local African clearing partners",
                                    },
                                ].map((item) => {
                                    const isDone = executionStep > item.step;
                                    const isCurrent = executionStep === item.step;
                                    return (
                                        <div
                                            key={item.step}
                                            className={`rounded-xl border p-3.5 transition-all ${
                                                isDone
                                                    ? "border-black bg-white"
                                                    : isCurrent
                                                      ? "border-black border-dashed bg-zinc-50"
                                                      : "border-[#E5E5E5] bg-zinc-50/50 opacity-60"
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shrink-0 mt-0.5 border ${
                                                        isDone
                                                            ? "bg-black text-white border-black"
                                                            : "bg-white text-black border-black"
                                                    }`}
                                                >
                                                    {isDone ? <Check size={12} /> : item.step}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-black">
                                                        {item.label}
                                                    </p>
                                                    <p className="text-[11px] text-zinc-500 mt-0.5 font-tabular-nums">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {executionStep === 4 && (
                                <div className="rounded-xl border border-black bg-zinc-50 p-4 mb-5 flex items-center justify-between font-mono font-tabular-nums">
                                    <div>
                                        <p className="text-[10px] uppercase text-zinc-500">
                                            Master Batch Reference
                                        </p>
                                        <p className="text-sm font-bold text-black">
                                            {createdBatchRef}
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase bg-black text-white px-2.5 py-1 rounded">
                                        {validationSummary.executableRows.length} Payouts Clearing
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={executionStep < 4}
                                    onClick={() => setIsExecutingModalOpen(false)}
                                    className="border-[#E5E5E5] text-black hover:border-black cursor-pointer"
                                >
                                    Stay on Batch Page
                                </Button>
                                <Button
                                    type="button"
                                    disabled={executionStep < 4}
                                    onClick={() => {
                                        setIsExecutingModalOpen(false);
                                        router.push("/business/dashboard");
                                    }}
                                    className="bg-black text-white hover:bg-zinc-800 cursor-pointer"
                                >
                                    <span>View in Business Overview</span>
                                    <ArrowRight size={14} />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

