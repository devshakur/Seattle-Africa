export type NotificationCategory = "all" | "transfers" | "security" | "vouchers" | "system";

export interface NotificationItem {
    id: string;
    category: "transfers" | "security" | "vouchers" | "system";
    title: string;
    description: string;
    timestamp: string;
    date: string;
    read: boolean;
    reference?: string;
    amount?: string;
    channel?: string;
    location?: string;
    device?: string;
    voucherCode?: string;
    actionLabel?: string;
    actionHref?: string;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
    {
        id: "notif-1",
        category: "transfers",
        title: "Transfer Delivered • Chioma Adeleke",
        description: "Your cross-border transfer of ₦1,824,480.00 has been successfully cleared and deposited to GTBank Nigeria.",
        timestamp: "5 mins ago",
        date: "Nov 03, 2026 • 23:25",
        read: false,
        reference: "TRX-8921-NGN",
        amount: "₦1,824,480.00",
        channel: "PAPSS Instant Interbank",
        actionLabel: "View in Transactions",
        actionHref: "/transactions",
    },
    {
        id: "notif-2",
        category: "security",
        title: "Security: New Device Sign-in",
        description: "An authorized sign-in was detected from Chrome on macOS in Lagos, Nigeria. If this was not you, lock your account immediately.",
        timestamp: "45 mins ago",
        date: "Nov 03, 2026 • 22:45",
        read: false,
        location: "Lagos, Nigeria (IP: 102.89.41.22)",
        device: "Chrome v130 on macOS (Apple Silicon)",
        reference: "SEC-LOG-9402",
        actionLabel: "Security Settings",
        actionHref: "/settings",
    },
    {
        id: "notif-3",
        category: "vouchers",
        title: "Promo: Zero-Fee Transfer Voucher",
        description: "You have unlocked 100% off FX settlement fees for your next cross-border transfer up to ₦7,600,000.",
        timestamp: "2 hours ago",
        date: "Nov 03, 2026 • 21:10",
        read: false,
        voucherCode: "SETTLEFREE",
        reference: "VOUCHER-FX-01",
        actionLabel: "Use in Send Money",
        actionHref: "/send-money",
    },
    {
        id: "notif-4",
        category: "transfers",
        title: "Incoming Liquidity Settlement",
        description: "Pan-African settlement transaction #TRX-9982 is clearing through the central bank correspondent network.",
        timestamp: "4 hours ago",
        date: "Nov 03, 2026 • 19:30",
        read: true,
        reference: "TRX-9982-ZAR",
        amount: "R 24,500.00",
        channel: "Standard Bank Treasury Clearing",
        actionLabel: "Track Transaction",
        actionHref: "/track-transaction",
    },
    {
        id: "notif-5",
        category: "transfers",
        title: "M-Pesa Mobile Money Received",
        description: "Abdulshakur Dauda sent KSh 45,000.00 to your Kenyan shilling digital treasury wallet.",
        timestamp: "Yesterday • 14:12",
        date: "Nov 02, 2026 • 14:12",
        read: true,
        reference: "MPESA-984129",
        amount: "KSh 45,000.00",
        channel: "Safaricom M-Pesa",
        actionLabel: "View Transaction",
        actionHref: "/transactions",
    },
    {
        id: "notif-6",
        category: "system",
        title: "KYC Tier 2 Verification Approved",
        description: "Your corporate and signatory documentation has been verified. Daily single-transfer limits increased to $50,000 USD.",
        timestamp: "Nov 01, 2026",
        date: "Nov 01, 2026 • 09:00",
        read: true,
        reference: "KYC-APP-819",
        actionLabel: "Account Limits",
        actionHref: "/settings",
    },
    {
        id: "notif-7",
        category: "transfers",
        title: "FX Live Market Alert: KES / NGN",
        description: "Kenyan Shilling to Nigerian Naira interbank rate moved +0.42% today. Great time to initiate East Africa settlements.",
        timestamp: "Oct 31, 2026",
        date: "Oct 31, 2026 • 16:45",
        read: true,
        reference: "FX-ALERT-390",
        actionLabel: "Send Money Now",
        actionHref: "/send-money",
    },
    {
        id: "notif-8",
        category: "security",
        title: "Two-Factor Authentication Updated",
        description: "Biometric and SMS 2FA authorization was updated successfully from your mobile device.",
        timestamp: "Oct 29, 2026",
        date: "Oct 29, 2026 • 11:20",
        read: true,
        reference: "SEC-2FA-109",
        actionLabel: "Review Security",
        actionHref: "/settings",
    },
];

