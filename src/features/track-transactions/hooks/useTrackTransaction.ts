import { useState } from "react";

export type TrackStatus = "idle" | "loading" | "success" | "error";

export interface TimelineEvent {
    title: string;
    description: string;
    timestamp: string;
    status: "completed" | "current" | "pending";
}

export interface TrackedTransaction {
    id: string;
    amount: string;
    recipient: string;
    bank: string;
    date: string;
    status: "Completed" | "Processing" | "Pending";
    timeline: TimelineEvent[];
}

const mockData: Record<string, TrackedTransaction> = {
    "SET-89210": {
        id: "SET-89210",
        amount: "$500.00",
        recipient: "Amina Yusuf",
        bank: "Guaranty Trust Bank (GTB)",
        date: "Oct 24, 2025 • 10:30 AM",
        status: "Completed",
        timeline: [
            { title: "Transfer Initiated", description: "You started the transfer.", timestamp: "10:30 AM", status: "completed" },
            { title: "Payment Confirmed", description: "Your payment was verified.", timestamp: "10:35 AM", status: "completed" },
            { title: "Processing at Partner Bank", description: "Funds are being routed to GTB.", timestamp: "10:40 AM", status: "completed" },
            { title: "Funds Delivered", description: "Recipient has received the funds.", timestamp: "10:45 AM", status: "completed" },
        ],
    },
    "SET-89211": {
        id: "SET-89211",
        amount: "$250.00",
        recipient: "John Doe",
        bank: "Access Bank",
        date: "Oct 25, 2025 • 02:15 PM",
        status: "Processing",
        timeline: [
            { title: "Transfer Initiated", description: "You started the transfer.", timestamp: "02:15 PM", status: "completed" },
            { title: "Payment Confirmed", description: "Your payment was verified.", timestamp: "02:20 PM", status: "completed" },
            { title: "Processing at Partner Bank", description: "Funds are being routed to Access Bank.", timestamp: "02:25 PM", status: "current" },
            { title: "Funds Delivered", description: "Waiting for partner bank confirmation.", timestamp: "-", status: "pending" },
        ],
    },
};

export function useTrackTransaction() {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState<TrackStatus>("idle");
    const [transaction, setTransaction] = useState<TrackedTransaction | null>(null);
    const [error, setError] = useState("");

    const searchTransaction = () => {
        if (!query.trim()) return;

        setStatus("loading");
        setError("");
        setTransaction(null);

        // Simulate API call
        setTimeout(() => {
            const result = mockData[query.toUpperCase()];
            if (result) {
                setTransaction(result);
                setStatus("success");
            } else {
                setError("Transaction not found. Please check the ID and try again.");
                setStatus("error");
            }
        }, 1500);
    };

    const resetSearch = () => {
        setQuery("");
        setStatus("idle");
        setTransaction(null);
        setError("");
    };

    return {
        query,
        setQuery,
        status,
        transaction,
        error,
        searchTransaction,
        resetSearch,
    };
}