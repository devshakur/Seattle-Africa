"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export type AccountMode = "personal" | "business";

export type TransferType = "single" | "batch";
export type PassThroughStatus =
    | "completed"
    | "clearing"
    | "pending_approval"
    | "source_debited";

export interface CorporateTransferItem {
    id: string;
    reference: string;
    timestamp: string;
    createdAtIso: string;
    type: TransferType;
    beneficiaryName: string;
    beneficiarySubtext: string;
    corridorCountry: string;
    corridorFlag: string;
    currencyCode: string;
    currencySymbol: string;
    fxRateToUsd: number;
    amountUsd: number;
    amountLocal: number;
    feeUsd: number;
    fundingSourceId: string;
    fundingSourceName: string;
    fundingSourceRail: string;
    payoutPartnerRail: string;
    status: PassThroughStatus;
    initiatedBy: string;
    approvedBy?: string;
    recipientCount?: number;
    clearingStage: 1 | 2 | 3;
}

export interface CorporateFundingSource {
    id: string;
    institutionName: string;
    accountLabel: string;
    maskedNumber: string;
    type: "corporate_bank" | "corporate_card";
    rail: string;
    currency: string;
    dailyLimitUsd: number;
    usedTodayUsd: number;
    feePercent: number;
    settlementSpeed: string;
    mandateRef: string;
    verified: boolean;
}

export type TeamRole = "Admin" | "Finance/Maker" | "Approver/Checker";
export type TeamMemberStatus = "Active" | "Pending Invite" | "Suspended";

export interface GranularPermissions {
    initiateSingleTransfers: boolean;
    uploadBatchFiles: boolean;
    approveUpTo50k: boolean;
    approveUnlimitedBatch: boolean;
    manageBeneficiariesTax: boolean;
    manageFundingSources: boolean;
    manageTeamSecurity: boolean;
}

export interface TeamMember {
    id: string;
    fullName: string;
    initials: string;
    email: string;
    department: string;
    role: TeamRole;
    status: TeamMemberStatus;
    authorizationLimitUsd: number | "Unlimited";
    twoFactorEnabled: boolean;
    lastActive: string;
    permissions: GranularPermissions;
}

export type BeneficiaryCategory = "Vendor" | "Contractor";
export type PayoutRailType = "Local Bank" | "Mobile Money";
export type TaxVerificationStatus = "TIN Verified" | "WHT Exempt" | "VAT Registered" | "Pending Tax Docs";

export interface CorporateBeneficiary {
    id: string;
    entityName: string;
    initials: string;
    category: BeneficiaryCategory;
    registrationNumber: string;
    country: string;
    flag: string;
    currencyCode: string;
    currencySymbol: string;
    payoutMethod: PayoutRailType;
    institutionName: string;
    routingOrSortCode: string;
    accountOrMobileNumber: string;
    taxIdNumber: string;
    taxTags: TaxVerificationStatus[];
    contactEmail: string;
    volume30dUsd: number;
    lastPaidDate: string;
    verified: boolean;
}

export interface BatchRowItem {
    id: string;
    rowNumber: number;
    recipientName: string;
    category: BeneficiaryCategory;
    country: string;
    flag: string;
    currencyCode: string;
    currencySymbol: string;
    payoutMethod: PayoutRailType;
    institutionName: string;
    routingCode: string;
    accountNumber: string;
    amountUsd: number;
    amountLocal: number;
    fxRate: number;
    taxReference: string;
    invoiceRef: string;
    errors: string[];
}

export type CorporateNotificationCategory = "all" | "transfers" | "approvals" | "security";

export interface CorporateNotificationItem {
    id: string;
    category: "transfers" | "approvals" | "security";
    title: string;
    description: string;
    timestamp: string;
    date: string;
    read: boolean;
    reference?: string;
    amountUsd?: number;
    amountLocal?: string;
    beneficiaryName?: string;
    actionLabel?: string;
    actionHref?: string;
}

export const INITIAL_CORPORATE_NOTIFICATIONS: CorporateNotificationItem[] = [
    {
        id: "c-notif-1",
        category: "approvals",
        title: "Transfer Awaiting Approval",
        description: "Q4 East Africa Field Payroll Batch ($48,500.00) requires checker approval.",
        timestamp: "12m ago",
        date: "Today • 14:22 WAT",
        read: false,
        reference: "SET-BIZ-90841",
        amountUsd: 48500,
        amountLocal: "KSh 6,278,325.00",
        beneficiaryName: "Q4 East Africa Field Payroll Batch",
        actionLabel: "Review in Dashboard",
        actionHref: "/business/dashboard",
    },
    {
        id: "c-notif-2",
        category: "transfers",
        title: "Direct RTGS Clearing",
        description: "Dangote Port Logistics payment of $82,400.00 is in clearing stage 2.",
        timestamp: "2h ago",
        date: "Today • 11:48 WAT",
        read: false,
        reference: "SET-BIZ-90839",
        amountUsd: 82400,
        amountLocal: "₦ 131,180,800.00",
        beneficiaryName: "Dangote Port Logistics & Freight Ltd",
        actionLabel: "View in Transactions",
        actionHref: "/business/transactions",
    },
    {
        id: "c-notif-3",
        category: "transfers",
        title: "Disbursement Completed",
        description: "Accra Cloud Infrastructure payment of $15,750.00 cleared via Ecobank.",
        timestamp: "5h ago",
        date: "Today • 09:15 WAT",
        read: true,
        reference: "SET-BIZ-90835",
        amountUsd: 15750,
        amountLocal: "GH₵ 249,637.50",
        beneficiaryName: "Accra Cloud Infrastructure Systems",
        actionLabel: "View Receipt",
        actionHref: "/business/transactions",
    },
    {
        id: "c-notif-4",
        category: "security",
        title: "Team Invite Accepted",
        description: "Chidi Okafor joined as Approver/Checker with $50k authorization limit.",
        timestamp: "1d ago",
        date: "Nov 02, 2026 • 16:30",
        read: true,
        reference: "SEC-TEAM-441",
        actionLabel: "Manage Team",
        actionHref: "/business/settings/team",
    },
    {
        id: "c-notif-5",
        category: "security",
        title: "Monthly Volume Alert",
        description: "Company utilized 28.8% ($288,710.00) of tier compliance limit.",
        timestamp: "2d ago",
        date: "Nov 01, 2026 • 09:00",
        read: true,
        reference: "COMP-TIER-102",
        actionLabel: "View Limits",
        actionHref: "/business/dashboard",
    },
];

