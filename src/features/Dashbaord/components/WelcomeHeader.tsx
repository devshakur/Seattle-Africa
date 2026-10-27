import { Button } from "@/components/ui/Button";
import { Send } from "lucide-react";

export function WelcomeHeader() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Good morning, Abdulshakur</h1>
                <p className="text-sm text-gray-500 mt-1">Here's your financial overview for today.</p>
            </div>
            <Button className="gap-2 h-10 px-5 rounded-xl self-start sm:self-auto">
                <Send size={16} />
                Send money
            </Button>
        </div>
    );
}