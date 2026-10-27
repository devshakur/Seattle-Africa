import { Button } from "@/components/ui/Button";
import { PaymentMethod } from "../hooks/useSendMoneyFlow";
import { Copy, Info, CreditCard, Smartphone } from "lucide-react";

interface Props {
    method: PaymentMethod;
    amount: string;
    fee: string;
    total: string;
    accountName: string;
    bankName: string;
    onNext: () => void;
    onBack: () => void;
}

export function StepPaymentDetails({
    method, amount, fee, total, accountName, bankName, onNext, onBack
}: Props) {
    return (
        <div className="w-full max-w-xl flex flex-col items-center animate-in slide-in-from-right-8 duration-300">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {method === "bank" ? "Complete your payment" : "Enter Payment Details"}
                </h1>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                    {method === "bank"
                        ? `Please transfer $${total} to the corporate account below to fund your transfer to ${accountName}.`
                        : `Please provide your payment details below to complete the $${total} transfer.`}
                </p>
            </div>

            {/* Summary Box */}
            <div className="w-full bg-gray-50 rounded-xl p-4 mb-6 flex justify-between items-center">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Recipient</p>
                    <p className="text-sm font-semibold text-gray-900">{accountName}</p>
                    <p className="text-xs text-gray-500">{bankName}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Total to pay</p>
                    <p className="text-lg font-bold text-gray-900">${total}</p>
                </div>
            </div>

            {method === "bank" && (
                <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                                <p className="font-semibold text-gray-900">Guaranty Trust Bank (GTB)</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Account Name</p>
                                <p className="font-semibold text-gray-900">Settle Africa Ltd</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Account Number</p>
                                <p className="text-xl font-bold tracking-wider text-gray-900">0123456789</p>
                            </div>
                            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors flex items-center gap-2 text-sm font-medium">
                                <Copy size={16} /> Copy
                            </button>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-4 border-t border-blue-100 flex items-start gap-3">
                        <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-blue-800 leading-relaxed">
                            Please use your Transaction ID <strong className="font-bold">#SET-{Math.floor(Math.random() * 100000)}</strong> as the transfer narration. Your beneficiary will receive funds within 5-10 minutes of confirmation.
                        </p>
                    </div>
                </div>
            )}

            {/* ... (Keep Card and Mobile money forms as previously written, just replacing static amounts with dynamic ones where necessary) ... */}

            <div className="flex gap-4 w-full">
                <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
                    Back
                </Button>
                <Button onClick={onNext} className="flex-1 h-12 rounded-xl">
                    {method === "bank" ? "I have sent the money" : "Pay Now"}
                </Button>
            </div>
        </div>
    );
}