export const INITIAL_FUNDING_SOURCES: CorporateFundingSource[] = [
    {
        id: "fs-stanbic-ng",
        institutionName: "Stanbic IBTC Bank PLC",
        accountLabel: "Corporate Treasury Operating A/C",
        maskedNumber: "•••• 4910",
        type: "corporate_bank",
        rail: "Direct RTGS / NIBSS Corporate Mandate",
        currency: "USD / NGN Direct Pull",
        dailyLimitUsd: 500000,
        usedTodayUsd: 84250,
        feePercent: 0.15,
        settlementSpeed: "Instant Direct Pass-Through (< 90s)",
        mandateRef: "MND-99402-STN",
        verified: true,
    },
    {
        id: "fs-citi-uk",
        institutionName: "Citibank N.A. Corporate",
        accountLabel: "EMEA Pan-African Clearing Account",
        maskedNumber: "•••• 7732",
        type: "corporate_bank",
        rail: "SWIFT gpi / Direct ACH Pass-Through",
        currency: "USD Direct Settlement",
        dailyLimitUsd: 1500000,
        usedTodayUsd: 210000,
        feePercent: 0.2,
        settlementSpeed: "Same-Day Correspondent Pass-Through",
        mandateRef: "MND-44108-CITI",
        verified: true,
    },
    {
        id: "fs-zenith-card",
        institutionName: "Zenith Commercial Visa",
        accountLabel: "Executive Corporate Debit Card",
        maskedNumber: "•••• 8821",
        type: "corporate_card",
        rail: "Visa Direct Commercial Rail",
        currency: "USD Multi-Corridor Card Pull",
        dailyLimitUsd: 100000,
        usedTodayUsd: 14500,
        feePercent: 0.95,
        settlementSpeed: "Immediate Authorization & Disbursement",
        mandateRef: "VISA-CORP-8821",
        verified: true,
    },
];

