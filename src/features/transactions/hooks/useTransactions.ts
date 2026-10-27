import { useState } from "react";

export interface Transaction {
    id: string;
    customer: string;
    email: string;
    type: string;
    status: "Approved" | "Declined" | "Refunded";
    account: string;
    date: string;
    amount: string;
    billing: {
        address: string;
        city: string;
        state: string;
        zip: string;
        mobile: string;
    };
    shipping: {
        address: string;
        city: string;
        state: string;
        zip: string;
        mobile: string;
    };
}

const mockTransactions: Transaction[] = [
    {
        id: "TX-1001",
        customer: "Leslie Alexander",
        email: "leslie@example.com",
        type: "Sale",
        status: "Approved",
        account: "•••• 5943",
        date: "8/15/17",
        amount: "$127.25",
        billing: { address: "3199 Waypack Lane", city: "Huntington Station", state: "New York", zip: "11746", mobile: "631-433-4375" },
        shipping: { address: "1801 Gordon Street", city: "Mira Loma", state: "California", zip: "91752", mobile: "951-703-9831" },
    },
    {
        id: "TX-1002",
        customer: "Dianne Russell",
        email: "dianne@example.com",
        type: "Refund",
        status: "Declined",
        account: "•••• 0039",
        date: "2/11/12",
        amount: "$127.25",
        billing: { address: "4242 Elm Street", city: "Austin", state: "Texas", zip: "73301", mobile: "512-555-0192" },
        shipping: { address: "4242 Elm Street", city: "Austin", state: "Texas", zip: "73301", mobile: "512-555-0192" },
    },
    {
        id: "TX-1003",
        customer: "Guy Hawkins",
        email: "guy@example.com",
        type: "Sale",
        status: "Approved",
        account: "•••• 8821",
        date: "9/02/23",
        amount: "$450.00",
        billing: { address: "789 Pine Ave", city: "Seattle", state: "Washington", zip: "98101", mobile: "206-555-0143" },
        shipping: { address: "789 Pine Ave", city: "Seattle", state: "Washington", zip: "98101", mobile: "206-555-0143" },
    },
    {
        id: "TX-1004",
        customer: "Esther Howard",
        email: "esther@example.com",
        type: "Sale",
        status: "Approved",
        account: "•••• 1122",
        date: "10/15/23",
        amount: "$89.99",
        billing: { address: "123 Oak Rd", city: "Miami", state: "Florida", zip: "33101", mobile: "305-555-0177" },
        shipping: { address: "123 Oak Rd", city: "Miami", state: "Florida", zip: "33101", mobile: "305-555-0177" },
    }
];

export function useTransactions() {
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

    return {
        transactions: mockTransactions,
        selectedTx,
        setSelectedTx,
    };
}