"use client";

import {
    ButtonHTMLAttributes,
    forwardRef,
    useState,
} from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/libs/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost" | "secondary";
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
        const [internalLoading, setInternalLoading] = useState(false);

        const busy = loading || internalLoading;
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
                    setInternalLoading(true);
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
                    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50 select-none",
                    {
                        "bg-black text-white hover:bg-zinc-850 active:bg-zinc-900 border border-black":
                            variant === "primary",
                        "border border-[#E5E5E5] bg-white text-black hover:bg-zinc-100":
                            variant === "outline",
                        "bg-zinc-100 text-black hover:bg-zinc-200 border border-transparent":
                            variant === "secondary",
                        "text-zinc-700 hover:text-black hover:bg-zinc-100":
                            variant === "ghost",
                        "h-11 px-4 py-2.5 text-sm":
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
                        className="shrink-0 animate-spin text-current"
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