export const INITIAL_CORPORATE_TRANSFERS: CorporateTransferItem[] = [
    {
        id: "tx-biz-1",
        reference: "SET-BIZ-90841",
        timestamp: "Today, 14:22 WAT",
        createdAtIso: "2026-11-03T14:22:00Z",
        type: "batch",
        beneficiaryName: "Q4 East Africa Field Payroll Batch",
        beneficiarySubtext: "34 Contractors • Safaricom M-Pesa & Equity Bank",
        corridorCountry: "Kenya",
        corridorFlag: "🇰🇪",
        currencyCode: "KES",
        currencySymbol: "KSh",
        fxRateToUsd: 129.45,
        amountUsd: 48500.0,
        amountLocal: 6278325.0,
        feeUsd: 72.75,
        fundingSourceId: "fs-stanbic-ng",
        fundingSourceName: "Stanbic IBTC Corporate •••• 4910",
        fundingSourceRail: "Direct RTGS Pass-Through",
        payoutPartnerRail: "Safaricom B2C & PesaLink API",
        status: "pending_approval",
        initiatedBy: "Tunde Bakare (Finance/Maker)",
        recipientCount: 34,
        clearingStage: 1,
    },
    {
        id: "tx-biz-2",
        reference: "SET-BIZ-90839",
        timestamp: "Today, 11:48 WAT",
        createdAtIso: "2026-11-03T11:48:00Z",
        type: "single",
        beneficiaryName: "Dangote Port Logistics & Freight Ltd",
        beneficiarySubtext: "Access Bank PLC • A/C 0049182736 • INV-2026-884",
        corridorCountry: "Nigeria",
        corridorFlag: "🇳🇬",
        currencyCode: "NGN",
        currencySymbol: "₦",
        fxRateToUsd: 1592.0,
        amountUsd: 82400.0,
        amountLocal: 131180800.0,
        feeUsd: 123.6,
        fundingSourceId: "fs-citi-uk",
        fundingSourceName: "Citibank N.A. Corporate •••• 7732",
        fundingSourceRail: "Direct ACH Pass-Through",
        payoutPartnerRail: "NIP Instant Interbank Rail",
        status: "clearing",
        initiatedBy: "Tunde Bakare (Finance/Maker)",
        approvedBy: "Amina Yusuf (Admin)",
        clearingStage: 2,
    },
    {
        id: "tx-biz-3",
        reference: "SET-BIZ-90835",
        timestamp: "Today, 09:15 WAT",
        createdAtIso: "2026-11-03T09:15:00Z",
        type: "single",
        beneficiaryName: "Accra Cloud Infrastructure Systems",
        beneficiarySubtext: "Ecobank Ghana • A/C 144092819201 • INV-GH-402",
        corridorCountry: "Ghana",
        corridorFlag: "🇬🇭",
        currencyCode: "GHS",
        currencySymbol: "GH₵",
        fxRateToUsd: 15.85,
        amountUsd: 15750.0,
        amountLocal: 249637.5,
        feeUsd: 23.63,
        fundingSourceId: "fs-stanbic-ng",
        fundingSourceName: "Stanbic IBTC Corporate •••• 4910",
        fundingSourceRail: "Direct RTGS Pass-Through",
        payoutPartnerRail: "GhIPSS Instant Pay",
        status: "pending_approval",
        initiatedBy: "Zainab Mensah (Finance/Maker)",
        clearingStage: 1,
    },
    {
        id: "tx-biz-4",
        reference: "SET-BIZ-90822",
        timestamp: "Yesterday, 17:05 WAT",
        createdAtIso: "2026-11-02T17:05:00Z",
        type: "batch",
        beneficiaryName: "West Africa Supplier Settlement #11",
        beneficiarySubtext: "18 Corporate Vendors • Nigeria & Senegal",
        corridorCountry: "Multi-Corridor",
        corridorFlag: "🇳🇬",
        currencyCode: "NGN",
        currencySymbol: "₦",
        fxRateToUsd: 1590.0,
        amountUsd: 164200.0,
        amountLocal: 261078000.0,
        feeUsd: 246.3,
        fundingSourceId: "fs-citi-uk",
        fundingSourceName: "Citibank N.A. Corporate •••• 7732",
        fundingSourceRail: "SWIFT gpi Pass-Through",
        payoutPartnerRail: "NIBSS & BCEAO STAR-UEMOA",
        status: "completed",
        initiatedBy: "Tunde Bakare (Finance/Maker)",
        approvedBy: "Chidi Okafor (Approver/Checker)",
        recipientCount: 18,
        clearingStage: 3,
    },
    {
        id: "tx-biz-5",
        reference: "SET-BIZ-90814",
        timestamp: "Nov 01, 15:30 WAT",
        createdAtIso: "2026-11-01T15:30:00Z",
        type: "single",
        beneficiaryName: "Cape Town Maritime Surveyors (Pty) Ltd",
        beneficiarySubtext: "FirstRand Bank (FNB) • A/C 6284910293 • INV-ZA-19",
        corridorCountry: "South Africa",
        corridorFlag: "🇿🇦",
        currencyCode: "ZAR",
        currencySymbol: "R",
        fxRateToUsd: 17.62,
        amountUsd: 42800.0,
        amountLocal: 754136.0,
        feeUsd: 64.2,
        fundingSourceId: "fs-stanbic-ng",
        fundingSourceName: "Stanbic IBTC Corporate •••• 4910",
        fundingSourceRail: "Direct RTGS Pass-Through",
        payoutPartnerRail: "SARB PayShap / RTC Clearing",
        status: "completed",
        initiatedBy: "Amina Yusuf (Admin)",
        approvedBy: "Amina Yusuf (Admin)",
        clearingStage: 3,
    },
    {
        id: "tx-biz-6",
        reference: "SET-BIZ-90798",
        timestamp: "Oct 30, 10:12 WAT",
        createdAtIso: "2026-10-30T10:12:00Z",
        type: "batch",
        beneficiaryName: "October Regional Engineering Retainers",
        beneficiarySubtext: "42 Contractors • NGN, KES, RWF, UGX",
        corridorCountry: "Pan-African",
        corridorFlag: "🇷🇼",
        currencyCode: "RWF",
        currencySymbol: "FRw",
        fxRateToUsd: 1385.0,
        amountUsd: 129260.0,
        amountLocal: 179025100.0,
        feeUsd: 193.89,
        fundingSourceId: "fs-zenith-card",
        fundingSourceName: "Zenith Commercial Visa •••• 8821",
        fundingSourceRail: "Visa Direct Commercial Rail",
        payoutPartnerRail: "MTN MoMo & Local Bank RTGS",
        status: "completed",
        initiatedBy: "Zainab Mensah (Finance/Maker)",
        approvedBy: "Chidi Okafor (Approver/Checker)",
        recipientCount: 42,
        clearingStage: 3,
    },
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
    {
        id: "tm-1",
        fullName: "Amina Yusuf",
        initials: "AY",
        email: "amina.yusuf@koralogistics.africa",
        department: "Executive / Chief Financial Officer",
        role: "Admin",
        status: "Active",
        authorizationLimitUsd: "Unlimited",
        twoFactorEnabled: true,
        lastActive: "Online now",
        permissions: {
            initiateSingleTransfers: true,
            uploadBatchFiles: true,
            approveUpTo50k: true,
            approveUnlimitedBatch: true,
            manageBeneficiariesTax: true,
            manageFundingSources: true,
            manageTeamSecurity: true,
        },
    },
    {
        id: "tm-2",
        fullName: "Chidi Okafor",
        initials: "CO",
        email: "c.okafor@koralogistics.africa",
        department: "VP Treasury & Risk Control",
        role: "Approver/Checker",
        status: "Active",
        authorizationLimitUsd: 250000,
        twoFactorEnabled: true,
        lastActive: "18 mins ago",
        permissions: {
            initiateSingleTransfers: false,
            uploadBatchFiles: false,
            approveUpTo50k: true,
            approveUnlimitedBatch: true,
            manageBeneficiariesTax: true,
            manageFundingSources: false,
            manageTeamSecurity: false,
        },
    },
    {
        id: "tm-3",
        fullName: "Tunde Bakare",
        initials: "TB",
        email: "tunde.b@koralogistics.africa",
        department: "Accounts Payable & Payroll",
        role: "Finance/Maker",
        status: "Active",
        authorizationLimitUsd: 10000,
        twoFactorEnabled: true,
        lastActive: "42 mins ago",
        permissions: {
            initiateSingleTransfers: true,
            uploadBatchFiles: true,
            approveUpTo50k: false,
            approveUnlimitedBatch: false,
            manageBeneficiariesTax: true,
            manageFundingSources: false,
            manageTeamSecurity: false,
        },
    },
    {
        id: "tm-4",
        fullName: "Ngozi Eze-Nwosu",
        initials: "NE",
        email: "ngozi.eze@koralogistics.africa",
        department: "Internal Audit & Compliance",
        role: "Approver/Checker",
        status: "Active",
        authorizationLimitUsd: 50000,
        twoFactorEnabled: true,
        lastActive: "2 hours ago",
        permissions: {
            initiateSingleTransfers: false,
            uploadBatchFiles: false,
            approveUpTo50k: true,
            approveUnlimitedBatch: false,
            manageBeneficiariesTax: true,
            manageFundingSources: false,
            manageTeamSecurity: false,
        },
    },
    {
        id: "tm-5",
        fullName: "Zainab Mensah",
        initials: "ZM",
        email: "z.mensah@koralogistics.africa",
        department: "West Africa Vendor Operations",
        role: "Finance/Maker",
        status: "Active",
        authorizationLimitUsd: 5000,
        twoFactorEnabled: true,
        lastActive: "Yesterday",
        permissions: {
            initiateSingleTransfers: true,
            uploadBatchFiles: true,
            approveUpTo50k: false,
            approveUnlimitedBatch: false,
            manageBeneficiariesTax: false,
            manageFundingSources: false,
            manageTeamSecurity: false,
        },
    },
    {
        id: "tm-6",
        fullName: "Kwame Boateng",
        initials: "KB",
        email: "k.boateng@koralogistics.africa",
        department: "Regional Tax & Treasury Counsel",
        role: "Approver/Checker",
        status: "Pending Invite",
        authorizationLimitUsd: 100000,
        twoFactorEnabled: false,
        lastActive: "Invite sent 1d ago",
        permissions: {
            initiateSingleTransfers: false,
            uploadBatchFiles: false,
            approveUpTo50k: true,
            approveUnlimitedBatch: false,
            manageBeneficiariesTax: true,
            manageFundingSources: false,
            manageTeamSecurity: false,
        },
    },
];

