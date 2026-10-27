import { useState } from "react";

export type PaymentMethod = "card" | "bank" | "mobile";
export type FlowStep = "select" | "transfer-details" | "payment-details" | "processing" | "result";
export type FlowStatus = "success" | "failed" | null;

export function useSendMoneyFlow() {
    const [step, setStep] = useState<FlowStep>("select");
    const [method, setMethod] = useState<PaymentMethod>("bank");
    const [status, setStatus] = useState<FlowStatus>(null);

    // New Transfer State
    const [amount, setAmount] = useState("");
    const [country, setCountry] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [bankName, setBankName] = useState("");

    const nextStep = () => {
        if (step === "select") setStep("transfer-details");
        else if (step === "transfer-details") setStep("payment-details");
        else if (step === "payment-details") {
            setStep("processing");
            setTimeout(() => {
                const isSuccess = Math.random() > 0.2;
                setStatus(isSuccess ? "success" : "failed");
                setStep("result");
            }, 2500);
        }
    };

    const prevStep = () => {
        if (step === "transfer-details") setStep("select");
        else if (step === "payment-details") setStep("transfer-details");
    };

    const resetFlow = () => {
        setStep("select");
        setStatus(null);
        setAmount("");
        setCountry("");
        setAccountNumber("");
        setAccountName("");
        setBankName("");
    };

    return {
        step,
        method,
        setMethod,
        status,
        nextStep,
        prevStep,
        resetFlow,
        // Transfer details
        amount, setAmount,
        country, setCountry,
        accountNumber, setAccountNumber,
        accountName, setAccountName,
        bankName, setBankName,
    };
}