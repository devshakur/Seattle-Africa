import { HTMLAttributes } from "react";
import { cn } from "@/libs/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]",
                className
            )}
            {...props}
        />
    );
}