export const INITIAL_BENEFICIARIES: CorporateBeneficiary[] = [
    {
        id: "ben-1",
        entityName: "Dangote Port Logistics & Freight Ltd",
        initials: "DP",
        category: "Vendor",
        registrationNumber: "RC-1049281",
        country: "Nigeria",
        flag: "🇳🇬",
        currencyCode: "NGN",
        currencySymbol: "₦",
        payoutMethod: "Local Bank",
        institutionName: "Access Bank PLC",
        routingOrSortCode: "044150149",
        accountOrMobileNumber: "0049182736",
        taxIdNumber: "TIN-20491829-0001",
        taxTags: ["TIN Verified", "VAT Registered"],
        contactEmail: "treasury@dangotefreight.ng",
        volume30dUsd: 146400.0,
        lastPaidDate: "Nov 03, 2026",
        verified: true,
    },
    {
        id: "ben-2",
        entityName: "Nairobi Telematics & IoT Fleet Ltd",
        initials: "NT",
        category: "Vendor",
        registrationNumber: "PVT-KE-883920",
        country: "Kenya",
        flag: "🇰🇪",
        currencyCode: "KES",
        currencySymbol: "KSh",
        payoutMethod: "Mobile Money",
        institutionName: "Safaricom M-Pesa B2B Paybill",
        routingOrSortCode: "MPESA-400200",
        accountOrMobileNumber: "+254 712 904 812",
        taxIdNumber: "KRA-P051928374K",
        taxTags: ["TIN Verified", "WHT Exempt"],
        contactEmail: "billing@nairobitelematics.co.ke",
        volume30dUsd: 64200.0,
        lastPaidDate: "Oct 29, 2026",
        verified: true,
    },
    {
        id: "ben-3",
        entityName: "Accra Cloud Infrastructure Systems",
        initials: "AC",
        category: "Vendor",
        registrationNumber: "CS-GH-294018",
        country: "Ghana",
        flag: "🇬🇭",
        currencyCode: "GHS",
        currencySymbol: "GH₵",
        payoutMethod: "Local Bank",
        institutionName: "Ecobank Ghana PLC",
        routingOrSortCode: "130101",
        accountOrMobileNumber: "144092819201",
        taxIdNumber: "GRA-C004918273",
        taxTags: ["TIN Verified", "VAT Registered"],
        contactEmail: "finance@accracloud.com.gh",
        volume30dUsd: 38900.0,
        lastPaidDate: "Nov 03, 2026",
        verified: true,
    },
    {
        id: "ben-4",
        entityName: "Cape Town Maritime Surveyors (Pty) Ltd",
        initials: "CT",
        category: "Vendor",
        registrationNumber: "2019/482910/07",
        country: "South Africa",
        flag: "🇿🇦",
        currencyCode: "ZAR",
        currencySymbol: "R",
        payoutMethod: "Local Bank",
        institutionName: "FirstRand Bank (FNB Corporate)",
        routingOrSortCode: "250655",
        accountOrMobileNumber: "6284910293",
        taxIdNumber: "SARS-9482019284",
        taxTags: ["TIN Verified", "VAT Registered", "WHT Exempt"],
        contactEmail: "accounts@ctmaritime.co.za",
        volume30dUsd: 92400.0,
        lastPaidDate: "Nov 01, 2026",
        verified: true,
    },
    {
        id: "ben-5",
        entityName: "Amadou Diallo — Principal Customs Broker",
        initials: "AD",
        category: "Contractor",
        registrationNumber: "SN-DKR-2024-991",
        country: "Senegal",
        flag: "🇸🇳",
        currencyCode: "XOF",
        currencySymbol: "CFA",
        payoutMethod: "Mobile Money",
        institutionName: "Wave Mobile Money Senegal",
        routingOrSortCode: "WAVE-SN-01",
        accountOrMobileNumber: "+221 77 492 81 04",
        taxIdNumber: "NINEA-00492812",
        taxTags: ["TIN Verified"],
        contactEmail: "amadou.diallo@dakarcustoms.sn",
        volume30dUsd: 18500.0,
        lastPaidDate: "Oct 27, 2026",
        verified: true,
    },
    {
        id: "ben-6",
        entityName: "Kigali Cold-Chain Warehousing SARL",
        initials: "KC",
        category: "Vendor",
        registrationNumber: "RDB-10948271",
        country: "Rwanda",
        flag: "🇷🇼",
        currencyCode: "RWF",
        currencySymbol: "FRw",
        payoutMethod: "Local Bank",
        institutionName: "Bank of Kigali PLC",
        routingOrSortCode: "BKIGRWRW",
        accountOrMobileNumber: "00040069281929",
        taxIdNumber: "RRA-104928192",
        taxTags: ["TIN Verified", "VAT Registered"],
        contactEmail: "settlements@kigalicoldchain.rw",
        volume30dUsd: 41200.0,
        lastPaidDate: "Oct 30, 2026",
        verified: true,
    },
    {
        id: "ben-7",
        entityName: "Tariq El-Masri — North Africa Legal Counsel",
        initials: "TE",
        category: "Contractor",
        registrationNumber: "EG-LAW-77412",
        country: "Egypt",
        flag: "🇪🇬",
        currencyCode: "EGP",
        currencySymbol: "E£",
        payoutMethod: "Local Bank",
        institutionName: "Commercial International Bank (CIB)",
        routingOrSortCode: "CIBEEGCX004",
        accountOrMobileNumber: "100049281726",
        taxIdNumber: "ETA-582-910-442",
        taxTags: ["Pending Tax Docs"],
        contactEmail: "t.elmasri@cairolaw.eg",
        volume30dUsd: 12000.0,
        lastPaidDate: "Oct 19, 2026",
        verified: false,
    },
    {
        id: "ben-8",
        entityName: "Chiamaka Obi — Senior DevSecOps Consultant",
        initials: "CO",
        category: "Contractor",
        registrationNumber: "BN-3948102",
        country: "Nigeria",
        flag: "🇳🇬",
        currencyCode: "NGN",
        currencySymbol: "₦",
        payoutMethod: "Local Bank",
        institutionName: "Guaranty Trust Bank (GTBank)",
        routingOrSortCode: "058152052",
        accountOrMobileNumber: "0159283741",
        taxIdNumber: "TIN-19402817-0002",
        taxTags: ["TIN Verified", "WHT Exempt"],
        contactEmail: "chiamaka@obitech.ng",
        volume30dUsd: 24000.0,
        lastPaidDate: "Oct 31, 2026",
        verified: true,
    },
];

