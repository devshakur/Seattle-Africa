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
        date: "8/15/25",
        amount: "₦ 193,420.00",
        billing: { address: "14 Adeola Odeku St", city: "Victoria Island", state: "Lagos", zip: "101241", mobile: "+234-803-433-4375" },
        shipping: { address: "14 Adeola Odeku St", city: "Victoria Island", state: "Lagos", zip: "101241", mobile: "+234-803-433-4375" },
    },
    {
        id: "TX-1002",
        customer: "Dianne Russell",
        email: "dianne@example.com",
        type: "Refund",
        status: "Declined",
        account: "•••• 0039",
        date: "2/11/25",
        amount: "₦ 193,420.00",
        billing: { address: "88 Oxford Road", city: "Rosebank", state: "Johannesburg", zip: "2196", mobile: "+27-82-555-0192" },
        shipping: { address: "88 Oxford Road", city: "Rosebank", state: "Johannesburg", zip: "2196", mobile: "+27-82-555-0192" },
    },
    {
        id: "TX-1003",
        customer: "Guy Hawkins",
        email: "guy@example.com",
        type: "Sale",
        status: "Approved",
        account: "•••• 8821",
        date: "9/02/25",
        amount: "₦ 684,000.00",
        billing: { address: "Kenyatta Ave", city: "Nairobi", state: "Nairobi County", zip: "00100", mobile: "+254-712-555-0143" },
        shipping: { address: "Kenyatta Ave", city: "Nairobi", state: "Nairobi County", zip: "00100", mobile: "+254-712-555-0143" },
    },
    {
        id: "TX-1004",
        customer: "Esther Howard",
        email: "esther@example.com",
        type: "Sale",
        status: "Approved",
        account: "•••• 1122",
        date: "10/15/25",
        amount: "₦ 136,785.00",
        billing: { address: "Independence Ave", city: "Accra", state: "Greater Accra", zip: "GA-039", mobile: "+233-24-555-0177" },
        shipping: { address: "Independence Ave", city: "Accra", state: "Greater Accra", zip: "GA-039", mobile: "+233-24-555-0177" },
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
