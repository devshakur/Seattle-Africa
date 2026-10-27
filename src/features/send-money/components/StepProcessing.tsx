import { Loader2 } from "lucide-react"; // Optional: if you want to use Lucide's spinner, but the CSS one is fine too.

export function StepProcessing() {
    return (
        <div className="flex flex-col items-center justify-center text-center min-h-[60vh] animate-in fade-in duration-500">
            {/* Spinner */}
            <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-black rounded-full border-t-transparent animate-spin"></div>
            </div>

            {/* Text Content */}
            <h2 className="text-xl font-bold text-gray-900 mb-2">
                Processing Transfer
            </h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                Please wait while we verify your payment and process the transfer to your recipient. Do not close this window.
            </p>
        </div>
    );
}