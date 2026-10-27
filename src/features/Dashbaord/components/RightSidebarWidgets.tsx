
import { Card } from "@/components/ui/Card";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

const rates = [
    {
        pair: "NGN → GHS",
        rate: "0.0097",
        change: "+0.12%",
        flags: [
            { code: "gh", src: "/images/flags/nigerias.jpg" },
            { code: "ng", src: "/images/flags/ghana.png" },
        ],
    },
    {
        pair: "NGN → KES",
        rate: "0.0790",
        change: "+0.08%",
        flags: [
            { code: "ng", src: "/images/flags/nigerias.jpg" },
            { code: "ke", src: "/images/flags/kenya.png" },
        ],
    },
    {
        pair: "NGN → ZAR",
        rate: "0.0105",
        change: "-0.05%",
        flags: [
            { code: "ng", src: "/images/flags/nigerias.jpg" },
            { code: "za", src: "/images/flags/south-africa.png" },
        ],
    },
    {
        pair: "GHS → KES",
        rate: "9.15",
        change: "+0.15%",
        flags: [
            { code: "gh", src: "/images/flags/ghana.png" },
            { code: "ke", src: "/images/flags/kenya.png" },
        ],
    },
];

const recipients = [
    { name: "John Smith", bank: "GTBank • ****4921", initials: "JS" },
    { name: "Amina Yusuf", bank: "Access • ****8832", initials: "AY" },
    { name: "David Osei", bank: "GCB • ****1102", initials: "DO" },
];

export function RightSidebarWidgets() {
    return (
        <div className="space-y-6">
            {/* Exchange Rates */}
            <Card className="p-6">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">
                        Exchange Rates
                    </h3>

                    <Link
                        href="#"
                        className="text-xs font-medium text-gray-500 transition-colors hover:text-black"
                    >
                        View all
                    </Link>
                </div>

                <div className="space-y-5">
                    {rates.map((item) => {
                        const isPositive = item.change.startsWith("+");

                        return (
                            <div
                                key={item.pair}
                                className="flex items-center justify-between gap-3"
                            >
                                {/* Country Flags and Currency Pair */}
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex shrink-0 items-center">
                                        {item.flags.map((flag, index) => (
                                            <img
                                                key={`${item.pair}-${flag.code}`}
                                                src={flag.src}
                                                alt={`${flag.code.toUpperCase()} flag`}
                                                width={32}
                                                height={32}
                                                className={`relative size-8 rounded-full border-2 border-white object-cover ${index === 0
                                                    ? "z-10"
                                                    : "-ml-2"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <span className="whitespace-nowrap text-sm font-medium text-gray-700">
                                        {item.pair}
                                    </span>
                                </div>

                                {/* Exchange Rate and Percentage Change */}
                                <div className="shrink-0 text-right">
                                    <p className="text-sm font-bold text-gray-900">
                                        {item.rate}
                                    </p>

                                    <p
                                        className={`mt-0.5 text-[11px] font-semibold ${isPositive
                                            ? "text-green-600"
                                            : "text-red-500"
                                            }`}
                                    >
                                        {item.change}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-5 border-t border-gray-100 pt-3">
                    <p className="text-[11px] text-gray-400">
                        Indicative rates · Sample data
                    </p>
                </div>
            </Card>

            {/* Top Recipients */}
            <Card className="p-6">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">
                        Top Recipients
                    </h3>

                    <button
                        type="button"
                        aria-label="Add recipient"
                        className="flex size-7 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                <div className="space-y-4">
                    {recipients.map((person) => (
                        <div
                            key={person.name}
                            className="group flex cursor-pointer items-center justify-between gap-3"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-xs font-bold text-gray-600">
                                    {person.initials}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-gray-900 group-hover:underline">
                                        {person.name}
                                    </p>

                                    <p className="truncate text-[11px] text-gray-500">
                                        {person.bank}
                                    </p>
                                </div>
                            </div>

                            <ArrowRight
                                size={14}
                                className="shrink-0 text-gray-300 transition-colors group-hover:text-black"
                            />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
