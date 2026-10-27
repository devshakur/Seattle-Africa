import { X, CreditCard, MapPin, Receipt, Calendar, User } from "lucide-react";
import { Transaction } from "../hooks/useTransactions";
import { cn } from "@/libs/utils";

interface Props {
    transaction: Transaction | null;
    onClose: () => void;
}

export function TransactionDetailsPanel({ transaction, onClose }: Props) {
    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300",
                    transaction ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Floating Panel */}
            <div
                className={cn(
                    "fixed top-4 bottom-4 right-4 w-[calc(100%-2rem)] md:w-[480px] bg-white z-50 rounded-2xl shadow-2xl border border-gray-200 transform transition-transform duration-500 ease-in-out flex flex-col overflow-hidden",
                    // Use translate-x-[calc(100%+2rem)] to fully hide it off-screen including the right margin
                    transaction ? "translate-x-0" : "translate-x-[calc(100%+2rem)]"
                )}
            >
                {transaction && (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Transaction Details</h2>
                                <p className="text-xs text-gray-500 mt-0.5">ID: {transaction.id}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">

                            {/* Hero Amount Section */}
                            <div className="text-center pb-6 border-b border-gray-100">
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Total Amount</p>
                                <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                                    {transaction.amount}
                                </h1>
                                <span className={cn(
                                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                                    transaction.status === "Approved"
                                        ? "bg-gray-900 text-white border-gray-900"
                                        : "bg-gray-100 text-gray-600 border-gray-200"
                                )}>
                                    {transaction.status}
                                </span>
                            </div>

                            {/* Transaction Metadata */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <Receipt size={16} className="text-gray-400" /> Transaction Info
                                </h3>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Type</span>
                                        <span className="font-semibold text-gray-900">{transaction.type}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Date</span>
                                        <span className="font-medium text-gray-900 flex items-center gap-1.5">
                                            <Calendar size={14} className="text-gray-400" />
                                            08/15/2019 11:26 AM
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Account</span>
                                        <span className="font-medium text-gray-900 flex items-center gap-2 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
                                            <CreditCard size={14} className="text-gray-400" />
                                            {transaction.account}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Invoice</span>
                                        <span className="font-medium text-gray-900">#91362</span>
                                    </div>
                                </div>
                            </div>

                            {/* Billing Information */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <User size={16} className="text-gray-400" /> Billing Information
                                </h3>
                                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm space-y-3 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Customer</p>
                                        <p className="font-semibold text-gray-900">{transaction.customer}</p>
                                        <p className="text-xs text-gray-500">{transaction.email}</p>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><MapPin size={12} /> Address</p>
                                        <p className="font-medium text-gray-900">{transaction.billing.address}</p>
                                        <p className="text-gray-600">{transaction.billing.city}, {transaction.billing.state} {transaction.billing.zip}</p>
                                        <p className="text-gray-600 mt-1">{transaction.billing.mobile}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            <div className="space-y-4 pb-4">
                                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-400" /> Shipping Information
                                </h3>
                                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm space-y-3 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                                        <p className="font-medium text-gray-900">{transaction.shipping.address}</p>
                                        <p className="text-gray-600">{transaction.shipping.city}, {transaction.shipping.state} {transaction.shipping.zip}</p>
                                        <p className="text-gray-600 mt-1">{transaction.shipping.mobile}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </div>
        </>
    );
}