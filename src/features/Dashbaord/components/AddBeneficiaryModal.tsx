"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AFRICAN_FX_CURRENCIES, flagUrl } from "../hooks/useAfricanLiveRates";

export interface Beneficiary {
    id: string;
    name: string;
    bank: string;
    accountNumber: string;
    currency: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onAdd: (beneficiary: Beneficiary) => void;
}

const countryOptions = AFRICAN_FX_CURRENCIES.map((c) => ({
    value: c.code,
    label: c.country,
    description: c.code,
    leadingNode: (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={flagUrl(c.iso)}
            alt=""
            width={20}
            height={14}
            className="h-3.5 w-5 rounded-[2px] object-cover border border-gray-200"
        />
    ),
}));

export function AddBeneficiaryModal({ open, onClose, onAdd }: Props) {
    const [name, setName] = useState("");
    const [currency, setCurrency] = useState("");
    const [bank, setBank] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset the form each time it opens; close on Escape
    useEffect(() => {
        if (!open) return;
        setName("");
        setCurrency("");
        setBank("");
        setAccountNumber("");
        setErrors({});
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open || typeof document === "undefined") return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (name.trim().length < 3) next.name = "Enter the recipient's full name.";
        if (!currency) next.currency = "Select a country.";
        if (!bank.trim()) next.bank = "Enter a bank or mobile money provider.";
        if (accountNumber.replace(/\D/g, "").length < 6) next.accountNumber = "Enter a valid account number.";
        setErrors(next);
        if (Object.keys(next).length) return;

        onAdd({
            id: `b-${Date.now()}`,
            name: name.trim(),
            bank: bank.trim(),
            accountNumber: accountNumber.replace(/\D/g, ""),
            currency,
        });
        toast.success(`${name.trim()} added as a beneficiary.`);
        onClose();
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/40 p-4"
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-beneficiary-title"
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            >
                <div className="mb-5 flex items-center justify-between">
                    <h2 id="add-beneficiary-title" className="text-base font-bold text-gray-900">
                        Add beneficiary
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-black transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    <Input
                        id="beneficiary-name"
                        label="Full name"
                        value={name}
                        placeholder="Amara Okafor"
                        error={errors.name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Select
                        label="Country"
                        value={currency}
                        onChange={setCurrency}
                        placeholder="Select country"
                        searchable
                        searchPlaceholder="Search country"
                        options={countryOptions}
                        error={errors.currency}
                    />

                    <Input
                        id="beneficiary-bank"
                        label="Bank or provider"
                        value={bank}
                        placeholder="GTBank, M-Pesa..."
                        error={errors.bank}
                        onChange={(e) => setBank(e.target.value)}
                    />

                    <Input
                        id="beneficiary-account"
                        label="Account / phone number"
                        value={accountNumber}
                        inputMode="numeric"
                        placeholder="0123456789"
                        error={errors.accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.replace(/[^\d]/g, ""))}
                    />

                    <div className="mt-1 flex gap-3">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="h-11 flex-1 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="h-11 flex-1 rounded-lg bg-black text-sm font-semibold text-white hover:bg-zinc-800"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

