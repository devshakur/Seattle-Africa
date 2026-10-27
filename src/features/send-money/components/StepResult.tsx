import { Button } from "@/components/ui/Button";
import { CheckCircle2, XCircle } from "lucide-react";
import { FlowStatus } from "../hooks/useSendMoneyFlow";

interface Props {
    status: FlowStatus;
    onReset: () => void;
}

export function StepResult({ status, onReset }: Props) {
    const isSuccess = status === "success";

    return (
        <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isSuccess ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}>
                {isSuccess ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isSuccess ? "Transfer Successful!" : "Transfer Failed"}
            </h2>

            <p className="text-gray-500 text-sm max-w-sm mb-8">
                {isSuccess
                    ? "Your funds have been successfully converted and sent to the beneficiary account. They will receive an alert shortly."
                    : "We couldn't verify your payment or process the transfer. Please check your details and try again."}
            </p>

            <div className="flex gap-4">
                <Button onClick={onReset} className="h-12 px-8 rounded-xl">
                    {isSuccess ? "Done" : "Try Again"}
                </Button>
                {isSuccess && (
                    <Button variant="outline" className="h-12 px-8 rounded-xl">
                        View Receipt
                    </Button>
                )}
            </div>
        </div>
    );
}