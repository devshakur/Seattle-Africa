"use client";

import { useBusiness } from "@/features/business/context/BusinessContext";

export function BeneficiariesPage() {
    const { beneficiaries } = useBusiness();

    return (
        <div className="space-y-8 pb-16 text-black">
            <h1 className="text-2xl font-bold tracking-tight">Beneficiaries</h1>

            <section className="rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-[#E5E5E5] bg-zinc-50 text-zinc-500">
                                <th className="py-3 px-6 font-semibold">Name</th>
                                <th className="py-3 px-6 font-semibold">Country</th>
                                <th className="py-3 px-6 font-semibold">Bank</th>
                                <th className="py-3 px-6 font-semibold">Account</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5]">
                            {beneficiaries.map((b) => (
                                <tr key={b.id} className="hover:bg-zinc-50">
                                    <td className="py-4 px-6 font-bold text-sm">{b.entityName}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        {b.flag} {b.country}
                                    </td>
                                    <td className="py-4 px-6">{b.institutionName}</td>
                                    <td className="py-4 px-6 font-mono">{b.accountOrMobileNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