export const SAMPLE_BATCH_ROWS_WITH_ERRORS: BatchRowItem[] = [
    {
        id: "row-1",
        rowNumber: 1,
        recipientName: "Dangote Port Logistics & Freight Ltd",
        category: "Vendor",
        country: "Nigeria",
        flag: "🇳🇬",
        currencyCode: "NGN",
        currencySymbol: "₦",
        payoutMethod: "Local Bank",
        institutionName: "Access Bank PLC",
        routingCode: "044150149",
        accountNumber: "0049182736",
        amountUsd: 18500.0,
        amountLocal: 29452000.0,
        fxRate: 1592.0,
        taxReference: "TIN-20491829-0001",
        invoiceRef: "INV-NG-901",
        errors: [],
    },
    {
        id: "row-2",
        rowNumber: 2,
        recipientName: "Nairobi Telematics & IoT Fleet Ltd",
        category: "Vendor",
        country: "Kenya",
        flag: "🇰🇪",
        currencyCode: "KES",
        currencySymbol: "KSh",
        payoutMethod: "Mobile Money",
        institutionName: "Safaricom M-Pesa Paybill",
        routingCode: "MPESA-400200",
        accountNumber: "+254712904812",
        amountUsd: 9400.0,
        amountLocal: 1216830.0,
        fxRate: 129.45,
        taxReference: "KRA-P051928374K",
        invoiceRef: "INV-KE-412",
        errors: [],
    },
    {
        id: "row-3",
        rowNumber: 3,
        recipientName: "Lagos Haulage & Terminal Services",
        category: "Vendor",
        country: "Nigeria",
        flag: "🇳🇬",
        currencyCode: "NGN",
        currencySymbol: "₦",
        payoutMethod: "Local Bank",
        institutionName: "Zenith Bank PLC",
        routingCode: "",
        accountNumber: "10184920",
        amountUsd: 12250.0,
        amountLocal: 19502000.0,
        fxRate: 1592.0,
        taxReference: "TIN-88491022-0001",
        invoiceRef: "INV-NG-904",
        errors: [
            "Missing bank sort/routing code (9-digit NIBSS code required)",
            "Incorrect NUBAN account length (8 digits provided, 10 digits required)",
        ],
    },
    {
        id: "row-4",
        rowNumber: 4,
        recipientName: "Accra Cloud Infrastructure Systems",
        category: "Vendor",
        country: "Ghana",
        flag: "🇬🇭",
        currencyCode: "GHS",
        currencySymbol: "GH₵",
        payoutMethod: "Local Bank",
        institutionName: "Ecobank Ghana PLC",
        routingCode: "130101",
        accountNumber: "144092819201",
        amountUsd: 7800.0,
        amountLocal: 123630.0,
        fxRate: 15.85,
        taxReference: "GRA-C004918273",
        invoiceRef: "INV-GH-219",
        errors: [],
    },
    {
        id: "row-5",
        rowNumber: 5,
        recipientName: "Cape Town Maritime Surveyors (Pty) Ltd",
        category: "Vendor",
        country: "South Africa",
        flag: "🇿🇦",
        currencyCode: "ZAR",
        currencySymbol: "R",
        payoutMethod: "Local Bank",
        institutionName: "FirstRand Bank (FNB)",
        routingCode: "250655",
        accountNumber: "6284910293",
        amountUsd: 14600.0,
        amountLocal: 257252.0,
        fxRate: 17.62,
        taxReference: "SARS-9482019284",
        invoiceRef: "INV-ZA-881",
        errors: [],
    },
    {
        id: "row-6",
        rowNumber: 6,
        recipientName: "Kumasi Agro-Packaging Supply Co.",
        category: "Vendor",
        country: "Ghana",
        flag: "🇬🇭",
        currencyCode: "GHS",
        currencySymbol: "GH₵",
        payoutMethod: "Local Bank",
        institutionName: "GCB Bank PLC",
        routingCode: "",
        accountNumber: "102948192019",
        amountUsd: 6300.0,
        amountLocal: 99855.0,
        fxRate: 15.85,
        taxReference: "GRA-C00918271",
        invoiceRef: "INV-GH-224",
        errors: ["Missing GhIPSS bank branch routing code (6-digit code required)"],
    },
    {
        id: "row-7",
        rowNumber: 7,
        recipientName: "Amadou Diallo — Customs Advisory",
        category: "Contractor",
        country: "Senegal",
        flag: "🇸🇳",
        currencyCode: "XOF",
        currencySymbol: "CFA",
        payoutMethod: "Mobile Money",
        institutionName: "Wave Mobile Money Senegal",
        routingCode: "WAVE-SN-01",
        accountNumber: "+221774928104",
        amountUsd: 4200.0,
        amountLocal: 2583000.0,
        fxRate: 615.0,
        taxReference: "NINEA-00492812",
        invoiceRef: "PAY-SN-104",
        errors: [],
    },
    {
        id: "row-8",
        rowNumber: 8,
        recipientName: "Chiamaka Obi — DevSecOps Retainer",
        category: "Contractor",
        country: "Nigeria",
        flag: "🇳🇬",
        currencyCode: "NGN",
        currencySymbol: "₦",
        payoutMethod: "Local Bank",
        institutionName: "Guaranty Trust Bank (GTBank)",
        routingCode: "058152052",
        accountNumber: "0159283741",
        amountUsd: 5500.0,
        amountLocal: 8756000.0,
        fxRate: 1592.0,
        taxReference: "TIN-19402817-0002",
        invoiceRef: "PAY-NG-312",
        errors: [],
    },
];

