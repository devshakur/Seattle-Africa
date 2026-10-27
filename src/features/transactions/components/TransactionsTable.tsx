import { Card } from "@/components/ui/Card";
import { Transaction } from "../hooks/useTransactions";

interface Props {
    transactions: Transaction[];
    onSelect: (tx: Transaction) => void;
}

export function TransactionsTable({ transactions, onSelect }: Props) {
    return (
        <Card className="overflow-hidden">
            <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Transactions</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium">Customer ID</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Account Data</th>
                            <th className="px-6 py-4 font-medium">Transaction Date</th>
                            <th className="px-6 py-4 font-medium text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr
                                key={tx.id}
                                onClick={() => onSelect(tx)}
                                className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors last:border-0"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${tx.status === 'Approved' ? 'bg-black' : 'bg-gray-400'}`}>
                                            {tx.customer.charAt(0)}
                                        </div>
                                        <span className="font-medium text-gray-900">{tx.customer}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{tx.type}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${tx.status === "Approved" ? "bg-gray-100 text-black border border-gray-200" : "bg-white text-gray-500 border border-gray-200"
                                        }`}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">{tx.account}</td>
                                <td className="px-6 py-4 text-xs">{tx.date}</td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900">{tx.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}