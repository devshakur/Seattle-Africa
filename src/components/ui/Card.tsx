import { HTMLAttributes } from "react";
import { cn } from "@/libs/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden",
                className
            )}
            {...props}
        />
    );
}