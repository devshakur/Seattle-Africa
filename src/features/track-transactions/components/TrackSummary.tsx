import { Card } from "@/components/ui/Card";
import { TrackedTransaction } from "../hooks/useTrackTransaction";
import { cn } from "@/libs/utils";

export function TrackSummary({ transaction }: { transaction: TrackedTransaction }) {
    return (
        <Card className="p-6 md:p-8 bg-gray-50/50 border-gray-200 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-gray-200">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Amount Sent</p>
                    <h2 className="text-3xl font-bold text-gray-900">{transaction.amount}</h2>
                </div>
                <div className="text-left md:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Status</p>
                    <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border",
                        transaction.status === "Completed" ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300"
                    )}>
                        {transaction.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                <div>
                    <p className="text-gray-500 mb-1">Transaction ID</p>
                    <p className="font-bold text-gray-900">{transaction.id}</p>
                </div>
                <div>
                    <p className="text-gray-500 mb-1">Date & Time</p>
                    <p className="font-medium text-gray-900">{transaction.date}</p>
                </div>
                <div>
                    <p className="text-gray-500 mb-1">Recipient</p>
                    <p className="font-semibold text-gray-900">{transaction.recipient}</p>
                </div>
                <div>
                    <p className="text-gray-500 mb-1">Bank</p>
                    <p className="font-medium text-gray-900">{transaction.bank}</p>
                </div>
            </div>
        </Card>
    );
}