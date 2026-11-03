"use client";

import { ArrowRight, CreditCard, Landmark, Smartphone, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { sendCurrencies, flagSrc } from "../data";
import { PaymentMethod } from "../hooks/useSendMoneyFlow";

interface Props {
    amount: string;
    setAmount: (val: string) => void;
    sendCurrency: string;
    setSendCurrency: (val: string) => void;
    method: PaymentMethod;
    setMethod: (val: PaymentMethod) => void;
    cardNumber: string;
    setCardNumber: (val: string) => void;
    cardExpiry: string;
    setCardExpiry: (val: string) => void;
    cardCvv: string;
    setCardCvv: (val: string) => void;
    senderPhone: string;
    setSenderPhone: (val: string) => void;
    onNext: () => void;
}

const currencyOptions = sendCurrencies.map((c) => {
    // Map currency code to country code for flag
    const iso = c.code === "NGN" ? "ng" :
        c.code === "ZAR" ? "za" :
        c.code === "KES" ? "ke" :
        c.code === "GHS" ? "gh" :
        c.code === "XOF" ? "sn" :
        c.code === "EGP" ? "eg" :
        c.code === "RWF" ? "rw" :
        c.code === "UGX" ? "ug" : "ng";

    return {
        value: c.code,
        label: c.code,
        description: c.name,
        leadingNode: (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={flagSrc(iso)}
                alt=""
                width={20}
                height={14}
                className="h-3.5 w-5 rounded-[2px] object-cover border border-gray-200"
            />
        ),
    };
});

export function StepSendingFrom({
    amount,
    setAmount,
    sendCurrency,
    setSendCurrency,
    method,
    setMethod,
    cardNumber,
    setCardNumber,
    cardExpiry,
    setCardExpiry,
    cardCvv,
    setCardCvv,
    senderPhone,
    setSenderPhone,
    onNext,
}: Props) {
    const num = parseFloat(amount.replace(/,/g, "")) || 0;
    const isValid = num > 0;

    return (
        <div className="mx-auto w-full max-w-xl animate-in fade-in duration-300">
            {/* Header */}
            <div className="mb-6 text-left">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-black bg-zinc-100 px-2.5 py-1 rounded-full">
                    Step 1 of 3
                </span>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                    Where are you sending from?
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    Enter the amount and select your preferred payment source.
                </p>
            </div>

            <div className="rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-6">
                {/* Amount & Currency input */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-black tracking-tight">
                        Transfer Amount
                    </label>
                    <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/70 p-2 focus-within:border-black focus-within:bg-white focus-within:ring-1 focus-within:ring-black transition-all">
                        <div className="flex-1 px-2">
                            <span className="text-[10px] uppercase font-mono text-gray-400 block">You send</span>
                            <input
                                type="text"
                                inputMode="decimal"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                                placeholder="0.00"
                                className="w-full bg-transparent font-mono tabular-nums text-2xl font-bold text-gray-950 outline-none"
                            />
                        </div>

                        {/* Currency Selector */}
                        <div className="w-36 shrink-0">
                            <Select
                                value={sendCurrency}
                                onChange={(v) => v && setSendCurrency(v)}
                                options={currencyOptions}
                                triggerClassName="h-11 rounded-lg px-2.5 text-xs font-bold"
                                panelClassName="min-w-[210px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-black tracking-tight">
                        Payment Method
                    </label>

                    <div className="grid grid-cols-3 gap-2.5">
                        {[
                            { id: "bank", label: "Bank Transfer", icon: Landmark, note: "Instant clearing" },
                            { id: "card", label: "Debit Card", icon: CreditCard, note: "Visa & Mastercard" },
                            { id: "mobile", label: "Mobile Money", icon: Smartphone, note: "M-Pesa / MoMo" },
                        ].map((item) => {
                            const isSelected = method === item.id;
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setMethod(item.id as PaymentMethod)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                                        isSelected
                                            ? "border-black bg-black text-white shadow-sm"
                                            : "border-gray-200 bg-white hover:border-gray-300 text-gray-800"
                                    }`}
                                >
                                    <Icon size={18} className="mb-1.5" />
                                    <span className="text-xs font-bold">{item.label}</span>
                                    <span
                                        className={`text-[10px] mt-0.5 ${
                                            isSelected ? "text-gray-300" : "text-gray-400"
                                        }`}
                                    >
                                        {item.note}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Sub-inputs based on payment method */}
                {method === "card" && (
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                        <Input
                            id="send-card-num"
                            label="Card Number"
                            placeholder="4123 •••• •••• 9821"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                id="send-card-exp"
                                label="Expires"
                                placeholder="MM/YY"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                            />
                            <Input
                                id="send-card-cvv"
                                label="CVV"
                                placeholder="123"
                                type="password"
                                maxLength={4}
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {method === "mobile" && (
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                        <Input
                            id="send-mobile-num"
                            label="Your Mobile Money Number"
                            placeholder="e.g. 0801 234 5678"
                            value={senderPhone}
                            onChange={(e) => setSenderPhone(e.target.value)}
                        />
                        <p className="mt-1.5 text-[11px] text-gray-500">
                            You will receive an STK push prompt on this phone to authorize payment.
                        </p>
                    </div>
                )}

                {method === "bank" && (
                    <div className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50 text-xs text-gray-600">
                        <Zap size={14} className="text-black shrink-0" />
                        <span>Direct account debit via secured Pan-African interbank clearing.</span>
                    </div>
                )}

                {/* Continue CTA */}
                <Button
                    type="button"
                    disabled={!isValid}
                    onClick={onNext}
                    className="w-full h-11 text-sm font-semibold rounded-xl bg-black text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                >
                    <span>Continue to Recipient</span>
                    <ArrowRight size={15} />
                </Button>
            </div>
        </div>
    );
}

