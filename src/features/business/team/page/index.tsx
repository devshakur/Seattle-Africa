"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    UserPlus,
    ShieldCheck,
    Search,
    Check,
    X,
    Trash2,
    Mail,
    UserCheck,
    FileEdit,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
    useBusiness,
    TeamRole,
    GranularPermissions,
    TeamMember,
} from "@/features/business/context/BusinessContext";

type TeamViewTab = "members" | "matrix";
type RoleFilter = "All" | TeamRole;

const ROLE_PRESET_PERMISSIONS: Record<TeamRole, { limit: number | "Unlimited"; perms: GranularPermissions }> = {
    Admin: {
        limit: "Unlimited",
        perms: {
            initiateSingleTransfers: true,
            uploadBatchFiles: true,
            approveUpTo50k: true,
            approveUnlimitedBatch: true,
            manageBeneficiariesTax: true,
            manageFundingSources: true,
            manageTeamSecurity: true,
        },
    },
    "Finance/Maker": {
        limit: 10000,
        perms: {
            initiateSingleTransfers: true,
            uploadBatchFiles: true,
            approveUpTo50k: false,
            approveUnlimitedBatch: false,
            manageBeneficiariesTax: true,
            manageFundingSources: false,
            manageTeamSecurity: false,
        },
    },
    "Approver/Checker": {
        limit: 250000,
        perms: {
            initiateSingleTransfers: false,
            uploadBatchFiles: false,
            approveUpTo50k: true,
            approveUnlimitedBatch: true,
            manageBeneficiariesTax: true,
            manageFundingSources: false,
            manageTeamSecurity: false,
        },
    },
};

const PERMISSION_ITEMS: {
    key: keyof GranularPermissions;
    title: string;
    description: string;
    tag: string;
}[] = [
    {
        key: "initiateSingleTransfers",
        title: "Initiate Single Pass-Through Transfers",
        description: "Stage single corporate vendor or contractor transfers from linked bank mandates.",
        tag: "MAKER • UP TO $25,000 USD",
    },
    {
        key: "uploadBatchFiles",
        title: "Upload & Stage Bulk CSV/Excel Payout Batches",
        description: "Upload multi-corridor payroll or vendor CSV manifests and run pre-flight validation.",
        tag: "MAKER • BATCH STAGING",
    },
    {
        key: "approveUpTo50k",
        title: "Checker Sign-Off: Approve Settlements up to $50,000 USD",
        description: "Authorize staged single transfers and batches up to $50,000 USD for atomic bank pull.",
        tag: "CHECKER • TIER 1 LIMIT",
    },
    {
        key: "approveUnlimitedBatch",
        title: "Senior Checker Sign-Off: Approve High-Value Batches (> $50,000 USD)",
        description: "Authorize wholesale treasury and payroll batches exceeding $50,000 USD.",
        tag: "CHECKER • UNLIMITED",
    },
    {
        key: "manageBeneficiariesTax",
        title: "Manage Corporate Beneficiaries & Tax Verification Tags",
        description: "Add verified vendors/contractors and update TIN, VAT, and WHT compliance records.",
        tag: "COMPLIANCE • KYB/TAX",
    },
    {
        key: "manageFundingSources",
        title: "Link & Modify Corporate Bank Mandates / Debit Cards",
        description: "Configure RTGS/ACH corporate bank accounts and commercial debit cards for pass-through pulls.",
        tag: "TREASURY RAIL",
    },
    {
        key: "manageTeamSecurity",
        title: "Administer Team Roles, SSO & Maker-Checker Thresholds",
        description: "Invite or revoke team members and modify corporate dual-control governance rules.",
        tag: "ADMIN GOVERNANCE",
    },
];

