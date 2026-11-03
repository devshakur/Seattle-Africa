"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { countries, sendCurrencies, getRate, FEE_RATE } from "../data";
import { useAfricanLiveRates } from "@/features/Dashbaord/hooks/useAfricanLiveRates";

export type PaymentMethod = "bank" | "card" | "mobile";
export type FlowStep = "from" | "to" | "review" | "processing" | "result";
export type FlowStatus = "success" | "failed" | null;

export const PROCESSING_DURATION_MS = 4000;

export function useSendMoneyFlow() {
    const { rates: liveRatesList } = useAfricanLiveRates();

    const liveRateMap = useMemo(() => {
        const map: Record<string, number> = {};
        liveRatesList.forEach((r) => {
            map[r.code] = r.rate;
        });
        return map;
    }, [liveRatesList]);

    const [step, setStep] = useState<FlowStep>("from");
    const [status, setStatus] = useState<FlowStatus>(null);

    // Step 1: Where are you sending from
    const [amount, setAmount] = useState("1000");
    const [sendCurrency, setSendCurrency] = useState("NGN");
    const [method, setMethod] = useState<PaymentMethod>("bank");

    // Optional card/mobile fields for payment details
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [senderPhone, setSenderPhone] = useState("");

    // Step 2: Who are you sending to
    const [country, setCountry] = useState("Ghana");
    const [bankName, setBankName] = useState("GCB Bank");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");

    // URL parameter prefilling (e.g. from Dashboard Quick Transfer or Beneficiary card)
    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        const source = params.get("source");
        const target = params.get("target");
        const amt = params.get("amount");
        const benId = params.get("beneficiary");

        if (source && sendCurrencies.some((c) => c.code === source)) {
            setSendCurrency(source);
        }
        if (amt && Number(amt) > 0) {
            setAmount(amt);
        }
        if (target) {
            const foundCountry = countries.find(
                (c) => c.currency === target || c.name.toLowerCase() === target.toLowerCase()
            );
            if (foundCountry) {
                setCountry(foundCountry.name);
            }
        }
        if (benId) {
            try {
                const stored = localStorage.getItem("settle_africa_beneficiaries");
                if (stored) {
                    const bens = JSON.parse(stored);
                    const b = bens.find((item: { id: string }) => item.id === benId);
                    if (b) {
                        setAccountName(b.name);
                        setBankName(b.bank);
                        setAccountNumber(b.accountNumber);
                        const match = countries.find((c) => c.currency === b.currency);
                        if (match) setCountry(match.name);
                    }
                }
            } catch {
                // ignore
            }
        }
    }, []);

    // Active country & currency objects
    const targetCountryObj = useMemo(() => {
        return countries.find((c) => c.name === country) || countries[0];
    }, [country]);

    const targetCurrency = targetCountryObj.currency;

    // Exchange rate & calculations
    const exchangeRate = useMemo(() => {
        return getRate(sendCurrency, targetCurrency, liveRateMap);
    }, [sendCurrency, targetCurrency, liveRateMap]);

    const numAmount = parseFloat(amount.replace(/,/g, "")) || 0;
    const feeAmount = numAmount * FEE_RATE;
    const totalToPay = numAmount + feeAmount;
    const recipientGets = numAmount * exchangeRate;

    // Navigation
    const nextStep = () => {
        if (step === "from") setStep("to");
        else if (step === "to") setStep("review");
    };

    const prevStep = () => {
        if (step === "to") setStep("from");
        else if (step === "review") setStep("to");
    };

    const confirmTransfer = () => {
        setStep("processing");
        setStatus(null);

        setTimeout(() => {
            const isSuccess = Math.random() > 0.1;
            setStatus(isSuccess ? "success" : "failed");
            setStep("result");

            if (isSuccess) {
                toast.success(
                    `Transfer of ${targetCountryObj.symbol}${recipientGets.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                    })} to ${accountName || "recipient"} is successful!`
                );
            } else {
                toast.error("Transfer could not be processed. Please verify details and try again.");
            }
        }, PROCESSING_DURATION_MS);
    };

    const resetFlow = () => {
        setStep("from");
        setStatus(null);
        setAmount("1000");
        setAccountNumber("");
        setAccountName("");
    };

    return {
        step,
        status,
        // Step 1
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
        // Step 2
        country,
        setCountry,
        bankName,
        setBankName,
        accountNumber,
        setAccountNumber,
        accountName,
        setAccountName,
        // Computed values
        targetCountryObj,
        targetCurrency,
        exchangeRate,
        numAmount,
        feeAmount,
        totalToPay,
        recipientGets,
        // Flow controls
        nextStep,
        prevStep,
        confirmTransfer,
        resetFlow,
    };
}
