"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AddBeneficiaryModal, Beneficiary } from "./AddBeneficiaryModal";
import { AFRICAN_FX_CURRENCIES, flagUrl } from "../hooks/useAfricanLiveRates";

const STORAGE_KEY = "settle_africa_beneficiaries";

const DEFAULT_BENEFICIARIES: Beneficiary[] = [
    { id: "b-1", name: "Chioma Adeleke", bank: "GTBank", accountNumber: "0124924921", currency: "NGN" },
    { id: "b-2", name: "Amina Yusuf", bank: "M-Pesa", accountNumber: "0712348832", currency: "KES" },
    { id: "b-3", name: "David Osei", bank: "GCB Bank", accountNumber: "0241231102", currency: "GHS" },
];

function initials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("");
}

export function RecentBeneficiaries() {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(DEFAULT_BENEFICIARIES);
    const [modalOpen, setModalOpen] = useState(false);

    // Load saved beneficiaries from this browser
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setBeneficiaries(JSON.parse(saved));
        } catch {
            // ignore corrupt storage
        }
    }, []);

    const handleAdd = (b: Beneficiary) => {
        const next = [b, ...beneficiaries];
        setBeneficiaries(next);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            // ignore storage errors
        }
    };

    return (
        <Card className="mb-6 border border-gray-200/90 bg-white p-5 shadow-xs">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold tracking-tight text-gray-900">Beneficiaries</h2>
                <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800"
                >
                    <Plus size={13} />
                    Add beneficiary
                </button>
            </div>

            {beneficiaries.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500">No beneficiaries yet.</p>
            ) : (
                <ul className="divide-y divide-gray-100">
                    {beneficiaries.slice(0, 5).map((person) => {
                        const iso = AFRICAN_FX_CURRENCIES.find((c) => c.code === person.currency)?.iso;
                        return (
                            <li key={person.id} className="flex items-center gap-3 py-2.5">
                                <div className="relative shrink-0">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 font-mono text-xs font-bold text-white">
                                        {initials(person.name)}
                                    </div>
                                    {iso && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={flagUrl(iso)}
                                            alt=""
                                            width={16}
                                            height={11}
                                            className="absolute -bottom-0.5 -right-1 h-3 w-4 rounded-[2px] border border-white object-cover"
                                        />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-gray-900">{person.name}</p>
                                    <p className="truncate text-xs text-gray-500">
                                        {person.bank} &bull; {person.currency}
                                    </p>
                                </div>
                                <Link
                                    href={`/send-money?beneficiary=${person.id}`}
                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-800 transition-colors hover:border-black hover:bg-black hover:text-white"
                                >
                                    <Send size={11} />
                                    Send
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}

            <AddBeneficiaryModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onAdd={handleAdd}
            />
        </Card>
    );
}
