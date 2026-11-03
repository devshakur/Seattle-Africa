"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { countries, sendCurrencies, flagSrc } from "../data";

interface Props {
    amount: string;
    sendCurrency: string;
    country: string;
    targetCurrency: string;
    accountName: string;
    recipientGets: number;
}

const STAGES = [
    { title: "Verifying payment source", desc: "Securing authorization from your bank/wallet" },
    { title: "Clearing via Pan-African rail", desc: "Routing funds through instant settlement" },
    { title: "Depositing to beneficiary", desc: "Crediting recipient bank account" },
];

export function StepProcessing({
    amount,
    sendCurrency,
    country,
    targetCurrency,
    accountName,
    recipientGets,
}: Props) {
    const [currentStage, setCurrentStage] = useState(0);

    // Advance stages over the processing window
    useEffect(() => {
        const timer1 = setTimeout(() => setCurrentStage(1), 1300);
        const timer2 = setTimeout(() => setCurrentStage(2), 2700);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    const sourceIso =
        sendCurrency === "NGN" ? "ng" :
        sendCurrency === "ZAR" ? "za" :
        sendCurrency === "KES" ? "ke" :
        sendCurrency === "GHS" ? "gh" :
        sendCurrency === "XOF" ? "sn" :
        sendCurrency === "EGP" ? "eg" :
        sendCurrency === "RWF" ? "rw" :
        sendCurrency === "UGX" ? "ug" : "ng";

    const targetCountryObj = countries.find((c) => c.name === country) || countries[0];
    const targetIso = targetCountryObj.code.toLowerCase();

    return (
        <div className="mx-auto w-full max-w-lg py-4 text-center animate-in fade-in duration-300">
            {/* Header */}
            <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-black bg-zinc-100 px-3 py-1 rounded-full">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    Transaction In Motion
                </span>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                    Moving your money...
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    Your cross-border transfer is currently clearing through the interbank network.
                </p>
            </div>

            {/* Visual: Moving Money Track (Origin -> Destination) */}
            <div className="rounded-2xl border border-gray-200/90 bg-white p-6 shadow-xs mb-6">
                <div className="relative flex items-center justify-between gap-4 py-3">
                    {/* Origin Badge */}
                    <div className="flex flex-col items-center gap-2 z-10">
                        <div className="relative h-14 w-14 rounded-2xl border-2 border-black bg-white p-1 flex items-center justify-center shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={flagSrc(sourceIso)}
                                alt=""
                                className="h-8 w-11 rounded object-cover shadow-2xs"
                            />
                        </div>
                        <span className="text-xs font-bold text-gray-900">{sendCurrency}</span>
                        <span className="text-[11px] font-mono text-gray-500 tabular-nums">
                            {Number(amount).toLocaleString()}
                        </span>
                    </div>

                    {/* Animated Connecting Flow Track */}
                    <div className="relative flex-1 flex flex-col items-center justify-center px-2">
                        {/* Track line */}
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden relative">
                            <motion.div
                                className="h-full bg-black rounded-full"
                                initial={{ x: "-100%", width: "40%" }}
                                animate={{ x: "250%" }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1.6,
                                    ease: "easeInOut",
                                }}
                            />
                        </div>

                        {/* Moving Pulse Icon */}
                        <motion.div
                            className="absolute -top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-black text-white shadow-md"
                            initial={{ left: "10%" }}
                            animate={{ left: "85%" }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.6,
                                ease: "easeInOut",
                            }}
                        >
                            <Zap size={13} className="fill-white" />
                        </motion.div>

                        <span className="mt-4 text-[10px] font-mono uppercase tracking-wider text-gray-400">
                            Fast Settling
                        </span>
                    </div>

                    {/* Destination Badge */}
                    <div className="flex flex-col items-center gap-2 z-10">
                        <div className="relative h-14 w-14 rounded-2xl border-2 border-gray-200 bg-white p-1 flex items-center justify-center shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={flagSrc(targetIso)}
                                alt=""
                                className="h-8 w-11 rounded object-cover shadow-2xs"
                            />
                        </div>
                        <span className="text-xs font-bold text-gray-900">{targetCurrency}</span>
                        <span className="text-[11px] font-mono text-gray-500 tabular-nums">
                            {recipientGets.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                {/* Expected Delivery Time Badge */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-gray-500">
                        <Clock size={14} className="text-black" />
                        Expected arrival time:
                    </span>
                    <span className="font-mono font-bold text-black bg-zinc-100 px-2.5 py-1 rounded-md">
                        &lt; 90 seconds
                    </span>
                </div>
            </div>

            {/* Live Progress Stage Steps */}
            <div className="rounded-2xl border border-gray-200/90 bg-white p-5 shadow-xs text-left space-y-3">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    Live Progress
                </span>

                {STAGES.map((s, idx) => {
                    const isDone = idx < currentStage;
                    const isActive = idx === currentStage;

                    return (
                        <div
                            key={s.title}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                                isActive ? "bg-zinc-50 border border-zinc-200" : ""
                            }`}
                        >
                            <div className="mt-0.5 shrink-0">
                                {isDone ? (
                                    <CheckCircle2 size={16} className="text-black" />
                                ) : isActive ? (
                                    <span className="relative flex h-4 w-4 items-center justify-center">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-40" />
                                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-black" />
                                    </span>
                                ) : (
                                    <div className="h-4 w-4 rounded-full border border-gray-300" />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p
                                    className={`text-xs font-bold ${
                                        isActive || isDone ? "text-gray-900" : "text-gray-400"
                                    }`}
                                >
                                    {s.title}
                                </p>
                                <p className="text-[11px] text-gray-500 mt-0.5">{s.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="mt-5 text-xs text-gray-400">
                Please do not refresh or close this window while funds are in transit.
            </p>
        </div>
    );
}
