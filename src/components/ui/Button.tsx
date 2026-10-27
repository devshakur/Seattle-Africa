
"use client";

import {
    ButtonHTMLAttributes,
    forwardRef,
    useState,
} from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/libs/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost";
    size?: "default" | "sm" | "lg";
    href?: string;
    loading?: boolean;
    loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "default",
            href,
            loading = false,
            loadingText,
            disabled,
            onClick,
            children,
            type = "button",
            ...props
        },
        ref
    ) => {
        const router = useRouter();
        const [isLoading, setIsLoading] = useState(false);

        const busy = loading || isLoading;
        const isDisabled = disabled || busy;

        const handleClick: ButtonHTMLAttributes<HTMLButtonElement>["onClick"] =
            async (event) => {
                if (isDisabled) {
                    event.preventDefault();
                    return;
                }

                if (onClick) {
                    onClick(event);
                }

                if (event.defaultPrevented) return;

                if (href) {
                    setIsLoading(true);
                    router.push(href);
                }
            };

        return (
            <button
                ref={ref}
                type={type}
                disabled={isDisabled}
                aria-busy={busy}
                onClick={handleClick}
                className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-black text-white hover:bg-gray-800":
                            variant === "primary",
                        "border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50":
                            variant === "outline",
                        "text-gray-700 hover:bg-gray-100":
                            variant === "ghost",
                        "h-10 px-4 py-2 text-sm":
                            size === "default",
                        "h-9 rounded-md px-3 text-xs":
                            size === "sm",
                        "h-12 rounded-lg px-8 text-base":
                            size === "lg",
                    },
                    className
                )}
                {...props}
            >
                {busy && (
                    <LoaderCircle
                        size={16}
                        className="shrink-0 animate-spin"
                        aria-hidden="true"
                    />
                )}

                {busy ? loadingText ?? children : children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
