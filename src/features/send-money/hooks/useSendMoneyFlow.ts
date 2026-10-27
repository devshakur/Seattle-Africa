import { useState } from "react";

export type PaymentMethod = "card" | "bank" | "mobile";
// Added "review" to the flow steps
export type FlowStep = "select" | "transfer-details" | "review" | "payment-details" | "processing" | "result";
export type FlowStatus = "success" | "failed" | null;

export function useSendMoneyFlow() {
    const [step, setStep] = useState<FlowStep>("select");
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
        if (step === "select") setStep("transfer-details");
        else if (step === "transfer-details") setStep("review");
        else if (step === "review") setStep("payment-details");
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
        else if (step === "review") setStep("transfer-details");
        else if (step === "payment-details") setStep("review");
    };

    const resetFlow = () => {
        setStep("select");
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