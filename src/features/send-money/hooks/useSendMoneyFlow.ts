import { useState } from "react";

export type PaymentMethod = "card" | "bank" | "mobile";

// Flow order: transfer-details -> review -> select payment method -> payment-details -> processing -> result
export type FlowStep = "transfer-details" | "review" | "select" | "payment-details" | "processing" | "result";
export type FlowStatus = "success" | "failed" | null;

export function useSendMoneyFlow() {
    const [step, setStep] = useState<FlowStep>("transfer-details");
    const [method, setMethod] = useState<PaymentMethod>("bank");
    const [status, setStatus] = useState<FlowStatus>(null);

    // Transfer State
    const [amount, setAmount] = useState("");
    const [sendCurrency, setSendCurrency] = useState("USD");
    const [country, setCountry] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [bankName, setBankName] = useState("");

    const nextStep = () => {
        if (step === "transfer-details") setStep("review");
        else if (step === "review") setStep("select");
        else if (step === "select") setStep("payment-details");
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
        if (step === "review") setStep("transfer-details");
        else if (step === "select") setStep("review");
        else if (step === "payment-details") setStep("select");
    };

    const resetFlow = () => {
        setStep("transfer-details");
        setStatus(null);
        setAmount("");
        setSendCurrency("USD");
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
        amount, setAmount,
        sendCurrency, setSendCurrency,
        country, setCountry,
        accountNumber, setAccountNumber,
        accountName, setAccountName,
        bankName, setBankName,
    };
}
