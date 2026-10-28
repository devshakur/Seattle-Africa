import {
    CreditCard,
    Building2,
    Smartphone,
    LockKeyhole,
    Check,
    ArrowRight,
    ArrowLeft,
    Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PaymentMethod } from "../hooks/useSendMoneyFlow";
import { cn } from "@/libs/utils";

interface Props {
    selected: PaymentMethod;
    onSelect: (method: PaymentMethod) => void;
    onNext: () => void;
    onBack: () => void;
    amount?: string;
    sendCurrency?: string;
    accountName?: string;
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
    amount,
    sendCurrency,
    accountName,
}: Props) {
    const selectedMethod = methods.find((m) => m.id === selected);

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col animate-in fade-in duration-300">

            {/* Wrapper Card */}
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 sm:p-10">

                {/* Heading */}
                <div className="mb-8">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                        Send money <span className="mx-1 text-gray-300">/</span> Payment method
                    </p>

                    <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                        Choose payment method
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
                        {amount && accountName ? (
                            <>
                                Select how you’d like to fund your transfer of{" "}
                                <strong className="text-gray-900 font-semibold">
                                    {sendCurrency === "GBP" ? "£" : sendCurrency === "EUR" ? "€" : "$"}{amount} {sendCurrency}
                                </strong>{" "}
                                to <strong className="text-gray-900 font-semibold">{accountName}</strong>, then click Continue.
                            </>
                        ) : (
                            "Select your preferred payment method below, then click Continue to proceed."
                        )}
                    </p>
                </div>

                {/* Payment methods: Clicking selects the method without navigating */}
                <div
                    role="radiogroup"
                    aria-label="Choose payment method"
                    className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3"
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
                                    "relative flex min-h-[200px] flex-col items-start rounded-2xl border p-5 text-left transition-all duration-200 cursor-pointer group",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2",
                                    isSelected
                                        ? "border-black bg-gray-50/90 shadow-xs ring-2 ring-black"
                                        : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-xs"
                                )}
                            >
                                {/* Badge if available */}
                                {method.badge && (
                                    <span className="absolute top-4 right-14 text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-full">
                                        {method.badge}
                                    </span>
                                )}

                                {/* Icon and selection indicator */}
                                <div className="flex w-full items-center justify-between">
                                    <div
                                        className={cn(
                                            "flex size-11 items-center justify-center rounded-xl transition-colors",
                                            isSelected
                                                ? "bg-gray-900 text-white"
                                                : "bg-gray-100 text-gray-700 group-hover:bg-gray-200"
                                        )}
                                    >
                                        <Icon size={21} strokeWidth={1.8} />
                                    </div>

                                    <span
                                        className={cn(
                                            "flex size-5 items-center justify-center rounded-full border transition-colors",
                                            isSelected
                                                ? "border-black bg-black text-white"
                                                : "border-gray-300 text-transparent group-hover:border-gray-400"
                                        )}
                                    >
                                        <Check size={12} strokeWidth={3} />
                                    </span>
                                </div>

                                {/* Method information */}
                                <h3 className="mt-5 text-base font-bold text-gray-950">
                                    {method.title}
                                </h3>

                                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                    {method.description}
                                </p>

                                {/* Processing time & Selection state */}
                                <div className="mt-auto flex items-center justify-between w-full pt-4 text-xs font-semibold text-gray-500">
                                    <span className="flex items-center gap-1.5">
                                        <Clock3 size={13} />
                                        {method.speed}
                                    </span>
                                    {isSelected && (
                                        <span className="text-[11px] font-bold text-black flex items-center gap-1">
                                            Selected
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Security information */}
                <div className="mt-8 flex items-center justify-start gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4">
                    <LockKeyhole
                        size={18}
                        className="shrink-0 text-gray-700"
                    />

                    <div className="text-left">
                        <p className="text-xs font-bold text-gray-900">
                            Your payment is protected
                        </p>
                        <p className="text-xs leading-5 text-gray-600">
                            Your payment details are processed with 256-bit bank-grade encryption.
                        </p>
                    </div>
                </div>

                {/* Actions: Navigation ONLY happens when clicking Continue */}
                <div className="mt-8 flex items-center justify-between gap-3 border-t border-gray-100 pt-6">
                    <Button
                        variant="outline"
                        onClick={onBack}
                        className="h-11 rounded-xl px-5 text-sm font-semibold text-gray-700 hover:bg-gray-100 border-gray-200"
                    >
                        <ArrowLeft size={16} className="mr-1.5" />
                        Back to Review
                    </Button>

                    <Button
                        onClick={onNext}
                        className="h-11 rounded-xl px-8 bg-black text-white hover:bg-gray-800 text-sm font-bold shadow-sm"
                    >
                        Continue
                        <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