export function validateBatchRow(row: Omit<BatchRowItem, "errors">): string[] {
    const errs: string[] = [];
    if (!row.routingCode || !row.routingCode.trim()) {
        errs.push(`Missing routing/sort code for ${row.institutionName}`);
    }
    const cleanAcc = row.accountNumber.replace(/[\s-]/g, "");
    if (!cleanAcc) {
        errs.push("Missing destination account or mobile number");
    } else if (row.payoutMethod === "Local Bank" && row.currencyCode === "NGN" && cleanAcc.length !== 10) {
        errs.push(`Incorrect NUBAN account length (${cleanAcc.length} digits provided, 10 digits required)`);
    } else if (row.payoutMethod === "Local Bank" && cleanAcc.length < 8) {
        errs.push(`Account number too short (${cleanAcc.length} characters; minimum 8 required)`);
    }
    if (isNaN(row.amountUsd) || row.amountUsd <= 0) {
        errs.push("Payout amount must be greater than $0.00 USD");
    }
    return errs;
}

interface BusinessContextValue {
    accountMode: AccountMode;
    companyName: string;
    rcNumber: string;
    transfers: CorporateTransferItem[];
    fundingSources: CorporateFundingSource[];
    teamMembers: TeamMember[];
    beneficiaries: CorporateBeneficiary[];
    notifications: CorporateNotificationItem[];
    unreadNotificationsCount: number;
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;
    initiateAccountSwitch: (targetMode: AccountMode) => void;
    addSingleTransfer: (item: Omit<CorporateTransferItem, "id" | "reference" | "timestamp" | "createdAtIso">) => CorporateTransferItem;
    approveTransfer: (id: string) => void;
    rejectTransfer: (id: string) => void;
    processBatchTransfer: (params: {
        batchTitle: string;
        validRows: BatchRowItem[];
        fundingSource: CorporateFundingSource;
    }) => CorporateTransferItem;
    inviteTeamMember: (member: Omit<TeamMember, "id" | "initials" | "status" | "twoFactorEnabled" | "lastActive">) => void;
    updateTeamMemberRole: (id: string, role: TeamRole, limit: number | "Unlimited") => void;
    removeTeamMember: (id: string) => void;
    addBeneficiary: (ben: Omit<CorporateBeneficiary, "id" | "initials" | "volume30dUsd" | "lastPaidDate">) => void;
}

