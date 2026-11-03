"use client";

import { useRouter } from "next/navigation";
import { useSendMoneyFlow } from "../hooks/useSendMoneyFlow";
import { FlowLayout } from "../components/FlowLayout";
import { StepSendingFrom } from "../components/StepSendingFrom";
import { StepRecipient } from "../components/StepRecipient";
import { StepReview } from "../components/StepReview";
import { StepProcessing } from "../components/StepProcessing";
import { StepResult } from "../components/StepResult";

export function SendMoneyFlow() {
    const router = useRouter();
    const flow = useSendMoneyFlow();

    // 3-step indices:
    // 0: Sending From
    // 1: Recipient
    // 2: Review
    // 3: Processing / Result
    const stepIndex =
        flow.step === "from"
            ? 0
            : flow.step === "to"
              ? 1
              : flow.step === "review"
                ? 2
                : 3;

    return (
        <FlowLayout stepIndex={stepIndex}>
            {/* Step 1: Where are you sending from */}
            {flow.step === "from" && (
                <StepSendingFrom
                    amount={flow.amount}
                    setAmount={flow.setAmount}
                    sendCurrency={flow.sendCurrency}
                    setSendCurrency={flow.setSendCurrency}
                    method={flow.method}
                    setMethod={flow.setMethod}
                    cardNumber={flow.cardNumber}
                    setCardNumber={flow.setCardNumber}
                    cardExpiry={flow.cardExpiry}
                    setCardExpiry={flow.setCardExpiry}
                    cardCvv={flow.cardCvv}
                    setCardCvv={flow.setCardCvv}
                    senderPhone={flow.senderPhone}
                    setSenderPhone={flow.setSenderPhone}
                    onNext={flow.nextStep}
                />
            )}

            {/* Step 2: Who are you sending to */}
            {flow.step === "to" && (
                <StepRecipient
                    country={flow.country}
                    setCountry={flow.setCountry}
                    bankName={flow.bankName}
                    setBankName={flow.setBankName}
                    accountNumber={flow.accountNumber}
                    setAccountNumber={flow.setAccountNumber}
                    accountName={flow.accountName}
                    setAccountName={flow.setAccountName}
                    onNext={flow.nextStep}
                    onBack={flow.prevStep}
                />
            )}

            {/* Step 3: Review */}
            {flow.step === "review" && (
                <StepReview
                    amount={flow.amount}
                    sendCurrency={flow.sendCurrency}
                    method={flow.method}
                    country={flow.country}
                    targetCurrency={flow.targetCurrency}
                    bankName={flow.bankName}
                    accountNumber={flow.accountNumber}
                    accountName={flow.accountName}
                    exchangeRate={flow.exchangeRate}
                    feeAmount={flow.feeAmount}
                    totalToPay={flow.totalToPay}
                    recipientGets={flow.recipientGets}
                    onBack={flow.prevStep}
                    onConfirm={flow.confirmTransfer}
                />
            )}

            {/* Step 4: Processing (Animated transaction moving + expected time) */}
            {flow.step === "processing" && (
                <StepProcessing
                    amount={flow.amount}
                    sendCurrency={flow.sendCurrency}
                    country={flow.country}
                    targetCurrency={flow.targetCurrency}
                    accountName={flow.accountName}
                    recipientGets={flow.recipientGets}
                />
            )}

            {/* Result Stage (Toast already triggered on success/failure) */}
            {flow.step === "result" && (
                <StepResult
                    status={flow.status}
                    onReset={flow.resetFlow}
                    recipientName={flow.accountName}
                    amount={flow.amount}
                    sendCurrency={flow.sendCurrency}
                    recipientGets={flow.recipientGets}
                    targetCurrency={flow.targetCurrency}
                />
            )}
        </FlowLayout>
    );
}
