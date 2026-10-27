import { useState, useMemo } from "react";

export type FlowStep = 1 | 2 | 3;

export function useOnboardingFlow() {
    const [step, setStep] = useState<FlowStep>(1);
    const [amount, setAmount] = useState("");
    const [country, setCountry] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [isFetchingAccount, setIsFetchingAccount] = useState(false);
    const [error, setError] = useState("");

    // Live Fee Calculation (Simulated: $2 flat fee for transfers over $10)
    const fee = useMemo(() => {
        const numAmount = parseFloat(amount) || 0;
        return numAmount > 10 ? 2.00 : 0;
    }, [amount]);

    const total = useMemo(() => {
        const numAmount = parseFloat(amount) || 0;
        return numAmount + fee;
    }, [amount, fee]);

    const nextStep = () => {
        if (step < 3) setStep((prev) => (prev + 1) as FlowStep);
    };

    const prevStep = () => {
        if (step > 1) setStep((prev) => (prev - 1) as FlowStep);
    };

    const verifyAccount = async () => {
        if (accountNumber.length < 10 || !bankName) return;

        setIsFetchingAccount(true);
        setError("");
        setAccountName("");

        // Simulate API call for account resolution
        setTimeout(() => {
            if (accountNumber === "0000000000") {
                setError("Account not found. Please check the number.");
            } else {
                // Mock successful resolution
                setAccountName("Amina Yusuf");
            }
            setIsFetchingAccount(false);
        }, 1500);
    };

    const reset = () => {
        setStep(1);
        setAmount("");
        setCountry("");
        setBankName("");
        setAccountNumber("");
        setAccountName("");
        setError("");
    };

    return {
        step, nextStep, prevStep, reset,
        amount, setAmount,
        country, setCountry,
        bankName, setBankName,
        accountNumber, setAccountNumber,
        accountName, verifyAccount, isFetchingAccount, error,
        fee, total
    };
}