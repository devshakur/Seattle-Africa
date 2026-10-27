import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Globe2 } from "lucide-react";

export function PromoCard() {
    return (
        <Card className="p-8 flex flex-col items-center text-center h-full justify-center bg-white relative overflow-hidden">
            {/* Decorative background blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-10" />

            {/* Illustration placeholder */}
            <div className="w-24 h-24 mb-6 rounded-full bg-gray-50 flex items-center justify-center relative">
                {/* Using Lucide icon as a placeholder for the 3D illustration in the image */}
                <Globe2 size={48} className="text-gray-800" strokeWidth={1.5} />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black rounded-full border-4 border-white flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">Need to send money overseas?</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-[250px]">
                Get the best exchange rates and low fees when you send money across Africa.
            </p>

            <Button className="w-full h-11 rounded-xl">Send money</Button>
        </Card>
    );
}