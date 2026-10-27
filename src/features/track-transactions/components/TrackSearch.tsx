import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TrackStatus } from "../hooks/useTrackTransaction";

interface Props {
    query: string;
    setQuery: (val: string) => void;
    onSearch: () => void;
    status: TrackStatus;
}

export function TrackSearch({ query, setQuery, onSearch, status }: Props) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") onSearch();
    };

    return (
        <div className="max-w-xl mx-auto w-full text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                Track your transfer
            </h1>
            <p className="text-gray-500 mb-8">
                Enter your Transaction ID (e.g., SET-89210) to see the current status.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter Transaction ID"
                        className="w-full h-14 rounded-xl border border-gray-200 bg-white px-4 pl-12 text-base font-medium text-gray-900 shadow-sm transition-all focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5"
                    />
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                <Button
                    onClick={onSearch}
                    disabled={!query.trim() || status === "loading"}
                    className="h-14 rounded-xl px-8 text-base font-semibold bg-black text-white hover:bg-gray-800 transition-all shadow-sm shrink-0"
                >
                    {status === "loading" ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        "Track Transfer"
                    )}
                </Button>
            </div>
        </div>
    );
}