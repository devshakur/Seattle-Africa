import {
    CreditCard,
    Building2,
    Smartphone,
    LockKeyhole,
    Check,
    ArrowRight,
    Clock3,
    Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PaymentMethod } from "../hooks/useSendMoneyFlow";
import { cn } from "@/libs/utils";

interface Props {
    selected: PaymentMethod;
    onSelect: (method: PaymentMethod) => void;
    onNext: () => void;
    onBack: () => void;
}

const methods = [
    {
        id: "card" as PaymentMethod,
        title: "Card payment",
        description: "Pay securely with your debit or credit card.",
        providers: "Visa · Mastercard · Verve",
        icon: CreditCard,
        badge: "Fastest",
        speed: "Instant",
    },
    {
        id: "bank" as PaymentMethod,
        title: "Bank transfer",
        description: "Transfer directly from your bank account.",
        providers: "All supported banks",
        icon: Building2,
        badge: null,
        speed: "5–10 mins",
    },
    {
        id: "mobile" as PaymentMethod,
        title: "Mobile money",
        description: "Pay using your mobile money wallet.",
        providers: "M-Pesa · MTN MoMo · Airtel Money",
        icon: Smartphone,
        badge: null,
        speed: "Instant",
    },
];

export function StepSelectMethod({
    selected,
    onSelect,
    onNext,
    onBack,
}: Props) {
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col animate-in fade-in duration-300">
            {/* Heading */}
            <div className="mb-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Send money <span className="mx-1 text-gray-300">/</span> Payment
                </p>

                <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
                    Choose payment method
                </h1>

                <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500">
                    Select how you’d like to fund your transfer. You can review
                    everything before completing your payment.
                </p>
            </div>


            {/* Payment methods */}
            <div
                role="radiogroup"
                aria-label="Choose payment method"
                className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3"
            >
                {methods.map((method) => {
                    const isSelected = selected === method.id;
                    const Icon = method.icon;

                    return (
                        <button
                            key={method.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => onSelect(method.id)}
                            className={cn(
                                "relative flex min-h-[190px] flex-col items-start rounded-2xl border p-4 text-left transition-all duration-200 sm:p-5",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2",
                                isSelected
                                    ? "border-gray-900 bg-gray-50 shadow-sm"
                                    : "border-gray-200 bg-white hover:border-gray-400"
                            )}
                        >
                            {/* Icon and selection indicator */}
                            <div className="flex w-full items-center justify-between">
                                <div
                                    className={cn(
                                        "flex size-11 items-center justify-center rounded-xl",
                                        isSelected
                                            ? "bg-gray-900 text-white"
                                            : "bg-gray-100 text-gray-600"
                                    )}
                                >
                                    <Icon size={21} strokeWidth={1.8} />
                                </div>

                                <span
                                    className={cn(
                                        "flex size-5 items-center justify-center rounded-full border",
                                        isSelected
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : "border-gray-300 text-transparent"
                                    )}
                                >
                                    <Check size={12} strokeWidth={3} />
                                </span>
                            </div>

                            {/* Method information */}
                            <h3 className="mt-5 text-sm font-semibold text-gray-900">
                                {method.title}
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                {method.description}
                            </p>

                            {/* Processing time */}
                            <div className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-gray-500">
                                <Clock3 size={13} />
                                {method.speed}
                            </div>
                        </button>
                    );
                })}
            </div>


            {/* Security information */}
            <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                <LockKeyhole
                    size={18}
                    className="shrink-0 text-gray-500"
                />

                <div className="text-left">
                    <p className="text-xs font-semibold text-gray-800">
                        Your money is protected
                    </p>
                    <p className="text-xs leading-5 text-gray-500">
                        Your payment details are handled securely using encrypted connections.
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-gray-100 pt-6">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="h-11 rounded-xl px-6"
                >
                    Back
                </Button>

                <Button
                    onClick={onNext}
                    className="h-11 rounded-xl px-6"
                >
                    Continue
                    <ArrowRight size={16} className="ml-2" />
                </Button>
            </div>
        </div>
    );
}