export function TeamPermissionsPage() {
    const {
        companyName,
        teamMembers,
        inviteTeamMember,
        updateTeamMemberRole,
        removeTeamMember,
    } = useBusiness();

    const [activeViewTab, setActiveViewTab] = useState<TeamViewTab>("members");
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Invite Drawer State
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("Corporate Treasury & Payables");
    const [selectedRole, setSelectedRole] = useState<TeamRole>("Finance/Maker");
    const [authLimit, setAuthLimit] = useState<number | "Unlimited">(10000);
    const [permissions, setPermissions] = useState<GranularPermissions>(
        ROLE_PRESET_PERMISSIONS["Finance/Maker"].perms
    );
    const [formError, setFormError] = useState("");

    // Inspect Member Modal
    const [inspectingMember, setInspectingMember] = useState<TeamMember | null>(null);

    const handleRoleSelect = (role: TeamRole) => {
        setSelectedRole(role);
        setAuthLimit(ROLE_PRESET_PERMISSIONS[role].limit);
        setPermissions({ ...ROLE_PRESET_PERMISSIONS[role].perms });
    };

    const togglePermission = (key: keyof GranularPermissions) => {
        setPermissions((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleInviteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim() || fullName.trim().length < 3) {
            setFormError("Please enter the team member's full legal name.");
            return;
        }
        if (!email.trim() || !email.includes("@")) {
            setFormError("Please enter a valid corporate work email address.");
            return;
        }

        setFormError("");
        inviteTeamMember({
            fullName: fullName.trim(),
            email: email.trim(),
            department: department.trim() || "Finance & Operations",
            role: selectedRole,
            authorizationLimitUsd: authLimit,
            permissions,
        });

        setFullName("");
        setEmail("");
        setIsInviteOpen(false);
    };

    const filteredMembers = useMemo(() => {
        return teamMembers.filter((m) => {
            if (roleFilter !== "All" && m.role !== roleFilter) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return (
                    m.fullName.toLowerCase().includes(q) ||
                    m.email.toLowerCase().includes(q) ||
                    m.department.toLowerCase().includes(q) ||
                    m.role.toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [teamMembers, roleFilter, searchQuery]);

    const roleCounts = useMemo(
        () => ({
            All: teamMembers.length,
            Admin: teamMembers.filter((m) => m.role === "Admin").length,
            "Finance/Maker": teamMembers.filter((m) => m.role === "Finance/Maker").length,
            "Approver/Checker": teamMembers.filter((m) => m.role === "Approver/Checker").length,
        }),
        [teamMembers]
    );

    return (
        <div className="space-y-8 pb-16 text-black">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 rounded border border-black bg-black text-white px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest">
                            <ShieldCheck size={11} />
                            <span>Maker-Checker Governance</span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded border border-[#E5E5E5] bg-white px-2.5 py-0.5 text-[10px] font-mono font-semibold text-black uppercase tracking-wider font-tabular-nums">
                            Dual-Control Active
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
                        Team &amp; Permissions Management
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                        Configure corporate roles, Maker-Checker dual-authorization workflows, and per-seat pass-through settlement limits for {companyName}.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        onClick={() => setIsInviteOpen(true)}
                        className="h-11 px-5 bg-black text-white hover:bg-zinc-800 text-xs font-bold tracking-tight cursor-pointer"
                    >
                        <UserPlus size={15} />
                        <span>Invite Team Member</span>
                    </Button>
                </div>
            </div>

            {/* Governance Summary Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-tabular-nums">
                <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                        Total Authorized Seats
                    </p>
                    <p className="text-2xl font-mono font-bold text-black mt-2">
                        {teamMembers.length}
                        <span className="text-xs font-sans font-normal text-zinc-500 ml-1.5">
                            members
                        </span>
                    </p>
                    <p className="text-[11px] font-mono text-zinc-500 mt-1">
                        2FA hardware/authenticator enforced
                    </p>
                </div>

                <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                        Finance / Makers
                    </p>
                    <p className="text-2xl font-mono font-bold text-black mt-2">
                        {roleCounts["Finance/Maker"]}
                        <span className="text-xs font-sans font-normal text-zinc-500 ml-1.5">
                            initiators
                        </span>
                    </p>
                    <p className="text-[11px] font-mono text-zinc-500 mt-1">
                        Can stage single &amp; CSV batch payouts
                    </p>
                </div>

                <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                        Approvers / Checkers
                    </p>
                    <p className="text-2xl font-mono font-bold text-black mt-2">
                        {roleCounts["Approver/Checker"] + roleCounts.Admin}
                        <span className="text-xs font-sans font-normal text-zinc-500 ml-1.5">
                            signatories
                        </span>
                    </p>
                    <p className="text-[11px] font-mono text-zinc-500 mt-1">
                        Authorized for bank debit sign-off
                    </p>
                </div>

                <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                        Dual-Control Threshold
                    </p>
                    <p className="text-2xl font-mono font-bold text-black mt-2">
                        $10,000.00
                        <span className="text-xs font-sans font-normal text-zinc-500 ml-1">
                            USD
                        </span>
                    </p>
                    <p className="text-[11px] font-mono text-zinc-500 mt-1">
                        Mandatory Checker sign-off above limit
                    </p>
                </div>
            </div>

            {/* Framer Motion View Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
                <div className="flex items-center gap-2">
                    {(
                        [
                            { id: "members", label: `Team Members (${teamMembers.length})` },
                            { id: "matrix", label: "Maker-Checker Authorization Matrix" },
                        ] as const
                    ).map((tab) => {
                        const isActive = activeViewTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveViewTab(tab.id)}
                                className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                    isActive
                                        ? "text-white"
                                        : "text-zinc-600 hover:text-black bg-zinc-50 border border-[#E5E5E5]"
                                }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="teamViewTabIndicator"
                                        className="absolute inset-0 rounded-lg bg-black z-0"
                                        transition={{
                                            type: "spring",
                                            stiffness: 420,
                                            damping: 32,
                                        }}
                                    />
                                )}
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeViewTab === "members" ? (
                    <motion.div
                        key="members-table"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden"
                    >
                        <div className="p-6 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                                {(["All", "Admin", "Finance/Maker", "Approver/Checker"] as const).map(
                                    (role) => {
                                        const isActive = roleFilter === role;
                                        return (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => setRoleFilter(role)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer border ${
                                                    isActive
                                                        ? "bg-black text-white border-black"
                                                        : "bg-white text-zinc-600 border-[#E5E5E5] hover:border-black hover:text-black"
                                                }`}
                                            >
                                                <span>{role === "All" ? "All Roles" : role}</span>
                                                <span className="ml-1.5 font-mono text-[10px] font-tabular-nums opacity-80">
                                                    ({roleCounts[role]})
                                                </span>
                                            </button>
                                        );
                                    }
                                )}
                            </div>

                            <div className="relative w-full sm:w-72">
                                <Search
                                    size={14}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search member name, email, role..."
                                    className="w-full h-10 rounded-lg border border-[#E5E5E5] bg-white pl-9 pr-3.5 text-xs font-medium text-black placeholder:text-zinc-400 focus:border-black focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#E5E5E5] bg-zinc-50 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                                        <th className="py-3.5 px-5">Team Member</th>
                                        <th className="py-3.5 px-5">Assigned Role</th>
                                        <th className="py-3.5 px-5">Authorization Limit</th>
                                        <th className="py-3.5 px-5">Active Scopes</th>
                                        <th className="py-3.5 px-5">Status &amp; Security</th>
                                        <th className="py-3.5 px-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E5E5] text-xs">
                                    {filteredMembers.map((member) => {
                                        const enabledScopesCount = Object.values(
                                            member.permissions
                                        ).filter(Boolean).length;

                                        return (
                                            <tr
                                                key={member.id}
                                                className="hover:bg-zinc-50/80 transition-colors"
                                            >
                                                <td className="py-4 px-5 align-top min-w-[230px]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-black text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 select-none">
                                                            {member.initials}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-black">
                                                                {member.fullName}
                                                            </p>
                                                            <p className="text-[11px] font-mono text-zinc-500">
                                                                {member.email}
                                                            </p>
                                                            <p className="text-[11px] text-zinc-400 mt-0.5">
                                                                {member.department}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-5 align-top whitespace-nowrap">
                                                    {member.role === "Admin" && (
                                                        <span className="inline-flex items-center gap-1 rounded bg-black text-white px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider">
                                                            <ShieldCheck size={11} />
                                                            <span>Admin</span>
                                                        </span>
                                                    )}
                                                    {member.role === "Approver/Checker" && (
                                                        <span className="inline-flex items-center gap-1 rounded border border-black bg-white text-black px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider">
                                                            <UserCheck size={11} />
                                                            <span>Approver / Checker</span>
                                                        </span>
                                                    )}
                                                    {member.role === "Finance/Maker" && (
                                                        <span className="inline-flex items-center gap-1 rounded border border-[#E5E5E5] bg-zinc-100 text-black px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider">
                                                            <FileEdit size={11} />
                                                            <span>Finance / Maker</span>
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-4 px-5 align-top whitespace-nowrap font-mono font-tabular-nums">
                                                    <p className="font-bold text-black">
                                                        {member.authorizationLimitUsd === "Unlimited"
                                                            ? "Unlimited Authority"
                                                            : `Up to $${member.authorizationLimitUsd.toLocaleString("en-US")} USD`}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-500 mt-0.5">
                                                        {member.role === "Finance/Maker"
                                                            ? "Single initiation cap"
                                                            : "Per-batch sign-off cap"}
                                                    </p>
                                                </td>

                                                <td className="py-4 px-5 align-top">
                                                    <div className="flex flex-wrap gap-1 max-w-[230px]">
                                                        {member.permissions.initiateSingleTransfers && (
                                                            <span className="px-2 py-0.5 rounded border border-[#E5E5E5] bg-zinc-50 text-[10px] font-mono text-black">
                                                                Single Payout
                                                            </span>
                                                        )}
                                                        {member.permissions.uploadBatchFiles && (
                                                            <span className="px-2 py-0.5 rounded border border-[#E5E5E5] bg-zinc-50 text-[10px] font-mono text-black">
                                                                Batch CSV
                                                            </span>
                                                        )}
                                                        {member.permissions.approveUpTo50k && (
                                                            <span className="px-2 py-0.5 rounded border border-black bg-white text-[10px] font-mono font-bold text-black">
                                                                Checker &le;$50k
                                                            </span>
                                                        )}
                                                        {member.permissions.approveUnlimitedBatch && (
                                                            <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-mono font-bold">
                                                                Unlimited Sign-Off
                                                            </span>
                                                        )}
                                                        <span className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 font-tabular-nums">
                                                            ({enabledScopesCount}/7)
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-5 align-top whitespace-nowrap">
                                                    {member.status === "Active" ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded border border-black bg-white px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase text-black">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-black" />
                                                            <span>Active &bull; 2FA</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 rounded border border-dashed border-black bg-zinc-100 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase text-black">
                                                            <span>Pending Invite</span>
                                                        </span>
                                                    )}
                                                    <p className="text-[10px] font-mono text-zinc-400 mt-1">
                                                        {member.lastActive}
                                                    </p>
                                                </td>

                                                <td className="py-4 px-5 align-top text-right whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => setInspectingMember(member)}
                                                            className="px-2.5 py-1.5 rounded-lg border border-[#E5E5E5] bg-white text-black hover:border-black text-[11px] font-mono font-semibold transition-colors cursor-pointer"
                                                        >
                                                            Permissions
                                                        </button>
                                                        {member.id !== "tm-1" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeTeamMember(member.id)}
                                                                className="p-1.5 rounded-lg border border-[#E5E5E5] text-zinc-500 hover:text-black hover:border-black transition-colors cursor-pointer"
                                                                title="Revoke team member access"
                                                                aria-label="Revoke member"
                                                            >
                                                                <Trash2 size={13} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="matrix-view"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="rounded-2xl border border-[#E5E5E5] bg-white p-6 space-y-5"
                    >
                        <div>
                            <h2 className="text-lg font-bold text-black">
                                Corporate Pass-Through Authorization Matrix
                            </h2>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                Enforced governance rules before Settle Africa executes an atomic direct debit from your linked corporate bank accounts or cards.
                            </p>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-[#E5E5E5]">
                            <table className="w-full text-left text-xs border-collapse font-tabular-nums">
                                <thead>
                                    <tr className="bg-zinc-50 border-b border-[#E5E5E5] text-[11px] font-mono font-bold uppercase text-zinc-500">
                                        <th className="py-3.5 px-5">Settlement Tier (USD)</th>
                                        <th className="py-3.5 px-5">Finance / Maker</th>
                                        <th className="py-3.5 px-5">Approver / Checker</th>
                                        <th className="py-3.5 px-5">Admin</th>
                                        <th className="py-3.5 px-5">Execution Rule</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E5E5] font-mono">
                                    <tr>
                                        <td className="py-4 px-5 font-bold text-black">
                                            $0.01 &ndash; $10,000.00 USD
                                        </td>
                                        <td className="py-4 px-5 text-black">
                                            Can Initiate &amp; Execute
                                        </td>
                                        <td className="py-4 px-5 text-black">Can Approve</td>
                                        <td className="py-4 px-5 text-black">Full Authority</td>
                                        <td className="py-4 px-5 font-sans text-zinc-600">
                                            Single-signature direct pass-through
                                        </td>
                                    </tr>
                                    <tr className="bg-zinc-50/50">
                                        <td className="py-4 px-5 font-bold text-black">
                                            $10,000.01 &ndash; $50,000.00 USD
                                        </td>
                                        <td className="py-4 px-5 text-zinc-600">
                                            Stage Only (Requires Checker)
                                        </td>
                                        <td className="py-4 px-5 font-bold text-black">
                                            1 Checker Sign-Off
                                        </td>
                                        <td className="py-4 px-5 text-black">Full Authority</td>
                                        <td className="py-4 px-5 font-sans text-zinc-600">
                                            Maker + 1 Checker dual-control
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-4 px-5 font-bold text-black">
                                            $50,000.01 &ndash; $250,000.00 USD
                                        </td>
                                        <td className="py-4 px-5 text-zinc-600">
                                            Stage CSV / Single Only
                                        </td>
                                        <td className="py-4 px-5 font-bold text-black">
                                            Senior Checker Sign-Off
                                        </td>
                                        <td className="py-4 px-5 text-black">Full Authority</td>
                                        <td className="py-4 px-5 font-sans text-zinc-600">
                                            Senior Checker + 2FA hardware token
                                        </td>
                                    </tr>
                                    <tr className="bg-zinc-50/50">
                                        <td className="py-4 px-5 font-bold text-black">
                                            &gt; $250,000.00 USD (Wholesale Batch)
                                        </td>
                                        <td className="py-4 px-5 text-zinc-600">Stage Only</td>
                                        <td className="py-4 px-5 text-zinc-600">
                                            Co-Sign with Admin
                                        </td>
                                        <td className="py-4 px-5 font-bold text-black">
                                            Mandatory Admin Co-Sign
                                        </td>
                                        <td className="py-4 px-5 font-sans text-zinc-600">
                                            Dual Checker + Admin RTGS Mandate Release
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Invite Drawer */}
            <AnimatePresence>
                {isInviteOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsInviteOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-[1px]"
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 380, damping: 36 }}
                            className="relative z-10 w-full max-w-xl h-full bg-white border-l border-black p-6 sm:p-8 overflow-y-auto text-black shadow-2xl flex flex-col justify-between text-left"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#E5E5E5]">
                                    <div>
                                        <span className="inline-flex items-center gap-1.5 rounded bg-black text-white px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                                            Corporate Access Control
                                        </span>
                                        <h2 className="text-xl font-bold text-black mt-2">
                                            Invite Team Member
                                        </h2>
                                        <p className="text-xs text-zinc-500 mt-0.5">
                                            Assign a Maker, Checker, or Admin role with granular authorization limits for pass-through settlements.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsInviteOpen(false)}
                                        className="p-2 rounded-lg border border-[#E5E5E5] text-zinc-500 hover:text-black hover:border-black transition-colors cursor-pointer"
                                        aria-label="Close drawer"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <form
                                    id="invite-member-form"
                                    onSubmit={handleInviteSubmit}
                                    className="mt-6 space-y-6"
                                >
                                    {formError && (
                                        <div className="rounded-lg border border-black bg-zinc-50 p-3 text-xs font-mono font-semibold text-black">
                                            {formError}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            label="Full Legal Name"
                                            placeholder="e.g., Folake Adeyemi"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                        />
                                        <Input
                                            label="Corporate Work Email"
                                            type="email"
                                            placeholder="folake@koralogistics.africa"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            icon={<Mail size={15} className="text-zinc-400" />}
                                            required
                                        />
                                    </div>

                                    <Input
                                        label="Department / Corporate Title"
                                        placeholder="e.g., Treasury &amp; Accounts Payable"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                    />

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider font-mono text-black block">
                                            Select Primary Corporate Role
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                            {(
                                                [
                                                    {
                                                        role: "Finance/Maker" as TeamRole,
                                                        subtitle: "Initiates single & batch payouts",
                                                    },
                                                    {
                                                        role: "Approver/Checker" as TeamRole,
                                                        subtitle: "Signs off & releases bank pulls",
                                                    },
                                                    {
                                                        role: "Admin" as TeamRole,
                                                        subtitle: "Full treasury & team control",
                                                    },
                                                ]
                                            ).map((item) => {
                                                const isSelected = selectedRole === item.role;
                                                return (
                                                    <button
                                                        key={item.role}
                                                        type="button"
                                                        onClick={() => handleRoleSelect(item.role)}
                                                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                                            isSelected
                                                                ? "border-black bg-black text-white"
                                                                : "border-[#E5E5E5] bg-white text-black hover:border-black"
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold">
                                                                {item.role}
                                                            </span>
                                                            {isSelected && <Check size={14} />}
                                                        </div>
                                                        <p
                                                            className={`text-[11px] mt-1 leading-snug ${
                                                                isSelected
                                                                    ? "text-zinc-300"
                                                                    : "text-zinc-500"
                                                            }`}
                                                        >
                                                            {item.subtitle}
                                                        </p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider font-mono text-black block">
                                            Per-Batch / Transfer Authorization Limit (USD)
                                        </label>
                                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 font-mono font-tabular-nums">
                                            {([5000, 10000, 50000, 250000, "Unlimited"] as const).map(
                                                (lim) => {
                                                    const isSelected = authLimit === lim;
                                                    return (
                                                        <button
                                                            key={String(lim)}
                                                            type="button"
                                                            onClick={() => setAuthLimit(lim)}
                                                            className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                                                                isSelected
                                                                    ? "border-black bg-black text-white"
                                                                    : "border-[#E5E5E5] bg-white text-black hover:border-black"
                                                            }`}
                                                        >
                                                            {lim === "Unlimited"
                                                                ? "Unlimited"
                                                                : `$${(lim / 1000).toFixed(0)}k`}
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold uppercase tracking-wider font-mono text-black">
                                                Granular Authorization Scopes &amp; Limits
                                            </label>
                                            <span className="text-[11px] font-mono text-zinc-500 font-tabular-nums">
                                                {Object.values(permissions).filter(Boolean).length} of 7 enabled
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {PERMISSION_ITEMS.map((perm) => {
                                                const checked = permissions[perm.key];
                                                return (
                                                    <label
                                                        key={perm.key}
                                                        className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                                                            checked
                                                                ? "border-black bg-zinc-50"
                                                                : "border-[#E5E5E5] bg-white hover:border-zinc-400"
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={() => togglePermission(perm.key)}
                                                            className="mt-0.5 h-4 w-4 rounded border-black accent-black cursor-pointer shrink-0"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-wrap items-center justify-between gap-1">
                                                                <span className="text-xs font-bold text-black">
                                                                    {perm.title}
                                                                </span>
                                                                <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border border-[#E5E5E5] bg-white text-black font-tabular-nums">
                                                                    {perm.tag}
                                                                </span>
                                                            </div>
                                                            <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                                                                {perm.description}
                                                            </p>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="pt-5 mt-6 border-t border-[#E5E5E5] flex items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsInviteOpen(false)}
                                    className="border-[#E5E5E5] text-black hover:border-black cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    form="invite-member-form"
                                    className="bg-black text-white hover:bg-zinc-800 px-6 cursor-pointer"
                                >
                                    <UserPlus size={15} />
                                    <span>Send Corporate Invite</span>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Inspect Member Modal */}
            <AnimatePresence>
                {inspectingMember && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setInspectingMember(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-[1px]"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            className="relative z-10 w-full max-w-md rounded-2xl border border-black bg-white p-6 text-black shadow-2xl text-left"
                        >
                            <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#E5E5E5]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-black text-white font-mono font-bold text-xs flex items-center justify-center">
                                        {inspectingMember.initials}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-black">
                                            {inspectingMember.fullName}
                                        </h3>
                                        <p className="text-xs font-mono text-zinc-500">
                                            {inspectingMember.email}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setInspectingMember(null)}
                                    className="p-1.5 rounded-lg border border-[#E5E5E5] text-zinc-500 hover:text-black cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="my-4 space-y-3">
                                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                                    Quick Role Re-Assignment
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    {(["Finance/Maker", "Approver/Checker", "Admin"] as TeamRole[]).map(
                                        (r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => {
                                                    const newLimit = ROLE_PRESET_PERMISSIONS[r].limit;
                                                    updateTeamMemberRole(
                                                        inspectingMember.id,
                                                        r,
                                                        newLimit
                                                    );
                                                    setInspectingMember({
                                                        ...inspectingMember,
                                                        role: r,
                                                        authorizationLimitUsd: newLimit,
                                                    });
                                                }}
                                                className={`py-2 px-2 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                                                    inspectingMember.role === r
                                                        ? "border-black bg-black text-white"
                                                        : "border-[#E5E5E5] bg-white text-black hover:border-black"
                                                }`}
                                            >
                                                {r}
                                            </button>
                                        )
                                    )}
                                </div>

                                <div className="pt-2">
                                    <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-2">
                                        Assigned Authorization Scopes
                                    </p>
                                    <div className="space-y-1.5">
                                        {PERMISSION_ITEMS.map((p) => {
                                            const active = inspectingMember.permissions[p.key];
                                            return (
                                                <div
                                                    key={p.key}
                                                    className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded border border-[#E5E5E5] bg-zinc-50"
                                                >
                                                    <span className="font-medium text-black">
                                                        {p.title}
                                                    </span>
                                                    <span className="font-mono text-[10px] font-bold uppercase">
                                                        {active ? "✓ Allowed" : "— Restricted"}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-3 border-t border-[#E5E5E5]">
                                <Button
                                    type="button"
                                    onClick={() => setInspectingMember(null)}
                                    className="bg-black text-white hover:bg-zinc-800 h-9 px-4 text-xs cursor-pointer"
                                >
                                    Done
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

