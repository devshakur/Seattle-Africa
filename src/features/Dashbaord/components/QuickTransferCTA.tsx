"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCurrency } from "@/features/currency/CurrencyContext";
import { Select, SelectOption } from "@/components/ui/Select";
import { useAfricanLiveRates, formatFxRate, AfricanRateItem } from "../hooks/useAfricanLiveRates";

const compactTrigger = "h-9 rounded-lg px-2.5 text-xs font-bold";
const compactPanel = "min-w-[210px]";

function toOption(r: AfricanRateItem): SelectOption {
    return {
        value: r.code,
        label: r.code,
        description: r.country,
        leadingNode: (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={r.flagSrc}
                alt=""
                width={20}
                height={14}
                className="h-3.5 w-5 rounded-[2px] object-cover border border-gray-200"
            />
        ),
    };
}

export function QuickTransferCTA() {
    const { currency } = useCurrency();
    const { rates } = useAfricanLiveRates();

    const [sourceOverride, setSourceOverride] = useState<string | null>(null);
    const [targetOverride, setTargetOverride] = useState("GHS");
    const [sendAmount, setSendAmount] = useState("1000");

    const source = sourceOverride ?? currency.code;
    const target = targetOverride === source ? (source === "NGN" ? "GHS" : "NGN") : targetOverride;

    const sourceRate = rates.find((r) => r.code === source)?.rate;
    const targetRate = rates.find((r) => r.code === target)?.rate;
    const rate = sourceRate && targetRate ? targetRate / sourceRate : null;

    const amount = parseFloat(sendAmount) || 0;
    const receiveAmount = rate
        ? (amount * rate).toLocaleString("en-US", { maximumFractionDigits: 2 })
        : "--";

    return (
        <Card className="mb-6 p-5 sm:p-6 border border-gray-200/90 bg-white shadow-xs">
            <h3 className="text-sm font-bold text-gray-950 mb-4">Send money</h3>

            <div className="space-y-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3 focus-within:border-black focus-within:bg-white transition-colors">
                    <label htmlFor="quick-send-amount" className="block text-xs text-gray-500 mb-1">
                        You send
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            id="quick-send-amount"
                            type="text"
                            inputMode="decimal"
                            value={sendAmount}
                            onChange={(e) => setSendAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                            placeholder="0.00"
                            className="w-full bg-transparent font-mono tabular-nums text-lg font-bold text-gray-950 outline-none"
                        />
                        <div className="w-32 shrink-0">
                            <Select
                                value={source}
                                onChange={(v) => v && setSourceOverride(v)}
                                options={rates.length ? rates.map(toOption) : [{ value: source, label: source }]}
                                searchable
                                searchPlaceholder="Search currency"
                                triggerClassName={compactTrigger}
                                panelClassName={compactPanel}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3">
                    <span className="block text-xs text-gray-500 mb-1">They get</span>
                    <div className="flex items-center gap-3">
                        <div className="w-full truncate font-mono tabular-nums text-lg font-bold text-gray-950">
                            {receiveAmount}
                        </div>
                        <div className="w-32 shrink-0">
                            <Select
                                value={target}
                                onChange={(v) => v && setTargetOverride(v)}
                                options={
                                    rates.length
                                        ? rates.filter((r) => r.code !== source).map(toOption)
                                        : [{ value: target, label: target }]
                                }
                                searchable
                                searchPlaceholder="Search currency"
                                triggerClassName={compactTrigger}
                                panelClassName={compactPanel}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-3 text-xs text-gray-500 font-mono tabular-nums">
                {rate ? `1 ${source} = ${formatFxRate(rate)} ${target}` : "Loading rate..."}
            </p>

            <Link
                href={`/send-money?source=${source}&target=${target}&amount=${amount}`}
                className="block mt-4"
            >
                <Button
                    variant="primary"
                    className="w-full h-11 text-sm font-semibold rounded-xl bg-black text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                >
                    <span>Continue</span>
                    <ArrowRight size={15} />
                </Button>
            </Link>
        </Card>
    );
}
