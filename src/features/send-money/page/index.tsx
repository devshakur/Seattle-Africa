"use client";

import { useSendMoneyFlow } from "../hooks/useSendMoneyFlow";
import { FlowLayout } from "../components/FlowLayout";
import { StepSelectMethod } from "../components/StepSelectMethod";
import { StepTransferDetails } from "../components/StepTransferDetails";
import { StepReviewTransfer } from "../components/StepReviewTransfer";
import { StepPaymentDetails } from "../components/StepPaymentDetails";
import { StepProcessing } from "../components/StepProcessing";
import { StepResult } from "../components/StepResult";

export function SendMoneyFlow() {
    const flow = useSendMoneyFlow();

    // Determine progress dot index
    const stepIndex =
        flow.step === "select" ? 0 :
            flow.step === "transfer-details" ? 1 :
                flow.step === "review" ? 1 :
                    flow.step === "payment-details" ? 2 :
                        2;

    return (
        <FlowLayout stepIndex={stepIndex}>
            {flow.step === "select" && (
                <StepSelectMethod
                    selected={flow.method}
                    onSelect={flow.setMethod}
                    onNext={flow.nextStep}
                    onBack={() => window.history.back()}
                />
            )}

            {flow.step === "transfer-details" && (
                <StepTransferDetails
                    amount={flow.amount}
                    setAmount={flow.setAmount}
                    sendCurrency={flow.sendCurrency}
                    setSendCurrency={flow.setSendCurrency}
                    country={flow.country}
                    setCountry={flow.setCountry}
                    accountNumber={flow.accountNumber}
                    setAccountNumber={flow.setAccountNumber}
                    accountName={flow.accountName}
                    setAccountName={flow.setAccountName}
                    bankName={flow.bankName}
                    setBankName={flow.setBankName}
                    onNext={flow.nextStep}
                    onBack={flow.prevStep}
                />
            )}

            {flow.step === "review" && (
                <StepReviewTransfer
                    amount={flow.amount}
                    sendCurrency={flow.sendCurrency}
                    country={flow.country}
                    bankName={flow.bankName}
                    accountNumber={flow.accountNumber}
                    accountName={flow.accountName}
                    onNext={flow.nextStep}
                    onBack={flow.prevStep}
                />
            )}

            {flow.step === "payment-details" && (
                <StepPaymentDetails
                    method={flow.method}
                    amount={flow.amount}
                    sendCurrency={flow.sendCurrency}
                    fee="2.00"
                    total={(parseFloat(flow.amount) + 2).toFixed(2)}
                    accountName={flow.accountName}
                    bankName={flow.bankName}
                    country={flow.country} // <-- FIXED: Added missing country prop here
                    onNext={flow.nextStep}
                    onBack={flow.prevStep}
                />
            )}

            {flow.step === "processing" && <StepProcessing />}

            {flow.step === "result" && (
                <StepResult
                    status={flow.status}
                    onReset={flow.resetFlow}
                />
            )}
        </FlowLayout>
    );
}