const BusinessContext = createContext<BusinessContextValue | undefined>(undefined);

export const ACCOUNT_TYPE_STORAGE_KEY = "settle_africa_account_type";
export const PENDING_SWITCH_STORAGE_KEY = "settle_africa_pending_switch";

export function BusinessProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [accountMode, setAccountMode] = useState<AccountMode>("personal");
    const [companyName, setCompanyName] = useState("Kora Logistics Africa Ltd.");
    const [rcNumber, setRcNumber] = useState("RC-1849204");

    const [transfers, setTransfers] = useState<CorporateTransferItem[]>(INITIAL_CORPORATE_TRANSFERS);
    const [fundingSources] = useState<CorporateFundingSource[]>(INITIAL_FUNDING_SOURCES);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
    const [beneficiaries, setBeneficiaries] = useState<CorporateBeneficiary[]>(INITIAL_BENEFICIARIES);
    const [notifications, setNotifications] = useState<CorporateNotificationItem[]>(INITIAL_CORPORATE_NOTIFICATIONS);

    const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

    const markNotificationAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllNotificationsAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        toast.success("All notifications marked as read.");
    };

    useEffect(() => {
        try {
            const savedType = localStorage.getItem(ACCOUNT_TYPE_STORAGE_KEY) as AccountMode | null;
            if (savedType === "business" || savedType === "personal") {
                setAccountMode(savedType);
            }
            const savedCompany = localStorage.getItem("settle_africa_business_name");
            if (savedCompany) setCompanyName(savedCompany);
            const savedRc = localStorage.getItem("settle_africa_rc_number");
            if (savedRc) setRcNumber(savedRc);
        } catch {
            // ignore storage errors
        }
    }, []);

    const initiateAccountSwitch = (targetMode: AccountMode) => {
        try {
            localStorage.setItem(PENDING_SWITCH_STORAGE_KEY, targetMode);
            localStorage.setItem(ACCOUNT_TYPE_STORAGE_KEY, targetMode);
        } catch {
            // ignore
        }
        const label = targetMode === "business" ? "Business Account" : "Personal Account";
        toast.info(`Redirecting to Login for ${label}...`, {
            autoClose: 1800,
        });
        router.push(`/login?switchTo=${targetMode}`);
    };

    const addSingleTransfer = (
        item: Omit<CorporateTransferItem, "id" | "reference" | "timestamp" | "createdAtIso">
    ) => {
        const randomNum = Math.floor(90850 + Math.random() * 900);
        const newTransfer: CorporateTransferItem = {
            ...item,
            id: `tx-biz-${Date.now()}`,
            reference: `SET-BIZ-${randomNum}`,
            timestamp: "Just now",
            createdAtIso: new Date().toISOString(),
        };
        setTransfers((prev) => [newTransfer, ...prev]);
        return newTransfer;
    };

    const approveTransfer = (id: string) => {
        setTransfers((prev) =>
            prev.map((tx) =>
                tx.id === id
                    ? {
                          ...tx,
                          status: "completed",
                          approvedBy: "Amina Yusuf (Admin)",
                          clearingStage: 3,
                          timestamp: "Approved • Just now",
                      }
                    : tx
            )
        );
        toast.success("Pass-through settlement authorized and dispatched to corridor partner.");
    };

    const rejectTransfer = (id: string) => {
        setTransfers((prev) => prev.filter((tx) => tx.id !== id));
        toast.info("Transfer request declined and removed from approval queue.");
    };

    const processBatchTransfer = ({
        batchTitle,
        validRows,
        fundingSource,
    }: {
        batchTitle: string;
        validRows: BatchRowItem[];
        fundingSource: CorporateFundingSource;
    }) => {
        const totalUsd = validRows.reduce((sum, r) => sum + r.amountUsd, 0);
        const feeUsd = Number((totalUsd * (fundingSource.feePercent / 100)).toFixed(2));
        const primaryRow = validRows[0];
        const uniqueCountries = Array.from(new Set(validRows.map((r) => r.country)));
        const randomNum = Math.floor(90900 + Math.random() * 900);

        const newBatchTx: CorporateTransferItem = {
            id: `tx-batch-${Date.now()}`,
            reference: `SET-BIZ-${randomNum}`,
            timestamp: "Just now",
            createdAtIso: new Date().toISOString(),
            type: "batch",
            beneficiaryName: batchTitle || "Pan-African Corporate Batch Settlement",
            beneficiarySubtext: `${validRows.length} Recipients • ${uniqueCountries.join(", ")}`,
            corridorCountry: uniqueCountries.length > 1 ? "Multi-Corridor" : primaryRow?.country || "Nigeria",
            corridorFlag: primaryRow?.flag || "🇳🇬",
            currencyCode: primaryRow?.currencyCode || "NGN",
            currencySymbol: primaryRow?.currencySymbol || "₦",
            fxRateToUsd: primaryRow?.fxRate || 1592.0,
            amountUsd: totalUsd,
            amountLocal: totalUsd * (primaryRow?.fxRate || 1592.0),
            feeUsd,
            fundingSourceId: fundingSource.id,
            fundingSourceName: `${fundingSource.institutionName} ${fundingSource.maskedNumber}`,
            fundingSourceRail: fundingSource.rail,
            payoutPartnerRail: "Direct Pass-Through Multi-Corridor API",
            status: "clearing",
            initiatedBy: "Amina Yusuf (Admin)",
            approvedBy: "Amina Yusuf (Admin)",
            recipientCount: validRows.length,
            clearingStage: 2,
        };

        setTransfers((prev) => [newBatchTx, ...prev]);
        return newBatchTx;
    };

    const inviteTeamMember = (
        member: Omit<TeamMember, "id" | "initials" | "status" | "twoFactorEnabled" | "lastActive">
    ) => {
        const parts = member.fullName.trim().split(/\s+/);
        const initials =
            parts.length >= 2
                ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
                : member.fullName.slice(0, 2).toUpperCase();

        const newMember: TeamMember = {
            ...member,
            id: `tm-${Date.now()}`,
            initials,
            status: "Pending Invite",
            twoFactorEnabled: false,
            lastActive: "Invite sent just now",
        };
        setTeamMembers((prev) => [newMember, ...prev]);
        toast.success(`Invitation dispatched to ${member.email} (${member.role}).`);
    };

    const updateTeamMemberRole = (id: string, role: TeamRole, limit: number | "Unlimited") => {
        setTeamMembers((prev) =>
            prev.map((m) =>
                m.id === id
                    ? {
                          ...m,
                          role,
                          authorizationLimitUsd: limit,
                          status: "Active",
                      }
                    : m
            )
        );
        toast.success("Team member role and authorization limit updated.");
    };

    const removeTeamMember = (id: string) => {
        setTeamMembers((prev) => prev.filter((m) => m.id !== id));
        toast.info("Team member access revoked.");
    };

    const addBeneficiary = (
        ben: Omit<CorporateBeneficiary, "id" | "initials" | "volume30dUsd" | "lastPaidDate">
    ) => {
        const words = ben.entityName.trim().split(/\s+/);
        const initials =
            words.length >= 2
                ? `${words[0][0]}${words[1][0]}`.toUpperCase()
                : ben.entityName.slice(0, 2).toUpperCase();

        const newBen: CorporateBeneficiary = {
            ...ben,
            id: `ben-${Date.now()}`,
            initials,
            volume30dUsd: 0,
            lastPaidDate: "Never (Newly Verified)",
        };
        setBeneficiaries((prev) => [newBen, ...prev]);
        toast.success(`${ben.entityName} added to Corporate Beneficiary Directory.`);
    };

    return (
        <BusinessContext.Provider
            value={{
                accountMode,
                companyName,
                rcNumber,
                transfers,
                fundingSources,
                teamMembers,
                beneficiaries,
                notifications,
                unreadNotificationsCount,
                markNotificationAsRead,
                markAllNotificationsAsRead,
                initiateAccountSwitch,
                addSingleTransfer,
                approveTransfer,
                rejectTransfer,
                processBatchTransfer,
                inviteTeamMember,
                updateTeamMemberRole,
                removeTeamMember,
                addBeneficiary,
            }}
        >
            {children}
        </BusinessContext.Provider>
    );
}

export function useBusiness() {
    const ctx = useContext(BusinessContext);
    if (!ctx) {
        throw new Error("useBusiness must be used within a BusinessProvider");
    }
    return ctx;
}

