import { cn } from "@/libs/utils";

interface AccountTypeToggleProps {
    value: "personal" | "business";
    onChange: (value: "personal" | "business") => void;
}

export function AccountTypeToggle({ value, onChange }: AccountTypeToggleProps) {
    return (
        <div className="flex p-1 bg-gray-100/80 rounded-xl w-full mb-6">
            <button
                type="button"
                onClick={() => onChange("personal")}
                className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    value === "personal"
                        ? "bg-white text-black shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                )}
            >
                Personal
            </button>
            <button
                type="button"
                onClick={() => onChange("business")}
                className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    value === "business"
                        ? "bg-white text-black shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                )}
            >
                Business
            </button>
        </div>
    );
}